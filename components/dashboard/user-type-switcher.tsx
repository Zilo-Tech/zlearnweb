'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { switchUserType } from '@/lib/store/slices/auth.slice';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, FileText, ArrowRight } from 'lucide-react';
import { useToast } from '@/lib/hooks/useToast';
import { useState, useEffect } from 'react';

type UserType = 'academic' | 'professional' | 'exams';

const LABELS: Record<UserType, { title: string; subtitle: string }> = {
    academic: { title: 'Academic Mode', subtitle: 'Focusing on your studies' },
    professional: { title: 'Professional Mode', subtitle: 'Upskilling for your career' },
    exams: { title: 'Exams Mode', subtitle: 'Preparing for entrance exams' },
};

export function UserTypeSwitcher() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { user, isLoading } = useAppSelector((state) => state.auth);
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const rawType = user?.user_type?.toLowerCase()?.trim();
    const currentType: UserType =
        rawType === 'professional' ? 'professional'
            : rawType === 'exams' ? 'exams'
            : 'academic';

    const labels = LABELS[currentType];
    const otherTypes: UserType[] =
        currentType === 'exams' ? ['academic', 'professional']
            : currentType === 'professional' ? ['academic', 'exams']
            : ['professional', 'exams'];

    const handleSwitch = async (target: UserType) => {
        try {
            dispatch(switchUserType(target));
            const name = target === 'exams' ? 'Exams' : target === 'professional' ? 'Professional' : 'Academic';
            toast({
                title: `Switched to ${name} mode`,
                description: `You are now browsing ${name.toLowerCase()} content.`,
            });
            // Redirect to type-specific onboarding if this type is not yet complete (aligned with mobile)
            const byType = (user as { onboarding_complete_by_type?: Record<string, boolean> })?.onboarding_complete_by_type;
            const isCompleteForTarget = byType && typeof byType[target] === 'boolean' ? byType[target] : true;
            if (!isCompleteForTarget) {
                if (target === 'academic') router.push('/onboarding/profile');
                else if (target === 'professional') router.push('/onboarding/professional-background');
                else if (target === 'exams') router.push('/onboarding/exams');
            }
        } catch (error: unknown) {
            toast({
                title: 'Switch failed',
                description: (error as Error)?.message || 'Failed to switch mode. Please try again.',
                variant: 'destructive',
            });
        }
    };

    if (!mounted) {
        return <div className="rounded-2xl bg-white p-6 border-2 border-primary-200 animate-pulse h-[100px]" />;
    }

    return (
        <div className="rounded-2xl bg-white p-6 border-2 border-primary-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 shrink-0">
                        {currentType === 'exams' ? (
                            <FileText className="h-6 w-6" />
                        ) : currentType === 'professional' ? (
                            <Briefcase className="h-6 w-6" />
                        ) : (
                            <GraduationCap className="h-6 w-6" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-primary-900 tracking-tight">
                            {labels.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {labels.subtitle}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    {otherTypes.map((target) => (
                        <Button
                            key={target}
                            variant="outline"
                            onClick={() => handleSwitch(target)}
                            disabled={isLoading}
                            className="rounded-xl w-full sm:w-auto"
                        >
                            Switch to {target === 'exams' ? 'Exams' : target === 'professional' ? 'Professional' : 'Academic'}
                        </Button>
                    ))}
                    <Button asChild className="rounded-xl w-full sm:w-auto font-semibold">
                        <Link href={currentType === 'exams' ? '/app/exams' : '/app/courses'}>
                            Explore <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
