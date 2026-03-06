'use client';

import Link from 'next/link';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/lib/hooks/useProgress';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect, useState } from 'react';
import { apiService } from '@/lib/services/api.service';

export function ContinueLearning() {
    const { userProgress, loadUserProgress, isLoading } = useProgress();
    const { isAuthenticated, token } = useAuth();
    const [enrollments, setEnrollments] = useState<any[] | null>(null);
    const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && token) {
            loadUserProgress();
        }
    }, [loadUserProgress, isAuthenticated, token]);

    // Fetch user's enrollments and prefer showing them in the Continue Learning block.
    useEffect(() => {
        let cancelled = false;
        async function loadEnrollments() {
            if (!isAuthenticated) return;
            setEnrollmentsLoading(true);
            try {
                const res = await apiService.get<unknown>('/content/enrollments/');
                // Support both array responses and paginated { results: [] }
                const data = Array.isArray(res) ? res : (res && (res as any).results ? (res as any).results : []);
                if (!cancelled) {
                    const final = Array.isArray(data) ? data : [];
                    if (process.env.NODE_ENV === 'development') console.log('📚 Enrollments loaded:', final.length, final);
                    setEnrollments(final);
                }
            } catch (err) {
                if (!cancelled) setEnrollments([]);
            } finally {
                if (!cancelled) setEnrollmentsLoading(false);
            }
        }
        loadEnrollments();
        return () => {
            cancelled = true;
        };
    }, [isAuthenticated]);

    // Prefer enrollments from the enrollments endpoint. If there are enrollments,
    // show the first one as the primary "continue" course. Otherwise fall back to
    // the progress-based current course (legacy).
    const currentEnrollment = enrollments && enrollments.length > 0 ? enrollments[0] : null;
    const currentCourse = currentEnrollment ? (
        // enrollment shape may vary; try common nested shapes
        (currentEnrollment.course ?? currentEnrollment) as any
    ) : userProgress?.current_courses?.[0];

    // Loading state: if either progress or enrollments are loading and we don't
    // yet have a course to show, display pulse skeleton.
    if ((isLoading || enrollmentsLoading) && !currentCourse) {
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

            <div className="flex flex-col gap-6">
                {/* If there are multiple enrollments, show them as a responsive grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(enrollments && enrollments.length > 0 ? enrollments : [userProgress?.current_courses?.[0]]).map((item: any, idx: number) => {
                        const course = (item && (item.course ?? item)) || null;
                        if (!course) return null;
                        const progress = Number(item.progress_percentage ?? course.progress_percentage ?? 0) || 0;
                        const lastAccessed = item.last_accessed ?? course.last_accessed ?? null;
                        const image = course.thumbnail ?? course.image ?? null;
                        return (
                            <div key={course.id ?? idx} className="rounded-lg border p-4 bg-white flex items-center gap-4">
                                <div className="h-20 w-28 rounded-md overflow-hidden bg-primary-100 flex-shrink-0">
                                    {image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={image} alt={course.title ?? 'Course'} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-primary-700 font-bold">{(course.title || '').slice(0,2)}</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                                    <p className="text-sm text-gray-600 truncate">{course.subject?.name ?? course.category ?? 'Course'}</p>
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                            <span>{Math.round(progress)}% Complete</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {lastAccessed ? new Date(String(lastAccessed)).toLocaleDateString() : 'Not started'}
                                            </span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <Link href={`/app/courses/${course.id ?? ''}`}>
                                        <Button className="font-semibold" size="sm">
                                            <Play className="mr-2 h-4 w-4 fill-current" />
                                            Resume
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
