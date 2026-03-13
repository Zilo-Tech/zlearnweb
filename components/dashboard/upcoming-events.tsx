'use client';

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { fetchExamResults } from '@/lib/store/slices/exams.slice';
import { fetchForums } from '@/lib/store/slices/community.slice';
import { Calendar, Clock, BookOpen, Users } from 'lucide-react';

export function UpcomingEvents() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, token } = useAuth();
    const { results: examResults, isLoading: examsLoading } = useAppSelector((state) => state.exams || { results: [] });
    const { forums: communities, isLoading: communityLoading } = useAppSelector((state) => state.community || { forums: [] });

    useEffect(() => {
        if (isAuthenticated && token) {
            dispatch(fetchExamResults());
            dispatch(fetchForums({}));
        }
    }, [dispatch, isAuthenticated, token]);

    const upcomingEvents = useMemo(() => {
        const events = [];

        if (examResults.length === 0) {
            events.push({
                id: 'mock-exam-1',
                title: 'Physics Mid-term',
                type: 'exam',
                date: 'Tomorrow',
                time: '10:00 AM',
                color: 'bg-blue-50',
                iconBg: 'bg-blue-100',
                textColor: 'text-blue-900',
                iconColor: 'text-blue-600',
                icon: BookOpen
            });
        } else {
            examResults.slice(0, 2).forEach((result: any) => {
                events.push({
                    id: `exam-${result.id}`,
                    title: result.exam?.title || 'Exam',
                    type: 'exam',
                    date: new Date(result.completed_at).toLocaleDateString(),
                    time: new Date(result.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    color: 'bg-blue-50',
                    iconBg: 'bg-blue-100',
                    textColor: 'text-blue-900',
                    iconColor: 'text-blue-600',
                    icon: BookOpen
                });
            });
        }

        if (communities.length === 0) {
            events.push({
                id: 'mock-community-1',
                title: 'Study Group: Math',
                type: 'class',
                date: 'Wed',
                time: '2:00 PM',
                color: 'bg-purple-50',
                iconBg: 'bg-purple-100',
                textColor: 'text-purple-900',
                iconColor: 'text-purple-600',
                icon: Users
            });
        } else {
            communities.slice(0, 1).forEach((community: any) => {
                events.push({
                    id: `community-${community.id}`,
                    title: `${community.name} Session`,
                    type: 'class',
                    date: 'Today',
                    time: '7:00 PM',
                    color: 'bg-purple-50',
                    iconBg: 'bg-purple-100',
                    textColor: 'text-purple-900',
                    iconColor: 'text-purple-600',
                    icon: Users
                });
            });
        }

        return events;
    }, [examResults, communities]);

    if (examsLoading || communityLoading) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
                <div className="h-6 w-32 bg-gray-100 rounded mb-5" />
                <div className="space-y-3">
                    <div className="h-20 w-full bg-gray-50 rounded-xl" />
                    <div className="h-20 w-full bg-gray-50 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
                <Calendar className="h-5 w-5 text-gray-600" />
                <h3 className="font-bold text-gray-900">Upcoming</h3>
            </div>
            <div className="space-y-3">
                {upcomingEvents.map((event) => {
                    const Icon = event.icon;
                    return (
                        <div
                            key={event.id}
                            className={`rounded-xl ${event.color} p-4 border border-gray-200/50 hover:shadow-sm transition-all`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`rounded-lg p-2 ${event.iconBg} shrink-0`}>
                                    <Icon className={`h-4 w-4 ${event.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold ${event.textColor} truncate mb-1`}>
                                        {event.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {event.date}
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {event.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
