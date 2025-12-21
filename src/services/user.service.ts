import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};

export const createUser = async (input: CreateUserInput) => {
  const passwordHash = await bcrypt.hash(input.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username: input.username,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error: any) {
    // Prisma unique constraint violation
    if (error.code === 'P2002') {
      throw new AppError('User already exists', 409);
    }
    throw error;
  }
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};
