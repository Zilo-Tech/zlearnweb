'use client';

import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/lib/hooks/useProgress';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect } from 'react';

export function ContinueLearning() {
    const { userProgress, loadUserProgress, isLoading } = useProgress();
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        if (isAuthenticated && token) {
            loadUserProgress();
        }
    }, [loadUserProgress, isAuthenticated, token]);

    const currentCourse = userProgress?.current_courses?.[0];

    if (isLoading && !currentCourse) {
        return (
            <div className="rounded-2xl bg-white p-6 border-2 border-primary-200 animate-pulse">
                <div className="h-6 w-48 bg-primary-100 rounded mb-4" />
                <div className="flex flex-col gap-6 md:flex-row">
                    <div className="h-32 w-full bg-primary-100 rounded-xl md:w-48" />
                    <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/4 bg-primary-100 rounded" />
                        <div className="h-3 w-1/2 bg-primary-100 rounded" />
                        <div className="h-2 w-full bg-primary-100 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!currentCourse) {
        return (
            <div className="rounded-2xl bg-white p-6 border-2 border-primary-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-primary-900 tracking-tight">Continue Learning</h2>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven&apos;t started any courses yet.</p>
                    <Link href="/app/courses">
                        <Button>Browse Courses</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-white p-6 border-2 border-primary-200">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-primary-900 tracking-tight">Continue Learning</h2>
                <Link href="/app/courses" className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:underline">
                    View all
                </Link>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="h-32 w-full shrink-0 rounded-xl bg-primary-700 md:w-48 flex items-center justify-center text-white font-bold text-xl p-4 text-center">
                    {(currentCourse as { title?: string }).title}
                </div>

                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 truncate">{(currentCourse as { title?: string }).title}</h3>
                        <p className="text-sm text-gray-600">{(currentCourse as { subject?: { name?: string } })?.subject?.name ?? 'Course'}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>{Math.round(Number((currentCourse as { progress_percentage?: number }).progress_percentage) || 0)}% Complete</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Last accessed: {new Date(String((currentCourse as { last_accessed?: string | number }).last_accessed || '')).toLocaleDateString()}
                            </span>
                        </div>
                        <Progress value={Number((currentCourse as { progress_percentage?: number }).progress_percentage) ?? 0} className="h-2" />
                    </div>
                </div>

                <Link href={`/app/courses/${(currentCourse as { id?: string }).id ?? ''}`}>
                    <Button className="w-full md:w-auto shrink-0 font-semibold" size="lg">
                        <Play className="mr-2 h-4 w-4 fill-current" />
                        Resume
                    </Button>
                </Link>
            </div>
        </div>
    );
}
