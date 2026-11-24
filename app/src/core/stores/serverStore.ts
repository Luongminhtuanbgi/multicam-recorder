import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

const SERVER_STORE_STORAGE_KEY = 'multicam.server.config.v1';

/**
 * Safe storage wrapper so static Web rendering (Node SSR during `expo export`)
 * never crashes when `window` is undefined.
 */
const safeAsyncStorage: StateStorage = {
  getItem: async (name: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return null;
    }
    return AsyncStorage.getItem(name);
  },
  setItem: async (name: string, value: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    await AsyncStorage.removeItem(name);
  },
};

function stripTrailingSlash(url: string): string {
  return url.trim().replace(/\/+$/, '');
}

/**
 * Xác định URL mặc định cho Web Controller:
 * - Khi được phục vụ trực tiếp từ Express backend (cùng origin), dùng `window.location.origin`.
 * - Khi chạy dev server Expo/Metro (`:8081`), ưu tiên `EXPO_PUBLIC_DEFAULT_SERVER_URL` hoặc cùng hostname cổng `3000`.
 */
export function resolveDefaultWebServerUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_DEFAULT_SERVER_URL?.trim();
  if (typeof window !== 'undefined' && window.location?.origin) {
    if (window.location.port === '8081') {
      if (envUrl) {
        return stripTrailingSlash(envUrl);
      }
      return `${window.location.protocol}//${window.location.hostname}:3000`;
    }
    return stripTrailingSlash(window.location.origin);
  }
  return envUrl ? stripTrailingSlash(envUrl) : 'http://localhost:3000';
}

export interface ServerConfigState {
  /** URL đầy đủ đã chuẩn hóa (ví dụ `http://192.168.1.17:3000`), rỗng nếu Android chưa cấu hình */
  serverUrl: string;
  /** Độ trễ lần kiểm tra kết nối thành công gần nhất (ms) */
  lastPingMs: number | null;
  /** Đánh dấu đã đọc xong AsyncStorage */
  isHydrated: boolean;
  setServerConfig: (url: string, pingMs?: number | null) => void;
  clearServerConfig: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useServerStore = create<ServerConfigState>()(
  persist(
    (set) => ({
      serverUrl: '',
      lastPingMs: null,
      isHydrated: Platform.OS === 'web' && typeof window === 'undefined',
      setServerConfig: (url, pingMs = null) =>
        set({
          serverUrl: stripTrailingSlash(url),
          lastPingMs: pingMs,
        }),
      clearServerConfig: () =>
        set({
          serverUrl: '',
          lastPingMs: null,
        }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: SERVER_STORE_STORAGE_KEY,
      storage: createJSONStorage(() => safeAsyncStorage),
      partialize: (state) => ({
        serverUrl: state.serverUrl,
        lastPingMs: state.lastPingMs,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

/**
 * Lấy base server URL đang hiệu lực (không gồm hậu tố `/api`).
 * - Nếu người dùng đã lưu `serverUrl` trong store -> ưu tiên dùng.
 * - Nếu chưa lưu: trên Web trả về origin mặc định; trên Android trả về chuỗi rỗng để chuyển sang màn cấu hình máy chủ.
 */
export function getActiveServerUrl(): string {
  const stored = useServerStore.getState().serverUrl;
  if (stored) {
    return stripTrailingSlash(stored);
  }
  if (Platform.OS === 'web') {
    return resolveDefaultWebServerUrl();
  }
  return '';
}

/**
 * Gợi ý giá trị ban đầu cho ô nhập địa chỉ máy chủ.
 */
export function getSuggestedServerAddressInput(): string {
  const stored = useServerStore.getState().serverUrl;
  if (stored) {
    return stored.replace(/^http:\/\//i, '');
  }
  const envUrl = process.env.EXPO_PUBLIC_DEFAULT_SERVER_URL?.trim();
  if (envUrl) {
    return stripTrailingSlash(envUrl).replace(/^http:\/\//i, '');
  }
  if (Platform.OS === 'web') {
    return resolveDefaultWebServerUrl().replace(/^http:\/\//i, '');
  }
  return '';
}
