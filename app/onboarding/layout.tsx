'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProgressIndicator } from '@/components/onboarding/progress-indicator';

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
        <div className="min-h-screen bg-gray-50">
            <header className="border-b bg-white px-4 py-4 md:px-8">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#446D6D]">
                        <div className="h-8 w-8 rounded-lg bg-[#446D6D] flex items-center justify-center text-white">
                            Z
                        </div>
                        <span>Z-Learn</span>
                    </Link>

                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/auth/logout">Save & Exit</Link>
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-4xl p-4 md:p-8">
                <div className="mb-8">
                    <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm md:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
