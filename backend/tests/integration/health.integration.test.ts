import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app';
import { createPrefixedId } from '../../src/common/utils/ids';
import { env } from '../../src/config/env';
import { prisma } from '../../src/db/prisma';
import { resetAndSeedTestDatabase } from '../helpers/testDb';

describe('Health endpoint and test database setup', () => {
  const app = createApp();

  beforeAll(async () => {
    await resetAndSeedTestDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /api/health returns 200 with code 1000 and valid server metadata', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.code).toBe('1000');
    expect(res.body.message).toBe('OK');
    expect(res.body.data.name).toBe('multicam-server');
    expect(res.body.data.version).toBe('1.0.0');
    expect(Number.isNaN(Date.parse(res.body.data.server_time))).toBe(false);
  });

  it('connects to isolated multicam_test DB and seeds exactly 1 active Controller', async () => {
    expect(env.DATABASE_URL).toContain('multicam_test');

    const users = await prisma.user.findMany();
    expect(users).toHaveLength(1);
    expect(users[0]?.role).toBe('controller');
    expect(users[0]?.status).toBe('active');
    expect(users[0]?.phone).toBe(env.CONTROLLER_PHONE);
  });

  it('enforces manual PostgreSQL CHECK constraint users_phone_format on multicam_test', async () => {
    await expect(
      prisma.user.create({
        data: {
          id: createPrefixedId('u'),
          firstName: 'Bad',
          lastName: 'Phone',
          email: 'badphone@test.local',
          phone: '1234567890', // không bắt đầu bằng số 0 -> bị CHECK constraint từ chối
          passwordHash: 'hashed_password',
        },
      })
    ).rejects.toThrow();
  });
});
