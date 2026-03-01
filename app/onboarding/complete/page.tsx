'use client';

import { useRouter } from 'next/navigation';
import { PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { completeOnboarding } from '@/lib/store/slices/auth.slice';
import { useState } from 'react';

export default function OnboardingCompletePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data: onboardingData } = useAppSelector((state) => state.onboarding);
    const [isFinishing, setIsFinishing] = useState(false);

    const handleFinish = async () => {
        setIsFinishing(true);
        try {
            await dispatch(completeOnboarding(onboardingData)).unwrap();
            router.push('/app/dashboard');
        } catch (error) {
            console.error('Failed to complete onboarding:', error);
            setIsFinishing(false);
        }
    };

    return (
        <div className="flex flex-col items-center text-center space-y-8 py-10">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 animate-bounce">
                <PartyPopper className="h-10 w-10" />
            </div>

            <div className="space-y-4 max-w-md">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    You're all set!
                </h1>
                <p className="text-lg text-gray-600">
                    Your profile is ready and your learning experience has been personalized. Ready to dive in?
                </p>
            </div>

            <div className="w-full max-w-sm pt-4">
                <Button
                    className="w-full bg-[#446D6D] hover:bg-[#3A5F5F] text-white py-6 rounded-xl text-lg font-semibold shadow-lg shadow-[#446D6D]/20 transition-all hover:scale-[1.02]"
                    onClick={handleFinish}
                    disabled={isFinishing}
                >
                    {isFinishing ? 'Setting things up...' : 'Go to Dashboard'}
                </Button>
            </div>
        </div>
    );
}
