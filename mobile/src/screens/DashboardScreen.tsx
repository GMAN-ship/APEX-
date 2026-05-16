import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import StatusBadge from '../components/StatusBadge';
import TradeCard from '../components/TradeCard';
import { AccountMetrics, OpenPosition } from '../types';

export default function DashboardScreen() {
  const [metrics, setMetrics] = useState<AccountMetrics | null>(null);
  const [positions, setPositions] = useState<OpenPosition[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data, error } = await supabase.from('account_metrics').select('*').order('updated_at', { ascending: false }).limit(1).single();
      if (!error && data) {
        setMetrics(data);
        setConnected(true);
      } else {
        setConnected(false);
      }
    };

    const fetchPositions = async () => {
      const { data, error } = await supabase.from('open_positions').select('*');
      if (!error && data) {
        setPositions(data as OpenPosition[]);
      }
    };

    fetchMetrics();
    fetchPositions();

    const metricsSubscription = supabase
      .channel('realtime-account-metrics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'account_metrics' }, payload => {
        if (payload.new) {
          setMetrics(payload.new as AccountMetrics);
          setConnected(true);
        }
      })
      .subscribe();

    const positionsSubscription = supabase
      .channel('realtime-open-positions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'open_positions' }, payload => {
        if (payload.new) {
          setPositions(prev => {
            const next = prev.filter(item => item.ticket !== payload.new.ticket);
            return [...next, payload.new as OpenPosition];
          });
        }
        if (payload.old && !payload.new) {
          setPositions(prev => prev.filter(item => item.ticket !== payload.old.ticket));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(metricsSubscription);
      supabase.removeChannel(positionsSubscription);
    };

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}> 
      <Text style={styles.title}>Account Dashboard</Text>
      <StatusBadge label="Connection" value={connected ? 'Live' : 'Disconnected'} status={connected ? 'online' : 'offline'} />

      <View style={styles.metricRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Balance</Text>
          <Text style={styles.metricValue}>${metrics?.balance.toFixed(2) ?? '--'}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Equity</Text>
          <Text style={styles.metricValue}>${metrics?.equity.toFixed(2) ?? '--'}</Text>
        </View>
      </View>
      <View style={styles.metricRow}>
        <View style={styles.metricCardWide}>
          <Text style={styles.metricLabel}>Floating P&L</Text>
          <Text style={[styles.metricValue, { color: metrics?.floating_pnl >= 0 ? '#22C55E' : '#F87171' }]}>${metrics?.floating_pnl.toFixed(2) ?? '--'}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Active Trades</Text>
      {positions.length > 0 ? (
        positions.map(trade => <TradeCard key={trade.ticket} trade={trade} />)
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No active trades found.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060E1A',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 18,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    marginRight: 10,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#0F1728',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  metricCardWide: {
    flex: 1,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#0F1728',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  metricLabel: {
    color: '#94A3B8',
    marginBottom: 8,
    fontSize: 12,
  },
  metricValue: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#E2E8F0',
    fontSize: 18,
    marginVertical: 16,
    fontWeight: '700',
  },
  emptyState: {
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0F1728',
  },
  emptyText: {
    color: '#94A3B8',
  },
});
