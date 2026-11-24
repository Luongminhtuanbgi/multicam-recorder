import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MESSAGES } from '@multicam/shared';
import { Button } from '@/components/Button';
import { colors, radii, spacing, typography } from '@/theme';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Bắt lỗi render không mong muốn để ứng dụng không bị văng trắng màn hình.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[ErrorBoundary] Unhandled render error:', error.message, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false });
  };

  public override render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Ionicons name="warning-outline" size={44} color={colors.danger} />
          <Text style={styles.title}>{MESSAGES.GENERIC_ERROR}</Text>
          <Button label="Thử lại" onPress={this.handleReset} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.bgSurface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
