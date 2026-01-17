import app from './api.js';
import logger from './config/logger.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';
import { redis } from './lib/redis.js';

// Handle uncaught exceptions (sync errors)
process.on('uncaughtException', (err: Error) => {
  logger.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

const PORT = env.PORT;
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('💥 UNHANDLED REJECTION! Shutting down...');
  if (reason instanceof Error) {
    logger.error(`${reason.name}: ${reason.message}`, { stack: reason.stack });
  } else {
    logger.error('Unknown reason:', reason);
  }
  server.close(() => {
    process.exit(1);
  });
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    await redis.quit();
    logger.info('Connections closed. Process terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
