'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useProgress } from '@/lib/hooks/useProgress';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export function WelcomeHeader() {
    const { user } = useAuth();
    const { learningAnalytics, loadLearningAnalytics } = useProgress();

    useEffect(() => {
        loadLearningAnalytics();
    }, [loadLearningAnalytics]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const currentStreak = learningAnalytics?.learning_insights?.current_streak || 0;

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl truncate">
                    {getGreeting()}, {user?.name?.split(' ')[0] || 'Learner'}! 👋
                </h1>
                <p className="text-gray-500">
                    Ready to continue your learning journey today?
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-900">Daily Streak</p>
                    <p className="text-xs text-[#446D6D] font-bold">🔥 {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</p>
                </div>
                <Button size="icon" variant="outline" className="relative">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </Button>
            </div>
        </div>
    );
}
