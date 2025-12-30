'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProgressIndicator } from '@/components/onboarding/progress-indicator';

// Map routes to step numbers
const steps = {
    '/onboarding/country': 1,
    '/onboarding/education-level': 2,
    '/onboarding/school': 3,
    '/onboarding/faculty': 3, // Alternative step 3
    '/onboarding/class': 4,
    '/onboarding/curriculum': 5,
    '/onboarding/preferences': 6,
    '/onboarding/professional-background': 3, // Professional path
    '/onboarding/professional-goals': 4, // Professional path
};

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const currentStep = steps[pathname as keyof typeof steps] || 1;
    const totalSteps = pathname?.includes('professional') ? 4 : 6;

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
