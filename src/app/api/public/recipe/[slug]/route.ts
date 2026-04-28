import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getRecipeById } from '@/data/recipes';
import { dbRecipeToEntry, normalizeRecipeEntry } from '@/lib/public-recipes';

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;

  const useDb = Boolean(process.env.DATABASE_URL) && process.env.USE_DB !== '0';
  if (!useDb) {
    const entry = getRecipeById(slug);
    if (!entry) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    return NextResponse.json({ recipe: normalizeRecipeEntry(entry), source: 'static' });
  }

  const recipe = await prisma.recipe.findUnique({ where: { slug } });
  if (!recipe) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json({ recipe: dbRecipeToEntry(recipe), source: 'db' });
}

