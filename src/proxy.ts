import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Bypass Next.js internals, static assets, and public files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/real_deal') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.svg' ||
    pathname === '/apple-icon.png' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt'
  ) {
    return NextResponse.next();
  }

  // 2. If static assets requested under /in (e.g. /in/images/... or /in/favicon.ico), rewrite to root
  if (
    pathname.startsWith('/in/images') ||
    pathname.startsWith('/in/real_deal') ||
    pathname === '/in/favicon.ico' ||
    pathname === '/in/icon.svg' ||
    pathname === '/in/apple-icon.png' ||
    pathname === '/in/llms.txt'
  ) {
    const assetPath = pathname.replace(/^\/in/, '');
    const url = request.nextUrl.clone();
    url.pathname = assetPath;
    return NextResponse.rewrite(url);
  }

  // 3. API Routes:
  // If called under /in/api/..., rewrite to /api/...
  if (pathname.startsWith('/in/api/')) {
    const apiPath = pathname.replace(/^\/in/, '');
    const url = request.nextUrl.clone();
    url.pathname = apiPath;
    return NextResponse.rewrite(url);
  }

  // Direct /api/... calls pass through directly
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 4. If request is already on /in (e.g. /in or /in/deals/new or /in/track/SS48291)
  if (pathname === '/in') {
    // Rewrite to root page (src/app/page.tsx) while keeping browser URL as /in
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith('/in/')) {
    // Rewrite /in/:subpath to /:subpath while keeping browser URL as /in/:subpath
    const subpath = pathname.replace(/^\/in/, '');
    const url = request.nextUrl.clone();
    url.pathname = subpath;
    return NextResponse.rewrite(url);
  }

  // 5. Any request NOT starting with /in -> REDIRECT to /in
  // e.g. / -> /in
  // /deals/new -> /in/deals/new
  // /track/SS48291?step=2 -> /in/track/SS48291?step=2
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/in${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    '/((?!_next/static|_next/image).*)',
  ],
};
