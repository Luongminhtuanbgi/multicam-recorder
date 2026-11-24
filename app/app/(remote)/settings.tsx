import React from 'react';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function RemoteSettingsScreen() {
  return (
    <ScreenPlaceholder
      badge="Remote"
      title="Cài đặt"
      description="Hồ sơ thiết bị, đổi mật khẩu, đăng xuất và quản lý tài khoản."
      actions={[{ label: 'Về màn Đăng nhập', href: '/(auth)/login', variant: 'danger' }]}
    />
  );
}
