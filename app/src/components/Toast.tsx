import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastStore } from '@/core/stores/toastStore';
import { colors, radii, spacing, typography } from '@/theme';

export function ToastHost() {
  const current = useToastStore((s) => s.current);
  const hideToast = useToastStore((s) => s.hideToast);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!current) {
      return;
    }
    const timer = setTimeout(() => {
      hideToast(current.id);
    }, current.durationMs);

    return () => clearTimeout(timer);
  }, [current, hideToast]);

  if (!current) {
    return null;
  }

  const iconName: keyof typeof Ionicons.glyphMap =
    current.tone === 'success'
      ? 'checkmark-circle-outline'
      : current.tone === 'warning'
        ? 'warning-outline'
        : current.tone === 'info'
          ? 'information-circle-outline'
          : 'alert-circle-outline';

  const accentColor =
    current.tone === 'success'
      ? colors.success
      : current.tone === 'warning'
        ? colors.warning
        : current.tone === 'info'
          ? colors.primary
          : colors.danger;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.overlay, { bottom: Math.max(insets.bottom, spacing.lg) + spacing.md }]}
    >
      <View
        accessibilityRole="alert"
        style={[
          styles.toastCard,
          current.tone === 'error' && styles.toastError,
          { borderColor: accentColor },
        ]}
      >
        <Ionicons name={iconName} size={20} color={accentColor} />
        <Text style={styles.message}>{current.message}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đóng thông báo"
          hitSlop={8}
          onPress={() => hideToast(current.id)}
        >
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    alignItems: 'center',
  },
  toastCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.card,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  toastError: {
    backgroundColor: colors.dangerSurface,
  },
  message: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
});
