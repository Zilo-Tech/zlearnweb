'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';

const CURRICULA = [
    {
        id: 'francophone',
        name: 'Francophone Sub-system',
        description: 'French-based curriculum'
    },
    {
        id: 'anglophone',
        name: 'Anglophone Sub-system',
        description: 'English-based curriculum'
    },
    {
        id: 'bilingual',
        name: 'Bilingual System',
        description: 'Combined English and French curriculum'
    },
];

export default function CurriculumSelectionPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedCurriculum, setSelectedCurriculum] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedCurriculum) {
            dispatch(updateOnboardingData({ curricula: [selectedCurriculum] }));
            router.push('/onboarding/preferences');
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Select your curriculum</h1>
                <p className="text-gray-500">
                    Choose the educational system you are following.
                </p>
            </div>

            <div className="grid gap-4">
                {CURRICULA.map((curr) => (
                    <SelectionCard
                        key={curr.id}
                        title={curr.name}
                        description={curr.description}
                        icon={<Globe className="h-6 w-6" />}
                        selected={selectedCurriculum === curr.id}
                        onClick={() => setSelectedCurriculum(curr.id)}
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
                    disabled={!selectedCurriculum}
                    size="lg"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
