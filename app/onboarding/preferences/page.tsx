'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';
import { completeOnboarding } from '@/lib/store/slices/auth.slice';
import { useToast } from '@/lib/hooks/useToast';

const INTERESTS = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Computer Science', 'Literature', 'History', 'Geography',
    'Economics', 'Business', 'Arts', 'Languages'
];

export default function PreferencesPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isSubmitting } = useAppSelector((state) => state.onboarding);
    const { toast } = useToast();
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const { data } = useAppSelector((state) => state.onboarding);

    // ...

    const handleComplete = async () => {
        try {
            const updatedData = { ...data, interests: selectedInterests };
            dispatch(updateOnboardingData({ interests: selectedInterests }));
            await dispatch(completeOnboarding(updatedData)).unwrap();

            toast({
                title: 'Onboarding complete!',
                description: 'Welcome to Z-Learn. Your personalized dashboard is ready.',
                variant: 'success',
            });

            router.push('/app/dashboard');
        } catch (error: any) {
            toast({
                title: 'Something went wrong',
                description: error.message || 'Could not complete onboarding. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">What are you interested in?</h1>
                <p className="text-gray-500">
                    Select subjects you want to focus on. We&apos;ll recommend relevant content.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {INTERESTS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                        <div
                            key={interest}
                            onClick={() => toggleInterest(interest)}
                            className={`
                cursor-pointer rounded-lg border p-4 text-center text-sm font-medium transition-all
                ${isSelected
                                    ? 'border-[#446D6D] bg-[#446D6D]/10 text-[#446D6D]'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }
              `}
                        >
                            {interest}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between pt-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                >
                    Back
                </Button>
                <Button
                    onClick={handleComplete}
                    disabled={selectedInterests.length === 0 || isSubmitting}
                    size="lg"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Finish Setup
                </Button>
            </div>
        </div>
    );
}
