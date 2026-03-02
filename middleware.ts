import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path is public
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // Get the token from the cookies (assuming you store it there)
    // In a real app, you might check for a session cookie or JWT
    // For this mock implementation, we'll check for a 'token' cookie
    const token = request.cookies.get('token')?.value;

    // If the user is authenticated and tries to access auth pages, redirect to dashboard
    if (token && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/app/dashboard', request.url));
    }

    // If the user is not authenticated and tries to access protected pages, redirect to login
    if (!token && !isPublicPath && pathname.startsWith('/app')) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)',
    ],
};
