// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('--- 🗑️ Limpiando base de datos ---');
//   await prisma.like.deleteMany();
//   await prisma.comment.deleteMany();
//   await prisma.post.deleteMany();
//   await prisma.user.deleteMany();

//   console.log('--- 🌱 Insertando datos coherentes para demo ---');

//   const salt = await bcrypt.genSalt(10);
//   const passwordHash = await bcrypt.hash('password123', salt);

//   // 1️⃣ Usuarios
//   const usersData = [
//     { username: 'Alice', email: 'alice@example.com' },
//     { username: 'Bob', email: 'bob@example.com' },
//     { username: 'Charlie', email: 'charlie@example.com' },
//     { username: 'Diana', email: 'diana@example.com' },
//     { username: 'Ethan', email: 'ethan@example.com' },
//   ];

//   const users = [];
//   for (const u of usersData) {
//     const user = await prisma.user.create({
//       data: { ...u, passwordHash, createdAt: new Date() },
//     });
//     users.push(user);
//   }

//   // 2️⃣ Posts
//   const postsData = [
//     {
//       author: users[0],
//       content: '💡 Dato curioso: Las abejas pueden reconocer rostros humanos.',
//       comments: [
//         { author: users[1], content: '¡Increíble! 😲' },
//         { author: users[2], content: 'No lo sabía, gracias.' },
//       ],
//       likes: [users[1], users[2]],
//     },
//     {
//       author: users[1],
//       content: '📢 Noticias: Nuevo parque abierto en la ciudad central.',
//       comments: [{ author: users[0], content: '¡Vamos a visitarlo este fin de semana!' }],
//       likes: [users[0], users[2]],
//     },
//     {
//       author: users[2],
//       content: '🎨 Tip de arte: Mezcla colores complementarios para un efecto vibrante.',
//       comments: [{ author: users[0], content: 'Lo probaré en mi próximo proyecto!' }],
//       likes: [users[0], users[1]],
//     },
//     {
//       author: users[3],
//       content: '🌍 Viaje: París es hermosa en primavera.',
//       comments: [{ author: users[4], content: '¡Quiero ir este año!' }],
//       likes: [users[0], users[2], users[4]],
//     },
//     {
//       author: users[4],
//       content: '📚 Lectura: Recomiendo "1984" de George Orwell.',
//       comments: [{ author: users[3], content: 'Clásico que siempre vale la pena.' }],
//       likes: [users[1], users[3]],
//     },
//     {
//       author: users[0],
//       content: '🍳 Cocina: Cómo hacer pancakes perfectos.',
//       comments: [{ author: users[2], content: 'Me encantan los pancakes!' }],
//       likes: [users[1], users[3]],
//     },
//     {
//       author: users[1],
//       content: '💻 Tecnología: Nueva versión de JavaScript lanzada.',
//       comments: [{ author: users[4], content: 'Necesito actualizar mis proyectos.' }],
//       likes: [users[0], users[2]],
//     },
//     {
//       author: users[2],
//       content: '🎵 Música: Top 5 canciones del mes.',
//       comments: [{ author: users[3], content: '¡Me encanta la playlist!' }],
//       likes: [users[1], users[4]],
//     },
//     {
//       author: users[3],
//       content: '🏀 Deportes: Final de la liga el domingo.',
//       comments: [{ author: users[0], content: 'No me lo pierdo!' }],
//       likes: [users[2], users[4]],
//     },
//     {
//       author: users[4],
//       content: '📝 Escritura: Tips para un blog efectivo.',
//       comments: [{ author: users[1], content: 'Muy útil, gracias.' }],
//       likes: [users[0], users[3]],
//     },
//   ];

//   for (const p of postsData) {
//     const post = await prisma.post.create({
//       data: { content: p.content, authorId: p.author.id, createdAt: new Date() },
//     });

//     for (const c of p.comments) {
//       await prisma.comment.create({
//         data: { content: c.content, authorId: c.author.id, postId: post.id, createdAt: new Date() },
//       });
//     }

//     for (const u of p.likes) {
//       await prisma.like.create({ data: { userId: u.id, postId: post.id } });
//     }
//   }

//   console.log('🚀 Seed listo para demo.');
//   console.log('Usuarios de prueba:');
//   users.forEach((u) => console.log(`- ${u.username} / ${u.email} / password123`));
// }

// main()
//   .catch((e) => {
//     console.error('❌ Error en seed manual ampliado:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient } from '@prisma/client';
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

  // Comentarios predefinidos para dar variedad
  const genericComments = [
    '¡Qué buen post! 👏',
    'Totalmente de acuerdo contigo.',
    'Gracias por compartir esta información.',
    'Me interesa mucho este tema.',
    '¿Podrías contar más sobre esto?',
  ];

  for (const [index, p] of rawPosts.entries()) {
    // Seleccionamos un par de usuarios aleatorios para comentarios y likes
    const randomUser1 = users[(index + 1) % users.length];
    const randomUser2 = users[(index + 2) % users.length];

    await prisma.post.create({
      data: {
        content: p.content,
        authorId: p.author.id,
        createdAt: new Date(Date.now() - index * 3600000), // Posts en diferentes horas
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
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
