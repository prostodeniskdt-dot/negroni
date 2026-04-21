import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getRecipeById } from '@/data/recipes';

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;

  if (process.env.USE_DB !== '1') {
    const entry = getRecipeById(slug);
    if (!entry) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    return NextResponse.json({ recipe: entry, source: 'static' });
  }

  const recipe = await prisma.recipe.findUnique({ where: { slug } });
  if (!recipe) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json({ recipe, source: 'db' });
}

