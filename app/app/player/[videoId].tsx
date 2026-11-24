import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ScreenPlaceholder } from '@/components/ScreenPlaceholder';

export default function VideoPlayerScreen() {
  const { videoId = 'unknown' } = useLocalSearchParams<{ videoId?: string }>();

  return (
    <ScreenPlaceholder
      badge="Player"
      title={`Trình phát video (${videoId})`}
      description="Trình phát video kèm thông tin chi tiết của clip."
      actions={[{ label: 'Quay lại màn hình chính', href: '/', variant: 'secondary' }]}
    />
  );
}
