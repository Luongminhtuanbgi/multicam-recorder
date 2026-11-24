import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MESSAGES } from '@multicam/shared';
import { useNetworkStatus } from '@/core/network/useNetworkStatus';
import { colors, spacing, typography } from '@/theme';

/**
 * Thanh cảnh báo mất kết nối mạng hiển thị ở đầu màn hình.
 */
export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const insets = useSafeAreaInsets();

  if (isOnline) {
    return null;
  }

  return (
    <View
      accessibilityRole="alert"
      style={[styles.banner, { paddingTop: Math.max(insets.top, spacing.sm) }]}
    >
      <Ionicons name="cloud-offline-outline" size={18} color={colors.danger} />
      <Text style={styles.text}>{MESSAGES.NETWORK_OFFLINE}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    backgroundColor: colors.dangerSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.danger,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  text: {
    ...typography.bodySemiBold,
    color: colors.textPrimary,
    flexShrink: 1,
  },
});
