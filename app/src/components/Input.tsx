import React, { forwardRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string | null;
  rightElement?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  mono?: boolean;
}

export const Input = forwardRef<React.ComponentRef<typeof TextInput>, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    rightElement,
    containerStyle,
    style,
    mono = false,
    onFocus,
    onBlur,
    editable = true,
    ...rest
  },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          Boolean(error) && styles.inputWrapperError,
          !editable && styles.inputWrapperDisabled,
        ]}
      >
        <TextInput
          ref={ref}
          editable={editable}
          placeholderTextColor={colors.textMuted}
          selectionColor={colors.primary}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, mono && styles.inputMono, style]}
          {...rest}
        />
        {rightElement ? <View style={styles.rightSlot}>{rightElement}</View> : null}
      </View>

      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.errorText}>
          {error}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySemiBold,
    color: colors.textSecondary,
  },
  inputWrapper: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.input,
    paddingHorizontal: spacing.md,
  },
  inputWrapperFocused: {
    borderColor: colors.borderFocus,
  },
  inputWrapperError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSurface,
  },
  inputWrapperDisabled: {
    opacity: 0.6,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  inputMono: {
    ...typography.mono,
  },
  rightSlot: {
    marginLeft: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
  },
  helperText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
