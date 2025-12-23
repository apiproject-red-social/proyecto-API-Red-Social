import { prisma } from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

export const createComment = async (content: string, authorId: string, postId: string) => {
  // Verificar si el post existe antes de comentar
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError('Post not found', 404);

  return prisma.comment.create({
    data: {
      content,
      authorId,
      postId,
    },
    include: {
      author: {
        select: { username: true },
      },
    },
  });
};

export const getCommentsByPost = async (postId: string) => {
  return prisma.comment.findMany({
    where: { postId },
    include: { author: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  });
};
