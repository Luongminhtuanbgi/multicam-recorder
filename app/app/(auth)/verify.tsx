import React from 'react';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function VerifyCodeScreen() {
  return (
    <ScreenPlaceholder
      badge="Auth"
      title="Nhập mã xác minh"
      description="Nhập mã xác thực 6 chữ số để kích hoạt tài khoản."
      actions={[
        { label: 'Xác nhận & vào Remote', href: '/(remote)/room' },
        { label: 'Quay lại Đăng nhập', href: '/(auth)/login', variant: 'secondary' },
      ]}
    />
  );
}
