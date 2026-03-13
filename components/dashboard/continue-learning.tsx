'use client';

import Link from 'next/link';
import { Play, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/lib/hooks/useProgress';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCourses } from '@/lib/hooks/useCourses';
import { useEffect, useState } from 'react';

export function ContinueLearning() {
    const { userProgress, loadUserProgress, isLoading } = useProgress();
    const { enrolled, loadEnrolled, userType } = useCourses();
    const { isAuthenticated, token } = useAuth();
    const [enrollments, setEnrollments] = useState<any[] | null>(null);
    const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);

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
            <div className="rounded-2xl bg-white p-6 md:p-8 border border-gray-200 shadow-sm animate-pulse">
                <div className="h-7 w-48 bg-gray-100 rounded mb-6" />
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="h-40 w-full lg:w-56 bg-gray-100 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-4">
                        <div className="h-6 w-3/4 bg-gray-100 rounded" />
                        <div className="h-4 w-1/2 bg-gray-100 rounded" />
                        <div className="h-3 w-full bg-gray-100 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!rawCurrentCourse) {
        return (
            <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 p-8 border border-primary-200">
                <div className="text-center max-w-md mx-auto">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm">
                        <BookOpen className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Start Your Learning Journey
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Explore our courses and begin mastering new skills today.
                    </p>
                    <Link href="/app/courses">
                        <Button size="lg" className="font-semibold">
                            Browse Courses
                        </Button>
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
    const progressPercentage = Number(currentCourse.progress_percentage) || 0;
    const courseTitle = currentCourse.title || 'Untitled Course';
    const subjectName = currentCourse.subject?.name ?? 'Course';
    const lastAccessed = currentCourse.last_accessed;

    return (
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
                    <Link
                        href="/app/courses"
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                    >
                        View all courses
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="relative h-40 w-full lg:w-56 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 shadow-md">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-white opacity-80" />
                        </div>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute bottom-3 left-3 right-3">
                            <span className="inline-block rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-primary-900">
                                {subjectName}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="space-y-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                                    {courseTitle}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    Last accessed {new Date(String(lastAccessed || '')).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-gray-700">
                                        {Math.round(progressPercentage)}% Complete
                                    </span>
                                    {progressPercentage > 0 && (
                                        <span className="flex items-center gap-1 text-green-600 font-medium">
                                            <CheckCircle2 className="h-4 w-4" />
                                            In Progress
                                        </span>
                                    )}
                                </div>
                                <Progress value={progressPercentage} className="h-2.5" />
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link href={courseHref}>
                                <Button className="w-full sm:w-auto font-semibold bg-[#446D6D] hover:bg-[#3A5F5F]" size="lg">
                                    <Play className="mr-2 h-4 w-4 fill-current" />
                                    Continue Learning
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
