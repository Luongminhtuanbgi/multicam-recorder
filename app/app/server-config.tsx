import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MESSAGES, serverAddressSchema } from '@multicam/shared';
import { Button, Card, Input } from '@/components';
import { pingServerHealth, type PingHealthResult } from '@/core/api/client';
import { toUserErrorMessage } from '@/core/errors/errorMap';
import { assertOnline } from '@/core/network/useNetworkStatus';
import { getSuggestedServerAddressInput, useServerStore } from '@/core/stores/serverStore';
import { colors, radii, spacing, typography } from '@/theme';

/**
 * Màn hình cấu hình địa chỉ máy chủ LAN:
 * 1. Kiểm tra định dạng `IP:port` bằng `serverAddressSchema` trước.
 * 2. Kiểm tra kết nối mạng (`assertOnline()`).
 * 3. Gọi `GET /api/health` đo độ trễ RTT (ms) và lưu cấu hình vào `serverStore`.
 */
export default function ServerConfigScreen() {
  const router = useRouter();
  const isHydrated = useServerStore((s) => s.isHydrated);
  const storedServerUrl = useServerStore((s) => s.serverUrl);
  const setServerConfig = useServerStore((s) => s.setServerConfig);

  const [addressInput, setAddressInput] = useState<string>(() => getSuggestedServerAddressInput());
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<PingHealthResult | null>(null);
  const [pingError, setPingError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isHydrated && !addressInput) {
      const suggested = getSuggestedServerAddressInput();
      if (suggested) {
        setAddressInput(suggested);
      }
    }
  }, [addressInput, isHydrated]);

  const handleChangeAddress = (value: string) => {
    setAddressInput(value);
    if (fieldError) {
      setFieldError(null);
    }
    if (pingError) {
      setPingError(null);
    }
    if (pingResult) {
      setPingResult(null);
    }
  };

  const validateAddressFirst = (): string | null => {
    const parsed = serverAddressSchema.safeParse(addressInput);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message ?? MESSAGES.SERVER_ADDRESS_INVALID;
      setFieldError(firstIssue);
      setPingError(null);
      setPingResult(null);
      return null;
    }
    setFieldError(null);
    return parsed.data;
  };

  const handleTestConnection = async () => {
    const normalizedUrl = validateAddressFirst();
    if (!normalizedUrl) {
      return;
    }

    setIsTesting(true);
    setPingError(null);
    setPingResult(null);

    try {
      await assertOnline();
      const result = await pingServerHealth(normalizedUrl);
      setPingResult(result);
    } catch (error) {
      setPingError(toUserErrorMessage(error));
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAndContinue = async () => {
    const normalizedUrl = validateAddressFirst();
    if (!normalizedUrl) {
      return;
    }

    if (pingResult && pingResult.normalizedUrl === normalizedUrl) {
      setServerConfig(pingResult.normalizedUrl, pingResult.latencyMs);
      router.replace('/(auth)/login');
      return;
    }

    setIsSaving(true);
    setPingError(null);

    try {
      await assertOnline();
      const result = await pingServerHealth(normalizedUrl);
      setPingResult(result);
      setServerConfig(result.normalizedUrl, result.latencyMs);
      router.replace('/(auth)/login');
    } catch (error) {
      setPingError(toUserErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const isBusy = isTesting || isSaving;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <View style={styles.iconBadge}>
                <Ionicons name="server-outline" size={26} color={colors.primary} />
              </View>
              <View style={styles.headerTextGroup}>
                <Text style={styles.title}>Cấu hình máy chủ</Text>
                <Text style={styles.subtitle}>
                  Nhập địa chỉ IP LAN và cổng của máy tính chạy Multi-Cam Server trong cùng mạng
                  Wi-Fi / Hotspot.
                </Text>
              </View>
            </View>

            <Card style={styles.formCard}>
              <Input
                label="Địa chỉ máy chủ (IP:port)"
                placeholder="192.168.1.10:3000"
                value={addressInput}
                onChangeText={handleChangeAddress}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={Platform.OS === 'web' ? 'default' : 'url'}
                editable={!isBusy}
                mono
                error={fieldError}
                helperText="Có thể nhập ngắn gọn dạng IP:port hoặc đầy đủ http://IP:port"
              />

              {pingResult ? (
                <View style={styles.successBox}>
                  <View style={styles.statusDotSuccess} />
                  <View style={styles.statusBody}>
                    <Text style={styles.successTitle}>
                      Kết nối thành công · {pingResult.latencyMs} ms
                    </Text>
                    <Text style={styles.statusMeta}>
                      {pingResult.normalizedUrl} · {pingResult.health.name} v
                      {pingResult.health.version}
                    </Text>
                  </View>
                </View>
              ) : null}

              {pingError ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
                  <Text style={styles.errorText}>{pingError}</Text>
                </View>
              ) : null}

              <View style={styles.buttonsGroup}>
                <Button
                  label="Kiểm tra kết nối"
                  variant="secondary"
                  loading={isTesting}
                  disabled={isSaving}
                  onPress={() => void handleTestConnection()}
                />

                <Button
                  label="Lưu và tiếp tục"
                  variant="primary"
                  loading={isSaving}
                  disabled={isTesting}
                  onPress={() => void handleSaveAndContinue()}
                />
              </View>
            </Card>

            {storedServerUrl || Platform.OS === 'web' ? (
              <Button
                label="Quay lại màn Đăng nhập"
                variant="ghost"
                disabled={isBusy}
                onPress={() => router.replace('/(auth)/login')}
              />
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  keyboardWrapper: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    gap: spacing.lg,
  },
  headerRow: {
    gap: spacing.md,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: radii.card,
    backgroundColor: colors.primarySurface,
    borderWidth: 1,
    borderColor: colors.borderFocus,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextGroup: {
    gap: spacing.xs,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  formCard: {
    gap: spacing.lg,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radii.input,
    padding: spacing.md,
  },
  statusDotSuccess: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.success,
  },
  statusBody: {
    flex: 1,
    gap: spacing.xs,
  },
  successTitle: {
    ...typography.bodySemiBold,
    color: colors.success,
  },
  statusMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerSurface,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radii.input,
    padding: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  buttonsGroup: {
    gap: spacing.sm,
  },
});
