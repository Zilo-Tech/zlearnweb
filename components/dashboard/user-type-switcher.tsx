'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { switchUserType } from '@/lib/store/slices/auth.slice';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/hooks/useToast';
import { useState, useEffect } from 'react';

export function UserTypeSwitcher() {
    const dispatch = useAppDispatch();
    const { user, isLoading } = useAppSelector((state) => state.auth);
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isProfessional = user?.user_type === 'professional';

    const handleSwitch = async () => {
        const target = isProfessional ? 'academic' : 'professional';
        try {
            await dispatch(switchUserType(target)).unwrap();
            toast({
                title: `Switched to ${target === 'professional' ? 'Professional' : 'Academic'} mode`,
                description: `You are now browsing ${target} content.`,
            });
        } catch (error: any) {
            toast({
                title: "Switch failed",
                description: error || "Failed to switch mode. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (!mounted) {
        return <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 animate-pulse h-[100px]" />;
    }

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl",
                        isProfessional ? "bg-teal-50 text-teal-600" : "bg-blue-50 text-blue-600"
                    )}>
                        {isProfessional ? <Briefcase className="h-6 w-6" /> : <GraduationCap className="h-6 w-6" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">
                            {isProfessional ? "Professional Mode" : "Academic Mode"}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {isProfessional
                                ? "Upskilling for your career"
                                : "Focusing on your studies"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        onClick={handleSwitch}
                        disabled={isLoading}
                        className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
                    >
                        Switch to {isProfessional ? "Academic" : "Professional"}
                    </Button>
                    <Button
                        className={cn(
                            "rounded-xl text-white w-full sm:w-auto",
                            isProfessional ? "bg-teal-600 hover:bg-teal-700" : "bg-[#446D6D] hover:bg-[#365757]"
                        )}
                    >
                        Explore <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
