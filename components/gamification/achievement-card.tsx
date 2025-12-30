'use client';

import { Lock, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    isUnlocked: boolean;
    progress?: number;
    dateUnlocked?: string;
}

export function AchievementCard({
    title,
    description,
    icon,
    isUnlocked,
    progress,
    dateUnlocked
}: AchievementCardProps) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-xl border p-4 transition-all",
            isUnlocked
                ? "border-yellow-200 bg-gradient-to-br from-yellow-50 to-white"
                : "border-gray-200 bg-gray-50 opacity-70"
        )}>
            <div className="flex items-start gap-4">
                <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                    isUnlocked ? "bg-yellow-100 text-yellow-600" : "bg-gray-200 text-gray-400"
                )}>
                    {isUnlocked ? (icon || <Trophy className="h-6 w-6" />) : <Lock className="h-6 w-6" />}
                </div>

                <div className="flex-1">
                    <h3 className={cn("font-semibold", isUnlocked ? "text-gray-900" : "text-gray-500")}>
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500">{description}</p>

                    {isUnlocked && dateUnlocked && (
                        <p className="mt-2 text-xs text-yellow-600 font-medium">Unlocked on {dateUnlocked}</p>
                    )}

                    {!isUnlocked && progress !== undefined && (
                        <div className="mt-3">
                            <div className="mb-1 flex justify-between text-xs text-gray-500">
                                <span>Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-200">
                                <div
                                    className="h-full rounded-full bg-yellow-500 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
