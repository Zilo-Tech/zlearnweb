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
    badge?: string;
}

export function SelectionCard({
    title,
    description,
    icon,
    selected,
    onClick,
    className,
    badge,
}: SelectionCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "group relative w-full cursor-pointer rounded-2xl border-2 p-6 text-left transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-1",
                selected
                    ? "border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100/50 shadow-md ring-2 ring-primary-200"
                    : "border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/30",
                className
            )}
        >
            {selected && (
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md">
                    <Check className="h-5 w-5" strokeWidth={3} />
                </div>
            )}

            {badge && (
                <div className="absolute left-4 top-4 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-sm">
                    {badge}
                </div>
            )}

            <div className="flex items-start gap-4">
                {icon && (
                    <div className={cn(
                        "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                        selected 
                            ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md scale-110" 
                            : "bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600"
                    )}>
                        {icon}
                    </div>
                )}

                <div className="flex-1 space-y-1">
                    <h3 className={cn(
                        "font-bold text-lg transition-colors",
                        selected ? "text-primary-700" : "text-gray-900"
                    )}>
                        {title}
                    </h3>
                    {description && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {selected && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400/10 to-primary-600/10 pointer-events-none" />
            )}
        </button>
    );
}
