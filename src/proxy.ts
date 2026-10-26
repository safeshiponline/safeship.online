import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. Bypass if already internally rewritten
  if (request.headers.get('x-internal-rewrite') === '1') {
    return NextResponse.next();
  }

  // 1. Bypass Next.js internals, static assets, security/trust discovery files, and public files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/.well-known') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/video') ||
    pathname.startsWith('/audio') ||
    pathname.startsWith('/real_deal') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.svg' ||
    pathname === '/apple-icon.png' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/security.txt' ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt'
  ) {
    return NextResponse.next();
  }

  // 2. If static or discovery assets requested under /in (e.g. /in/images/... or /in/llms.txt), rewrite to root
  if (
    pathname.startsWith('/in/.well-known') ||
    pathname.startsWith('/in/images') ||
    pathname.startsWith('/in/video') ||
    pathname.startsWith('/in/audio') ||
    pathname.startsWith('/in/real_deal') ||
    pathname === '/in/favicon.ico' ||
    pathname === '/in/icon.svg' ||
    pathname === '/in/apple-icon.png' ||
    pathname === '/in/security.txt' ||
    pathname === '/in/llms.txt' ||
    pathname === '/in/llms-full.txt'
  ) {
    const assetPath = pathname.replace(/^\/in/, '');
    const url = request.nextUrl.clone();
    url.pathname = assetPath;
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set('x-internal-rewrite', '1');
    return NextResponse.rewrite(url, {
      request: { headers: reqHeaders }
    });
  }

  // 3. API Routes:
  // If called under /in/api/..., rewrite to /api/...
  if (pathname.startsWith('/in/api/')) {
    const apiPath = pathname.replace(/^\/in/, '');
    const url = request.nextUrl.clone();
    url.pathname = apiPath;
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set('x-internal-rewrite', '1');
    return NextResponse.rewrite(url, {
      request: { headers: reqHeaders }
    });
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
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set('x-internal-rewrite', '1');
    return NextResponse.rewrite(url, {
      request: { headers: reqHeaders }
    });
  }

  if (pathname.startsWith('/in/')) {
    // Rewrite /in/:subpath to /:subpath while keeping browser URL as /in/:subpath
    const subpath = pathname.replace(/^\/in/, '');
    const url = request.nextUrl.clone();
    url.pathname = subpath;
    const reqHeaders = new Headers(request.headers);
    reqHeaders.set('x-internal-rewrite', '1');
    return NextResponse.rewrite(url, {
      request: { headers: reqHeaders }
    });
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
     * - .well-known/ (RFC 9116 security.txt & trust.txt scanners)
     * - video/, images/, audio/, real_deal/ (direct CDN static & byte-range media streaming)
     */
    '/((?!_next/static|_next/image|\\.well-known/|video/|images/|audio/|real_deal/|favicon\\.ico|icon\\.svg|apple-icon\\.png|security\\.txt).*)',
  ],
};
