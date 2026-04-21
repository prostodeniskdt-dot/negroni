import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { recipes as staticRecipes } from '@/data/recipes';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status') || 'published';

  if (process.env.USE_DB !== '1') {
    // Minimal compatibility response
    return NextResponse.json({
      recipes: staticRecipes.map((r) => ({
        slug: r.id,
        city: r.city,
        lat: r.lat,
        lng: r.lng,
        recipe: r.recipe,
      })),
      source: 'static',
    });
  }

  const list = await prisma.recipe.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json({ recipes: list, source: 'db' });
}

