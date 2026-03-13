'use client';

import { TrendingUp, Clock, Award, Target } from 'lucide-react';
import { useProgress } from '@/lib/hooks/useProgress';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect } from 'react';
import { ProgressCard } from './progress-card';

export function StudyInsights() {
    const { learningAnalytics, loadLearningAnalytics, isLoading } = useProgress();
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        if (isAuthenticated && token) {
            loadLearningAnalytics();
        }
    }, [loadLearningAnalytics, isAuthenticated, token]);

    const studyTime = (learningAnalytics as { study_time_analytics?: { total_study_time_hours?: number } })?.study_time_analytics?.total_study_time_hours || 0;
    const avgScore = (learningAnalytics as { performance_analytics?: { average_quiz_score?: number } })?.performance_analytics?.average_quiz_score || 0;
    const completionRate = (learningAnalytics as { performance_analytics?: { completion_rate?: number } })?.performance_analytics?.completion_rate || 0;
    const streak = (learningAnalytics as { learning_insights?: { current_streak?: number } })?.learning_insights?.current_streak || 0;

    const stats = [
        {
            label: 'Study Time',
            value: `${Math.round(studyTime)}h`,
            icon: Clock,
            colorScheme: 'blue' as const,
        },
        {
            label: 'Completion Rate',
            value: `${Math.round(completionRate * 100)}%`,
            icon: Target,
            colorScheme: 'green' as const,
        },
        {
            label: 'Average Score',
            value: `${Math.round(avgScore)}%`,
            icon: TrendingUp,
            colorScheme: 'purple' as const,
        },
        {
            label: 'Daily Streak',
            value: `${streak} days`,
            icon: Award,
            colorScheme: 'orange' as const,
        },
    ];

    if (isLoading && !learningAnalytics) {
        return (
            <div className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
                <p className="text-sm text-gray-500">This week</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <ProgressCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        colorScheme={stat.colorScheme}
                    />
                ))}
            </div>
        </div>
    );
}
