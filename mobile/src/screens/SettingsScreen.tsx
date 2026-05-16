import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function SettingsScreen() {
  const [riskPercent, setRiskPercent] = useState('1.5');
  const [slPadding, setSlPadding] = useState('20');
  const [tpTarget, setTpTarget] = useState('30');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase.from('strategy_settings').select('*').single();
      if (!error && data) {
        setRiskPercent((data.risk_per_trade ?? 1.5).toString());
        setSlPadding((data.sl_padding ?? 20).toString());
        setTpTarget((data.tp_target ?? 30).toString());
      }
    };
    loadSettings();
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    const payload = {
      risk_per_trade: parseFloat(riskPercent) || 1.5,
      sl_padding: parseInt(slPadding, 10) || 20,
      tp_target: parseInt(tpTarget, 10) || 30,
    };

    const { error } = await supabase.from('strategy_settings').upsert({ id: 1, ...payload }, { onConflict: 'id' });
    setSaving(false);

    if (error) {
      Alert.alert('Save failed', error.message);
    } else {
      Alert.alert('Settings saved', 'Remote trade settings have been updated.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Remote Settings</Text>
      <Text style={styles.description}>Update your risk profile and trade management targets remotely.</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Risk %</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={riskPercent}
          onChangeText={setRiskPercent}
          placeholder="e.g. 1.5"
          placeholderTextColor="#475569"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Stop Loss Padding</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={slPadding}
          onChangeText={setSlPadding}
          placeholder="e.g. 20"
          placeholderTextColor="#475569"
        />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Take Profit Target</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={tpTarget}
          onChangeText={setTpTarget}
          placeholder="e.g. 30"
          placeholderTextColor="#475569"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings} disabled={saving}>
        <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Settings'}</Text>
      </TouchableOpacity>
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
  },
  description: {
    color: '#94A3B8',
    marginBottom: 24,
    lineHeight: 20,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    color: '#CBD5E1',
    marginBottom: 8,
    fontSize: 13,
  },
  input: {
    backgroundColor: '#0F1728',
    color: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    padding: 14,
  },
  saveButton: {
    marginTop: 18,
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  saveText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
});
