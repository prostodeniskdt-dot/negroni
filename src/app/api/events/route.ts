import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const EventSchema = z.object({
  type: z.enum([
    'page_view',
    'time_on_page',
    'favorite_add',
    'favorite_remove',
    'collection_create',
    'collection_delete',
    'collection_add',
    'collection_remove',
    'share_create',
    'pdf_export',
  ]),
  path: z.string().min(1).max(500),
  referrer: z.string().max(1000).optional(),
  durationMs: z.number().int().min(0).max(1000 * 60 * 60 * 24).optional(),
  recipeSlug: z.string().optional(),
  anonymousId: z.string().min(6).max(100),
  sessionId: z.string().min(6).max(100),
  meta: z.record(z.string(), z.any()).optional(),
});

const BodySchema = z.object({
  events: z.array(EventSchema).min(1).max(50),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({ ok: true, accepted: parsed.data.events.length, source: 'noop' });
}

