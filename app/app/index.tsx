import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card, Loading } from '@/components';
import { pingServerHealth } from '@/core/api/client';
import { toUserErrorMessage } from '@/core/errors/errorMap';
import { assertOnline } from '@/core/network/useNetworkStatus';
import { getActiveServerUrl, useServerStore } from '@/core/stores/serverStore';
import { colors, radii, spacing, typography } from '@/theme';

/**
 * Màn hình khởi động:
 * - Đọc `serverUrl` đã lưu từ `serverStore`.
 * - Nếu chạy trên Android mà chưa cấu hình máy chủ -> chuyển sang `/server-config`.
 * - Kiểm tra kết nối `/api/health`: thành công -> chuyển sang `/(auth)/login`;
 *   thất bại -> hiển thị lỗi và cho phép Thử lại hoặc mở cấu hình máy chủ.
 */
export default function BootstrapScreen() {
  const router = useRouter();
  const isHydrated = useServerStore((s) => s.isHydrated);
  const storedServerUrl = useServerStore((s) => s.serverUrl);
  const setServerConfig = useServerStore((s) => s.setServerConfig);

  const [isChecking, setIsChecking] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetUrl, setTargetUrl] = useState<string>('');

  const runBootstrapCheck = useCallback(async () => {
    const activeUrl = getActiveServerUrl();
    setTargetUrl(activeUrl);

    if (Platform.OS !== 'web' && !activeUrl) {
      router.replace('/server-config');
      return;
    }

    setIsChecking(true);
    setErrorMessage(null);

    try {
      await assertOnline();
      const pingResult = await pingServerHealth(activeUrl);
      if (storedServerUrl) {
        setServerConfig(pingResult.normalizedUrl, pingResult.latencyMs);
      }
      router.replace('/(auth)/login');
    } catch (error) {
      setErrorMessage(toUserErrorMessage(error));
      setIsChecking(false);
    }
  }, [router, setServerConfig, storedServerUrl]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    void runBootstrapCheck();
  }, [isHydrated, runBootstrapCheck]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.contentBox}>
          <View style={styles.logoCircle}>
            <Ionicons name="videocam" size={38} color={colors.primary} />
          </View>

          <Text style={styles.title}>Multi-Cam Recorder</Text>
          <Text style={styles.subtitle}>Thu thập dữ liệu video đồng bộ đa góc quay</Text>

          {isChecking ? (
            <Loading label="Đang kiểm tra kết nối máy chủ..." />
          ) : errorMessage ? (
            <Card tone="danger" style={styles.errorCard}>
              <View style={styles.errorHeader}>
                <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>

              {targetUrl ? <Text style={styles.urlHint}>Máy chủ: {targetUrl}</Text> : null}

              <View style={styles.actionsColumn}>
                <Button label="Thử lại" onPress={() => void runBootstrapCheck()} />
                <Button
                  label="Cấu hình máy chủ"
                  variant="secondary"
                  onPress={() => router.push('/server-config')}
                />
              </View>
            </Card>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  contentBox: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: spacing.md,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySurface,
    borderWidth: 1,
    borderColor: colors.borderFocus,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorCard: {
    width: '100%',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  errorText: {
    ...typography.bodySemiBold,
    color: colors.textPrimary,
    flex: 1,
  },
  urlHint: {
    ...typography.mono,
    color: colors.textSecondary,
  },
  actionsColumn: {
    gap: spacing.sm,
  },
});
