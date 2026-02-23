'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';

type UserType = 'academic' | 'professional' | 'exams';

const OPTIONS: { type: UserType; title: string; description: string; icon: React.ReactNode; features: string[] }[] = [
    {
        type: 'exams',
        title: 'Examinations',
        description: 'Prepare for standardized exams like JAMB, SAT, and more',
        icon: <FileText className="h-7 w-7 text-primary-600" />,
        features: ['Mock exams & practice tests', 'Past papers & solutions', 'Track exam progress & scores'],
    },
    {
        type: 'professional',
        title: 'Professional',
        description: 'Learn new skills, advance your career, or change paths',
        icon: <Briefcase className="h-7 w-7 text-primary-600" />,
        features: ['Skill development & career growth', 'Flexible, self-paced learning', 'Industry-relevant courses'],
    },
    {
        type: 'academic',
        title: 'School & Curriculum',
        description: 'Follow your school curriculum and prepare for exams',
        icon: <BookOpen className="h-7 w-7 text-primary-600" />,
        features: ['Curriculum-aligned content', 'Exam preparation resources', 'Track academic progress'],
    },
];

export default function UserTypePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedType, setSelectedType] = useState<UserType | null>(null);

    const handleContinue = () => {
        if (!selectedType) return;
        dispatch(updateOnboardingData({ user_type: selectedType }));
        if (selectedType === 'academic') router.push('/onboarding/profile');
        else if (selectedType === 'professional') router.push('/onboarding/professional-background');
        else router.push('/onboarding/exams');
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">What brings you here?</h1>
                <p className="text-gray-500">Choose the learning path that best fits your needs.</p>
            </div>

            <div className="space-y-4">
                {OPTIONS.map((opt) => (
                    <button
                        key={opt.type}
                        type="button"
                        onClick={() => setSelectedType(opt.type)}
                        className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                            selectedType === opt.type
                                ? 'border-primary-500 bg-primary-50/80'
                                : 'border-primary-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
                        }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100">
                                {opt.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="font-bold text-gray-900">{opt.title}</h2>
                                <p className="text-sm text-gray-600 mt-0.5">{opt.description}</p>
                                <ul className="mt-3 space-y-1">
                                    {opt.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                            <span className="text-primary-500">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {selectedType === opt.type && (
                                <div className="h-6 w-6 shrink-0 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm">✓</div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    Back
                </Button>
                <Button onClick={handleContinue} disabled={!selectedType} size="lg">
                    Continue
                </Button>
            </div>
        </div>
    );
}
