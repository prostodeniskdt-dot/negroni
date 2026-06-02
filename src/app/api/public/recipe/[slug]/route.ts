import { NextResponse } from 'next/server';
import { getRecipeById } from '@/data/recipes';
import { normalizeRecipeEntry } from '@/lib/public-recipes';

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const entry = getRecipeById(slug);
  if (!entry) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json({ recipe: normalizeRecipeEntry(entry), source: 'static' });
}

