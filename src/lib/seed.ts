import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { recipes as staticRecipes, type RecipeEntry, type Prebatch as StaticPrebatch } from '@/data/recipes';
import {
  partners as staticPartners,
  drinkCategories as staticDrinkCategories,
  drinks as staticDrinks,
} from '@/data/partners';

type SeedOptions = {
  adminEmail?: string;
  adminPassword?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function findOrCreatePrebatch(p: StaticPrebatch) {
  const existing = await prisma.prebatch.findFirst({ where: { name: p.name } });
  if (existing) return existing;
  return prisma.prebatch.create({
    data: {
      name: p.name,
      ingredients: p.ingredients,
      steps: p.steps,
      status: 'published',
    },
  });
}

function recipeToDb(entry: RecipeEntry, prebatchId: string | null, prebatchText: string | null) {
  const r = entry.recipe;
  return {
    slug: entry.id,
    city: entry.city,
    lat: entry.lat,
    lng: entry.lng,

    name: r.name,
    region: r.region,
    author: r.author,
    bar: r.bar,
    difficulty: r.difficulty,
    category: r.category,
    barDescription: r.barDescription,
    barCity: r.barCity,
    tags: r.tags,
    intro: r.intro,
    image: r.image,
    method: r.method,
    glass: r.glass,
    garnish: r.garnish,
    ice: r.ice,

    prebatchMode: prebatchId ? 'ref' : prebatchText ? 'text' : 'none',
    prebatchText,
    prebatchId,

    flavorBitter: r.flavorProfile?.bitter ?? 0,
    flavorSweet: r.flavorProfile?.sweet ?? 0,
    flavorSour: r.flavorProfile?.sour ?? 0,
    flavorSpicy: r.flavorProfile?.spicy ?? 0,
    flavorStrong: r.flavorProfile?.strong ?? 0,

    ingredients: r.ingredients,
    steps: r.steps,

    authorInstagram: r.authorInstagram ?? null,
    authorTg: r.authorTg ?? null,
    barLink: r.barLink ?? null,

    status: 'published' as const,
    publishedAt: new Date(),
  };
}

export async function seedDatabase(opts: SeedOptions = {}) {
  // Partners
  for (const p of staticPartners) {
    await prisma.partner.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        nameEn: p.nameEn,
        isGeneralPartner: p.isGeneralPartner,
        logo: p.logo ?? null,
        description: p.description,
        descriptionEn: p.descriptionEn,
        link: p.link ?? null,
      },
      create: {
        id: p.id,
        name: p.name,
        nameEn: p.nameEn,
        isGeneralPartner: p.isGeneralPartner,
        logo: p.logo ?? null,
        description: p.description,
        descriptionEn: p.descriptionEn,
        link: p.link ?? null,
      },
    });
  }

  // Drink categories
  for (const c of staticDrinkCategories) {
    await prisma.drinkCategory.upsert({
      where: { id: c.id },
      update: {
        slug: c.slug,
        name: c.name,
        nameEn: c.nameEn,
        icon: c.icon ?? null,
        description: c.description,
        descriptionEn: c.descriptionEn,
      },
      create: {
        id: c.id,
        slug: c.slug,
        name: c.name,
        nameEn: c.nameEn,
        icon: c.icon ?? null,
        description: c.description,
        descriptionEn: c.descriptionEn,
      },
    });
  }

  // Drinks
  for (const d of staticDrinks) {
    await prisma.drink.upsert({
      where: { id: d.id },
      update: {
        categoryId: d.categoryId,
        partnerId: d.partnerId,
        name: d.name,
        nameEn: d.nameEn,
        image: d.image ?? null,
        description: d.description,
        descriptionEn: d.descriptionEn,
        status: 'published',
      },
      create: {
        id: d.id,
        categoryId: d.categoryId,
        partnerId: d.partnerId,
        name: d.name,
        nameEn: d.nameEn,
        image: d.image ?? null,
        description: d.description,
        descriptionEn: d.descriptionEn,
        status: 'published',
      },
    });
  }

  // Recipes + prebatches
  for (const entry of staticRecipes) {
    const prebatch = entry.recipe.prebatch;
    let prebatchId: string | null = null;
    let prebatchText: string | null = null;

    if (typeof prebatch === 'string') {
      prebatchText = prebatch;
    } else if (prebatch && typeof prebatch === 'object') {
      const pb = await findOrCreatePrebatch(prebatch as StaticPrebatch);
      prebatchId = pb.id;
    }

    const data = recipeToDb(entry, prebatchId, prebatchText);

    await prisma.recipe.upsert({
      where: { slug: entry.id },
      update: data,
      create: data,
    });
  }

  // Admin user (optional)
  if (opts.adminEmail && opts.adminPassword) {
    const email = normalizeEmail(opts.adminEmail);
    const passwordHash = await bcrypt.hash(opts.adminPassword, 12);
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role: 'admin' },
      create: { email, passwordHash, role: 'admin' },
    });
  }
}

