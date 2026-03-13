'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useProgress } from '@/lib/hooks/useProgress';
import { usePersonalization } from '@/lib/hooks/usePersonalization';
import { Bell, Flame } from 'lucide-react';
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
    const userType = (user?.user_type?.toLowerCase?.() ?? '').trim();
    const isExamUser = userType === 'exams';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getFirstName = () => {
        if (user?.display_name) return (user.display_name as string).split(' ')[0];
        if (user?.first_name) return user.first_name as string;
        if (user?.name) return (user.name as string).split(' ')[0];
        if (user?.username) return user.username as string;
        return 'Learner';
    };

    const defaultMessage = isExamUser
        ? 'Ready to continue your exam prep today?'
        : 'Ready to continue your learning journey today?';

    const currentStreak = (learningAnalytics as { learning_insights?: { current_streak?: number } })?.learning_insights?.current_streak || 0;

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-black text-gray-900 md:text-3xl truncate tracking-tight">
                    {welcome?.title ?? `${getGreeting()}, ${getFirstName()}! 👋`}
                </h1>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                    {welcome?.message ?? defaultMessage}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <Flame className="h-6 w-6 text-orange-500" />
                    <div>
                        <p className="text-xs font-semibold text-orange-900 uppercase tracking-wide">
                            Streak
                        </p>
                        <p className="text-lg font-bold text-orange-700">
                            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                        </p>
                    </div>
                </div>

                <Button
                    size="icon"
                    variant="outline"
                    className="relative h-12 w-12 rounded-xl border-gray-200 hover:bg-gray-50"
                >
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </Button>
            </div>
        </div>
    );
}
