import type { Response } from 'express';
import {
  RESPONSE_CODES,
  RESPONSE_HTTP_STATUS,
  RESPONSE_MESSAGES,
  type ApiErrorData,
  type ApiResponse,
  type ResponseCode,
} from '@multicam/shared';

/**
 * Lỗi nghiệp vụ chuẩn của Backend, tự động tra message tiếng Anh theo slide và HTTP status chuẩn.
 */
export class AppError extends Error {
  public readonly code: ResponseCode;
  public readonly httpStatus: number;
  public readonly data: ApiErrorData;

  constructor(code: ResponseCode, data: ApiErrorData = {}, httpStatus?: number) {
    const message = RESPONSE_MESSAGES[code];
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.httpStatus = httpStatus ?? RESPONSE_HTTP_STATUS[code] ?? 500;
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Xây dựng đối tượng phản hồi thành công `{ code: "1000", message: "OK", data }` */
export function ok<T>(data: T): ApiResponse<T> {
  return {
    code: RESPONSE_CODES.OK,
    message: RESPONSE_MESSAGES[RESPONSE_CODES.OK],
    data,
  };
}

/** Gửi phản hồi thành công qua Express `Response` */
export function sendOk<T>(res: Response, data: T, httpStatus = 200): Response<ApiResponse<T>> {
  return res.status(httpStatus).json(ok(data));
}

/** Gửi phản hồi với mã bất kỳ (ví dụ `1010` idempotent HTTP 200 hoặc `9994` empty list HTTP 200) */
export function sendCode<T>(
  res: Response,
  code: ResponseCode,
  data: T,
  httpStatus?: number
): Response<ApiResponse<T>> {
  const status = httpStatus ?? RESPONSE_HTTP_STATUS[code] ?? 200;
  return res.status(status).json({
    code,
    message: RESPONSE_MESSAGES[code],
    data,
  });
}
