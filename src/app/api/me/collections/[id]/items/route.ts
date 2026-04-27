import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSession, requireRole } from '@/lib/auth';

export const runtime = 'nodejs';

const PostSchema = z.object({
  slugs: z.array(z.string().min(1)).max(500),
});

const DeleteSchema = z.object({
  slug: z.string().min(1),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['user', 'admin']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });

  const col = await prisma.collection.findFirst({ where: { id, userId: session.sub }, select: { id: true } });
  if (!col) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

  const incoming = Array.from(new Set(parsed.data.slugs.map((s) => s.trim()).filter(Boolean)));
  const recipes = incoming.length
    ? await prisma.recipe.findMany({ where: { slug: { in: incoming } }, select: { id: true, slug: true } })
    : [];
  const bySlug = new Map(recipes.map((r) => [r.slug, r.id]));
  const recipeIds = incoming.map((s) => bySlug.get(s)).filter((x): x is string => Boolean(x));

  // append: position after current max
  const maxPos = await prisma.collectionItem.aggregate({
    where: { collectionId: col.id },
    _max: { position: true },
  });
  let pos = (maxPos._max.position ?? 0) + 1;

  await prisma.collectionItem.createMany({
    data: recipeIds.map((recipeId) => ({ collectionId: col.id, recipeId, position: pos++ })),
    skipDuplicates: true,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['user', 'admin']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = DeleteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });

  const col = await prisma.collection.findFirst({ where: { id, userId: session.sub }, select: { id: true } });
  if (!col) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

  const recipe = await prisma.recipe.findUnique({ where: { slug: parsed.data.slug.trim() }, select: { id: true } });
  if (!recipe) return NextResponse.json({ ok: true });

  await prisma.collectionItem.deleteMany({ where: { collectionId: col.id, recipeId: recipe.id } });
  return NextResponse.json({ ok: true });
}

