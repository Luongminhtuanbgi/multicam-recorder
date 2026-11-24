import { seedController } from '../../prisma/seed';
import { env } from '../../src/config/env';
import { prisma } from '../../src/db/prisma';

/**
 * Đảm bảo tuyệt đối chỉ xóa dữ liệu trên DB kiểm thử `multicam_test`.
 */
function assertTestDatabase(): void {
  if (!env.DATABASE_URL.includes('multicam_test')) {
    throw new Error(
      `Refusing to reset non-test database! Current DATABASE_URL: ${env.DATABASE_URL}`
    );
  }
}

/**
 * Xóa sạch dữ liệu các bảng nghiệp vụ trong schema `public` (trừ `_prisma_migrations`)
 * trước mỗi lần chạy integration test.
 */
export async function resetTestDatabase(): Promise<void> {
  assertTestDatabase();

  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename <> '_prisma_migrations'
  `;

  if (tables.length === 0) return;

  const quotedNames = tables.map((t) => `"${t.tablename.replace(/"/g, '""')}"`).join(', ');

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${quotedNames} RESTART IDENTITY CASCADE;`);
}

/**
 * Reset sạch `multicam_test` rồi seed sẵn 1 tài khoản Controller chuẩn từ `.env.test`.
 */
export async function resetAndSeedTestDatabase(): Promise<void> {
  await resetTestDatabase();
  await seedController(prisma);
}
