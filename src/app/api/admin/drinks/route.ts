import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, requireRole } from '@/lib/auth';
import { z } from 'zod';

const UpsertSchema = z.object({
  id: z.string().min(1),
  categoryId: z.string().min(1),
  partnerId: z.string().min(1),
  name: z.string().min(1),
  nameEn: z.string().min(1),
  image: z.string().nullable().optional(),
  tagline: z.string().nullable().optional(),
  taglineEn: z.string().nullable().optional(),
  description: z.string().min(1),
  descriptionEn: z.string().min(1),
  producer: z.string().nullable().optional(),
  producerEn: z.string().nullable().optional(),
  origin: z.string().nullable().optional(),
  originEn: z.string().nullable().optional(),
  abv: z.string().nullable().optional(),
  volume: z.string().nullable().optional(),
  tastingNotes: z.string().nullable().optional(),
  serve: z.string().nullable().optional(),
  serveEn: z.string().nullable().optional(),
  buyUrl: z.string().nullable().optional(),
  buyLabel: z.string().nullable().optional(),
  buyLabelEn: z.string().nullable().optional(),
  purchaseNote: z.string().nullable().optional(),
  purchaseNoteEn: z.string().nullable().optional(),
  recipeHints: z.string().nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

export async function GET() {
  const session = await getSession();
  try {
    requireRole(session, ['admin', 'editor', 'partner']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const where =
    session.role === 'partner' && session.partnerId
      ? { partnerId: session.partnerId }
      : {};

  const list = await prisma.drink.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    select: { id: true, name: true, partnerId: true, categoryId: true, status: true, updatedAt: true, buyUrl: true },
  });
  return NextResponse.json({ drinks: list });
}

export async function POST(req: Request) {
  const session = await getSession();
  try {
    requireRole(session, ['admin', 'editor', 'partner']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = UpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });
  }

  if (session.role === 'partner' && session.partnerId && parsed.data.partnerId !== session.partnerId) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const created = await prisma.drink.create({
    data: {
      ...parsed.data,
      image: parsed.data.image ?? null,
      createdById: session.sub,
    },
    select: { id: true, name: true },
  });
  return NextResponse.json({ ok: true, drink: created }, { status: 201 });
}

