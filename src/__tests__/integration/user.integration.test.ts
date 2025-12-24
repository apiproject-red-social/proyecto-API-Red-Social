import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../api.js';
import { prisma } from '../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { JWT_CONFIG } from '../../config/jwt.js';

// Usamos nombres únicos para este suite para evitar colisiones con Post API
const testUser = {
  username: 'user_suite_admin',
  email: 'admin_suite@example.com',
  password: '123456',
};

let userId: string;
let token: string;

describe('User API', () => {
  beforeAll(async () => {
    const created = await prisma.user.create({
      data: {
        username: testUser.username,
        email: testUser.email,
        passwordHash: testUser.password, // Asegúrate que tu lógica use passwordHash
      },
    });

    userId = created.id;

    // 3. Firmar JWT
    token = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: JWT_CONFIG.ACCESS_EXPIRES_IN,
    });
  });

  afterAll(async () => {
    // Limpieza final y desconexión
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: testUser.email },
          { email: 'another@example.com' }, // Limpiar residuos del test de POST
        ],
      },
    });
    await prisma.$disconnect();
  });

  it('POST /api/v1/users → register a user', async () => {
    // Aseguramos que 'anotheruser' no exista antes de empezar
    await prisma.user.deleteMany({ where: { username: 'anotheruser' } });

    const res = await request(app).post('/api/v1/users').send({
      username: 'anotheruser',
      email: 'another@example.com',
      password: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toBe('anotheruser');
  });

  it('GET /api/v1/users/:id → get public profile', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`);

    expect(res.status).toBe(200);
    // Ajustado para manejar posibles respuestas que anidan el user o devuelven el objeto directo
    const userData = res.body.user || res.body;
    expect(userData).toHaveProperty('id', userId);
    expect(userData).toHaveProperty('username', testUser.username);
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
  });
});
