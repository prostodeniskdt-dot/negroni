import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import type { UserRole } from '@prisma/client';

const COOKIE_NAME = 'negroni_user';

export type UserSessionPayload = {
  sub: string;
  email: string;
  role: UserRole;
};

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export async function createUserSessionCookie(payload: UserSessionPayload): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + 60 * 60 * 24 * 30) // 30 days
    .sign(getSecret());
}

export async function setUserSession(payload: UserSessionPayload): Promise<void> {
  const token = await createUserSessionCookie(payload);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearUserSession(): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}

export async function getUserSession(): Promise<UserSessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const p = payload as unknown as UserSessionPayload;
    if (!p?.sub || !p?.email || !p?.role) return null;
    return p;
  } catch {
    return null;
  }
}

export function requireUser(session: UserSessionPayload | null): asserts session is UserSessionPayload {
  if (!session) throw new Error('UNAUTHENTICATED');
  if (session.role !== 'user' && session.role !== 'admin') throw new Error('FORBIDDEN');
}

