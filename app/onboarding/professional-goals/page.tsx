'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, TrendingUp, Award, Briefcase, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';
import { completeOnboarding } from '@/lib/store/slices/auth.slice';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const GOALS = [
    { id: 'skill_up', label: 'Upgrade specific skills', icon: <TrendingUp className="h-5 w-5" /> },
    { id: 'cert', label: 'Get certified for current job', icon: <Award className="h-5 w-5" /> },
    { id: 'switch', label: 'Switch to a new career', icon: <Briefcase className="h-5 w-5" /> },
    { id: 'promotion', label: 'Qualify for a promotion', icon: <Target className="h-5 w-5" /> },
    { id: 'own_business', label: 'Start my own business', icon: <TrendingUp className="h-5 w-5" /> },
];

export default function ProfessionalGoalsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const data = useAppSelector((state) => state.onboarding) as Record<string, unknown>;

    const handleComplete = async () => {
        if (selectedGoal) {
            try {
                setIsSubmitting(true);
                const updatedData = { ...data, goal: selectedGoal };
                dispatch(updateOnboardingData({ goal: selectedGoal }));
                await dispatch(completeOnboarding(updatedData)).unwrap();

                toast.success('Onboarding complete! Welcome to Z-Learn Professional. Your dashboard is ready.');

                router.push('/app/dashboard');
            } catch (error: unknown) {
                toast.error((error as Error)?.message || 'Could not complete onboarding. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">What are your professional goals?</h1>
                <p className="text-gray-500">
                    Select all that apply to you. This helps us suggest the best learning paths.
                </p>
            </div>

            <div className="space-y-3">
                {GOALS.map((goal) => (
                    <button
                        key={goal.id}
                        onClick={() => setSelectedGoal(goal.id)}
                        className={cn(
                            "w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all text-left",
                            selectedGoal === goal.id
                                ? "border-[#446D6D] bg-[#446D6D]/5 ring-1 ring-[#446D6D]"
                                : "border-gray-100 bg-white hover:border-gray-200"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                                selectedGoal === goal.id ? "bg-[#446D6D] text-white" : "bg-gray-100 text-gray-500"
                            )}>
                                {goal.icon}
                            </div>
                            <span className={cn(
                                "font-medium text-lg",
                                selectedGoal === goal.id ? "text-[#446D6D]" : "text-gray-700"
                            )}>
                                {goal.label}
                            </span>
                        </div>
                        {selectedGoal === goal.id && (
                            <div className="h-6 w-6 rounded-full bg-[#446D6D] flex items-center justify-center text-white">
                                <Check className="h-4 w-4" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex justify-between pt-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    Back
                </Button>
                <Button
                    onClick={handleComplete}
                    disabled={!selectedGoal}
                    size="lg"
                    className="bg-[#446D6D] hover:bg-[#3A5F5F] px-8"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
