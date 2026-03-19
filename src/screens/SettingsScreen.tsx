import React from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GradientBackground from '../components/GradientBackground';
import { useSettingsStore } from '../store/useSettingsStore';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const settings = useSettingsStore((s) => s.settings);
  const setHaptic = useSettingsStore((s) => s.setHaptic);
  const setSound = useSettingsStore((s) => s.setSound);
  const setNotifications = useSettingsStore((s) => s.setNotifications);
  const clearHistory = useSettingsStore((s) => s.clearHistory);

  const handleClearHistory = () => {
    Alert.alert(
      'Clear All Data?',
      'This will reset all your statistics and progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clearHistory(),
        },
      ],
    );
  };

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + SPACING.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        {/* Feedback section */}
        <Text style={styles.sectionLabel}>Feedback</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="vibrate" size={22} color={COLORS.primary} />
              <Text style={styles.rowLabel}>Haptic Feedback</Text>
            </View>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={setHaptic}
              trackColor={{ false: COLORS.inputBackground, true: COLORS.primaryDark }}
              thumbColor={settings.hapticEnabled ? COLORS.primary : COLORS.textMuted}
            />
          </View>

          <View style={styles.separator} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="volume-high" size={22} color={COLORS.primary} />
              <Text style={styles.rowLabel}>Sound Effects</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={setSound}
              trackColor={{ false: COLORS.inputBackground, true: COLORS.primaryDark }}
              thumbColor={settings.soundEnabled ? COLORS.primary : COLORS.textMuted}
            />
          </View>
        </View>

        {/* Notifications section */}
        <Text style={styles.sectionLabel}>Notifications</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="bell-outline" size={22} color={COLORS.primary} />
              <Text style={styles.rowLabel}>Daily Reminder</Text>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.inputBackground, true: COLORS.primaryDark }}
              thumbColor={settings.notificationsEnabled ? COLORS.primary : COLORS.textMuted}
            />
          </View>
          <Text style={styles.rowHint}>Get reminded at 7 PM to keep your streak</Text>
        </View>

        {/* Support section */}
        <Text style={styles.sectionLabel}>Support the App</Text>

        <View style={styles.card}>
          <Text style={styles.supportMessage}>
            Alpha Bravo Quiz is free with no ads. If you find it useful, consider buying me a coffee!
          </Text>
          <View style={styles.tipRow}>
            <TouchableOpacity
              style={styles.tipButton}
              activeOpacity={0.7}
              onPress={() => Linking.openURL('https://buymeacoffee.com/YOUR_USERNAME')}
            >
              <Text style={styles.tipEmoji}>☕</Text>
              <Text style={styles.tipAmount}>$1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tipButton}
              activeOpacity={0.7}
              onPress={() => Linking.openURL('https://buymeacoffee.com/YOUR_USERNAME')}
            >
              <Text style={styles.tipEmoji}>☕☕</Text>
              <Text style={styles.tipAmount}>$3</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tipButton}
              activeOpacity={0.7}
              onPress={() => Linking.openURL('https://buymeacoffee.com/YOUR_USERNAME')}
            >
              <Text style={styles.tipEmoji}>☕☕☕</Text>
              <Text style={styles.tipAmount}>$5</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data section */}
        <Text style={styles.sectionLabel}>Data</Text>

        <TouchableOpacity style={styles.dangerCard} onPress={handleClearHistory} activeOpacity={0.7}>
          <MaterialCommunityIcons name="delete-outline" size={22} color={COLORS.error} />
          <Text style={styles.dangerText}>Clear All Data</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Alpha Bravo Quiz v1.0.0</Text>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  rowLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginHorizontal: SPACING.md,
  },
  dangerCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
  },
  dangerText: {
    fontSize: 16,
    color: COLORS.error,
    fontWeight: '600',
  },
  rowHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    marginTop: -SPACING.sm,
  },
  supportMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  tipRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  tipButton: {
    flex: 1,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
    gap: 2,
  },
  tipEmoji: {
    fontSize: 18,
  },
  tipAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  version: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: SPACING.xl,
  },
});
