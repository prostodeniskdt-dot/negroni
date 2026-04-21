import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, requireRole } from '@/lib/auth';
import { z } from 'zod';

const PatchSchema = z.object({
  slug: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  name: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  bar: z.string().min(1).optional(),
  difficulty: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  barDescription: z.string().min(1).optional(),
  barCity: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  intro: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  method: z.string().min(1).optional(),
  glass: z.string().min(1).optional(),
  garnish: z.string().min(1).optional(),
  ice: z.string().min(1).optional(),
  prebatchMode: z.string().optional(),
  prebatchText: z.string().nullable().optional(),
  prebatchId: z.string().nullable().optional(),
  flavorBitter: z.number().int().min(0).max(10).optional(),
  flavorSweet: z.number().int().min(0).max(10).optional(),
  flavorSour: z.number().int().min(0).max(10).optional(),
  flavorSpicy: z.number().int().min(0).max(10).optional(),
  flavorStrong: z.number().int().min(0).max(10).optional(),
  ingredients: z.array(z.string()).optional(),
  steps: z.array(z.string()).optional(),
  authorInstagram: z.string().nullable().optional(),
  authorTg: z.string().nullable().optional(),
  barLink: z.string().nullable().optional(),
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
  const recipe = await prisma.recipe.findUnique({ where: { id } });
  if (!recipe) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  return NextResponse.json({ recipe });
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

  const data = parsed.data;
  const updated = await prisma.recipe.update({
    where: { id },
    data: {
      ...data,
      publishedAt:
        data.status === 'published'
          ? new Date()
          : data.status
            ? null
            : undefined,
    },
    select: { id: true, slug: true, updatedAt: true },
  });
  return NextResponse.json({ ok: true, recipe: updated });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  try {
    requireRole(session, ['admin']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const { id } = await ctx.params;
  await prisma.recipe.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

