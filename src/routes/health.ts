import { Router, Request, Response } from 'express';
import os from 'os';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    hostname: os.hostname(),
    environment: process.env.NODE_ENV,
  });
});

export default router;
