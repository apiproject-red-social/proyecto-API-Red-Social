import { prisma } from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

export const toggleLike = async (postId: string, userId: string) => {
  // 1. Verificar si el post existe
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // 2. Buscar si ya existe el Like
  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingLike) {
    // 3. Si existe, lo quitamos (Unlike)
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
    return { liked: false };
  } else {
    // 4. Si no existe, lo creamos (Like)
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    return { liked: true };
  }
};
