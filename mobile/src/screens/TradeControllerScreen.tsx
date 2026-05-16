import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { TradeCommandPayload } from '../types';

const commandOptions: Array<Pick<TradeCommandPayload, 'command_type'>> = [
  { command_type: 'BUY' },
  { command_type: 'SELL' },
  { command_type: 'CLOSE_ALL' },
];

export default function TradeControllerScreen() {
  const [riskPercent, setRiskPercent] = useState(1.5);
  const [slPadding, setSlPadding] = useState(20);
  const [tpTarget, setTpTarget] = useState(30);
  const [submitting, setSubmitting] = useState(false);

  const sendCommand = async (commandType: TradeCommandPayload['command_type']) => {
    setSubmitting(true);
    const payload: TradeCommandPayload = {
      command_type: commandType,
      symbol: commandType === 'BUY' || commandType === 'SELL' ? 'EURUSD' : undefined,
      lots: commandType === 'BUY' || commandType === 'SELL' ? 0.1 : undefined,
      user_id: 'authenticated-user-id',
    };

    const { error } = await supabase.from('trade_commands').insert(payload);
    setSubmitting(false);

    if (error) {
      Alert.alert('Command failed', error.message);
    } else {
      Alert.alert('Command queued', `Sent ${command} to Supabase.`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Trade Controls</Text>
      <Text style={styles.description}>Send remote trade instructions to your MT5 Expert Advisor.</Text>

      <View style={styles.buttonGrid}>
        {commandOptions.map(cmd => (
          <TouchableOpacity
            key={cmd.command}
            style={[styles.actionButton, cmd.command === 'CLOSE_ALL' && styles.closeAll]}
            onPress={() => sendCommand(cmd.command)}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>{cmd.command.replace('_', ' ')}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.paramPanel}>
        <Text style={styles.paramLabel}>Risk %</Text>
        <Text style={styles.paramValue}>{riskPercent.toFixed(1)}%</Text>
        <Text style={styles.paramLabel}>SL Padding</Text>
        <Text style={styles.paramValue}>{slPadding} pips</Text>
        <Text style={styles.paramLabel}>TP Target</Text>
        <Text style={styles.paramValue}>{tpTarget} pips</Text>
      </View>

      <Text style={styles.hint}>Tip: Use Settings screen to update these values persistently.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060E1A',
    padding: 20,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  description: {
    color: '#CBD5E1',
    marginBottom: 24,
  },
  buttonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 20,
    marginHorizontal: 4,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  closeAll: {
    backgroundColor: '#7F1D1D',
    borderColor: '#991B1B',
  },
  buttonText: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontSize: 14,
  },
  paramPanel: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#0F1728',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  paramLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 14,
  },
  paramValue: {
    color: '#E2E8F0',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 6,
  },
  hint: {
    color: '#94A3B8',
    marginTop: 20,
    fontSize: 13,
  },
});
