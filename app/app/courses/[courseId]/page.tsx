'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModuleList } from '@/components/courses/module-list';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Award, Clock, BookOpen, Star, Share2, ArrowLeft } from 'lucide-react';
import { useCourses } from '@/lib/hooks/useCourses';
import { useAuth } from '@/lib/hooks/useAuth';
import { getCourseService } from '@/lib/services/courses.service';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';

function mapLessons(lessons: any[], completedIds?: Set<string>): { id: string; title: string; type: 'video' | 'text' | 'quiz'; duration: string; isCompleted: boolean; isLocked: boolean }[] {
    if (!Array.isArray(lessons)) return [];
    return lessons.map((l: any) => ({
        id: String(l.id),
        title: l.title || 'Lesson',
        type: (l.content_type === 'quiz' || l.lesson_type === 'quiz' ? 'quiz' : l.content_type === 'video' || l.lesson_type === 'video' ? 'video' : 'text') as 'video' | 'text' | 'quiz',
        duration: l.duration ? `${l.duration}m` : (l.duration_minutes != null ? `${l.duration_minutes}m` : '—'),
        isCompleted: completedIds ? completedIds.has(String(l.id)) : !!l.is_completed,
        isLocked: !!l.is_locked,
    }));
}

function mapModules(
    modules: any[],
    courseSlug: string,
    fetchedLessons: Record<string, any[]> = {},
    completedLessonIds?: Set<string>,
    completedModuleIds?: Set<string>
): { id: string; title: string; isCompleted: boolean; lessons: ReturnType<typeof mapLessons> }[] {
    if (!Array.isArray(modules)) return [];
    return modules.map((m: any) => {
        const lessons = (m.lessons?.length ? m.lessons : fetchedLessons[String(m.id)]) || [];
        return {
            id: String(m.id),
            title: m.title || 'Module',
            isCompleted: completedModuleIds ? completedModuleIds.has(String(m.id)) : !!m.is_completed,
            lessons: mapLessons(lessons, completedLessonIds),
        };
    });
}

