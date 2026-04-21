import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { UserRole } from '@prisma/client';

const COOKIE_NAME = 'negroni_admin';

type SessionPayload = {
  sub: string;
  email: string;
  role: UserRole;
  partnerId?: string | null;
};

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionCookie(payload: SessionPayload): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60 * 24 * 7) // 7 days
    .sign(getSecret());
  return token;
}

export async function setSession(payload: SessionPayload): Promise<void> {
  const token = await createSessionCookie(payload);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const p = payload as unknown as SessionPayload;
    if (!p?.sub || !p?.email || !p?.role) return null;
    return p;
  } catch {
    return null;
  }
}

export function requireRole(
  session: SessionPayload | null,
  allowed: UserRole[]
): asserts session is SessionPayload {
  if (!session) throw new Error('UNAUTHENTICATED');
  if (!allowed.includes(session.role)) throw new Error('FORBIDDEN');
}

