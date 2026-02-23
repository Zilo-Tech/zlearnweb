'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, BookOpen, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';
import { EDUCATION_LEVELS } from '@/lib/constants';

export default function EducationLevelPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedLevel) {
            dispatch(updateOnboardingData({ education_level: selectedLevel }));
            if (selectedLevel === 'university') {
                router.push('/onboarding/school');
            } else {
                router.push('/onboarding/school');
            }
        }
    };

    // Academic path only: exclude 'professional' (chosen at user-type)
    const academicLevels = EDUCATION_LEVELS.filter((l) => l.id !== 'professional');

    const getIcon = (id: string) => {
        switch (id) {
            case 'university': return <GraduationCap className="h-6 w-6" />;
            case 'high_school': return <School className="h-6 w-6" />;
            case 'primary': return <BookOpen className="h-6 w-6" />;
            default: return <BookOpen className="h-6 w-6" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">What is your education level?</h1>
                <p className="text-gray-500">
                    This helps us tailor the learning experience to your needs.
                </p>
            </div>

            <div className="grid gap-4">
                {academicLevels.map((level) => (
                    <SelectionCard
                        key={level.id}
                        title={level.name}
                        description={level.description}
                        icon={getIcon(level.id)}
                        selected={selectedLevel === level.id}
                        onClick={() => setSelectedLevel(level.id)}
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
                    disabled={!selectedLevel}
                    size="lg"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
