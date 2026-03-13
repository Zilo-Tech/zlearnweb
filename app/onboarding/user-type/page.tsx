'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Briefcase, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';
import { cn } from '@/lib/utils';

type UserType = 'academic' | 'professional' | 'exams';

const OPTIONS: { 
    type: UserType; 
    title: string; 
    description: string; 
    icon: React.ComponentType<any>;
    iconColor: string;
    gradient: string;
    features: string[] 
}[] = [
    {
        type: 'exams',
        title: 'Examinations',
        description: 'Prepare for standardized exams like JAMB, SAT, and more',
        icon: FileText,
        iconColor: 'text-blue-600',
        gradient: 'from-blue-500 to-blue-600',
        features: ['Mock exams & practice tests', 'Past papers & solutions', 'Track exam progress & scores'],
    },
    {
        type: 'professional',
        title: 'Professional',
        description: 'Learn new skills, advance your career, or change paths',
        icon: Briefcase,
        iconColor: 'text-purple-600',
        gradient: 'from-purple-500 to-purple-600',
        features: ['Skill development & career growth', 'Flexible, self-paced learning', 'Industry-relevant courses'],
    },
    {
        type: 'academic',
        title: 'School & Curriculum',
        description: 'Follow your school curriculum and prepare for exams',
        icon: BookOpen,
        iconColor: 'text-green-600',
        gradient: 'from-green-500 to-green-600',
        features: ['Curriculum-aligned content', 'Exam preparation resources', 'Track academic progress'],
    },
];

export default function UserTypePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [selectedType, setSelectedType] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        if (!selectedType) return;
        setIsLoading(true);
        try {
            dispatch(updateOnboardingData({ user_type: selectedType }));
            // Small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 300));
            if (selectedType === 'academic') router.push('/onboarding/profile');
            else if (selectedType === 'professional') router.push('/onboarding/professional-background');
            else router.push('/onboarding/exams');
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-2 shadow-lg">
                    <Sparkles className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome to Z-Learn!</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Choose the learning path that best fits your needs and goals.
                </p>
            </div>

            <div className="space-y-4">
                {OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                        <button
                            key={opt.type}
                            type="button"
                            onClick={() => setSelectedType(opt.type)}
                            disabled={isLoading}
                            className={cn(
                                "group w-full rounded-2xl border-2 p-6 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                                selectedType === opt.type
                                    ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100/50 shadow-md ring-2 ring-primary-200'
                                    : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/30',
                                isLoading && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            <div className="flex items-start gap-5">
                                <div className={cn(
                                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-xl transition-all duration-300 shadow-md",
                                    selectedType === opt.type
                                        ? `bg-gradient-to-br ${opt.gradient} text-white scale-110`
                                        : "bg-gray-100 text-gray-500 group-hover:bg-primary-100"
                                )}>
                                    <Icon className="h-8 w-8" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h2 className={cn(
                                            "font-bold text-xl transition-colors",
                                            selectedType === opt.type ? "text-primary-700" : "text-gray-900"
                                        )}>
                                            {opt.title}
                                        </h2>
                                        {selectedType === opt.type && (
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md shrink-0">
                                                <ArrowRight className="h-5 w-5" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{opt.description}</p>
                                    <ul className="space-y-2">
                                        {opt.features.map((f) => (
                                            <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                                                <div className={cn(
                                                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5",
                                                    selectedType === opt.type
                                                        ? "bg-primary-500 text-white"
                                                        : "bg-gray-200 text-gray-600"
                                                )}>
                                                    <span className="text-xs font-bold">✓</span>
                                                </div>
                                                <span className="flex-1">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <Button variant="ghost" onClick={() => router.back()} disabled={isLoading} className="font-semibold">
                    Back
                </Button>
                <Button 
                    onClick={handleContinue} 
                    disabled={!selectedType || isLoading}
                    loading={isLoading}
                    size="lg"
                    className="font-semibold px-8"
                >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
