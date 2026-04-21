import { NextResponse } from 'next/server';
import { getSession, requireRole } from '@/lib/auth';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  const session = await getSession();
  try {
    requireRole(session, ['admin']);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 401 });
  }

  await seedDatabase();
  return NextResponse.json({ ok: true });
}

