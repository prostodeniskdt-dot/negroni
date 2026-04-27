import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getUserSession, requireUser } from '@/lib/userAuth';

export const runtime = 'nodejs';

const PutSchema = z.object({
  slugs: z.array(z.string().min(1)).max(500),
  mode: z.enum(['replace', 'merge']).default('merge'),
});

export async function GET() {
  const session = await getUserSession();
  try {
    requireUser(session);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const list = await prisma.favorite.findMany({
    where: { userId: session.sub },
    select: { recipe: { select: { slug: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ slugs: list.map((x) => x.recipe.slug) });
}

export async function PUT(req: Request) {
  const session = await getUserSession();
  try {
    requireUser(session);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });
  }

  const incoming = Array.from(new Set(parsed.data.slugs.map((s) => s.trim()).filter(Boolean)));

  const recipes = incoming.length
    ? await prisma.recipe.findMany({
        where: { slug: { in: incoming } },
        select: { id: true, slug: true },
      })
    : [];

  const recipeBySlug = new Map(recipes.map((r) => [r.slug, r.id]));
  const recipeIds = incoming.map((slug) => recipeBySlug.get(slug)).filter((x): x is string => Boolean(x));

  if (parsed.data.mode === 'replace') {
    await prisma.favorite.deleteMany({ where: { userId: session.sub } });
  }

  if (recipeIds.length) {
    await prisma.favorite.createMany({
      data: recipeIds.map((recipeId) => ({ userId: session.sub, recipeId })),
      skipDuplicates: true,
    });
  }

  const result = await prisma.favorite.findMany({
    where: { userId: session.sub },
    select: { recipe: { select: { slug: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ slugs: result.map((x) => x.recipe.slug) });
}

