'use client';

import { TrendingUp, Clock, Award, Target } from 'lucide-react';
import { useProgress } from '@/lib/hooks/useProgress';
import { useEffect } from 'react';

export function StudyInsights() {
    const { learningAnalytics, loadLearningAnalytics, isLoading } = useProgress();

    useEffect(() => {
        loadLearningAnalytics();
    }, [loadLearningAnalytics]);

    const studyTime = learningAnalytics?.study_time_analytics?.total_study_time_hours || 0;
    const avgScore = learningAnalytics?.performance_analytics?.average_quiz_score || 0;
    const completionRate = learningAnalytics?.performance_analytics?.completion_rate || 0;
    const streak = learningAnalytics?.learning_insights?.current_streak || 0;

    const stats = [
        {
            label: 'Time Spent',
            value: `${studyTime}h`,
            change: '', // Backend doesn't provide change yet
            trend: 'up',
            icon: Clock,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Completion Rate',
            value: `${Math.round(completionRate * 100)}%`,
            change: '',
            trend: 'up',
            icon: Target,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            label: 'Average Score',
            value: `${Math.round(avgScore)}%`,
            change: '',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            label: 'Current Streak',
            value: `${streak}`,
            change: '',
            trend: 'up',
            icon: Award,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Insights</h2>
            <div className="grid grid-cols-1 min-[320px]:grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className={`rounded-lg ${stat.bg} p-2 ${stat.color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
