import { prisma } from '../../../libs/prisma-client.js';

export async function deleteIncident() {
  const tableName = 'console';

  try {
    const tableExists = await prisma.$queryRaw`SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = ${tableName}
    ) AS "exists"`;
    if (!tableExists[0].exists) {
      console.log(`Table "${tableName}" does not exist.`);
      return;
    }
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
    console.log(`Table "${tableName}" deleted successfully.`);
  } 
  catch (error) {
    console.error(`Error deleting ${tableName}:`, error.message);
  }
}



// Standalone function to delete the incident table
// deleteIncident()
//     .then(async () => {
//         await prisma.$disconnect();
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });