import axios from 'axios';
import {
  MESSAGES,
  resolveApiErrorMessageKey,
  type ApiErrorData,
  type ApiResponse,
  type MessageKey,
} from '@multicam/shared';

export type ClientErrorCode =
  'CLIENT_OFFLINE' | 'CLIENT_UNREACHABLE' | 'CLIENT_INVALID_RESPONSE' | 'CLIENT_UNKNOWN';

export interface AppApiErrorOptions {
  code: string;
  userMessage: string;
  messageKey: MessageKey | null;
  reason?: string;
  field?: string;
  httpStatus?: number;
  rawData?: unknown;
  isAutoHandled?: boolean;
}

/**
 * Lớp lỗi chuẩn hóa phía client cho các lời gọi API và kiểm tra kết nối.
 * Thông báo hiển thị luôn lấy thống nhất từ `MESSAGES` của `@multicam/shared`.
 */
export class AppApiError extends Error {
  public readonly code: string;
  public readonly userMessage: string;
  public readonly messageKey: MessageKey | null;
  public readonly reason?: string;
  public readonly field?: string;
  public readonly httpStatus?: number;
  public readonly rawData?: unknown;
  public readonly isAutoHandled: boolean;

  constructor(options: AppApiErrorOptions) {
    super(options.userMessage);
    this.name = 'AppApiError';
    this.code = options.code;
    this.userMessage = options.userMessage;
    this.messageKey = options.messageKey;
    this.reason = options.reason;
    this.field = options.field;
    this.httpStatus = options.httpStatus;
    this.rawData = options.rawData;
    this.isAutoHandled = options.isAutoHandled ?? options.messageKey === null;
  }
}

export function isValidApiEnvelope(payload: unknown): payload is ApiResponse<unknown> {
  if (!payload || typeof payload !== 'object') {
    return false;
  }
  const record = payload as Record<string, unknown>;
  return typeof record.code === 'string' && typeof record.message === 'string';
}

function extractErrorMeta(data: unknown): { reason?: string; field?: string } {
  if (!data || typeof data !== 'object') {
    return {};
  }
  const record = data as ApiErrorData;
  return {
    reason: typeof record.reason === 'string' ? record.reason : undefined,
    field: typeof record.field === 'string' ? record.field : undefined,
  };
}

/**
 * Ánh xạ phản hồi `{ code, message, data }` khác `1000` sang `AppApiError`.
 */
export function mapApiEnvelopeToError(
  envelope: ApiResponse<unknown>,
  httpStatus?: number
): AppApiError {
  const { reason, field } = extractErrorMeta(envelope.data);
  const messageKey = resolveApiErrorMessageKey(envelope.code, reason);

  return new AppApiError({
    code: envelope.code,
    userMessage: messageKey ? MESSAGES[messageKey] : MESSAGES.GENERIC_ERROR,
    messageKey,
    reason,
    field,
    httpStatus,
    rawData: envelope.data,
    isAutoHandled: messageKey === null,
  });
}

/**
 * Chuẩn hóa mọi ngoại lệ từ Axios, mất kết nối hoặc dữ liệu sai định dạng sang `AppApiError`.
 */
export function normalizeTransportError(error: unknown): AppApiError {
  if (error instanceof AppApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const payload: unknown = error.response.data;
      if (isValidApiEnvelope(payload)) {
        return mapApiEnvelopeToError(payload, error.response.status);
      }
      return new AppApiError({
        code: 'CLIENT_INVALID_RESPONSE',
        messageKey: 'INVALID_RESPONSE',
        userMessage: MESSAGES.INVALID_RESPONSE,
        httpStatus: error.response.status,
        rawData: payload,
      });
    }

    return new AppApiError({
      code: 'CLIENT_UNREACHABLE',
      messageKey: 'SERVER_UNREACHABLE',
      userMessage: MESSAGES.SERVER_UNREACHABLE,
    });
  }

  return new AppApiError({
    code: 'CLIENT_UNKNOWN',
    messageKey: 'GENERIC_ERROR',
    userMessage: MESSAGES.GENERIC_ERROR,
  });
}

/**
 * Lấy câu thông báo tiếng Việt thân thiện để hiển thị cho người dùng.
 */
export function toUserErrorMessage(error: unknown): string {
  return normalizeTransportError(error).userMessage;
}
