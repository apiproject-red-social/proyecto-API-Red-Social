import { Router } from 'express';
import os from 'os';

const router = Router();

/**
 * Simple health check endpoint.
 * Returns basic system and runtime information.
 */
router.get('/health', (_req, res) => {
  const health = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    environment: process.env.NODE_ENV,
  };

  res.status(200).json(health);
});

export default router;
