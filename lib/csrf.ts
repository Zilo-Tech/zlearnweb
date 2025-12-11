import { cookies } from 'next/headers';
import crypto from 'crypto';

/**
 * CSRF Protection Utility
 * 
 * This module provides CSRF (Cross-Site Request Forgery) protection
 * for state-changing operations in the application.
 */

const CSRF_TOKEN_NAME = 'csrf-token';
const CSRF_TOKEN_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

/**
 * Generates a cryptographically secure random token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Gets the current CSRF token from cookies or generates a new one
 */
export async function getCSRFToken(): Promise<string> {
  const cookieStore = await cookies();
  let token = cookieStore.get(CSRF_TOKEN_NAME)?.value;

  if (!token) {
    token = generateCSRFToken();
    cookieStore.set(CSRF_TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: CSRF_TOKEN_MAX_AGE,
      path: '/',
    });
  }

  return token;
}

/**
 * Validates a CSRF token against the token stored in cookies
 */
export async function validateCSRFToken(token: string | null | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }

  const cookieStore = await cookies();
  const storedToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;

  if (!storedToken) {
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(storedToken)
  );
}

/**
 * Validates the Origin and Referer headers to prevent CSRF attacks
 */
export function validateOriginHeaders(
  origin: string | null,
  referer: string | null,
  allowedOrigins: string[]
): boolean {
  // In production, validate against allowed origins
  if (process.env.NODE_ENV === 'production') {
    if (!origin && !referer) {
      return false;
    }

    const requestOrigin = origin || new URL(referer!).origin;
    
    // Check if the origin is in the allowed list
    return allowedOrigins.some(allowed => {
      try {
        const allowedUrl = new URL(allowed);
        return allowedUrl.origin === requestOrigin;
      } catch {
        return allowed === requestOrigin;
      }
    });
  }

  // In development, allow localhost origins
  if (process.env.NODE_ENV === 'development') {
    if (!origin && !referer) {
      return false;
    }

    const requestOrigin = origin || new URL(referer!).origin;
    return requestOrigin.includes('localhost') || requestOrigin.includes('127.0.0.1');
  }

  return false;
}

/**
 * Gets allowed origins from environment variables
 */
export function getAllowedOrigins(): string[] {
  const origins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (baseUrl) {
    origins.push(baseUrl);
  }

  return origins.filter(Boolean);
}

