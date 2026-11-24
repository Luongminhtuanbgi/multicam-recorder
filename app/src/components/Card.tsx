import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radii, spacing } from '@/theme';

export type CardTone = 'default' | 'active' | 'recording' | 'danger' | 'primary';

export interface CardProps {
  children: React.ReactNode;
  tone?: CardTone;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, tone = 'default', style }: CardProps) {
  return (
    <View
      style={[
        styles.base,
        tone === 'active' && styles.active,
        tone === 'recording' && styles.recording,
        tone === 'danger' && styles.danger,
        tone === 'primary' && styles.primary,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.bgSurface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  active: {
    backgroundColor: colors.bgSurfaceActive,
    borderColor: colors.borderFocus,
  },
  recording: {
    borderColor: colors.borderRecording,
  },
  danger: {
    backgroundColor: colors.dangerSurface,
    borderColor: colors.danger,
  },
  primary: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.borderFocus,
  },
});
