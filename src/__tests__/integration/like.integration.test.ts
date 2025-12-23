import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
import app from '../../api.js';
import { prisma } from '../../lib/prisma.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

describe('Like API', () => {
  let userId: string;
  let postId: string;
  let token: string;

  beforeAll(async () => {
    // Limpieza
    await prisma.like.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});

    // Crear entorno
    const user = await prisma.user.create({
      data: { username: 'liker', email: 'liker@test.com', passwordHash: '123' },
    });
    userId = user.id;

    const post = await prisma.post.create({
      data: { content: 'Post para dar like', authorId: userId },
    });
    postId = post.id;

    // Firmar con userId para coincidir con tu JwtPayload
    token = jwt.sign({ userId: userId }, env.JWT_ACCESS_SECRET);
  });

  it('POST /api/v1/posts/:postId/like → toggle like flow', async () => {
    // 1. Dar Like
    const res1 = await request(app)
      .post(`/api/v1/posts/${postId}/like`)
      .set('Cookie', `accessToken=${token}`); // <--- Vital

    expect(res1.status).toBe(201);

    // 2. Quitar Like
    const res2 = await request(app)
      .post(`/api/v1/posts/${postId}/like`)
      .set('Cookie', `accessToken=${token}`);

    expect(res2.status).toBe(200);
    expect(res2.body.liked).toBe(false);
  });
});
