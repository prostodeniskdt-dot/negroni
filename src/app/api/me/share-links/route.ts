import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getUserSession, requireUser } from '@/lib/userAuth';

export const runtime = 'nodejs';

const PostSchema = z.object({
  kind: z.enum(['favorites', 'collection', 'recipe']),
  collectionId: z.string().optional(),
  recipeSlug: z.string().optional(),
  lang: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getUserSession();
  try {
    requireUser(session);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });

  const { kind, collectionId, recipeSlug, lang } = parsed.data;

  let colId: string | null = null;
  let recipeId: string | null = null;

  if (kind === 'collection') {
    if (!collectionId) return NextResponse.json({ error: 'COLLECTION_REQUIRED' }, { status: 400 });
    const col = await prisma.collection.findFirst({ where: { id: collectionId, userId: session.sub }, select: { id: true } });
    if (!col) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    colId = col.id;
  }

  if (kind === 'recipe') {
    if (!recipeSlug) return NextResponse.json({ error: 'RECIPE_REQUIRED' }, { status: 400 });
    const recipe = await prisma.recipe.findUnique({ where: { slug: recipeSlug.trim() }, select: { id: true } });
    if (!recipe) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
    recipeId = recipe.id;
  }

  const created = await prisma.shareLink.create({
    data: {
      kind,
      lang: lang?.trim() || null,
      userId: session.sub,
      collectionId: colId,
      recipeId,
    },
    select: { token: true },
  });

  return NextResponse.json({ ok: true, token: created.token, url: `/share/${created.token}` }, { status: 201 });
}

