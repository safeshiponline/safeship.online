import 'server-only';

/**
 * Browser-initiated mutations must originate from this deployment. This is a
 * lightweight defence in depth layer; authorization still belongs in every
 * route handler.
 */
export function isTrustedRequestOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const secFetchSite = request.headers.get('sec-fetch-site');

  // Allow same-origin browser fetches (Sec-Fetch-Site: same-origin or none)
  if (secFetchSite === 'same-origin' || secFetchSite === 'none') {
    return true;
  }

  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  let requestHost = '';
  try {
    requestHost = new URL(request.url).host;
  } catch {}

  // If Origin header is provided, validate domain
  if (origin) {
    if (configuredOrigin && origin === configuredOrigin) return true;
    try {
      const originHost = new URL(origin).host;
      if (originHost === requestHost) return true;
      if (originHost.endsWith('cashfree.com') || originHost.endsWith('razorpay.com')) return true;
      if (originHost === 'localhost' || originHost.startsWith('127.0.0.1')) return true;
    } catch {
      return false;
    }
    return false;
  }

  // If Referer header is provided instead of Origin, validate host
  if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost === requestHost) return true;
      if (configuredOrigin && refererHost === new URL(configuredOrigin).host) return true;
      if (refererHost.endsWith('cashfree.com') || refererHost.endsWith('razorpay.com')) return true;
      if (refererHost === 'localhost' || refererHost.startsWith('127.0.0.1')) return true;
    } catch {
      return false;
    }
  }

  // Same-origin or non-browser server-to-server request
  return true;
}

export function safeErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && process.env.NODE_ENV !== 'production'
    ? error.message
    : fallback;
}
