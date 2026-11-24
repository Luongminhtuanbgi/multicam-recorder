import express, { Router } from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { deviceTypeSchema, ERROR_REASONS, phoneSchema, RESPONSE_CODES } from '@multicam/shared';
import { createApp } from '../../src/app';
import { AppError, sendCode, sendOk } from '../../src/common/http/apiResponse';
import { asyncHandler } from '../../src/common/http/asyncHandler';
import { errorHandler } from '../../src/common/middlewares/errorHandler';
import { createApiNotFoundHandler } from '../../src/common/middlewares/notFoundHandler';
import { validate } from '../../src/common/middlewares/validate';

function buildTestApp() {
  const app = express();
  app.use(express.json({ limit: '1kb' }));

  const apiRouter = Router();

  const sampleBodySchema = z.object({
    phone: phoneSchema,
    device_type: deviceTypeSchema,
    battery_level: z.number().int().min(0).max(100).optional(),
  });

  apiRouter.post(
    '/sample',
    validate({ body: sampleBodySchema }),
    asyncHandler(async (req, res) => {
      sendOk(res, { received: req.body });
    })
  );

  apiRouter.get(
    '/app-error',
    asyncHandler(async () => {
      throw new AppError(RESPONSE_CODES.PARAM_VALUE_INVALID, {
        reason: ERROR_REASONS.WRONG_PASSWORD,
        field: 'password',
      });
    })
  );

  apiRouter.post(
    '/idempotent',
    asyncHandler(async (_req, res) => {
      sendCode(res, RESPONSE_CODES.ACTION_ALREADY_DONE, { session_id: 'S8F2A1' });
    })
  );

  apiRouter.get(
    '/db-error',
    asyncHandler(async () => {
      const prismaErr = Object.assign(new Error('Can not reach database server'), {
        name: 'PrismaClientInitializationError',
        code: 'P1001',
      });
      throw prismaErr;
    })
  );

  apiRouter.get(
    '/crash',
    asyncHandler(async () => {
      throw new Error('Internal secret failure detail');
    })
  );

  apiRouter.use(createApiNotFoundHandler(apiRouter));
  app.use('/api', apiRouter);
  app.use(errorHandler);

  return app;
}

describe('API response envelope, validation middleware, and error handler', () => {
  const testApp = buildTestApp();

  it('returns 1000 OK with parsed data when input is valid', async () => {
    const res = await request(testApp)
      .post('/api/sample')
      .send({ phone: '0912345678', device_type: 1, battery_level: 85 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      code: '1000',
      message: 'OK',
      data: {
        received: { phone: '0912345678', device_type: 1, battery_level: 85 },
      },
    });
  });

  it('maps missing required field to 1002 (HTTP 400) with field name', async () => {
    const res = await request(testApp).post('/api/sample').send({ device_type: 1 });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('1002');
    expect(res.body.message).toBe('Parameter is not enough');
    expect(res.body.data.field).toBe('phone');
  });

  it('maps wrong parameter type to 1003 (HTTP 400) with field name', async () => {
    const res = await request(testApp)
      .post('/api/sample')
      .send({ phone: '0912345678', device_type: 'android' });

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('1003');
    expect(res.body.message).toBe('Parameter type is invalid');
    expect(res.body.data.field).toBe('device_type');
  });

  it('maps invalid parameter value/format to 1004 (HTTP 400) with field name', async () => {
    const badPhone = await request(testApp)
      .post('/api/sample')
      .send({ phone: '12345', device_type: 1 });

    expect(badPhone.status).toBe(400);
    expect(badPhone.body.code).toBe('1004');
    expect(badPhone.body.data.field).toBe('phone');

    const badDeviceType = await request(testApp)
      .post('/api/sample')
      .send({ phone: '0912345678', device_type: 99 });

    expect(badDeviceType.status).toBe(400);
    expect(badDeviceType.body.code).toBe('1004');
    expect(badDeviceType.body.data.field).toBe('device_type');
  });

  it('maps malformed JSON body to 1003 (HTTP 400)', async () => {
    const res = await request(testApp)
      .post('/api/sample')
      .set('Content-Type', 'application/json')
      .send('{ invalid json');

    expect(res.status).toBe(400);
    expect(res.body.code).toBe('1003');
  });

  it('maps oversized body to 1006 (HTTP 413)', async () => {
    const res = await request(testApp)
      .post('/api/sample')
      .send({ phone: '0912345678', device_type: 1, padding: 'x'.repeat(2048) });

    expect(res.status).toBe(413);
    expect(res.body.code).toBe('1006');
  });

  it('serializes AppError with custom reason/field and supports 1010 HTTP 200', async () => {
    const errRes = await request(testApp).get('/api/app-error');
    expect(errRes.status).toBe(400);
    expect(errRes.body).toEqual({
      code: '1004',
      message: 'Parameter value is invalid',
      data: { reason: 'WRONG_PASSWORD', field: 'password' },
    });

    const idemRes = await request(testApp).post('/api/idempotent');
    expect(idemRes.status).toBe(200);
    expect(idemRes.body.code).toBe('1010');
    expect(idemRes.body.data).toEqual({ session_id: 'S8F2A1' });
  });

  it('maps Prisma database connection error to 1001 (HTTP 500)', async () => {
    const res = await request(testApp).get('/api/db-error');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      code: '1001',
      message: 'Can not connect to DB',
      data: {},
    });
  });

  it('maps unhandled error to 9999 (HTTP 500) without leaking stack or internal message', async () => {
    const res = await request(testApp).get('/api/crash');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      code: '9999',
      message: 'Exception error',
      data: {},
    });
    expect(JSON.stringify(res.body)).not.toContain('Internal secret failure detail');
  });

  it('returns 9997 (HTTP 405) for wrong method on real /api/health and 404 for unknown route', async () => {
    const realApp = createApp();

    const wrongMethod = await request(realApp).post('/api/health');
    expect(wrongMethod.status).toBe(405);
    expect(wrongMethod.body.code).toBe('9997');
    expect(wrongMethod.body.message).toBe('Method is invalid');

    const unknownRoute = await request(realApp).get('/api/does-not-exist');
    expect(unknownRoute.status).toBe(404);
    expect(unknownRoute.body.code).toBe('1005');
    expect(unknownRoute.body.data).toEqual({ reason: 'ROUTE_NOT_FOUND' });
  });
});
