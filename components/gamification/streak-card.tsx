'use client';

import { Flame } from 'lucide-react';

interface StreakCardProps {
    streak: number;
    isActive: boolean;
}

export function StreakCard({ streak, isActive }: StreakCardProps) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                <Flame className={`h-6 w-6 ${isActive ? 'fill-white' : ''}`} />
            </div>
            <div>
                <p className="text-sm font-medium text-orange-900">Day Streak</p>
                <p className="text-2xl font-bold text-orange-600">{streak} Days</p>
            </div>
        </div>
    );
}
