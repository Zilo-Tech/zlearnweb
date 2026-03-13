'use client';

import { useGamification } from '@/lib/hooks/useGamification';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function LeaderboardPreview() {
    const { leaderboard, loadLeaderboard, isLoading } = useGamification();
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        if (isAuthenticated && token) {
            loadLeaderboard({ limit: 5, period: 'weekly' });
        }
    }, [loadLeaderboard, isAuthenticated, token]);

    if (isLoading && leaderboard.length === 0) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
                <div className="h-6 w-32 bg-gray-100 rounded mb-5" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-100" />
                            <div className="h-10 w-10 rounded-full bg-gray-100" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 bg-gray-100 rounded" />
                                <div className="h-3 w-16 bg-gray-100 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const medalColors = [
        'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white',
        'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700',
        'bg-gradient-to-br from-orange-400 to-orange-600 text-white',
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-bold text-gray-900">Top Learners</h3>
                </div>
                <Link 
                    href="/app/leaderboard"
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                    View all
                    <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <div className="space-y-3">
                {leaderboard.length > 0 ? (
                    leaderboard.map((entry: unknown, index: number) => {
                        const e = entry as { id?: string; profile_picture?: string; name?: string; total_xp?: number };
                        const isTopThree = index < 3;
                        return (
                            <div
                                key={e.id || index}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-xs shrink-0 ${
                                        isTopThree
                                            ? medalColors[index]
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {isTopThree ? <Trophy className="h-4 w-4" /> : index + 1}
                                </div>
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={e.profile_picture} />
                                    <AvatarFallback className="bg-primary-100 text-primary-700 font-semibold">
                                        {e.name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {e.name}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium">
                                        {e.total_xp?.toLocaleString() || 0} XP
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 text-sm text-gray-500">
                        No leaderboard data available.
                    </div>
                )}
            </div>
        </div>
    );
}
