'use client';

import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/lib/hooks/useProgress';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCourses } from '@/lib/hooks/useCourses';
import { useEffect } from 'react';

export function ContinueLearning() {
    const { userProgress, loadUserProgress, isLoading } = useProgress();
    const { enrolled, loadEnrolled, userType } = useCourses();
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        if (isAuthenticated && token) {
            loadUserProgress();
            loadEnrolled();
        }
    }, [loadUserProgress, loadEnrolled, isAuthenticated, token]);

    // Try analytics endpoint first; fall back to most-recently-started enrolled course
    const analyticsCurrentCourse = userProgress?.current_courses?.[0];

    // Find the enrolled course with the highest progress (or first one)
    const enrolledCurrentCourse = enrolled.length > 0
        ? [...enrolled].sort((a, b) => {
            const pa = Number((a as { progress_percentage?: number }).progress_percentage ?? 0);
            const pb = Number((b as { progress_percentage?: number }).progress_percentage ?? 0);
            if (pa !== pb) return pb - pa; // highest progress first
            return 0;
        })[0]
        : null;

    const rawCurrentCourse = analyticsCurrentCourse ?? enrolledCurrentCourse;

    // Determine course URL — professional uses slug, academic uses UUID
    const courseId = (rawCurrentCourse as { id?: string })?.id ?? '';
    const courseSlug = (rawCurrentCourse as { slug?: string })?.slug ?? '';
    const courseHref = `/app/courses/${userType === 'professional' ? (courseSlug || courseId) : courseId}`;

    if (isLoading && !rawCurrentCourse) {
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

    if (!rawCurrentCourse) {
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

    const currentCourse = rawCurrentCourse as {
        id?: string;
        title?: string;
        slug?: string;
        subject?: { name?: string };
        progress_percentage?: number;
        last_accessed?: string | number;
        thumbnail?: string;
    };

    return (
        <div className="rounded-2xl bg-white p-6 border-2 border-primary-200">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-primary-900 tracking-tight">Continue Learning</h2>
                <Link href="/app/courses" className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:underline">
                    View all
                </Link>
            </div>

            <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="h-32 w-full shrink-0 rounded-xl overflow-hidden md:w-48">
                    {currentCourse.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={currentCourse.thumbnail} alt={currentCourse.title ?? 'Course'} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-[#446D6D] flex items-center justify-center text-white font-bold text-sm p-4 text-center">
                            {currentCourse.title}
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="font-semibold text-gray-900 truncate">{currentCourse.title}</h3>
                        <p className="text-sm text-gray-600">{currentCourse.subject?.name ?? 'Course'}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>{Math.round(Number(currentCourse.progress_percentage) || 0)}% Complete</span>
                            {currentCourse.last_accessed && (
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(String(currentCourse.last_accessed)).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <Progress value={Number(currentCourse.progress_percentage) ?? 0} className="h-2" />
                    </div>
                </div>

                <Link href={courseHref}>
                    <Button className="w-full md:w-auto shrink-0 font-semibold bg-[#446D6D] hover:bg-[#3A5F5F]" size="lg">
                        <Play className="mr-2 h-4 w-4 fill-current" />
                        Resume
                    </Button>
                </Link>
            </div>
        </div>
    );
}
