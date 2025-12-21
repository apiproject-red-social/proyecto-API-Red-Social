import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../api.js';
import { prisma } from '../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { JWT_CONFIG } from '../../config/jwt.js';

const testUser = {
  username: 'testuser',
  email: 'testuser@example.com',
  password: '123456',
};

let userId: string;
let token: string;

describe('User API', () => {
  beforeAll(async () => {
    // Limpiar datos de prueba
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    // Crear usuario de prueba
    const created = await prisma.user.create({
      data: {
        username: testUser.username,
        email: testUser.email,
        passwordHash: testUser.password,
      },
    });

    userId = created.id;

    // Firmar JWT
    token = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: JWT_CONFIG.ACCESS_EXPIRES_IN,
    });
  });

  afterAll(async () => {
    // Limpiar datos de prueba
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it('POST /api/v1/users → register a user', async () => {
    const res = await request(app).post('/api/v1/users').send({
      username: 'anotheruser',
      email: 'another@example.com',
      password: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toBe('anotheruser');

    // Limpiar
    await prisma.user.deleteMany({ where: { email: 'another@example.com' } });
  });

  it('GET /api/v1/users/:id → get public profile', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id', userId);
    expect(res.body.user).toHaveProperty('username', testUser.username);
  });

  it('GET /api/v1/users/me → 401 without token', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/users/me → 200 with valid token', async () => {
    const res = await request(app).get('/api/v1/users/me').set('Cookie', `accessToken=${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('id', userId);
    expect(res.body.user).toHaveProperty('username', testUser.username);
  });
});
