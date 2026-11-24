import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ERROR_REASONS, RESPONSE_CODES, type ApiErrorData } from '@multicam/shared';
import { ZodError, type ZodIssue, type ZodTypeAny } from 'zod';
import { AppError } from '../http/apiResponse';

const KNOWN_REASONS = new Set<string>(Object.values(ERROR_REASONS));

function getValueAtPath(source: unknown, path: (string | number)[]): unknown {
  let curr: unknown = source;
  for (const key of path) {
    if (curr === null || curr === undefined || typeof curr !== 'object') {
      return undefined;
    }
    curr = (curr as Record<string | number, unknown>)[key];
  }
  return curr;
}

/**
 * Ánh xạ lỗi Zod sang mã `1002` (thiếu tham số), `1003` (sai kiểu) hoặc `1004` (sai giá trị).
 */
export function mapZodErrorToAppError(zodError: ZodError, rawInput?: unknown): AppError {
  const issue: ZodIssue | undefined = zodError.issues[0];
  if (!issue) {
    return new AppError(RESPONSE_CODES.PARAM_VALUE_INVALID);
  }

  const field = issue.path.length > 0 ? issue.path.join('.') : undefined;
  const data: ApiErrorData = {};
  if (field) {
    data.field = field;
  }

  // Hỗ trợ gắn `reason` chuẩn nếu schema truyền qua `params.reason` hoặc `message`
  const customReason =
    issue.code === 'custom' && typeof issue.params?.reason === 'string'
      ? issue.params.reason
      : KNOWN_REASONS.has(issue.message)
        ? issue.message
        : undefined;
  if (customReason) {
    data.reason = customReason;
  }

  const rawFieldValue =
    rawInput !== undefined && issue.path.length > 0
      ? getValueAtPath(rawInput, issue.path)
      : rawInput;

  // 1. Thiếu tham số bắt buộc -> 1002
  if (issue.code === 'invalid_type' && issue.received === 'undefined') {
    return new AppError(RESPONSE_CODES.PARAM_NOT_ENOUGH, data);
  }
  if (
    issue.code === 'too_small' &&
    issue.type === 'string' &&
    issue.minimum === 1 &&
    (rawFieldValue === undefined || rawFieldValue === null || rawFieldValue === '')
  ) {
    return new AppError(RESPONSE_CODES.PARAM_NOT_ENOUGH, data);
  }

  // 2. Sai kiểu dữ liệu (trừ trường hợp số thực gửi vào trường số nguyên -> coi là sai giá trị 1004) -> 1003
  if (issue.code === 'invalid_type') {
    if (issue.expected === 'integer' && issue.received === 'float') {
      return new AppError(RESPONSE_CODES.PARAM_VALUE_INVALID, data);
    }
    return new AppError(RESPONSE_CODES.PARAM_TYPE_INVALID, data);
  }

  // 3. Còn lại: sai định dạng, độ dài, miền giá trị, enum... -> 1004
  return new AppError(RESPONSE_CODES.PARAM_VALUE_INVALID, data);
}

export interface ValidateSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

/**
 * Middleware kiểm tra `params`, `query`, `body` bằng Zod trước khi vào controller.
 */
export function validate(schemas: ValidateSchemas): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.params) {
        const parsedParams = schemas.params.safeParse(req.params);
        if (!parsedParams.success) {
          throw mapZodErrorToAppError(parsedParams.error, req.params);
        }
        req.params = parsedParams.data;
      }

      if (schemas.query) {
        const parsedQuery = schemas.query.safeParse(req.query);
        if (!parsedQuery.success) {
          throw mapZodErrorToAppError(parsedQuery.error, req.query);
        }
        req.query = parsedQuery.data;
      }

      if (schemas.body) {
        const parsedBody = schemas.body.safeParse(req.body);
        if (!parsedBody.success) {
          throw mapZodErrorToAppError(parsedBody.error, req.body);
        }
        req.body = parsedBody.data;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
