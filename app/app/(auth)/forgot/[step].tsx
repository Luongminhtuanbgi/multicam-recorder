import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function ForgotPasswordStepScreen() {
  const { step = '1' } = useLocalSearchParams<{ step?: string }>();

  return (
    <ScreenPlaceholder
      badge="Auth"
      title={`Khôi phục mật khẩu — Bước ${step}/3`}
      description="Luồng đặt lại mật khẩu qua mã xác thực 6 chữ số."
      actions={[
        ...(step === '1' ? [{ label: 'Tiếp tục Bước 2', href: '/(auth)/forgot/2' }] : []),
        ...(step === '2' ? [{ label: 'Tiếp tục Bước 3', href: '/(auth)/forgot/3' }] : []),
        { label: 'Về màn Đăng nhập', href: '/(auth)/login', variant: 'secondary' },
      ]}
    />
  );
}
