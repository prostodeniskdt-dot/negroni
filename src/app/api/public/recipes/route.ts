import { NextResponse } from 'next/server';
import { staticPublicRecipes } from '@/lib/public-recipes';

export async function GET() {
  return NextResponse.json({
    recipes: staticPublicRecipes(),
    source: 'static',
  });
}

