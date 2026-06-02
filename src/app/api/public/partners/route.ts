import { NextResponse } from 'next/server';
import { partners as staticPartners, drinkCategories as staticCategories, drinks as staticDrinks } from '@/data/partners';

export async function GET() {
  return NextResponse.json({
    partners: staticPartners,
    categories: staticCategories,
    drinks: staticDrinks,
    source: 'static',
  });
}

