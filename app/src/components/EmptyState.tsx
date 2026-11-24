import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MESSAGES } from '@multicam/shared';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function EmptyState({
  title = MESSAGES.EMPTY_VIDEOS,
  description,
  iconName = 'folder-open-outline',
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={48} color={colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onActionPress ? (
        <View style={styles.actionWrapper}>
          <Button
            label={actionLabel}
            onPress={onActionPress}
            variant="secondary"
            fullWidth={false}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  actionWrapper: {
    marginTop: spacing.sm,
  },
});