export default function CourseDetailsPage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = use(params);
    const { user } = useAuth();
    const { currentCourse, loadDetails, loadEnrolled, isLoading, error, isEnrolled, enroll } = useCourses();
    const [enrolling, setEnrolling] = useState(false);
    const [moduleLessons, setModuleLessons] = useState<Record<string, any[]>>({});
    const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
    const [completedModuleIds, setCompletedModuleIds] = useState<Set<string>>(new Set());
    const [progressPct, setProgressPct] = useState(0);
    const userType = (user?.user_type as 'academic' | 'professional' | 'exams') || 'academic';

    useEffect(() => {
        if (courseId) loadDetails(courseId);
    }, [courseId, loadDetails]);

    // Fetch progress once course is loaded
    useEffect(() => {
        if (!currentCourse?.id) return;
        let cancelled = false;
        (async () => {
            try {
                const svc = getCourseService(userType);
                const prog = await svc.getCourseProgress(currentCourse.id);
                if (!cancelled && prog) {
                    setCompletedLessonIds(new Set((prog.completed_lessons ?? []).map(String)));
                    setCompletedModuleIds(new Set((prog.completed_modules ?? []).map(String)));
                    setProgressPct(prog.completion_percentage ?? prog.progress_percentage ?? 0);
                }
            } catch {
                // progress not available (not enrolled etc.) — silently ignore
            }
        })();
        return () => { cancelled = true; };
    }, [currentCourse?.id, userType]);

    // When course has modules but no lessons (e.g. professional API), fetch lessons per module (like mobile).
    const rawModules = (currentCourse as any)?.modules ?? [];
    useEffect(() => {
        if (!course || !rawModules.length) return;
        const svc = getCourseService(userType);
        const modulesNeedingLessons = rawModules.filter((m: any) => {
            const hasLessons = Array.isArray(m.lessons) && m.lessons.length > 0;
            const alreadyFetched = moduleLessons[String(m.id)]?.length;
            const hasCount = (m.lesson_count ?? m.lessons_count) > 0;
            return !hasLessons && !alreadyFetched && (hasCount || userType === 'professional');
        });
        if (modulesNeedingLessons.length === 0) return;
        let cancelled = false;
        (async () => {
            const next: Record<string, any[]> = {};
            for (const m of modulesNeedingLessons) {
                if (cancelled) break;
                try {
                    const list = await svc.getModuleLessons(String(m.id));
                    const arr = Array.isArray(list) ? list : [];
                    if (!cancelled && arr.length) next[String(m.id)] = arr;
                } catch {
                    // ignore per-module errors
                }
            }
            if (!cancelled && Object.keys(next).length > 0) {
                setModuleLessons((prev) => ({ ...prev, ...next }));
            }
        })();
        return () => { cancelled = true; };
    }, [currentCourse?.id, rawModules.length, userType, moduleLessons]);

    const course = currentCourse;
    const enrolled = course && (isEnrolled(course.id, (course as any).slug) || (course as any).is_enrolled);

    // Refresh progress after enrolling
    const handleEnroll = async () => {
        if (!course?.id || enrolling) return;
        setEnrolling(true);
        try {
            await enroll(course.id, (course as any).slug);
            // Refresh enrolled list so isEnrolled() returns true immediately
            loadEnrolled();
            // Re-fetch progress
            try {
                const svc = getCourseService(userType);
                const prog = await svc.getCourseProgress(course.id);
                if (prog) {
                    setCompletedLessonIds(new Set((prog.completed_lessons ?? []).map(String)));
                    setCompletedModuleIds(new Set((prog.completed_modules ?? []).map(String)));
                    setProgressPct(prog.completion_percentage ?? prog.progress_percentage ?? 0);
                }
            } catch { /* ignore */ }
        } catch (e: any) {
            console.error('Enrollment failed:', e?.message || e);
        } finally {
            setEnrolling(false);
        }
    };

    if (isLoading && !course) {
        return (
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6 animate-pulse">
                    <div className="h-8 w-48 bg-gray-200 rounded" />
                    <div className="h-10 w-3/4 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-64 bg-gray-100 rounded-xl" />
                </div>
                <div className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="space-y-4">
                <Link href="/app/courses" className="inline-flex items-center gap-2 text-primary-600 hover:underline">
                    <ArrowLeft className="h-4 w-4" /> Back to Courses
                </Link>
                <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-center">
                    <p className="text-red-700">{error || 'Course not found.'}</p>
                    <Button asChild className="mt-4">
                        <Link href="/app/courses">Browse Courses</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const categoryLabel = (course as any).category_name ?? course.subject?.name ?? 'Course';
    const levelLabel = (course as any).level ?? course.difficulty ?? '';
    const modulesForList = mapModules((course as any).modules ?? [], courseId, moduleLessons, completedLessonIds, completedModuleIds);
    const lessonCount = modulesForList.reduce((acc, m) => acc + m.lessons.length, 0);
    const durationHours = (course as any).estimated_hours ?? (course as any).duration_hours ?? 0;
    const firstLessonId = modulesForList[0]?.lessons?.[0]?.id;
    const continueLearningHref = firstLessonId
        ? `/app/courses/${courseId}/lessons/${firstLessonId}`
        : `/app/courses/${courseId}`;

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <Link href="/app/courses" className="inline-flex items-center gap-2 text-primary-600 hover:underline text-sm font-medium">
                    <ArrowLeft className="h-4 w-4" /> Back to Courses
                </Link>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-[#446D6D]/10 text-[#446D6D]">
                            {categoryLabel}
                        </Badge>
                        {levelLabel && (
                            <>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">{levelLabel}</span>
                            </>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        {course.title}
                    </h1>

                    <div
                        className="prose prose-gray max-w-none text-lg text-gray-600 leading-relaxed prose-headings:text-gray-900 prose-p:my-2 prose-ul:my-2 prose-ol:my-2"
                        dangerouslySetInnerHTML={{
                            __html: markdownToHtml(course.description || '') || '<p>No description available.</p>',
                        }}
                    />

                    {(course as any).instructor_name && (
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <span className="font-medium text-gray-900">{(course as any).instructor_name}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                    {modulesForList.length > 0 ? (
                        <ModuleList courseId={courseId} modules={modulesForList} />
                    ) : (
                        <p className="text-gray-500 py-4">No modules available yet.</p>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                    <div className="relative aspect-video w-full rounded-lg bg-gray-900 flex items-center justify-center group cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                        <PlayCircle className="h-16 w-16 text-white opacity-90 group-hover:scale-110 transition-transform" />
                    </div>

                    {progressPct > 0 || enrolled ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-700">Your Progress</span>
                                    <span className="text-[#446D6D]">{Math.round(progressPct)}%</span>
                                </div>
                                <Progress value={progressPct} className="h-2" />
                            </div>
                            <Button asChild className="w-full" size="lg">
                                <Link href={continueLearningHref}>Continue Learning</Link>
                            </Button>
                        </div>
                    ) : (
                        <Button className="w-full" size="lg" onClick={handleEnroll} disabled={enrolling}>
                            {enrolling ? 'Enrolling…' : 'Enroll Now'}
                        </Button>
                    )}

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        {durationHours > 0 && (
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Clock className="h-5 w-5 text-gray-400" />
                                <span>{durationHours}h of content</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <BookOpen className="h-5 w-5 text-gray-400" />
                            <span>{lessonCount} lessons</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Award className="h-5 w-5 text-gray-400" />
                            <span>Certificate of completion</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full gap-2">
                        <Share2 className="h-4 w-4" />
                        Share Course
                    </Button>
                </div>
            </div>
        </div>
    );
}
