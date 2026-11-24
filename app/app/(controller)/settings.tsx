import React from 'react';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function ControllerSettingsScreen() {
  return (
    <ScreenPlaceholder
      badge="Controller"
      title="Cài đặt"
      description="Thông tin tài khoản Controller, đổi mật khẩu và đăng xuất."
      actions={[{ label: 'Về màn Đăng nhập', href: '/(auth)/login', variant: 'danger' }]}
    />
  );
}
