import { prisma } from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

export const toggleLike = async (postId: string, userId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
    return { liked: false };
  } else {
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    return { liked: true };
  }
};
