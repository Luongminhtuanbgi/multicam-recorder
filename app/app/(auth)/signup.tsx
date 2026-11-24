import React from 'react';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function SignupScreen() {
  return (
    <ScreenPlaceholder
      badge="Auth"
      title="Tạo tài khoản Remote"
      description="Đăng ký tài khoản mới dành cho thiết bị quay từ xa."
      actions={[
        { label: 'Sang bước nhập mã xác minh', href: '/(auth)/verify' },
        { label: 'Quay lại Đăng nhập', href: '/(auth)/login', variant: 'secondary' },
      ]}
    />
  );
}
