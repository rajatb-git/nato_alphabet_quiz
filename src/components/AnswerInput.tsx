import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  flashColor?: 'success' | 'error' | null;
}

export interface AnswerInputHandle {
  focus: () => void;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export default forwardRef<AnswerInputHandle, Props>(function AnswerInput(
  { value, onChangeText, onSubmit, disabled, flashColor },
  ref,
) {
  const inputRef = useRef<TextInput>(null);
  const flash = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  useEffect(() => {
    if (!disabled) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [disabled]);

  useEffect(() => {
    if (flashColor) {
      flash.value = 1;
      flash.value = withTiming(0, { duration: 400 });
    }
  }, [flashColor, flash]);

  const inputBorderStyle = useAnimatedStyle(() => {
    const color = flashColor === 'success'
      ? interpolateColor(flash.value, [0, 1], [COLORS.cardBorder, COLORS.success])
      : flashColor === 'error'
        ? interpolateColor(flash.value, [0, 1], [COLORS.cardBorder, COLORS.error])
        : COLORS.cardBorder;
    return { borderColor: color };
  });

  return (
    <View style={styles.container}>
      <AnimatedTextInput
        ref={inputRef}
        style={[styles.input, inputBorderStyle]}
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
});

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
    borderWidth: 2,
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
