'use client';

import { useState } from 'react';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { Footer as AppFooter } from './footer';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import { BottomNav } from './bottom-nav';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

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

    // For public pages, render without sidebar but with original Header and Footer
    if (isPublicPage) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        );
    }

    // For app routes, render full layout with sidebar
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

            <div className="flex pt-16">
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
