import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { RESPONSE_CODES, RESPONSE_HTTP_STATUS, RESPONSE_MESSAGES } from '@multicam/shared';
import { ZodError } from 'zod';
import { AppError } from '../http/apiResponse';
import { logger } from '../logger';
import { mapZodErrorToAppError } from './validate';

const PRISMA_CONNECTION_CODES = new Set([
  'P1000',
  'P1001',
  'P1002',
  'P1003',
  'P1008',
  'P1009',
  'P1010',
  'P1011',
  'P1017',
  'P2024',
]);

function isPrismaConnectionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { name?: string; code?: string };
  if (e.name === 'PrismaClientInitializationError' || e.name === 'PrismaClientRustPanicError') {
    return true;
  }
  if (typeof e.code === 'string' && PRISMA_CONNECTION_CODES.has(e.code)) {
    return true;
  }
  return false;
}

/**
 * Middleware xử lý lỗi tập trung ở cuối chuỗi Express.
 * Đảm bảo mọi response lỗi đều có dạng `{ code, message, data }` và không bao giờ lộ stack trace.
 */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. AppError đã chuẩn hóa
  if (err instanceof AppError) {
    res.status(err.httpStatus).json({
      code: err.code,
      message: err.message,
      data: err.data,
    });
    return;
  }

  // 2. Lỗi validate Zod trực tiếp (nếu ném ngoài middleware `validate`)
  if (err instanceof ZodError) {
    const mapped = mapZodErrorToAppError(err);
    res.status(mapped.httpStatus).json({
      code: mapped.code,
      message: mapped.message,
      data: mapped.data,
    });
    return;
  }

  // 3. Body vượt quá giới hạn kích thước (body-parser / express.raw) -> 1006
  if (
    err &&
    typeof err === 'object' &&
    'type' in err &&
    (err as { type?: string }).type === 'entity.too.large'
  ) {
    const code = RESPONSE_CODES.FILE_TOO_BIG;
    res.status(RESPONSE_HTTP_STATUS[code]).json({
      code,
      message: RESPONSE_MESSAGES[code],
      data: {},
    });
    return;
  }

  // 4. Body JSON sai cú pháp -> 1003
  if (err instanceof SyntaxError && 'body' in err) {
    const code = RESPONSE_CODES.PARAM_TYPE_INVALID;
    res.status(RESPONSE_HTTP_STATUS[code]).json({
      code,
      message: RESPONSE_MESSAGES[code],
      data: { reason: 'INVALID_JSON' },
    });
    return;
  }

  // 5. Lỗi kết nối CSDL Prisma -> 1001
  if (isPrismaConnectionError(err)) {
    logger.error({ err }, 'Database connection error');
    const code = RESPONSE_CODES.DB_CONNECTION_ERROR;
    res.status(RESPONSE_HTTP_STATUS[code]).json({
      code,
      message: RESPONSE_MESSAGES[code],
      data: {},
    });
    return;
  }

  // 6. Lỗi không lường trước -> 9999 (ẩn hoàn toàn chi tiết nội bộ/stack trace)
  logger.error({ err }, 'Unhandled server exception');
  const code = RESPONSE_CODES.EXCEPTION_ERROR;
  res.status(RESPONSE_HTTP_STATUS[code]).json({
    code,
    message: RESPONSE_MESSAGES[code],
    data: {},
  });
};
