import type { NextFunction, Request, RequestHandler, Response, Router } from 'express';
import { RESPONSE_CODES } from '@multicam/shared';
import { AppError } from '../http/apiResponse';

interface ExpressLayer {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
  name?: string;
  regexp?: RegExp & { fast_slash?: boolean };
  handle?: {
    stack?: ExpressLayer[];
  };
}

function normalizePath(p: string): string {
  const clean = p.replace(/\/+/g, '/').replace(/\/$/, '');
  return clean || '/';
}

function routePatternToRegex(pattern: string): RegExp {
  const norm = normalizePath(pattern);
  const escaped = norm.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:[A-Za-z0-9_]+/g, '[^/]+');
  return new RegExp(`^${escaped}$`);
}

function collectRoutePatterns(stack: ExpressLayer[], prefix = ''): RegExp[] {
  const patterns: RegExp[] = [];
  for (const layer of stack) {
    if (layer.route) {
      patterns.push(routePatternToRegex(`${prefix}${layer.route.path}`));
    } else if (layer.name === 'router' && layer.handle?.stack) {
      let mountPrefix = '';
      if (layer.regexp && !layer.regexp.fast_slash) {
        const src = layer.regexp.source;
        // Trích tiền tố tĩnh từ regexp của Express `router.use('/prefix', subRouter)`
        const match = src.match(/^\^\\\/(.+?)\\\/\?\(\?=\\\/\|\$\)/);
        if (match?.[1]) {
          mountPrefix = '/' + match[1].replace(/\\\//g, '/');
        }
      }
      patterns.push(...collectRoutePatterns(layer.handle.stack, `${prefix}${mountPrefix}`));
    }
  }
  return patterns;
}

/**
 * Bắt các request cuối `apiRouter`:
 * - Nếu đường dẫn khớp với một endpoint đã đăng ký nhưng khác HTTP method -> ném `9997` (HTTP 405).
 * - Nếu đường dẫn không tồn tại -> trả HTTP 404 với khuôn dạng chuẩn `{ code, message, data }`.
 */
export function createApiNotFoundHandler(apiRouter: Router): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const stack = (apiRouter as unknown as { stack?: ExpressLayer[] }).stack ?? [];
    const patterns = collectRoutePatterns(stack);
    const targetPath = normalizePath(req.path);

    const pathExistsWithOtherMethod = patterns.some((re) => re.test(targetPath));
    if (pathExistsWithOtherMethod) {
      return next(new AppError(RESPONSE_CODES.METHOD_INVALID));
    }

    return next(new AppError(RESPONSE_CODES.UNKNOWN_ERROR, { reason: 'ROUTE_NOT_FOUND' }, 404));
  };
}

export function rootNotFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(RESPONSE_CODES.UNKNOWN_ERROR, { reason: 'ROUTE_NOT_FOUND' }, 404));
}
