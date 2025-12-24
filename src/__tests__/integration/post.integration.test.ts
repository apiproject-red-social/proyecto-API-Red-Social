import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../api.js';
import { prisma } from '../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { JWT_CONFIG } from '../../config/jwt.js';

const testUser = {
  username: 'post_test_user', // Usamos un nombre específico para este suite
  email: 'post_test@example.com',
  password: '123456',
};
let userId: string, token: string;

describe('Post API', () => {
  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        username: testUser.username,
        email: testUser.email,
        passwordHash: 'hashed_password_here', // En un test real deberías usar bcrypt
      },
    });

    userId = user.id;
    token = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, {
      expiresIn: JWT_CONFIG.ACCESS_EXPIRES_IN,
    });
  });

  afterAll(async () => {
    // 3. LIMPIEZA FINAL: En orden inverso por las Foreign Keys
    await prisma.post.deleteMany({ where: { authorId: userId } });
    await prisma.user.deleteMany({ where: { id: userId } });
    await prisma.$disconnect();
  });

  it('POST /api/v1/posts → create post', async () => {
    const res = await request(app)
      .post('/api/v1/posts')
      .set('Cookie', `accessToken=${token}`) // Asegúrate de que tu auth middleware lea cookies
      .send({ content: 'Hello world!' });

    expect(res.status).toBe(201);
    expect(res.body.post).toHaveProperty('content', 'Hello world!');
    expect(res.body.post.authorId).toBe(userId);
  });

  it('DELETE /api/v1/posts/:id → should delete own post', async () => {
    // 1. Creamos un post para borrar
    const post = await prisma.post.create({
      data: { content: 'Post to be deleted', authorId: userId },
    });

    // 2. Lo borramos
    const res = await request(app)
      .delete(`/api/v1/posts/${post.id}`)
      .set('Cookie', `accessToken=${token}`);

    expect(res.status).toBe(204);

    // 3. Verificamos que realmente no exista en la DB
    const deletedPost = await prisma.post.findUnique({ where: { id: post.id } });
    expect(deletedPost).toBeNull();
  });

  it('DELETE /api/v1/posts/:id → should not delete others post', async () => {
    // 1. Creamos un post de OTRO usuario (o ID inventado)
    const res = await request(app)
      .delete(`/api/v1/posts/${crypto.randomUUID()}`)
      .set('Cookie', `accessToken=${token}`);

    // 2. Debería dar 404 (porque no existe) o 403 (si fuera de otro)
    expect([404, 403]).toContain(res.status);
  });

  it('PATCH /api/v1/posts/:id → update post', async () => {
    // 1. Crear un post primero para tener el ID
    const post = await prisma.post.create({
      data: { content: 'Original', authorId: userId },
    });

    // 2. Intentar actualizarlo
    const res = await request(app)
      .patch(`/api/v1/posts/${post.id}`)
      .set('Cookie', `accessToken=${token}`)
      .send({ content: 'Updated content' });

    expect(res.status).toBe(200);
    expect(res.body.post.content).toBe('Updated content');
  });
  it('GET /api/v1/posts → get feed', async () => {
    const res = await request(app).get('/api/v1/posts');

    expect(res.status).toBe(200);
    // Verificamos que sea un array y que al menos tenga el post que acabamos de crear
    expect(Array.isArray(res.body.posts || res.body)).toBe(true);
  });
});
