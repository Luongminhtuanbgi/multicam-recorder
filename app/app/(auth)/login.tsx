import React from 'react';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';
import { getActiveServerUrl, useServerStore } from '@/core/stores/serverStore';

export default function LoginScreen() {
  const serverUrl = useServerStore((s) => s.serverUrl);
  const lastPingMs = useServerStore((s) => s.lastPingMs);
  const effectiveUrl = serverUrl || getActiveServerUrl();
  const pingInfo = lastPingMs !== null ? ` (${lastPingMs} ms)` : '';

  return (
    <ScreenPlaceholder
      badge="Auth"
      title="Đăng nhập"
      description={`Máy chủ đang kết nối: ${effectiveUrl || 'Chưa cấu hình'}${pingInfo}.`}
      actions={[
        { label: 'Mở giao diện Remote', href: '/(remote)/room' },
        {
          label: 'Mở bảng điều khiển Controller',
          href: '/(controller)/room',
          variant: 'secondary',
        },
        { label: 'Tạo tài khoản mới', href: '/(auth)/signup', variant: 'secondary' },
        { label: 'Quên mật khẩu?', href: '/(auth)/forgot/1', variant: 'secondary' },
        { label: 'Đổi địa chỉ máy chủ LAN', href: '/server-config', variant: 'secondary' },
      ]}
    />
  );
}
