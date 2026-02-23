import { NextRequest, NextResponse } from 'next/server';
import { withCSRFProtection } from '@/lib/csrf-middleware';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.z-learn.app';

/**
 * API Route: POST /api/contact
 * Proxies to backend POST /api/contact/ (public, no auth).
 */

async function handleContactSubmission(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    const res = await fetch(`${BACKEND_URL}/api/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error proxying contact form to backend:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 }
    );
  }
}

// Export POST handler with CSRF protection
export async function POST(request: NextRequest) {
  return withCSRFProtection(request, handleContactSubmission);
}

// Reject other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

