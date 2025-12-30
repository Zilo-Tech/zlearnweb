'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Award, Users, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';
import { completeOnboarding } from '@/lib/store/slices/auth.slice';
import { useToast } from '@/lib/hooks/useToast';

const GOALS = [
    { id: 'upskill', name: 'Upskill for current job', icon: <TrendingUp className="h-6 w-6" /> },
    { id: 'certification', name: 'Get certified', icon: <Award className="h-6 w-6" /> },
    { id: 'career_change', name: 'Change career', icon: <Zap className="h-6 w-6" /> },
    { id: 'networking', name: 'Network with peers', icon: <Users className="h-6 w-6" /> },
];

export default function ProfessionalGoalsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isSubmitting } = useAppSelector((state) => state.onboarding);
    const { toast } = useToast();
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

    const { data } = useAppSelector((state) => state.onboarding);

    // ...

    const handleComplete = async () => {
        if (selectedGoal) {
            try {
                const updatedData = { ...data, goal: selectedGoal };
                dispatch(updateOnboardingData({ goal: selectedGoal }));
                await dispatch(completeOnboarding(updatedData)).unwrap();

                toast({
                    title: 'Onboarding complete!',
                    description: 'Welcome to Z-Learn Professional. Your dashboard is ready.',
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
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">What is your main goal?</h1>
                <p className="text-gray-500">
                    This helps us recommend the right courses and path for you.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {GOALS.map((goal) => (
                    <SelectionCard
                        key={goal.id}
                        title={goal.name}
                        icon={goal.icon}
                        selected={selectedGoal === goal.id}
                        onClick={() => setSelectedGoal(goal.id)}
                    />
                ))}
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
                    disabled={!selectedGoal || isSubmitting}
                    size="lg"
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Finish Setup
                </Button>
            </div>
        </div>
    );
}
