import { beforeAll, afterAll } from 'vitest';
import { prisma } from '../lib/prisma.js';

beforeAll(async () => {
  await prisma.$connect();

  const tables = ['Comment', 'Post', 'User'];

  try {
    for (const table of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
    }
  } catch (error) {
    console.error('Error limpiando tablas en el setup:', error);
  }
});

afterAll(async () => {});
