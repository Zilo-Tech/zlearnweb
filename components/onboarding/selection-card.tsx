'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface SelectionCardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    selected?: boolean;
    onClick?: () => void;
    className?: string;
}

export function SelectionCard({
    title,
    description,
    icon,
    selected,
    onClick,
    className,
}: SelectionCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative cursor-pointer rounded-xl border-2 p-6 transition-all hover:border-[#446D6D]/50 hover:bg-gray-50",
                selected
                    ? "border-[#446D6D] bg-[#446D6D]/5 ring-1 ring-[#446D6D]"
                    : "border-gray-200 bg-white",
                className
            )}
        >
            {selected && (
                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#446D6D] text-white">
                    <Check className="h-4 w-4" />
                </div>
            )}

            <div className="flex items-start gap-4">
                {icon && (
                    <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                        selected ? "bg-[#446D6D]/10 text-[#446D6D]" : "bg-gray-100 text-gray-500"
                    )}>
                        {icon}
                    </div>
                )}

                <div className="space-y-1">
                    <h3 className={cn(
                        "font-semibold",
                        selected ? "text-[#446D6D]" : "text-gray-900"
                    )}>
                        {title}
                    </h3>
                    {description && (
                        <p className="text-sm text-gray-500">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
