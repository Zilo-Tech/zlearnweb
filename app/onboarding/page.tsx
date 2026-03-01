'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function WelcomePage() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center text-center space-y-8 py-10">
            <div className="h-20 w-20 rounded-2xl bg-[#446D6D]/10 flex items-center justify-center text-[#446D6D]">
                <Sparkles className="h-10 w-10" />
            </div>

            <div className="space-y-4 max-w-md">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    Welcome to Z-Learn
                </h1>
                <p className="text-lg text-gray-600">
                    Your journey to personalized global digital education begins here. Let's set up your profile to give you the best experience.
                </p>
            </div>

            <div className="w-full max-w-sm space-y-4 pt-4">
                <Button
                    className="w-full bg-[#446D6D] hover:bg-[#3A5F5F] text-white py-6 rounded-xl text-lg font-semibold"
                    onClick={() => router.push('/onboarding/user-type')}
                >
                    Get Started
                </Button>
                <p className="text-sm text-gray-500">
                    It only takes about 2 minutes to personalize your learning journey
                </p>
            </div>
        </div>
    );
}
