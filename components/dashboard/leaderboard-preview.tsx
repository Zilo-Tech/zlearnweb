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
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-200" />
                            <div className="h-10 w-10 rounded-full bg-gray-200" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-gray-200 rounded" />
                                <div className="h-3 w-16 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 truncate">Top Learners</h3>
            <div className="space-y-4">
                {leaderboard.length > 0 ? (
                    leaderboard.map((user, index) => (
                        <div key={user.id || index} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-xs text-gray-600">
                                {index + 1}
                            </div>
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={user.profile_picture} />
                                <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.total_xp?.toLocaleString() || 0} XP</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-sm text-gray-500">
                        No leaderboard data available.
                    </div>
                )}
            </div>
        </div>
    );
}
