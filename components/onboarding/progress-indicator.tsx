'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

export function ProgressIndicator({ currentStep, totalSteps, className }: ProgressIndicatorProps) {
    return (
        <div className={cn("w-full space-y-4", className)}>
            <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>

            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full bg-[#446D6D] transition-all duration-500 ease-in-out"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
            </div>

            <div className="flex justify-between">
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                                isCompleted
                                    ? "border-[#446D6D] bg-[#446D6D] text-white"
                                    : isCurrent
                                        ? "border-[#446D6D] text-[#446D6D]"
                                        : "border-gray-200 text-gray-400"
                            )}
                        >
                            {isCompleted ? <Check className="h-4 w-4" /> : stepNumber}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
