import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, Alert, Linking, Modal, Platform } from 'react-native';
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
  const setReminderTime = useSettingsStore((s) => s.setReminderTime);
  const clearHistory = useSettingsStore((s) => s.clearHistory);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickerHour, setPickerHour] = useState(settings.reminderHour);
  const [pickerMinute, setPickerMinute] = useState(settings.reminderMinute);

  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m} ${period}`;
  };

  const openTimePicker = () => {
    setPickerHour(settings.reminderHour);
    setPickerMinute(settings.reminderMinute);
    setShowTimePicker(true);
  };

  const confirmTime = () => {
    setReminderTime(pickerHour, pickerMinute);
    setShowTimePicker(false);
  };

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

          <View style={styles.separator} />

          <TouchableOpacity style={styles.row} onPress={openTimePicker} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons name="clock-outline" size={22} color={COLORS.primary} />
              <Text style={styles.rowLabel}>Reminder Time</Text>
            </View>
            <Text style={styles.timeValue}>
              {formatTime(settings.reminderHour, settings.reminderMinute)}
            </Text>
          </TouchableOpacity>
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

        <Text style={styles.version}>Alpha Bravo Quiz v1.1.0</Text>
      </ScrollView>

      <Modal visible={showTimePicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Reminder Time</Text>

            <View style={styles.pickerRow}>
              <View style={styles.pickerColumn}>
                <TouchableOpacity
                  style={styles.pickerArrow}
                  onPress={() => setPickerHour((h) => (h + 1) % 24)}
                >
                  <MaterialCommunityIcons name="chevron-up" size={28} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.pickerValue}>
                  {(pickerHour % 12 || 12).toString().padStart(2, '0')}
                </Text>
                <TouchableOpacity
                  style={styles.pickerArrow}
                  onPress={() => setPickerHour((h) => (h - 1 + 24) % 24)}
                >
                  <MaterialCommunityIcons name="chevron-down" size={28} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>Hour</Text>
              </View>

              <Text style={styles.pickerColon}>:</Text>

              <View style={styles.pickerColumn}>
                <TouchableOpacity
                  style={styles.pickerArrow}
                  onPress={() => setPickerMinute((m) => (m + 5) % 60)}
                >
                  <MaterialCommunityIcons name="chevron-up" size={28} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.pickerValue}>
                  {pickerMinute.toString().padStart(2, '0')}
                </Text>
                <TouchableOpacity
                  style={styles.pickerArrow}
                  onPress={() => setPickerMinute((m) => (m - 5 + 60) % 60)}
                >
                  <MaterialCommunityIcons name="chevron-down" size={28} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>Min</Text>
              </View>

              <View style={styles.pickerColumn}>
                <TouchableOpacity
                  style={styles.pickerArrow}
                  onPress={() => setPickerHour((h) => (h + 12) % 24)}
                >
                  <MaterialCommunityIcons name="chevron-up" size={28} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.pickerValue}>
                  {pickerHour >= 12 ? 'PM' : 'AM'}
                </Text>
                <TouchableOpacity
                  style={styles.pickerArrow}
                  onPress={() => setPickerHour((h) => (h + 12) % 24)}
                >
                  <MaterialCommunityIcons name="chevron-down" size={28} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.pickerLabel}>{' '}</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonConfirm} onPress={confirmTime}>
                <Text style={styles.modalButtonConfirmText}>Set Time</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  timeValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: SPACING.lg,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  pickerColumn: {
    alignItems: 'center',
  },
  pickerArrow: {
    padding: SPACING.xs,
  },
  pickerValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    minWidth: 50,
    textAlign: 'center',
  },
  pickerColon: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.inputBackground,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalButtonConfirm: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  version: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: SPACING.xl,
  },
});
