import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { setUserSession } from '@/lib/userAuth';

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 });

  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
  if (user.role !== 'user' && user.role !== 'admin') {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });

  await setUserSession({ sub: user.id, email: user.email, role: user.role });
  return NextResponse.json({ ok: true });
}

