import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- 🗑️ Borrando datos existentes ---');
  // El orden es importante por las relaciones (FK)
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log('--- 🌱 Generando nuevos datos ---');

  // Dentro de la función main del seed:
  const salt = await bcrypt.genSalt(10);
  const commonPasswordHash = await bcrypt.hash('password123', salt);

  // 1. Crear 10 Usuarios
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.user.create({
        data: {
          username: faker.internet.username(),
          email: faker.internet.email(),
          passwordHash: commonPasswordHash,
          createdAt: faker.date.past({ years: 1 }),
        },
      }),
    ),
  );

  console.log(`✅ ${users.length} usuarios creados.`);

  // 2. Crear Posts para cada usuario
  for (const user of users) {
    const posts = await Promise.all(
      Array.from({ length: 3 }).map(() =>
        prisma.post.create({
          data: {
            content: faker.lorem.paragraph({ min: 1, max: 3 }),
            authorId: user.id,
            createdAt: faker.date.recent({ days: 30 }),
          },
        }),
      ),
    );

    // 3. Crear Comentarios y Likes para cada Post
    for (const post of posts) {
      // Generar entre 1 y 3 comentarios por post
      const numComments = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < numComments; i++) {
        await prisma.comment.create({
          data: {
            content: faker.lorem.sentence(),
            authorId: users[Math.floor(Math.random() * users.length)].id,
            postId: post.id,
            createdAt: faker.date.recent({ days: 5 }),
          },
        });
      }

      // Generar entre 2 y 5 likes por post
      const numLikes = faker.number.int({ min: 2, max: 5 });
      const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
      const selectedUsers = shuffledUsers.slice(0, numLikes);

      for (const likingUser of selectedUsers) {
        await prisma.like
          .create({
            data: {
              userId: likingUser.id,
              postId: post.id,
            },
          })
          .catch(() => {
            // Ignoramos duplicados si los hay
          });
      }
    }
  }

  console.log('🚀 Seed completado con éxito. La base de datos está lista para probar.');
  console.log('--- 💡 USUARIO DE PRUEBA ---');
  console.log(`Email: ${users[0].email}`);
  console.log(`Password: password123`);
  console.log('---------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
