import { NextResponse } from 'next/server';
import { z } from 'zod';
import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { prisma } from '@/lib/db';
import { getUserSession, requireUser } from '@/lib/userAuth';
import { RecipesPdf, type PdfRecipe } from '@/lib/pdf/RecipesPdf';

export const runtime = 'nodejs';

const QuerySchema = z.object({
  kind: z.enum(['favorites', 'collection', 'recipe']).optional(),
  id: z.string().optional(),
  share: z.string().optional(),
  lang: z.string().optional(),
});

function normalizeRecipes(list: any[]): PdfRecipe[] {
  return list.map((r) => ({
    slug: r.slug,
    name: r.name,
    region: r.region,
    intro: r.intro,
    image: r.image,
    method: r.method,
    glass: r.glass,
    garnish: r.garnish,
    ice: r.ice,
    ingredients: r.ingredients ?? [],
    steps: r.steps ?? [],
  }));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = Object.fromEntries(url.searchParams.entries());
  const parsed = QuerySchema.safeParse(q);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_QUERY' }, { status: 400 });

  const { kind, id, share } = parsed.data;

  let title = 'Recipes';
  let recipes: any[] = [];

  if (share) {
    const link = await prisma.shareLink.findUnique({
      where: { token: share },
      select: {
        kind: true,
        userId: true,
        collectionId: true,
        recipeId: true,
        collection: { select: { name: true, items: { orderBy: { position: 'asc' }, select: { recipeId: true } } } },
      },
    });
    if (!link) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

    if (link.kind === 'favorites') {
      title = 'Избранное';
      const fav = await prisma.favorite.findMany({ where: { userId: link.userId }, select: { recipeId: true }, orderBy: { createdAt: 'desc' } });
      recipes = fav.length ? await prisma.recipe.findMany({ where: { id: { in: fav.map((x) => x.recipeId) } } }) : [];
    } else if (link.kind === 'collection' && link.collection) {
      title = link.collection.name;
      const ids = link.collection.items.map((x) => x.recipeId);
      recipes = ids.length ? await prisma.recipe.findMany({ where: { id: { in: ids } } }) : [];
    } else if (link.kind === 'recipe' && link.recipeId) {
      const r = await prisma.recipe.findUnique({ where: { id: link.recipeId } });
      if (r) recipes = [r];
      title = r?.name ?? 'Рецепт';
    }
  } else {
    const session = await getUserSession();
    try {
      requireUser(session);
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 401 });
    }

    if (kind === 'favorites') {
      title = 'Избранное';
      const fav = await prisma.favorite.findMany({ where: { userId: session.sub }, select: { recipeId: true }, orderBy: { createdAt: 'desc' } });
      recipes = fav.length ? await prisma.recipe.findMany({ where: { id: { in: fav.map((x) => x.recipeId) } } }) : [];
    } else if (kind === 'collection') {
      if (!id) return NextResponse.json({ error: 'ID_REQUIRED' }, { status: 400 });
      const col = await prisma.collection.findFirst({
        where: { id, userId: session.sub },
        select: { name: true, items: { orderBy: { position: 'asc' }, select: { recipeId: true } } },
      });
      if (!col) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
      title = col.name;
      const ids = col.items.map((x) => x.recipeId);
      recipes = ids.length ? await prisma.recipe.findMany({ where: { id: { in: ids } } }) : [];
    } else if (kind === 'recipe') {
      if (!id) return NextResponse.json({ error: 'ID_REQUIRED' }, { status: 400 });
      const r = await prisma.recipe.findUnique({ where: { slug: id } });
      if (!r) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
      title = r.name;
      recipes = [r];
    } else {
      return NextResponse.json({ error: 'KIND_REQUIRED' }, { status: 400 });
    }
  }

  const doc = React.createElement(RecipesPdf, { title, recipes: normalizeRecipes(recipes) });
  // @react-pdf/renderer provides Node helpers; `toBuffer()` is the most compatible for Response.
  const buf: Buffer = await (pdf(doc) as any).toBuffer();
  const body = new Uint8Array(buf);

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="${encodeURIComponent(title)}.pdf"`,
      'cache-control': 'no-store',
    },
  });
}

