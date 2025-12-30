'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading';

interface RouteGuardProps {
    children: React.ReactNode;
}

const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
];

export function RouteGuard({ children }: RouteGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        // If loading, do nothing yet
        if (isLoading) return;

        const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

        // If not authenticated and trying to access a protected route
        if (!isAuthenticated && !isPublicPath && pathname.startsWith('/app')) {
            router.push(`/auth/login?from=${encodeURIComponent(pathname)}`);
        }

        // If authenticated and trying to access auth pages
        if (isAuthenticated && pathname.startsWith('/auth')) {
            router.push('/app/dashboard');
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    // Show loading spinner while checking auth state
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // If not authenticated and on a protected route, don't render children (will redirect)
    if (!isAuthenticated && !publicPaths.some((path) => pathname.startsWith(path)) && pathname.startsWith('/app')) {
        return null;
    }

    return <>{children}</>;
}
