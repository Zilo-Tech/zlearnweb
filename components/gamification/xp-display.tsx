'use client';

import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';

interface XPDisplayProps {
    currentXP: number;
    nextLevelXP: number;
    level: number;
    className?: string;
}

export function XPDisplay({ currentXP, nextLevelXP, level, className }: XPDisplayProps) {
    const progress = (currentXP / nextLevelXP) * 100;

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex items-center justify-between text-sm font-medium">
                <div className="flex items-center gap-1 text-[#446D6D]">
                    <Zap className="h-4 w-4 fill-[#446D6D]" />
                    <span>Level {level}</span>
                </div>
                <span className="text-gray-500">{currentXP} / {nextLevelXP} XP</span>
            </div>
            <Progress value={progress} className="h-2" />
        </div>
    );
}
