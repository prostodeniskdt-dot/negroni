import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, requireRole } from '@/lib/auth';
import { z } from 'zod';

const RecipeUpsertSchema = z.object({
  slug: z.string().min(1),
  city: z.string().min(1),
  lat: z.number(),
  lng: z.number(),

  name: z.string().min(1),
  region: z.string().min(1),
  author: z.string().min(1),
  bar: z.string().min(1),
  difficulty: z.string().min(1),
  category: z.string().min(1),
  barDescription: z.string().min(1),
  barCity: z.string().min(1),
  tags: z.array(z.string()).default([]),
  intro: z.string().min(1),
  image: z.string().min(1),
  method: z.string().min(1),
  glass: z.string().min(1),
  garnish: z.string().min(1),
  ice: z.string().min(1),

  prebatchMode: z.string().default('text'),
  prebatchText: z.string().nullable().optional(),
  prebatchId: z.string().nullable().optional(),

  flavorBitter: z.number().int().min(0).max(10).default(0),
  flavorSweet: z.number().int().min(0).max(10).default(0),
  flavorSour: z.number().int().min(0).max(10).default(0),
  flavorSpicy: z.number().int().min(0).max(10).default(0),
  flavorStrong: z.number().int().min(0).max(10).default(0),

  ingredients: z.array(z.string()).default([]),
  steps: z.array(z.string()).default([]),

  authorInstagram: z.string().nullable().optional(),
  authorTg: z.string().nullable().optional(),
  barLink: z.string().nullable().optional(),

  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

export async function GET() {
  const session = await getSession();
  try {
    requireRole(session, ['admin', 'editor']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const list = await prisma.recipe.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, slug: true, name: true, region: true, status: true, updatedAt: true },
  });
  return NextResponse.json({ recipes: list });
}

export async function POST(req: Request) {
  const session = await getSession();
  try {
    requireRole(session, ['admin', 'editor']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = RecipeUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const created = await prisma.recipe.create({
    data: {
      ...data,
      prebatchText: data.prebatchText ?? null,
      prebatchId: data.prebatchId ?? null,
      authorInstagram: data.authorInstagram ?? null,
      authorTg: data.authorTg ?? null,
      barLink: data.barLink ?? null,
      publishedAt: data.status === 'published' ? new Date() : null,
      createdById: session.sub,
    },
    select: { id: true, slug: true },
  });

  return NextResponse.json({ ok: true, recipe: created }, { status: 201 });
}

