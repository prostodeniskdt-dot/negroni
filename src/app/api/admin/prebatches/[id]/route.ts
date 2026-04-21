import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, requireRole } from '@/lib/auth';
import { z } from 'zod';

const PatchSchema = z.object({
  name: z.string().min(1).optional(),
  ingredients: z.array(z.string()).optional(),
  steps: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['admin', 'editor']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }
  const { id } = await ctx.params;
  const prebatch = await prisma.prebatch.findUnique({ where: { id } });
  if (!prebatch) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json({ prebatch });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['admin', 'editor']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });
  }
  const updated = await prisma.prebatch.update({
    where: { id },
    data: parsed.data,
    select: { id: true, name: true, updatedAt: true },
  });
  return NextResponse.json({ ok: true, prebatch: updated });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['admin']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }
  const { id } = await ctx.params;
  await prisma.prebatch.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

