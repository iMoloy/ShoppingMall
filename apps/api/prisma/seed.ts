import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Categories
  const categories = [
    { name: 'Apparel', slug: 'apparel' },
    { name: 'Leather Goods', slug: 'leather-goods' },
    { name: 'Timepieces', slug: 'timepieces' },
    { name: 'Footwear', slug: 'footwear' },
    { name: 'Accessories', slug: 'accessories' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    });
  }

  // Seed Admin & Demo Buyer
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  await prisma.user.upsert({
    where: { email: 'admin@atelier.luxury' },
    update: {},
    create: {
      email: 'admin@atelier.luxury',
      name: 'Atelier Director',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const buyerPassword = await bcrypt.hash('Buyer@123456', 12);
  await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      name: 'Julian Vance',
      passwordHash: buyerPassword,
      role: Role.BUYER,
    },
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
