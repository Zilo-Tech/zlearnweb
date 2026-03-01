'use client';

import { useGamification } from '@/lib/hooks/useGamification';
import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function LeaderboardPreview() {
    const { leaderboard, loadLeaderboard, isLoading } = useGamification();

    useEffect(() => {
        loadLeaderboard({ limit: 5, period: 'weekly' });
    }, [loadLeaderboard]);

    if (isLoading && leaderboard.length === 0) {
        return (
            <div className="rounded-xl border-2 border-primary-200 bg-white p-6 animate-pulse">
                <div className="h-6 w-32 bg-primary-100 rounded mb-4" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary-100" />
                            <div className="h-10 w-10 rounded-full bg-primary-100" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-primary-100 rounded" />
                                <div className="h-3 w-16 bg-primary-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border-2 border-primary-200 bg-white p-6">
            <h3 className="font-bold text-primary-900 tracking-tight mb-4 truncate uppercase text-sm">Top Learners</h3>
            <div className="space-y-4">
                {leaderboard.length > 0 ? (
                    leaderboard.map((entry: unknown, index: number) => {
                        const e = entry as { id?: string; profile_picture?: string; name?: string; total_xp?: number };
                        return (
                        <div key={e.id || index} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 font-bold text-xs text-primary-800">
                                {index + 1}
                            </div>
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={e.profile_picture} />
                                <AvatarFallback>{e.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">{e.name}</p>
                                <p className="text-xs text-gray-500 truncate">{e.total_xp?.toLocaleString() || 0} XP</p>
                            </div>
                        </div>
                        );
                    })
                ) : (
                    <div className="text-center py-4 text-sm text-gray-500">
                        No leaderboard data available.
                    </div>
                )}
            </div>
        </div>
    );
}
