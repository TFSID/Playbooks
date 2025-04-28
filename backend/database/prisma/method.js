import { prisma } from '../../libs/prisma-client.js';

async function main() {

  const deleteIncident = await prisma.incident.deleteMany({
    where: {
      id: 1,
    },
  });  

  
  // Example query
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.log('All users with their posts:');
  console.log(JSON.stringify(allUsers, null, 2));
  
  // Example create operation
  const newUser = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice',
      posts: {
        create: {
          title: 'Hello World',
          content: 'This is my first post!',
        },
      },
    },
  });
  console.log('Created new user:');
  console.log(JSON.stringify(newUser, null, 2));
}

async function deleteIncident() {
  try {
    await prisma.$executeRawUnsafe`DROP TABLE IF EXISTS "incident" CASCADE`;
    console.log('Table "incident" deleted successfully.');
  }
    catch (error) {
        console.error('Error deleting incident:', error);
    }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
