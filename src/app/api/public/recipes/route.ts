import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { dbRecipeToEntry, staticPublicRecipes } from '@/lib/public-recipes';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status') || 'published';

  const useDb = Boolean(process.env.DATABASE_URL) && process.env.USE_DB !== '0';
  if (!useDb) {
    // Minimal compatibility response
    return NextResponse.json({
      recipes: staticPublicRecipes(),
      source: 'static',
    });
  }

  const list = await prisma.recipe.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ recipes: list.map(dbRecipeToEntry), source: 'db' });
}

