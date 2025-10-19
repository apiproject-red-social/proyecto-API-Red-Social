import request from 'supertest';
import app from '../../api.js';
import { describe, expect, it } from 'vitest';

describe('GET /api/v1/health', () => {
  it('should return 200 and valid health payload', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(typeof res.body.uptime).toBe('number');
    expect(typeof res.body.timestamp).toBe('string');
    expect(res.body).toHaveProperty('hostname');
    expect(res.body).toHaveProperty('environment');
  });
});
