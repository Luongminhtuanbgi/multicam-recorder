import React from 'react';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function ControllerLibraryScreen() {
  return (
    <ScreenPlaceholder
      badge="Controller"
      title="Thư viện Video Server"
      description="Danh sách video thu được theo từng phiên quay, hỗ trợ phát lại, tải xuống và xóa."
      actions={[
        { label: 'Mở trình phát video mẫu', href: '/player/vd_demo01', variant: 'secondary' },
      ]}
    />
  );
}
