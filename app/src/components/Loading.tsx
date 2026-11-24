import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, spacing, typography } from '@/theme';

export interface LoadingProps {
  label?: string;
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Loading({ label, fullScreen = false, style }: LoadingProps) {
  return (
    <View style={[styles.base, fullScreen && styles.fullScreen, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
