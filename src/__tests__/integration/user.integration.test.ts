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
    // Limpiamos antes de empezar para evitar conflictos de tests previos
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
      password: 'password123', // Cumple validación
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toBe('anotheruser');
    expect(res.body.user).not.toHaveProperty('passwordHash'); // Seguridad: no devolver hash
  });

  it('POST /api/v1/users → 400 if validation fails (Zod)', async () => {
    const res = await request(app).post('/api/v1/users').send({
      username: 'ab', // Demasiado corto (Zod pide min 3)
      email: 'not-an-email', // Formato inválido
      password: '123', // Demasiado corta (Zod pide min 8)
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Validation error');
  });

  it('POST /api/v1/users → 400 if email already exists (Prisma)', async () => {
    const res = await request(app).post('/api/v1/users').send({
      username: 'differentuser',
      email: testUser.email, // Email ya registrado en beforeAll
      password: 'password123',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Duplicate field value');
  });

  // --- PRUEBAS DE PERFIL Y SESIÓN ---

  it('GET /api/v1/users/:id → get public profile', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);

    expect(res.status).toBe(200);
    const userData = res.body.user || res.body;
    expect(userData).toHaveProperty('id', userId);
    expect(userData).toHaveProperty('username', testUser.username);
    expect(userData).not.toHaveProperty('email'); // Opcional: proteger email en perfiles públicos
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

    // Si tu prisma handler está bien, debería devolver 404
    expect(res.status).toBe(404);
  });
});
