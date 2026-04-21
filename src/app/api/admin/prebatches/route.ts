import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, requireRole } from '@/lib/auth';
import { z } from 'zod';

const Schema = z.object({
  name: z.string().min(1),
  ingredients: z.array(z.string()).default([]),
  steps: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

export async function GET() {
  const session = await getSession();
  try {
    requireRole(session, ['admin', 'editor']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }
  const list = await prisma.prebatch.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, name: true, status: true, updatedAt: true },
  });
  return NextResponse.json({ prebatches: list });
}

export async function POST(req: Request) {
  const session = await getSession();
  try {
    requireRole(session, ['admin', 'editor']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });
  }
  const created = await prisma.prebatch.create({
    data: { ...parsed.data, createdById: session.sub },
    select: { id: true, name: true },
  });
  return NextResponse.json({ ok: true, prebatch: created }, { status: 201 });
}

