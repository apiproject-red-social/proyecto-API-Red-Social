import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../api.js';
import { prisma } from '../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { JWT_CONFIG } from '../../config/jwt.js';
import bcrypt from 'bcrypt';

const testUser = {
  username: 'user_suite_admin',
  email: 'admin_suite@example.com',
  password: 'password123',
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
          { username: 'nuevo_username' },
        ],
      },
    });

    const hashed = await bcrypt.hash(testUser.password, 10);
    const created = await prisma.user.create({
      data: {
        username: testUser.username,
        email: testUser.email,
        passwordHash: hashed,
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
    expect(res.body.message).toMatch(/already exists|Duplicate/i);
  });

  // --- PRUEBAS DE PERFIL Y SESIÓN ---

  it('GET /api/v1/users/:id → get public profile', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);
    expect(res.status).toBe(200);
    const userData = res.body.user || res.body;
    expect(userData).toHaveProperty('id', userId);
    expect(userData).toHaveProperty('username');
  });

  it('GET /api/v1/users/me → 200 with valid token', async () => {
    const res = await request(app).get('/api/v1/users/me').set('Cookie', `accessToken=${token}`);

    expect(res.status).toBe(200);
    const userData = res.body.user || res.body;
    expect(userData).toHaveProperty('id', userId);
    expect(userData).toHaveProperty('email', testUser.email);
  });

  // --- PRUEBAS DE GESTIÓN DE PERFIL (EDIT/PASSWORD/DELETE) ---

  it('PATCH /api/v1/users/me → debe editar el username exitosamente', async () => {
    const res = await request(app)
      .patch('/api/v1/users/me')
      .set('Cookie', `accessToken=${token}`)
      .send({ username: 'nuevo_username' });

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('nuevo_username');
  });

  it('PATCH /api/v1/users/me/password → debe fallar si la contraseña actual es incorrecta', async () => {
    const res = await request(app)
      .patch('/api/v1/users/me/password')
      .set('Cookie', `accessToken=${token}`)
      .send({
        currentPassword: 'wrong_password',
        newPassword: 'newPassword123',
      });

    expect(res.status).toBe(401);
  });

  it('PATCH /api/v1/users/me/password → debe cambiar la contraseña exitosamente', async () => {
    const res = await request(app)
      .patch('/api/v1/users/me/password')
      .set('Cookie', `accessToken=${token}`)
      .send({
        currentPassword: testUser.password,
        newPassword: 'newPasswordSecure123',
      });

    expect(res.status).toBe(200);

    // Verificar que la nueva contraseña funciona comparando el hash en DB
    const userDb = await prisma.user.findUnique({ where: { id: userId } });
    const isMatch = await bcrypt.compare('newPasswordSecure123', userDb!.passwordHash);
    expect(isMatch).toBe(true);
  });

  it('DELETE /api/v1/users/me → debe borrar la cuenta y limpiar cookies', async () => {
    const res = await request(app).delete('/api/v1/users/me').set('Cookie', `accessToken=${token}`);

    expect(res.status).toBe(204);

    // Verificar que el usuario ya no existe
    const userDb = await prisma.user.findUnique({ where: { id: userId } });
    expect(userDb).toBeNull();
  });
});
