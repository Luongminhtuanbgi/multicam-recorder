import os from 'node:os';
import { createApp } from './app';
import { logger } from './common/logger';
import { env } from './config/env';
import { prisma } from './db/prisma';

function getLocalIPv4s(): string[] {
  const out: string[] = [];
  const interfaces = os.networkInterfaces();
  for (const list of Object.values(interfaces)) {
    for (const info of list ?? []) {
      if (info.family === 'IPv4' && !info.internal) {
        out.push(info.address);
      }
    }
  }
  return out;
}

const app = createApp();

const server = app.listen(env.PORT, env.HOST, () => {
  const lanUrls = getLocalIPv4s().map((ip) => `http://${ip}:${env.PORT}/api/health`);
  logger.info(
    {
      host: env.HOST,
      port: env.PORT,
      env: env.NODE_ENV,
      lanHealthUrls: lanUrls,
    },
    'Multi-Cam Recorder backend listening'
  );
});

const shutdown = (signal: string) => {
  logger.info({ signal }, 'Shutting down server gracefully...');
  server.close(async () => {
    await prisma.$disconnect().catch(() => undefined);
    logger.info('HTTP server and Prisma disconnected');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
