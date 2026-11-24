import React from 'react';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function RemoteLibraryScreen() {
  return (
    <ScreenPlaceholder
      badge="Remote"
      title="Thư viện Remote"
      description="Danh sách clip đã quay trên thiết bị và trạng thái tải lên máy chủ."
      actions={[
        { label: 'Mở trình phát video mẫu', href: '/player/vd_demo01', variant: 'secondary' },
      ]}
    />
  );
}
