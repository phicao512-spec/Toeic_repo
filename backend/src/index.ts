import type { Server } from 'node:http';
import { app } from './app';
import { prisma } from './config/database';
import { env } from './config/env';
import { disconnectRedis, getRedisClient } from './config/redis';

let server: Server | undefined;

async function bootstrap(): Promise<void> {
  try {
    await prisma.$connect();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';
    console.warn(`Prisma connection warning: ${message}`);
  }

  await getRedisClient();

  server = app.listen(env.PORT, () => {
    console.log(`Backend API listening on port ${env.PORT}`);
  });
}

async function shutdown(signal: string): Promise<void> {
  console.log(`Received ${signal}, shutting down gracefully...`);

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  await disconnectRedis();
  await prisma.$disconnect();

  process.exit(0);
}

void bootstrap();

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});