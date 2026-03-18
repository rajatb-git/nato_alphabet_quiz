import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface Props {
  text: string;
  variant: 'success' | 'error';
  onDismiss: () => void;
}

export default function CorrectionBanner({ text, variant, onDismiss }: Props) {
  const translateY = useSharedValue(-44);
  const opacity = useSharedValue(0);
  const duration = variant === 'success' ? 1000 : 2000;

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(1, { duration: 200 });

    const timer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(-44, { duration: 200 });
      setTimeout(() => runOnJS(onDismiss)(), 250);
    }, duration);

    return () => clearTimeout(timer);
  }, [text, variant, translateY, opacity, onDismiss, duration]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const isSuccess = variant === 'success';

  return (
    <Animated.View
      style={[
        styles.banner,
        isSuccess ? styles.bannerSuccess : styles.bannerError,
        animStyle,
      ]}
      pointerEvents="none"
    >
      <MaterialCommunityIcons
        name={isSuccess ? 'check-circle' : 'close-circle'}
        size={18}
        color={isSuccess ? COLORS.success : COLORS.error}
      />
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: SPACING.lg,
    right: SPACING.lg,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  bannerSuccess: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    borderColor: COLORS.success,
  },
  bannerError: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderColor: COLORS.error,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
});
