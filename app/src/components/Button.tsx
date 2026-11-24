import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  style,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const spinnerColor =
    variant === 'primary'
      ? colors.textOnPrimary
      : variant === 'danger'
        ? colors.textOnDanger
        : colors.primary;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        variant === 'primary' && styles.primary,
        variant === 'primary' && pressed && !isDisabled && styles.primaryPressed,
        variant === 'primary' && isDisabled && styles.primaryDisabled,
        variant === 'secondary' && styles.secondary,
        variant === 'secondary' && pressed && !isDisabled && styles.secondaryPressed,
        variant === 'secondary' && isDisabled && styles.nonPrimaryDisabled,
        variant === 'danger' && styles.danger,
        variant === 'danger' && pressed && !isDisabled && styles.dangerPressed,
        variant === 'danger' && isDisabled && styles.nonPrimaryDisabled,
        variant === 'ghost' && styles.ghost,
        variant === 'ghost' && pressed && !isDisabled && styles.ghostPressed,
        variant === 'ghost' && isDisabled && styles.nonPrimaryDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon ? <View style={styles.iconSlot}>{leftIcon}</View> : null}
          <Text
            style={[
              styles.labelBase,
              variant === 'primary' && styles.labelPrimary,
              variant === 'primary' && isDisabled && styles.labelPrimaryDisabled,
              variant === 'secondary' && styles.labelSecondary,
              variant === 'danger' && styles.labelDanger,
              variant === 'ghost' && styles.labelGhost,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 46,
    borderRadius: radii.button,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryPressed,
  },
  primaryDisabled: {
    backgroundColor: colors.primaryMuted,
  },
  secondary: {
    backgroundColor: colors.bgSurfaceActive,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  secondaryPressed: {
    backgroundColor: colors.bgSurface,
    borderColor: colors.borderFocus,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  dangerPressed: {
    backgroundColor: colors.dangerPressed,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  ghostPressed: {
    backgroundColor: colors.bgSurfaceActive,
  },
  nonPrimaryDisabled: {
    opacity: 0.5,
  },
  labelBase: {
    ...typography.bodySemiBold,
    textAlign: 'center',
  },
  labelPrimary: {
    color: colors.textOnPrimary,
  },
  labelPrimaryDisabled: {
    color: colors.textSecondary,
  },
  labelSecondary: {
    color: colors.textPrimary,
  },
  labelDanger: {
    color: colors.textOnDanger,
  },
  labelGhost: {
    color: colors.primary,
  },
});
