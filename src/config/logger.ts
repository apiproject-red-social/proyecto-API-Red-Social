import { createLogger, format, transports } from 'winston';
import { env } from './env.js';

const { combine, timestamp, errors, splat, json, colorize, simple, printf } = format;

// Custom console format for development
const devFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level}: ${stack || message}`;
});

// Determine transports based on environment
const transportList = [];

if (env.NODE_ENV === 'production') {
  // In production, log in JSON format and store logs in files
  transportList.push(
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  );
} else if (env.NODE_ENV === 'development') {
  // In development, log in console with colors and human-readable format
  transportList.push(
    new transports.Console({
      format: combine(colorize(), simple(), timestamp(), devFormat),
    }),
  );
} else if (env.NODE_ENV === 'test') {
  // In test, disable logging (silent)
  transportList.push(
    new transports.Console({
      silent: true,
    }),
  );
}

const logger = createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(timestamp(), errors({ stack: true }), splat(), json()),
  defaultMeta: { service: 'microblogging-api' },
  transports: transportList,
});

export default logger;
