import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const res = await fetch(new URL('/api/auth/register', req.url), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: await req.text(),
  });
  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
}

