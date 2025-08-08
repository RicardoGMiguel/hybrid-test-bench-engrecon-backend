import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

import { UserRoles } from '@modules/users/interfaces';

const prisma = new PrismaClient();

async function seed() {
  const password = await hash('admin@123', 8);

  await prisma.user.upsert({
    where: { email: 'admin@empresa.com' },
    update: {},
    create: {
      email: 'admin@empresa.com',
      name: 'Admin',
      password,
      role: UserRoles.ADMIN,
    },
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
