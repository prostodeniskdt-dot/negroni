import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { partners as staticPartners, drinkCategories as staticCategories, drinks as staticDrinks } from '@/data/partners';

export async function GET() {
  if (process.env.USE_DB !== '1') {
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
    prisma.drink.findMany({ where: { status: 'published' }, orderBy: { name: 'asc' } }),
  ]);

  return NextResponse.json({ partners, categories, drinks, source: 'db' });
}

