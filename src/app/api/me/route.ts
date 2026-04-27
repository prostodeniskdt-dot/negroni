import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/userAuth';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getUserSession();
  if (!session) return NextResponse.json({ session: null });
  return NextResponse.json({ session });
}

