import { Router, Request, Response } from 'express';
import os from 'os';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns basic system and service status.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 uptime:
 *                   type: number
 *                   example: 1523.45
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-10-18T19:43:12.098Z
 *                 hostname:
 *                   type: string
 *                   example: my-machine
 *                 environment:
 *                   type: string
 *                   example: development
 */
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