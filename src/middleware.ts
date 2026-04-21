import { NextResponse, type NextRequest } from 'next/server';

const COOKIE_NAME = 'negroni_admin';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth =
    pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  if (!needsAuth) return NextResponse.next();

  if (pathname === '/admin/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Edge runtime: avoid heavy JWT verification here.
  // API routes (Node.js runtime) do full verification.
  const hasCookie = Boolean(req.cookies.get(COOKIE_NAME)?.value);
  if (hasCookie) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};

