'use client';

import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/lib/hooks/useProgress';
import { useEffect } from 'react';

export function ContinueLearning() {
    const { userProgress, loadUserProgress, isLoading } = useProgress();

    useEffect(() => {
        loadUserProgress();
    }, [loadUserProgress]);

    const currentCourse = userProgress?.current_courses?.[0];

    if (isLoading && !currentCourse) {
        return (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
                <div className="flex flex-col gap-6 md:flex-row">
                    <div className="h-32 w-full bg-gray-200 rounded-xl md:w-48" />
                    <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/4 bg-gray-200 rounded" />
                        <div className="h-3 w-1/2 bg-gray-200 rounded" />
                        <div className="h-2 w-full bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!currentCourse) {
        return (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't started any courses yet.</p>
                    <Link href="/app/courses">
                        <Button>Browse Courses</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
                <Link href="/app/courses" className="text-sm font-medium text-[#446D6D] hover:underline">
                    View all
                </Link>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-center">
                {/* Course Thumbnail Placeholder */}
                <div className="h-32 w-full shrink-0 rounded-xl bg-[#446D6D] md:w-48 flex items-center justify-center text-white font-bold text-xl p-4 text-center">
                    {currentCourse.title}
                </div>

                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 truncate">{currentCourse.title}</h3>
                        <p className="text-sm text-gray-500">{currentCourse.subject.name}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{Math.round(currentCourse.progress_percentage)}% Complete</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Last accessed: {new Date(currentCourse.last_accessed).toLocaleDateString()}
                            </span>
                        </div>
                        <Progress value={currentCourse.progress_percentage} className="h-2" />
                    </div>
                </div>

                <Link href={`/app/courses/${currentCourse.id}`}>
                    <Button className="w-full md:w-auto shrink-0" size="lg">
                        <Play className="mr-2 h-4 w-4 fill-current" />
                        Resume
                    </Button>
                </Link>
            </div>
        </div>
    );
}
