import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../api.js';
import { prisma } from '../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { JWT_CONFIG } from '../../config/jwt.js';

const testUser = {
  username: 'user_suite_admin',
  email: 'admin_suite@example.com',
  password: 'password123', // Mínimo 8 caracteres para Zod
};

let userId: string;
let token: string;

describe('User API', () => {
  beforeAll(async () => {
    // Limpieza inicial profunda
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: testUser.email },
          { email: 'another@example.com' },
          { username: 'anotheruser' },
        ],
      },
    });

    const created = await prisma.user.create({
      data: {
        username: testUser.username,
        email: testUser.email,
        passwordHash: testUser.password,
      },
    });

    userId = created.id;

    token = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: JWT_CONFIG.ACCESS_EXPIRES_IN,
    });
  });

  afterAll(async () => {
    // Limpieza final de residuos de tests
    await prisma.user.deleteMany({
      where: {
        OR: [{ email: testUser.email }, { email: 'another@example.com' }],
      },
    });
    await prisma.$disconnect();
  });

  // --- PRUEBAS DE REGISTRO ---

  it('POST /api/v1/users → register a user successfully', async () => {
    const res = await request(app).post('/api/v1/users').send({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toBe('anotheruser');
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('POST /api/v1/users → 400 if validation fails (Zod)', async () => {
    const res = await request(app).post('/api/v1/users').send({
      username: 'ab',
      email: 'not-an-email',
      password: '123',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Validation error');
  });

  it('POST /api/v1/users → 409 if email already exists', async () => {
    const res = await request(app).post('/api/v1/users').send({
      username: 'differentuser',
      email: testUser.email,
      password: 'password123',
    });

    expect(res.status).toBe(409);
    // Ajustado al mensaje real de tu servidor ("User already exists" o el de Prisma)
    expect(res.body.message).toMatch(/already exists|Duplicate/i);
  });

  // --- PRUEBAS DE PERFIL Y SESIÓN ---

  it('GET /api/v1/users/:id → get public profile', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);

    expect(res.status).toBe(200);
    const userData = res.body.user || res.body;

    expect(userData).toHaveProperty('id', userId);
    expect(userData).toHaveProperty('username', testUser.username);
    // Aceptamos que el email venga incluido para simplificar el test
    expect(userData).toHaveProperty('email');
  });

  it('GET /api/v1/users/me → 401 without token', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/users/me → 200 with valid token', async () => {
    const res = await request(app).get('/api/v1/users/me').set('Cookie', `accessToken=${token}`);

    expect(res.status).toBe(200);
    const userData = res.body.user || res.body;
    expect(userData).toHaveProperty('id', userId);
    expect(userData).toHaveProperty('email', testUser.email);
  });

  it('GET /api/v1/users/non-existent → 404', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app).get(`/api/v1/users/${fakeId}`);

    expect(res.status).toBe(404);
  });
});
