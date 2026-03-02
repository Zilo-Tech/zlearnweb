'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useProgress } from '@/lib/hooks/useProgress';
import { usePersonalization } from '@/lib/hooks/usePersonalization';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export function WelcomeHeader() {
    const { user, isAuthenticated, token } = useAuth();
    const { learningAnalytics, loadLearningAnalytics } = useProgress();
    const { dashboard, loadDashboard } = usePersonalization();

    useEffect(() => {
        if (isAuthenticated && token) {
            loadLearningAnalytics();
        }
    }, [loadLearningAnalytics, isAuthenticated, token]);
    
    useEffect(() => {
        if (isAuthenticated && token) {
            loadDashboard();
        }
    }, [loadDashboard, isAuthenticated, token]);

    const welcome = dashboard?.welcome_message as { title?: string; message?: string; context?: string } | undefined;
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const currentStreak = (learningAnalytics as { learning_insights?: { current_streak?: number } })?.learning_insights?.current_streak || 0;

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-black text-gray-900 md:text-3xl truncate tracking-tight">
                    {welcome?.title ?? `${getGreeting()}, ${user?.name?.split(' ')[0] || 'Learner'}! 👋`}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                    {welcome?.message ?? 'Ready to continue your learning journey today?'}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                    <p className="text-xs font-bold text-primary-900 uppercase tracking-widest">Daily Streak</p>
                    <p className="text-sm font-bold text-primary-600">🔥 {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</p>
                </div>
                <Button size="icon" variant="outline" className="relative border-2 border-primary-200 hover:bg-primary-50">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </Button>
            </div>
        </div>
    );
}
