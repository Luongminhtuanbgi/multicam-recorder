import React from 'react';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function RemoteCameraScreen() {
  return (
    <ScreenPlaceholder
      badge="Remote"
      title="Camera Remote"
      description="Khung xem trước camera, đồng hồ thời gian quay và trạng thái nhận lệnh từ Controller."
      actions={[{ label: 'Quay lại Nhập mã phòng', href: '/(remote)/room', variant: 'secondary' }]}
    />
  );
}
