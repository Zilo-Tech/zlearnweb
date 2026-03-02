'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, TrendingUp, Award, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';

const CAREER_PATHS = [
    { id: 'tech', label: 'Technology & Software', icon: <Target className="h-6 w-6" /> },
    { id: 'business', label: 'Business & Management', icon: <TrendingUp className="h-6 w-6" /> },
    { id: 'finance', label: 'Finance & Accounting', icon: <Award className="h-6 w-6" /> },
    { id: 'health', label: 'Healthcare & Medicine', icon: <Briefcase className="h-6 w-6" /> },
    { id: 'others', label: 'Others', icon: <Target className="h-6 w-6" /> },
];

export default function CareerOrientationPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedPath, setSelectedPath] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedPath) {
            dispatch(updateOnboardingData({ program: selectedPath }));
            router.push('/onboarding/professional-background');
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">What is your career orientation?</h1>
                <p className="text-gray-500">
                    Select the field that best describes your professional focus.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {CAREER_PATHS.map((path) => (
                    <SelectionCard
                        key={path.id}
                        title={path.label}
                        icon={path.icon}
                        selected={selectedPath === path.id}
                        onClick={() => setSelectedPath(path.id)}
                    />
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
                    onClick={handleContinue}
                    disabled={!selectedPath}
                    size="lg"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
