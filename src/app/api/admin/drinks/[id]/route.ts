import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, requireRole } from '@/lib/auth';
import { z } from 'zod';

const PatchSchema = z.object({
  categoryId: z.string().min(1).optional(),
  partnerId: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  image: z.string().nullable().optional(),
  description: z.string().min(1).optional(),
  descriptionEn: z.string().min(1).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['admin', 'editor', 'partner']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }
  const { id } = await ctx.params;
  const drink = await prisma.drink.findUnique({ where: { id } });
  if (!drink) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  if (session.role === 'partner' && session.partnerId && drink.partnerId !== session.partnerId) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }
  return NextResponse.json({ drink });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['admin', 'editor', 'partner']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }
  const { id } = await ctx.params;
  const current = await prisma.drink.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  if (session.role === 'partner' && session.partnerId && current.partnerId !== session.partnerId) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });
  }

  if (session.role === 'partner' && parsed.data.partnerId && session.partnerId && parsed.data.partnerId !== session.partnerId) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const updated = await prisma.drink.update({
    where: { id },
    data: parsed.data,
    select: { id: true, updatedAt: true },
  });
  return NextResponse.json({ ok: true, drink: updated });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['admin']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }
  const { id } = await ctx.params;
  await prisma.drink.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

