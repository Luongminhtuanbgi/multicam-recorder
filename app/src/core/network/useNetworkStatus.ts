import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { MESSAGES } from '@multicam/shared';
import { create } from 'zustand';
import { AppApiError } from '@/core/errors/errorMap';

interface NetworkStoreState {
  isOnline: boolean;
  connectionType: string | null;
  setFromNetInfo: (state: NetInfoState) => void;
}

/**
 * Trên mạng LAN nội bộ / Hotspot không có Internet ra ngoài, `isConnected` là `true`
 * còn `isInternetReachable` của Android có thể là `false`.
 * Vì hệ thống chạy qua LAN nội bộ, chỉ coi là mất mạng khi `isConnected === false`.
 */
function computeIsOnline(state: NetInfoState): boolean {
  return state.isConnected !== false;
}

const useNetworkStore = create<NetworkStoreState>((set) => ({
  isOnline: true,
  connectionType: null,
  setFromNetInfo: (state) =>
    set({
      isOnline: computeIsOnline(state),
      connectionType: state.type ?? null,
    }),
}));

let isNetInfoSubscribed = false;

function ensureNetInfoSubscription(): void {
  if (isNetInfoSubscribed) {
    return;
  }
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    return;
  }
  isNetInfoSubscribed = true;
  NetInfo.addEventListener((state) => {
    useNetworkStore.getState().setFromNetInfo(state);
  });
}

/**
 * Hook theo dõi trạng thái kết nối mạng thời gian thực.
 */
export function useNetworkStatus() {
  const isOnline = useNetworkStore((s) => s.isOnline);
  const connectionType = useNetworkStore((s) => s.connectionType);

  useEffect(() => {
    ensureNetInfoSubscription();
    void NetInfo.fetch().then((state) => {
      useNetworkStore.getState().setFromNetInfo(state);
    });
  }, []);

  const refresh = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return true;
    }
    const state = await NetInfo.fetch();
    useNetworkStore.getState().setFromNetInfo(state);
    return computeIsOnline(state);
  }, []);

  return {
    isOnline,
    connectionType,
    refresh,
  };
}

/**
 * Kiểm tra trạng thái mạng trước khi gửi request API (gọi sau bước validate dữ liệu đầu vào).
 * Nếu thiết bị đang mất kết nối, ném `AppApiError` với `MESSAGES.NETWORK_OFFLINE`.
 */
export async function assertOnline(): Promise<void> {
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    return;
  }
  const state = await NetInfo.fetch();
  useNetworkStore.getState().setFromNetInfo(state);
  if (!computeIsOnline(state)) {
    throw new AppApiError({
      code: 'CLIENT_OFFLINE',
      messageKey: 'NETWORK_OFFLINE',
      userMessage: MESSAGES.NETWORK_OFFLINE,
    });
  }
}
