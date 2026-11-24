import pino from 'pino';
import pinoHttp from 'pino-http';
import { env } from '../config/env';

/**
 * Logger toàn cục tự động ẩn các trường nhạy cảm (token, password).
 */
export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.access_token',
      '*.refresh_token',
      '*.password',
      '*.old_password',
      '*.new_password',
      'access_token',
      'refresh_token',
      'password',
    ],
    censor: '[REDACTED]',
  },
});

export const httpLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => req.url === '/api/health',
  },
});
