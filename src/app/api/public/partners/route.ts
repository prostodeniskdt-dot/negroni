import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { partners as staticPartners, drinkCategories as staticCategories, drinks as staticDrinks } from '@/data/partners';

export async function GET() {
  const useDb = Boolean(process.env.DATABASE_URL) && process.env.USE_DB !== '0';
  if (!useDb) {
    return NextResponse.json({
      partners: staticPartners,
      categories: staticCategories,
      drinks: staticDrinks,
      source: 'static',
    });
  }

  const [partners, categories, drinks] = await Promise.all([
    prisma.partner.findMany({ orderBy: { name: 'asc' } }),
    prisma.drinkCategory.findMany({ orderBy: { name: 'asc' } }),
    prisma.drink.findMany({
      where: { status: 'published' },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        categoryId: true,
        partnerId: true,
        name: true,
        nameEn: true,
        image: true,
        tagline: true,
        taglineEn: true,
        description: true,
        descriptionEn: true,
        producer: true,
        producerEn: true,
        origin: true,
        originEn: true,
        abv: true,
        volume: true,
        tastingNotes: true,
        serve: true,
        serveEn: true,
        buyUrl: true,
        buyLabel: true,
        buyLabelEn: true,
        purchaseNote: true,
        purchaseNoteEn: true,
        recipeHints: true,
        sortOrder: true,
      },
    }),
  ]);

  return NextResponse.json({ partners, categories, drinks, source: 'db' });
}

