import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  MESSAGES,
  RESPONSE_CODES,
  type ApiResponse,
  type HealthResponseDto,
} from '@multicam/shared';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import {
  AppApiError,
  isValidApiEnvelope,
  mapApiEnvelopeToError,
  normalizeTransportError,
} from '@/core/errors/errorMap';
import { getActiveServerUrl } from '@/core/stores/serverStore';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Bỏ qua đính kèm Bearer token (dùng cho health, login, signup, refresh...) */
    _skipAuth?: boolean;
    /** Bỏ qua cơ chế tự gọi refresh_token khi gặp 9998 */
    _skipAuthRefresh?: boolean;
    /** Cờ nội bộ đánh dấu request đã thử refresh đúng 1 lần */
    _retriedRefresh?: boolean;
  }
}

export interface AuthInterceptorHooks {
  getAccessToken: () => string | null;
  /** Thực hiện xoay vòng refresh_token; trả về access_token mới hoặc `null` nếu thất bại */
  refreshSession: () => Promise<string | null>;
  /** Xóa phiên cục bộ và đưa người dùng về màn Đăng nhập khi refresh thất bại */
  onSessionExpired: () => void;
}

let authHooks: AuthInterceptorHooks | null = null;
let refreshInFlightPromise: Promise<string | null> | null = null;

/**
 * Đăng ký các hàm xử lý phiên xác thực từ store xác thực.
 */
export function registerAuthInterceptorHooks(hooks: AuthInterceptorHooks | null): void {
  authHooks = hooks;
}

/**
 * Gọi `refresh_token` dùng chung một Promise duy nhất cho các request song song gặp mã `9998`.
 */
async function refreshAccessTokenSingleFlight(): Promise<string | null> {
  if (!authHooks) {
    return null;
  }
  if (!refreshInFlightPromise) {
    refreshInFlightPromise = authHooks
      .refreshSession()
      .catch(() => null)
      .finally(() => {
        refreshInFlightPromise = null;
      });
  }
  return refreshInFlightPromise;
}

async function handleTokenInvalidAndRetry(
  client: AxiosInstance,
  originalConfig: InternalAxiosRequestConfig
) {
  originalConfig._retriedRefresh = true;
  const nextAccessToken = await refreshAccessTokenSingleFlight();

  if (!nextAccessToken) {
    authHooks?.onSessionExpired();
    throw new AppApiError({
      code: RESPONSE_CODES.TOKEN_INVALID,
      messageKey: 'SESSION_EXPIRED',
      userMessage: MESSAGES.SESSION_EXPIRED,
    });
  }

  originalConfig.headers.set('Authorization', `Bearer ${nextAccessToken}`);
  return client.request(originalConfig);
}

export const DEFAULT_API_TIMEOUT_MS = 15_000;
export const HEALTH_PING_TIMEOUT_MS = 8_000;

export const apiClient: AxiosInstance = axios.create({
  timeout: DEFAULT_API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (!config.baseURL) {
    const serverUrl = getActiveServerUrl();
    if (!serverUrl) {
      throw new AppApiError({
        code: 'CLIENT_UNREACHABLE',
        messageKey: 'SERVER_UNREACHABLE',
        userMessage: MESSAGES.SERVER_UNREACHABLE,
      });
    }
    config.baseURL = `${serverUrl}/api`;
  }

  if (!config._skipAuth && authHooks) {
    const token = authHooks.getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  async (response) => {
    const payload: unknown = response.data;
    if (!isValidApiEnvelope(payload)) {
      throw new AppApiError({
        code: 'CLIENT_INVALID_RESPONSE',
        messageKey: 'INVALID_RESPONSE',
        userMessage: MESSAGES.INVALID_RESPONSE,
        httpStatus: response.status,
        rawData: payload,
      });
    }

    if (payload.code === RESPONSE_CODES.OK) {
      return response;
    }

    if (
      payload.code === RESPONSE_CODES.TOKEN_INVALID &&
      !response.config._skipAuthRefresh &&
      !response.config._retriedRefresh &&
      authHooks
    ) {
      return handleTokenInvalidAndRetry(apiClient, response.config);
    }

    throw mapApiEnvelopeToError(payload, response.status);
  },
  async (error: AxiosError) => {
    const originalConfig = error.config;
    const payload: unknown = error.response?.data;

    if (
      originalConfig &&
      isValidApiEnvelope(payload) &&
      payload.code === RESPONSE_CODES.TOKEN_INVALID &&
      !originalConfig._skipAuthRefresh &&
      !originalConfig._retriedRefresh &&
      authHooks
    ) {
      return handleTokenInvalidAndRetry(apiClient, originalConfig);
    }

    throw normalizeTransportError(error);
  }
);

/**
 * Gọi REST endpoint chuẩn và trả thẳng trường `data` khi `code === "1000"`.
 */
export async function requestApi<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<ApiResponse<T>>(config);
  return response.data.data;
}

export interface PingHealthResult {
  normalizedUrl: string;
  latencyMs: number;
  health: HealthResponseDto;
}

/**
 * Gọi `GET /api/health` để kiểm tra kết nối máy chủ và đo độ trễ RTT.
 */
export async function pingServerHealth(customServerUrl?: string): Promise<PingHealthResult> {
  const targetUrl = (customServerUrl ?? getActiveServerUrl()).trim().replace(/\/+$/, '');
  if (!targetUrl) {
    throw new AppApiError({
      code: 'CLIENT_UNREACHABLE',
      messageKey: 'SERVER_UNREACHABLE',
      userMessage: MESSAGES.SERVER_UNREACHABLE,
    });
  }

  const startedAt = Date.now();
  const health = await requestApi<HealthResponseDto>({
    method: 'GET',
    baseURL: `${targetUrl}/api`,
    url: API_ENDPOINTS.HEALTH,
    timeout: HEALTH_PING_TIMEOUT_MS,
    _skipAuth: true,
    _skipAuthRefresh: true,
  });
  const latencyMs = Math.max(1, Date.now() - startedAt);

  return {
    normalizedUrl: targetUrl,
    latencyMs,
    health,
  };
}
