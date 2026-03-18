import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface Props {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export default function StatCard({ label, value, icon, color }: Props) {
  return (
    <View style={styles.card}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.value, color ? { color } : null]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  icon: {
    fontSize: 24,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
