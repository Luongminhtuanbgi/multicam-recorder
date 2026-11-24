import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, type ButtonVariant } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors, radii, spacing, typography } from '@/theme';

export interface NavAction {
  label: string;
  href: Href;
  variant?: ButtonVariant;
}

interface ScreenPlaceholderProps {
  badge?: string;
  title: string;
  description: string;
  actions?: NavAction[];
}

export function ScreenPlaceholder({
  badge,
  title,
  description,
  actions = [],
}: ScreenPlaceholderProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {actions.length > 0 && (
          <Card style={styles.actionsCard}>
            <Text style={styles.sectionLabel}>Điều hướng nhanh</Text>
            {actions.map((item) => (
              <Button
                key={item.href + item.label}
                label={item.label}
                variant={item.variant ?? 'primary'}
                onPress={() => router.push(item.href)}
              />
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySurface,
    borderColor: colors.borderFocus,
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography.mono,
    color: colors.primary,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actionsCard: {
    marginTop: spacing.md,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
});
