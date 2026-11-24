import React from 'react';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function RemoteJoinRoomScreen() {
  return (
    <ScreenPlaceholder
      badge="Remote"
      title="Tham gia phòng"
      description="Nhập mã phòng 6 ký tự, đặt tên camera hiển thị và cấp quyền điều khiển quay từ xa."
      actions={[{ label: 'Mở màn hình Camera', href: '/(remote)/room/camera' }]}
    />
  );
}
