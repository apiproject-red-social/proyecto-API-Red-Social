import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- 🗑️ Limpiando base de datos ---');
  await prisma.$transaction([
    prisma.like.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  console.log('--- 🌱 Creando usuarios ---');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const usersData = [
    { username: 'Alice', email: 'alice@example.com' },
    { username: 'Bob', email: 'bob@example.com' },
    { username: 'Charlie', email: 'charlie@example.com' },
    { username: 'Diana', email: 'diana@example.com' },
    { username: 'Ethan', email: 'ethan@example.com' },
  ];

  const users = await Promise.all(
    usersData.map((u) => prisma.user.create({ data: { ...u, passwordHash } })),
  );

  console.log('--- 📝 Generando 15 posts con interacciones ---');

  const rawPosts = [
    { content: '💡 Dato curioso: Las abejas pueden reconocer rostros humanos.', author: users[0] },
    { content: '📢 Noticias: Nuevo parque abierto en la ciudad central.', author: users[1] },
    {
      content: '🎨 Tip de arte: Mezcla colores complementarios para un efecto vibrante.',
      author: users[2],
    },
    { content: '🌍 Viaje: París es hermosa en primavera.', author: users[3] },
    { content: '📚 Lectura: Recomiendo "1984" de George Orwell.', author: users[4] },
    { content: '🍳 Cocina: Cómo hacer pancakes perfectos.', author: users[0] },
    { content: '💻 Tecnología: Nueva versión de JavaScript lanzada.', author: users[1] },
    { content: '🎵 Música: Top 5 canciones del mes.', author: users[2] },
    { content: '🏀 Deportes: Final de la liga el domingo.', author: users[3] },
    { content: '📝 Escritura: Tips para un blog efectivo.', author: users[4] },
    { content: '🚀 Espacio: La NASA descubre un nuevo exoplaneta.', author: users[0] },
    { content: '🧘 Salud: 5 minutos de meditación cambian tu día.', author: users[1] },
    { content: '🎬 Cine: El estreno de la semana es imperdible.', author: users[2] },
    { content: '🐕 Mascotas: Cómo entender el lenguaje de tu perro.', author: users[3] },
    { content: '🎮 Gaming: Los mejores lanzamientos de 2024.', author: users[4] },
  ];

  const genericComments = [
    '¡Qué buen post! 👏',
    'Totalmente de acuerdo contigo.',
    'Gracias por compartir esta información.',
    'Me interesa mucho este tema.',
    '¿Podrías contar más sobre esto?',
  ];

  for (const [index, p] of rawPosts.entries()) {
    const randomUser1 = users[(index + 1) % users.length];
    const randomUser2 = users[(index + 2) % users.length];

    await prisma.post.create({
      data: {
        content: p.content,
        authorId: p.author.id,
        createdAt: new Date(Date.now() - index * 3600000),
        comments: {
          create: [
            {
              content: genericComments[index % genericComments.length],
              authorId: randomUser1.id,
            },
          ],
        },
        likes: {
          create: [{ userId: randomUser1.id }, { userId: randomUser2.id }],
        },
      },
    });
  }

  console.log('✅ Seed completado con éxito.');
  console.table(users.map((u) => ({ usuario: u.username, email: u.email })));
}

main()
  .catch((e) => {
    console.error('❌ Error en el proceso de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
