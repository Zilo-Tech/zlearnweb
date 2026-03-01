'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Code, Layers, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';

const PROGRAMS = [
    { id: 'undergrad', label: 'Undergraduate Program', icon: <BookOpen className="h-6 w-6" /> },
    { id: 'postgrad', label: 'Postgraduate Program', icon: <Layers className="h-6 w-6" /> },
    { id: 'professional_cert', label: 'Professional Certification', icon: <Award className="h-6 w-6" /> },
    { id: 'short_course', label: 'Short Skills Course', icon: <Code className="h-6 w-6" /> },
];

import { Award } from 'lucide-react';

export default function ProgramSelectionPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

    const handleContinue = () => {
        if (selectedProgram) {
            dispatch(updateOnboardingData({ program: selectedProgram }));
            router.push('/onboarding/education-level');
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Select your program</h1>
                <p className="text-gray-500">
                    Which level of study or certification are you pursuing?
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {PROGRAMS.map((program) => (
                    <SelectionCard
                        key={program.id}
                        title={program.label}
                        icon={program.icon}
                        selected={selectedProgram === program.id}
                        onClick={() => setSelectedProgram(program.id)}
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
                    disabled={!selectedProgram}
                    size="lg"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
