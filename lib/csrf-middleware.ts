import { NextRequest, NextResponse } from 'next/server';
import { validateCSRFToken, validateOriginHeaders, getAllowedOrigins } from './csrf';

/**
 * CSRF Middleware
 * 
 * Validates CSRF tokens and Origin/Referer headers for API routes
 * that perform state-changing operations (POST, PUT, DELETE, PATCH).
 */

export interface CSRFValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates CSRF protection for a request
 */
export async function validateCSRFRequest(
  request: NextRequest
): Promise<CSRFValidationResult> {
  const method = request.method;

  // Only validate state-changing methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return { valid: true };
  }

  // Get CSRF token from request headers first
  let csrfToken = request.headers.get('X-CSRF-Token') || 
                   request.headers.get('x-csrf-token');

  // If not in headers, try to get from body (for form submissions)
  if (!csrfToken) {
    try {
      const body = await request.clone().json().catch(() => ({}));
      const bodyToken = (body as { csrfToken?: string }).csrfToken;
      if (bodyToken) {
        csrfToken = bodyToken;
      }
    } catch {
      // Body might not be JSON, that's okay
    }
  }

  // Validate CSRF token
  const tokenValid = await validateCSRFToken(csrfToken);
  if (!tokenValid) {
    return {
      valid: false,
      error: 'Invalid or missing CSRF token',
    };
  }

  // Validate Origin/Referer headers
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const allowedOrigins = getAllowedOrigins();

  const originValid = validateOriginHeaders(origin, referer, allowedOrigins);
  if (!originValid) {
    return {
      valid: false,
      error: 'Invalid origin or referer header',
    };
  }

  return { valid: true };
}

/**
 * Middleware wrapper for API routes
 * Returns a 403 response if CSRF validation fails
 */
export async function withCSRFProtection(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const validation = await validateCSRFRequest(request);

  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error || 'CSRF validation failed' },
      { status: 403 }
    );
  }

  return handler(request);
}

