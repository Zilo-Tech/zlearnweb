'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    colorScheme?: 'blue' | 'green' | 'purple' | 'orange' | 'primary';
    className?: string;
}

const colorSchemes = {
    blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        iconBg: 'bg-blue-100',
        trendBg: 'bg-blue-50',
        trendText: 'text-blue-700',
    },
    green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        iconBg: 'bg-green-100',
        trendBg: 'bg-green-50',
        trendText: 'text-green-700',
    },
    purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        iconBg: 'bg-purple-100',
        trendBg: 'bg-purple-50',
        trendText: 'text-purple-700',
    },
    orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        iconBg: 'bg-orange-100',
        trendBg: 'bg-orange-50',
        trendText: 'text-orange-700',
    },
    primary: {
        bg: 'bg-primary-50',
        text: 'text-primary-600',
        iconBg: 'bg-primary-100',
        trendBg: 'bg-primary-50',
        trendText: 'text-primary-700',
    },
};

export function ProgressCard({
    label,
    value,
    icon: Icon,
    trend,
    trendValue,
    colorScheme = 'primary',
    className,
}: ProgressCardProps) {
    const colors = colorSchemes[colorScheme];

    return (
        <div
            className={cn(
                'rounded-xl bg-white border border-gray-200 p-5 transition-all hover:shadow-md hover:border-gray-300',
                className
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={cn('rounded-lg p-2.5', colors.iconBg)}>
                    <Icon className={cn('h-5 w-5', colors.text)} />
                </div>
                {trendValue && (
                    <span
                        className={cn(
                            'text-xs font-semibold px-2.5 py-1 rounded-full',
                            colors.trendBg,
                            colors.trendText
                        )}
                    >
                        {trendValue}
                    </span>
                )}
            </div>

            <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
                <p className="text-sm font-medium text-gray-600">{label}</p>
            </div>
        </div>
    );
}
