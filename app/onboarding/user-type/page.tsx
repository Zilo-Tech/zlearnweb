'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';

export default function UserTypeSelectionPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedType, setSelectedType] = useState<'academic' | 'professional' | null>(null);

    const handleContinue = () => {
        if (selectedType) {
            dispatch(updateOnboardingData({ user_type: selectedType }));
            router.push('/onboarding/country'); // Both paths start with country
        }
    };

    return (
        <div className="space-y-8 py-4">
            <div className="space-y-3">
                <h1 className="text-2xl font-bold text-gray-900">Choose your path</h1>
                <p className="text-gray-600 text-lg">
                    Are you studying in school or are you a professional looking to upgrade your skills?
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <SelectionCard
                    title="Student"
                    description="I'm currently in Primary, Secondary, or University"
                    icon={<GraduationCap className="h-8 w-8 text-[#446D6D]" />}
                    selected={selectedType === 'academic'}
                    onClick={() => setSelectedType('academic')}
                    className="p-8"
                />
                <SelectionCard
                    title="Professional"
                    description="I'm a graduate or professional seeking skills"
                    icon={<Briefcase className="h-8 w-8 text-[#446D6D]" />}
                    selected={selectedType === 'professional'}
                    onClick={() => setSelectedType('professional')}
                    className="p-8"
                />
            </div>

            <div className="flex justify-between pt-8 border-t">
                <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => router.back()}
                >
                    Back
                </Button>
                <Button
                    onClick={handleContinue}
                    disabled={!selectedType}
                    size="lg"
                    className="bg-[#446D6D] hover:bg-[#3A5F5F] px-8"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
