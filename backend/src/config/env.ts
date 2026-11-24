import path from 'node:path';
import dotenv from 'dotenv';
import { z } from 'zod';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().trim().min(1).default('0.0.0.0'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),

  DATABASE_URL: z.string().trim().min(1, 'DATABASE_URL is required'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRES_SEC: z.coerce.number().int().positive().default(3600),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().int().positive().default(30),

  MEDIA_SECRET: z.string().min(32, 'MEDIA_SECRET must be at least 32 characters'),

  STORAGE_DIR: z.string().trim().min(1).default('./storage'),
  UPLOAD_CHUNK_SIZE_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(5 * 1024 * 1024),
  UPLOAD_MAX_FILE_SIZE_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(1024 * 1024 * 1024),
  UPLOAD_SESSION_TTL_MINUTES: z.coerce.number().int().positive().default(120),
  STORAGE_MAX_QUOTA_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(10 * 1024 * 1024 * 1024),

  INVITE_CODE_TTL_MINUTES: z.coerce.number().int().positive().default(10),
  VERIFY_CODE_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  VERIFY_CODE_COOLDOWN_SECONDS: z.coerce.number().int().positive().default(120),

  CONTROLLER_EMAIL: z.string().trim().email().default('controller@multicam.local'),
  CONTROLLER_PHONE: z
    .string()
    .regex(/^0\d{9}$/)
    .default('0900000001'),
  CONTROLLER_PASSWORD: z
    .string()
    .regex(/^[A-Za-z0-9]{6,20}$/)
    .default('Controller123'),
  CONTROLLER_FIRST_NAME: z.string().trim().min(1).max(50).default('Quan Tri'),
  CONTROLLER_LAST_NAME: z.string().trim().min(1).max(50).default('Controller'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    '❌ Invalid backend environment configuration:',
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
