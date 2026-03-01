import { NextRequest, NextResponse } from 'next/server';
import { withCSRFProtection } from '@/lib/csrf-middleware';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.z-learn.app';

/**
 * API Route: POST /api/waitlist
 *
 * Proxies waitlist sign-ups to the backend with CSRF protection.
 * Backend: POST /api/waitlist/ — public, no auth. Body: { email (required), name (optional) }.
 */

async function handleWaitlistSubmission(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const name = typeof body.name === 'string' ? body.name.trim() || undefined : undefined;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const payload: { email: string; name?: string } = { email };
    if (name) payload.name = name;

    const res = await fetch(`${BACKEND_URL}/api/waitlist/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error proxying waitlist to backend:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return withCSRFProtection(request, handleWaitlistSubmission);
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
