import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../api.js';
import { prisma } from '../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

describe('Comment API', () => {
  let user1Token: string;
  let user2Id: string;
  let postByUser2Id: string;

  beforeAll(async () => {
    // Limpieza
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Crear Usuario 1 (El que comenta)
    const user1 = await prisma.user.create({
      data: { username: 'comentador', email: 'user1@test.com', passwordHash: 'hash' },
    });
    user1Token = jwt.sign({ userId: user1.id }, env.JWT_ACCESS_SECRET);

    // Crear Usuario 2 (El dueño del post)
    const user2 = await prisma.user.create({
      data: { username: 'posteador', email: 'user2@test.com', passwordHash: 'hash' },
    });
    user2Id = user2.id;

    // Crear un Post del Usuario 2
    const post = await prisma.post.create({
      data: { content: 'Post original de User 2', authorId: user2Id },
    });
    postByUser2Id = post.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /api/v1/posts/:postId/comments → debería permitir a User 1 comentar en post de User 2', async () => {
    const res = await request(app)
      .post(`/api/v1/posts/${postByUser2Id}/comments`)
      .set('Cookie', `accessToken=${user1Token}`)
      .send({ content: '¡Buen post, amigo!' });

    expect(res.status).toBe(201);
    expect(res.body.comment).toHaveProperty('content', '¡Buen post, amigo!');
    expect(res.body.comment.postId).toBe(postByUser2Id);
  });

  it('GET /api/v1/posts/:postId/comments → debería obtener la lista de comentarios', async () => {
    const res = await request(app).get(`/api/v1/posts/${postByUser2Id}/comments`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.comments)).toBe(true);
    expect(res.body.comments.length).toBeGreaterThan(0);
    expect(res.body.comments[0].author.username).toBe('comentador');
  });

  it('POST /api/v1/posts/:postId/comments → debería fallar si el post no existe', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app)
      .post(`/api/v1/posts/${fakeId}/comments`)
      .set('Cookie', `accessToken=${user1Token}`)
      .send({ content: 'Error esperado' });

    expect(res.status).toBe(404);
    expect(res.body.message).toContain('Post not found');
  });
});
