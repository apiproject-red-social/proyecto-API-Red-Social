import { beforeAll, afterAll } from 'vitest';
import { prisma } from '../lib/prisma.js';

beforeAll(async () => {
  // Conectar explícitamente al inicio
  await prisma.$connect();

  // Limpieza agresiva: Truncate resetea IDs y borra todo en orden correcto
  // El comando depende de tu DB (este ejemplo es para PostgreSQL)
  const tables = ['Comment', 'Post', 'User'];

  try {
    for (const table of tables) {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
    }
  } catch (error) {
    console.error('Error limpiando tablas en el setup:', error);
  }
});

afterAll(async () => {
  // No desconectes aquí si otros tests están usando la misma instancia
  // Pero sí podemos asegurar que no hay transacciones pendientes
});
