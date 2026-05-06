const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const users = [
      { id: 'admin-1', email: 'admin@leadgen.app', password: 'admin', name: 'Admin' },
      { id: 'admin-2', email: 'admin', password: 'admin', name: 'Admin 2' },
      { id: 'demo-1', email: 'demo@leadgen.local', password: 'password', name: 'Demo User' },
    ];

    for (const u of users) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const existing = await prisma.user.findUnique({ where: { id: u.id } });
      if (!existing) {
        await prisma.user.create({
          data: {
            id: u.id,
            email: u.email,
            password: hashedPassword,
            name: u.name,
          },
        });
        console.log('Created user:', u.id);
      } else {
        console.log('User already exists:', u.id);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
