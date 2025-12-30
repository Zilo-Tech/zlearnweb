'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Code, Stethoscope, Scale, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';

const PROFESSIONS = [
    { id: 'tech', name: 'Technology & IT', icon: <Code className="h-6 w-6" /> },
    { id: 'business', name: 'Business & Finance', icon: <Briefcase className="h-6 w-6" /> },
    { id: 'health', name: 'Healthcare', icon: <Stethoscope className="h-6 w-6" /> },
    { id: 'law', name: 'Law & Legal', icon: <Scale className="h-6 w-6" /> },
    { id: 'engineering', name: 'Engineering', icon: <Calculator className="h-6 w-6" /> },
];

export default function ProfessionalBackgroundPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedProfession, setSelectedProfession] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedProfession) {
            dispatch(updateOnboardingData({ professional_background: selectedProfession }));
            router.push('/onboarding/professional-goals');
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">What is your field?</h1>
                <p className="text-gray-500">
                    Tell us about your professional background.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {PROFESSIONS.map((prof) => (
                    <SelectionCard
                        key={prof.id}
                        title={prof.name}
                        icon={prof.icon}
                        selected={selectedProfession === prof.id}
                        onClick={() => setSelectedProfession(prof.id)}
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
                    disabled={!selectedProfession}
                    size="lg"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
