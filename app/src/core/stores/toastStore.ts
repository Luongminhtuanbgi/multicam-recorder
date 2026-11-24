import { create } from 'zustand';

export type ToastTone = 'error' | 'success' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
  durationMs: number;
}

interface ToastStoreState {
  current: ToastItem | null;
  showToast: (params: { message: string; tone?: ToastTone; durationMs?: number }) => void;
  hideToast: (id?: string) => void;
}

let toastSeq = 0;

export const useToastStore = create<ToastStoreState>((set) => ({
  current: null,
  showToast: ({ message, tone = 'error', durationMs = 3500 }) => {
    toastSeq += 1;
    const id = `toast_${Date.now()}_${toastSeq}`;
    set({
      current: {
        id,
        message,
        tone,
        durationMs,
      },
    });
  },
  hideToast: (id) =>
    set((state) => {
      if (!state.current) return state;
      if (id && state.current.id !== id) return state;
      return { current: null };
    }),
}));

export function showToast(message: string, tone: ToastTone = 'error', durationMs = 3500): void {
  useToastStore.getState().showToast({ message, tone, durationMs });
}
