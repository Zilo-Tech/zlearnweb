'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';

// This would typically come from constants or API based on education level
const CLASSES = [
    { id: 'form_1', name: 'Form 1', level: 'high_school' },
    { id: 'form_2', name: 'Form 2', level: 'high_school' },
    { id: 'form_3', name: 'Form 3', level: 'high_school' },
    { id: 'form_4', name: 'Form 4', level: 'high_school' },
    { id: 'form_5', name: 'Form 5', level: 'high_school' },
    { id: 'lower_6', name: 'Lower 6th', level: 'high_school' },
    { id: 'upper_6', name: 'Upper 6th', level: 'high_school' },
    { id: 'level_100', name: 'Level 100', level: 'university' },
    { id: 'level_200', name: 'Level 200', level: 'university' },
    { id: 'level_300', name: 'Level 300', level: 'university' },
    { id: 'level_400', name: 'Level 400', level: 'university' },
    { id: 'level_500', name: 'Level 500', level: 'university' },
];

export default function ClassSelectionPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data } = useAppSelector((state) => state.onboarding);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);

    // Filter classes based on education level
    const filteredClasses = CLASSES.filter((cls) => {
        if (data.education_level === 'university') {
            return cls.level === 'university';
        }
        return cls.level === 'high_school'; // Default to high school for now
    });

    const handleContinue = () => {
        if (selectedClass) {
            dispatch(updateOnboardingData({ class_level: selectedClass }));
            router.push('/onboarding/curriculum');
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Select your class/level</h1>
                <p className="text-gray-500">
                    Which level are you currently studying in?
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {filteredClasses.map((cls) => (
                    <SelectionCard
                        key={cls.id}
                        title={cls.name}
                        icon={<BookOpen className="h-6 w-6" />}
                        selected={selectedClass === cls.id}
                        onClick={() => setSelectedClass(cls.id)}
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
                    disabled={!selectedClass}
                    size="lg"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
