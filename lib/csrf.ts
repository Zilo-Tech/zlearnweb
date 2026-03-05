import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'csrf-token';
const TOKEN_BYTES = 32;

export async function getCSRFToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  const token = crypto.randomBytes(TOKEN_BYTES).toString('hex');
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  return token;
}

export function getAllowedOrigins(): string[] {
  const env = process.env.ALLOWED_ORIGINS;
  if (env) return env.split(',').map((o) => o.trim()).filter(Boolean);
  // Production: allow the app's own site URL so same-origin requests (e.g. waitlist, contact) work
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (typeof siteUrl === 'string' && siteUrl) {
    const base = siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`;
    const origins = [base];
    // Allow both www and non-www when one is configured
    try {
      const u = new URL(base);
      if (u.hostname.startsWith('www.')) {
        origins.push(`${u.protocol}//${u.hostname.slice(4)}`);
      } else {
        origins.push(`${u.protocol}//www.${u.hostname}`);
      }
    } catch {
      // ignore
    }
    return origins;
  }
  return ['http://localhost:3000', 'http://127.0.0.1:3000'];
}
