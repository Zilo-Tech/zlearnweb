'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProgressIndicator } from '@/components/onboarding/progress-indicator';
import { ArrowLeft } from 'lucide-react';

// Map routes to step numbers
const steps: Record<string, number> = {
    '/onboarding/user-type': 1,
    '/onboarding/profile': 2,
    '/onboarding/country': 2,
    '/onboarding/education-level': 3,
    '/onboarding/school': 4,
    '/onboarding/faculty': 4,
    '/onboarding/class': 5,
    '/onboarding/curriculum': 6,
    '/onboarding/preferences': 7,
    '/onboarding/professional-background': 2,
    '/onboarding/professional-goals': 3,
    '/onboarding/exams': 2,
};

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const currentStep = steps[pathname ?? ''] ?? 1;
    const totalSteps =
        pathname === '/onboarding/user-type' ? 1
        : pathname?.includes('exams') ? 2
        : pathname?.includes('professional') ? 4
        : 7;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-4 md:px-8 sticky top-0 z-50 shadow-sm">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform group-hover:scale-105">
                            Z
                        </div>
                        <span className="font-bold text-xl text-gray-900">Learn</span>
                    </Link>

                    <Button variant="ghost" size="sm" asChild className="font-semibold">
                        <Link href="/auth/logout" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Save & Exit
                        </Link>
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
                <div className="mb-8">
                    <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
                </div>

                <div className="rounded-2xl bg-white border border-gray-200 shadow-lg p-6 md:p-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
