import { NextResponse, type NextRequest } from 'next/server';

const COOKIE_NAME = 'negroni_session';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAdminAuth = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const needsUserAuth = pathname.startsWith('/cabinet') || pathname.startsWith('/api/me');

  if (!needsAdminAuth && !needsUserAuth) return NextResponse.next();

  if (pathname.startsWith('/api/auth')) return NextResponse.next();
  if (pathname === '/login' || pathname === '/register') return NextResponse.next();

  // Edge runtime: avoid heavy JWT verification here.
  // API routes (Node.js runtime) do full verification (role checks).
  const hasCookie = Boolean(req.cookies.get(COOKIE_NAME)?.value);
  if (hasCookie) return NextResponse.next();

  if (needsAdminAuth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/cabinet/:path*', '/api/me/:path*'],
};

