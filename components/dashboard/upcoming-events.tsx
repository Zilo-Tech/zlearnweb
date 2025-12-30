'use client';

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { useEffect, useMemo } from 'react';
import { fetchExamResults } from '@/lib/store/slices/exams.slice';
import { fetchForums } from '@/lib/store/slices/community.slice';
import { Calendar, Clock, BookOpen, Users } from 'lucide-react';

export function UpcomingEvents() {
    const dispatch = useAppDispatch();
    const { results: examResults, isLoading: examsLoading } = useAppSelector((state) => state.exams || { results: [] });
    const { forums: communities, isLoading: communityLoading } = useAppSelector((state) => state.community || { forums: [] });

    useEffect(() => {
        // In a real app, we might have a specific endpoint for upcoming events
        // For now, mirroring the mobile app logic
        dispatch(fetchExamResults());
        dispatch(fetchForums({}));
    }, [dispatch]);

    const upcomingEvents = useMemo(() => {
        const events = [];

        // Add mock upcoming exams if no real ones
        if (examResults.length === 0) {
            events.push({
                id: 'mock-exam-1',
                title: 'Physics Mid-term',
                type: 'exam',
                date: 'Tomorrow',
                time: '10:00 AM',
                color: 'bg-blue-50',
                textColor: 'text-blue-900',
                subColor: 'text-blue-700',
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
                    textColor: 'text-blue-900',
                    subColor: 'text-blue-700',
                    icon: BookOpen
                });
            });
        }

        // Add mock community events if no real ones
        if (communities.length === 0) {
            events.push({
                id: 'mock-community-1',
                title: 'Study Group: Math',
                type: 'class',
                date: 'Wed',
                time: '2:00 PM',
                color: 'bg-purple-50',
                textColor: 'text-purple-900',
                subColor: 'text-purple-700',
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
                    textColor: 'text-purple-900',
                    subColor: 'text-purple-700',
                    icon: Users
                });
            });
        }

        return events;
    }, [examResults, communities]);

    if (examsLoading || communityLoading) {
        return (
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm animate-pulse">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                <div className="space-y-4">
                    <div className="h-16 w-full bg-gray-100 rounded-lg" />
                    <div className="h-16 w-full bg-gray-100 rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming</h3>
            <div className="space-y-4">
                {upcomingEvents.map((event) => {
                    const Icon = event.icon;
                    return (
                        <div key={event.id} className={`rounded-lg ${event.color} p-3 flex items-start gap-3`}>
                            <div className={`mt-0.5 rounded-md p-1.5 bg-white/50 ${event.textColor}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${event.textColor} truncate`}>{event.title}</p>
                                <p className={`text-xs ${event.subColor}`}>{event.date}, {event.time}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
