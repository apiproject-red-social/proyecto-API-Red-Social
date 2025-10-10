import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../../api.js';

describe('NotFoundHandler Middleware (Integration)', () => {
  it('should return 404 JSON response for unknown routes', async () => {
    const res = await request(app).get('/this-does-not-exist');

    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch(/json/);

    expect(res.body).toHaveProperty('status', 'fail');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('/this-does-not-exist');
  });
});
