import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/userAuth';
import { getSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  const session = (await getUserSession()) ?? (await getSession());
  if (!session) return NextResponse.json({ session: null });
  return NextResponse.json({ session });
}

