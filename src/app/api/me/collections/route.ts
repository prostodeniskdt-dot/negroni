import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getUserSession, requireUser } from '@/lib/userAuth';

export const runtime = 'nodejs';

const PostSchema = z.object({
  name: z.string().min(1).max(120),
});

export async function GET() {
  const session = await getUserSession();
  try {
    requireUser(session);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const list = await prisma.collection.findMany({
    where: { userId: session.sub },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      updatedAt: true,
      _count: { select: { items: true } },
    },
  });

  return NextResponse.json({
    collections: list.map((c) => ({
      id: c.id,
      name: c.name,
      updatedAt: c.updatedAt.toISOString(),
      itemsCount: c._count.items,
    })),
  });
}

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

  const created = await prisma.collection.create({
    data: { userId: session.sub, name: parsed.data.name.trim() },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}

