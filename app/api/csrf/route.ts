import { NextResponse } from 'next/server';
import { getCSRFToken } from '@/lib/csrf';

/**
 * API Route: GET /api/csrf
 * 
 * Returns a CSRF token for the current session.
 * The token is stored in an httpOnly, SameSite=Strict cookie.
 * 
 * This endpoint should be called before submitting any form
 * that performs state-changing operations.
 */
export async function GET() {
  try {
    const token = await getCSRFToken();

    return NextResponse.json(
      { csrfToken: token },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

