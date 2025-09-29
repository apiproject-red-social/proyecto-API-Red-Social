import dotenv from 'dotenv';
dotenv.config();

import app from './api.js';
import logger from './config/logger.js';

// Handle uncaught exceptions (sync errors)
process.on('uncaughtException', (err: Error) => {
  logger.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error | any) => {
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
