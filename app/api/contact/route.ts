import { NextRequest, NextResponse } from 'next/server';
import { withCSRFProtection } from '@/lib/csrf-middleware';

/**
 * API Route: POST /api/contact
 * 
 * Handles contact form submissions with CSRF protection.
 * 
 * This endpoint validates:
 * - CSRF token from X-CSRF-Token header or request body
 * - Origin/Referer headers
 * - Request method (only POST allowed)
 */

async function handleContactSubmission(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // TODO: Implement actual email sending or database storage
    // For now, we'll just log the submission
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // In production, you would:
    // 1. Send an email notification
    // 2. Store the submission in a database
    // 3. Send a confirmation email to the user

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
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

