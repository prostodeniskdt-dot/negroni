import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession, requireRole } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  try {
    requireRole(session, ['admin', 'editor', 'partner']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  const partners = await prisma.partner.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  const filtered =
    session.role === 'partner' && session.partnerId
      ? partners.filter((p) => p.id === session.partnerId)
      : partners;

  return NextResponse.json({ partners: filtered });
}

