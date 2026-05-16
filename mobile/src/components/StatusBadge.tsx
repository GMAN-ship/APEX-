import { View, Text, StyleSheet } from 'react-native';

type Props = {
  label: string;
  value: string;
  status?: 'online' | 'offline';
};

export default function StatusBadge({ label, value, status = 'offline' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.badge, status === 'online' ? styles.online : styles.offline]}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 4,
  },
  badge: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  online: {
    backgroundColor: '#0F1728',
    borderColor: '#22C55E',
  },
  offline: {
    backgroundColor: '#0F1728',
    borderColor: '#EF4444',
  },
  value: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
});
