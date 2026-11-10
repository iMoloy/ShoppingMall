import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Neon PostgreSQL database...');

  // 1. Seed Categories (matching storefront category slugs)
  const categoryDefs = [
    { name: 'Clothing', slug: 'clothing' },
    { name: 'Bags', slug: 'bags' },
    { name: 'Watches', slug: 'watches' },
    { name: 'Shoes', slug: 'shoes' },
    { name: 'Accessories', slug: 'accessories' },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categoryDefs) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: {
        name: cat.name,
        slug: cat.slug,
      },
    });
    categoryMap[cat.slug] = record.id;
  }

  // 2. Seed Products
  const products = [
    {
      name: 'Atelier Structured Wool Trench Coat',
      slug: 'atelier-wool-trench-coat',
      description:
        'Tailored in double-faced virgin Italian wool with horn buttons, storm lapel, and a relaxed architectural silhouette.',
      price: '285.00',
      stock: 14,
      season: 'winter',
      isFeatured: true,
      categorySlug: 'clothing',
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Verona Full-Grain Leather Tote',
      slug: 'verona-leather-tote',
      description:
        'Handcrafted full-grain calfskin structured tote featuring solid brushed brass hardware, suede lining, and detachable shoulder strap.',
      price: '219.00',
      stock: 9,
      season: 'summer',
      isFeatured: true,
      categorySlug: 'bags',
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Heritage Chronograph Watch in Silver',
      slug: 'heritage-chronograph-watch',
      description:
        '316L surgical-grade stainless steel chronograph with anti-reflective sapphire crystal. Water resistant up to 10 ATM.',
      price: '319.00',
      stock: 5,
      season: 'summer',
      isFeatured: true,
      categorySlug: 'watches',
      images: [
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Cashmere Blend Knit Mock-Neck',
      slug: 'cashmere-blend-knit-mock-neck',
      description:
        'Spun from Mongolian Grade-A cashmere and superfine merino wool for breathable winter insulation and effortless drape.',
      price: '165.00',
      stock: 18,
      season: 'winter',
      isFeatured: false,
      categorySlug: 'clothing',
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Monolith Calfskin Chelsea Boot',
      slug: 'monolith-calfskin-chelsea-boot',
      description:
        'Goodyear-welted Italian calfskin Chelsea boot with natural crepe sole and hand-burnished toe cap.',
      price: '249.00',
      stock: 7,
      season: 'winter',
      isFeatured: true,
      categorySlug: 'shoes',
      images: [
        'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Riviera Linen Relaxed Overshirt',
      slug: 'riviera-linen-overshirt',
      description:
        'Garment-washed Belgian linen overshirt crafted for coastal summer tailoring with mother-of-pearl buttons.',
      price: '139.00',
      stock: 22,
      season: 'summer',
      isFeatured: false,
      categorySlug: 'clothing',
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Solstice Tortoise Acetate Sunglasses',
      slug: 'solstice-tortoise-sunglasses',
      description:
        'Hand-finished Japanese Takiron acetate frames with CR-39 polarized lenses offering full UV400 protection.',
      price: '149.00',
      stock: 15,
      season: 'summer',
      isFeatured: false,
      categorySlug: 'accessories',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80',
      ],
    },
    {
      name: 'Nocturne Leather Crossbody Satchel',
      slug: 'nocturne-leather-crossbody-satchel',
      description:
        'Compact evening crossbody crafted in pebble-grained leather with palladium-plated clasp closure.',
      price: '195.00',
      stock: 11,
      season: 'winter',
      isFeatured: false,
      categorySlug: 'bags',
      images: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      ],
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        season: p.season,
        isFeatured: p.isFeatured,
        images: p.images,
        categoryId: categoryMap[p.categorySlug],
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        season: p.season,
        isFeatured: p.isFeatured,
        images: p.images,
        categoryId: categoryMap[p.categorySlug],
      },
    });
  }

  // 3. Seed Admin & Demo Buyer
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

  console.log('Seeding completed successfully (5 categories, 8 products, 2 users).');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
