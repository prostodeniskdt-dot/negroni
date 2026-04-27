import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getSession, requireRole } from '@/lib/auth';

export const runtime = 'nodejs';

const PatchSchema = z.object({
  name: z.string().min(1).max(120),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['user', 'admin']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const { id } = await ctx.params;
  const c = await prisma.collection.findFirst({
    where: { id, userId: session.sub },
    select: {
      id: true,
      name: true,
      updatedAt: true,
      items: { orderBy: { position: 'asc' }, select: { recipe: { select: { slug: true } } } },
    },
  });
  if (!c) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

  return NextResponse.json({
    collection: {
      id: c.id,
      name: c.name,
      updatedAt: c.updatedAt.toISOString(),
      slugs: c.items.map((x) => x.recipe.slug),
    },
  });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['user', 'admin']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });

  const updated = await prisma.collection.updateMany({
    where: { id, userId: session.sub },
    data: { name: parsed.data.name.trim() },
  });
  if (updated.count === 0) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['user', 'admin']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const { id } = await ctx.params;
  const deleted = await prisma.collection.deleteMany({ where: { id, userId: session.sub } });
  if (deleted.count === 0) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

