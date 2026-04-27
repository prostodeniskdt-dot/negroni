import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { setSession } from '@/lib/auth';

const BodySchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  username: z.string().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/, 'INVALID_USERNAME'),
  barName: z.string().min(1).max(120).optional(),
  city: z.string().min(1).max(120).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_BODY', details: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const email = data.email.trim().toLowerCase();
  const username = data.username.trim();

  const passwordHash = await bcrypt.hash(data.password, 12);

  try {
    const created = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'user',
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        username,
        barName: data.barName?.trim() || null,
        city: data.city?.trim() || null,
      },
      select: { id: true, email: true, role: true, partnerId: true },
    });

    await setSession({ sub: created.id, email: created.email, role: created.role, partnerId: created.partnerId });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    const msg = String(e?.code || e?.message || e);
    if (msg.includes('P2002')) return NextResponse.json({ error: 'ALREADY_EXISTS' }, { status: 409 });
    return NextResponse.json({ error: 'REGISTER_FAILED' }, { status: 500 });
  }
}

