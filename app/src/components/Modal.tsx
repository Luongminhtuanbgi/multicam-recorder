import React from 'react';
import { Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, type ButtonVariant } from '@/components/Button';
import { colors, radii, spacing, typography } from '@/theme';

export interface AppModalProps {
  visible: boolean;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonVariant;
  confirmLoading?: boolean;
  confirmDisabled?: boolean;
  onConfirm?: () => void;
  onClose: () => void;
}

export function AppModal({
  visible,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = 'Hủy',
  confirmVariant = 'primary',
  confirmLoading = false,
  confirmDisabled = false,
  onConfirm,
  onClose,
}: AppModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={confirmLoading ? undefined : onClose}>
        <Pressable style={styles.dialog} onPress={() => undefined}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          {children}

          <View style={styles.actionsRow}>
            <View style={styles.actionItem}>
              <Button
                label={cancelLabel}
                variant="secondary"
                disabled={confirmLoading}
                onPress={onClose}
              />
            </View>
            {confirmLabel && onConfirm ? (
              <View style={styles.actionItem}>
                <Button
                  label={confirmLabel}
                  variant={confirmVariant}
                  loading={confirmLoading}
                  disabled={confirmDisabled}
                  onPress={onConfirm}
                />
              </View>
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.bgOverlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.modal,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  actionItem: {
    flex: 1,
  },
});
