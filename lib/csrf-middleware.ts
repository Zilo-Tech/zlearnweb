import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getAllowedOrigins } from './csrf';

const COOKIE_NAME = 'csrf-token';

function validateOriginHeaders(origin: string | null, referer: string | null, allowed: string[]): boolean {
  const o = (origin || referer || '').trim();
  if (!o) return allowed.some((a) => a.includes('localhost') || a.includes('127.0.0.1'));
  return allowed.some((a) => o.startsWith(a));
}

export async function withCSRFProtection<T>(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse<T>>
): Promise<NextResponse> {
  const method = request.method;
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return handler(request);
  }

  let token: string | null = request.headers.get('X-CSRF-Token') || request.headers.get('x-csrf-token');
  if (!token) {
    try {
      const body = await request.clone().json().catch(() => ({}));
      const fromBody = (body as { csrfToken?: string }).csrfToken;
      token = fromBody ?? null;
    } catch {
      // ignore
    }
  }

  const cookieStore = await cookies();
  const storedToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!storedToken || !token || !crypto.timingSafeEqual(Buffer.from(storedToken, 'utf8'), Buffer.from(token, 'utf8'))) {
    return NextResponse.json({ error: 'Invalid or missing CSRF token' }, { status: 403 });
  }

  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');
  const allowed = getAllowedOrigins();
  if (!validateOriginHeaders(origin, referer, allowed)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  return handler(request);
}
