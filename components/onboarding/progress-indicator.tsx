'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

export function ProgressIndicator({ currentStep, totalSteps, className }: ProgressIndicatorProps) {
    const percentage = Math.round((currentStep / totalSteps) * 100);
    
    return (
        <div className={cn("w-full space-y-6", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-gray-900">
                        Step {currentStep} of {totalSteps}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {percentage}% Complete
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200">
                    <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                    <span className="text-xs font-semibold text-primary-700">In Progress</span>
                </div>
            </div>

            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner">
                <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
            </div>

            {totalSteps <= 7 && (
                <div className="flex justify-between gap-2">
                    {Array.from({ length: totalSteps }).map((_, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = stepNumber < currentStep;
                        const isCurrent = stepNumber === currentStep;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "relative flex h-10 w-10 items-center justify-center rounded-xl border-2 text-sm font-bold transition-all duration-300",
                                    isCompleted
                                        ? "border-primary-500 bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md scale-100"
                                        : isCurrent
                                            ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm scale-110"
                                            : "border-gray-200 bg-white text-gray-400 scale-95"
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-5 w-5" strokeWidth={3} />
                                ) : (
                                    stepNumber
                                )}
                                {isCurrent && (
                                    <div className="absolute -inset-1 rounded-xl bg-primary-200 -z-10 animate-pulse" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
