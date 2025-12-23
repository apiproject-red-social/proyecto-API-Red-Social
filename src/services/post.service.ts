import { prisma } from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

export const createPost = async (data: { content: string }, authorId: string) => {
  return prisma.post.create({
    data: {
      content: data.content,
      authorId,
    },
  });
};

export const getPostById = async (id: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { id: true, username: true } } },
  });
  if (!post) throw new AppError('Post not found', 404);
  return post;
};

export const getFeed = async (page = 1, pageSize = 10) => {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: { author: { select: { id: true, username: true } } },
  });
};

export const updatePost = async (id: string, content: string, authorId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new AppError('Post not found', 404);
  if (post.authorId !== authorId) throw new AppError('Forbidden', 403);

  return prisma.post.update({
    where: { id },
    data: { content },
  });
};

export const deletePost = async (id: string, authorId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new AppError('Post not found', 404);
  if (post.authorId !== authorId) throw new AppError('Forbidden', 403);

  await prisma.post.delete({ where: { id } });
};
