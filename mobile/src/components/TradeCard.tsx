import { View, Text, StyleSheet } from 'react-native';
import { OpenPosition } from '../types';

export default function TradeCard({ trade }: { trade: OpenPosition }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.symbol}>{trade.symbol}</Text>
        <Text style={[styles.profit, trade.pnl >= 0 ? styles.positive : styles.negative]}>${trade.pnl.toFixed(2)}</Text>
      </View>
      <Text style={styles.details}>{trade.order_type} · {trade.lots.toFixed(2)} lots</Text>
      <Text style={styles.details}>Entry {trade.entry_price.toFixed(5)} · Current {trade.current_price.toFixed(5)}</Text>
      <Text style={styles.details}>SL {trade.stop_loss ?? 'N/A'} · TP {trade.take_profit ?? 'N/A'}</Text>
      <Text style={styles.muted}>Opened {new Date(trade.opened_at).toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0F1728',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  symbol: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  profit: {
    fontSize: 16,
    fontWeight: '700',
  },
  positive: {
    color: '#22C55E',
  },
  negative: {
    color: '#F87171',
  },
  details: {
    color: '#CBD5E1',
    fontSize: 13,
    marginBottom: 4,
  },
  muted: {
    color: '#94A3B8',
    fontSize: 12,
  },
});
