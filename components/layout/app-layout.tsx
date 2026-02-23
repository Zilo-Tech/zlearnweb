'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/lib/store/hooks';

import { BottomNav } from './bottom-nav';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, onboardingComplete } = useAppSelector((state) => state.auth);

    // Redirect to onboarding when on app route but onboarding not complete (aligned with mobile)
    useEffect(() => {
        if (pathname?.startsWith('/app') && isAuthenticated && !onboardingComplete) {
            router.replace('/onboarding/user-type');
        }
    }, [pathname, isAuthenticated, onboardingComplete, router]);

    // Check if we are in the app section (authenticated routes)
    const isAppRoute = pathname?.startsWith('/app');
    // Check if we are in auth pages (login/register)
    const isAuthPage = pathname?.startsWith('/auth');
    // Check if we are in onboarding pages
    const isOnboardingPage = pathname?.startsWith('/onboarding');
    // Check if we are on public landing pages
    const publicRoutes = ['/', '/about', '/contact', '/pricing', '/faq', '/terms', '/privacy'];
    const isPublicPage = publicRoutes.includes(pathname || '');

    // For auth and onboarding pages, render minimal layout (they have their own layouts)
    if (isAuthPage || isOnboardingPage) {
        return (
            <div className="min-h-screen bg-gray-50">
                {children}
            </div>
        );
    }

    // For public pages, render without sidebar but with Header and Footer (brand: zinc-50)
    if (isPublicPage) {
        return (
            <div className="min-h-screen flex flex-col bg-zinc-50 font-sans text-base antialiased">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        );
    }

    // For app routes, use same Header (auth-aware) with sidebar toggle
    return (
        <div className="min-h-screen flex flex-col bg-zinc-50 font-sans text-base antialiased">
            <header className="sticky top-0 z-50 shrink-0">
                <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </header>

            <div className="flex flex-1 min-h-0">
                {isAppRoute && (
                    <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                )}

                <main className={cn(
                    "flex-1 min-h-[calc(100vh-4rem)] transition-all duration-200 ease-in-out pb-20 md:pb-0 max-w-full break-words",
                    isAppRoute ? "md:ml-64" : ""
                )}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
                        {children}
                    </div>
                    {!isAppRoute && <Footer />}
                </main>
            </div>

            {isAppRoute && <BottomNav />}
        </div>
    );
}
