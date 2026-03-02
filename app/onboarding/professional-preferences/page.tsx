'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Zap, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';

const PREFERENCES = [
    { id: 'part_time', label: 'Part-time Learning', description: '2-4 hours per week', icon: <Clock className="h-6 w-6 text-[#446D6D]" /> },
    { id: 'full_time', label: 'Full-time Learning', description: '10+ hours per week', icon: <Zap className="h-6 w-6 text-[#446D6D]" /> },
    { id: 'weekend', label: 'Weekend ONLY', description: 'Focused weekend sessions', icon: <Target className="h-6 w-6 text-[#446D6D]" /> },
    { id: 'flexible', label: 'Flexible / Self-paced', description: 'Learn whenever you can', icon: <Star className="h-6 w-6 text-[#446D6D]" /> },
];

export default function ProfessionalPreferencesPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedPref, setSelectedPref] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedPref) {
            dispatch(updateOnboardingData({ daily_study_time: selectedPref }));
            router.push('/onboarding/features');
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Learning Preferences</h1>
                <p className="text-gray-500">
                    How do you prefer to schedule your professional development?
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {PREFERENCES.map((pref) => (
                    <SelectionCard
                        key={pref.id}
                        title={pref.label}
                        description={pref.description}
                        icon={pref.icon}
                        selected={selectedPref === pref.id}
                        onClick={() => setSelectedPref(pref.id)}
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
                    disabled={!selectedPref}
                    size="lg"
                    className="bg-[#446D6D] hover:bg-[#3A5F5F]"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
