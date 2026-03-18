import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function AnswerInput({
  value,
  onChangeText,
  onSubmit,
  disabled,
}: Props) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!disabled) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [disabled]);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder="Type NATO word..."
        placeholderTextColor={COLORS.textMuted}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="done"
        editable={!disabled}
        selectionColor={COLORS.primaryLight}
      />
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={disabled || value.trim().length === 0}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="send" size={22} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.lg,
    fontSize: 18,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
