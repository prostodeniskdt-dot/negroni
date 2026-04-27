import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';
import { clearUserSession } from '@/lib/userAuth';

export async function POST() {
  await clearSession();
  await clearUserSession();
  return NextResponse.json({ ok: true });
}

