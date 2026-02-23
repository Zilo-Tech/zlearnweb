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
import { coursesService } from '@/lib/services';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUuid(id: string): boolean {
    return UUID_REGEX.test(id || '');
}

function mapLessons(lessons: any[]): { id: string; title: string; type: 'video' | 'text' | 'quiz'; duration: string; isCompleted: boolean; isLocked: boolean }[] {
    if (!Array.isArray(lessons)) return [];
    return lessons.map((l: any) => ({
        id: String(l.id),
        title: l.title || 'Lesson',
        type: (l.content_type === 'quiz' || l.lesson_type === 'quiz' ? 'quiz' : l.content_type === 'video' || l.lesson_type === 'video' ? 'video' : 'text') as 'video' | 'text' | 'quiz',
        duration: l.duration ? `${l.duration}m` : (l.duration_minutes != null ? `${l.duration_minutes}m` : '—'),
        isCompleted: !!l.is_completed,
        isLocked: !!l.is_locked,
    }));
}

function mapModules(
    modules: any[],
    courseSlug: string,
    fetchedLessons: Record<string, any[]> = {}
): { id: string; title: string; lessons: ReturnType<typeof mapLessons> }[] {
    if (!Array.isArray(modules)) return [];
    return modules.map((m: any) => {
        const lessons = (m.lessons?.length ? m.lessons : fetchedLessons[String(m.id)]) || [];
        return {
            id: String(m.id),
            title: m.title || 'Module',
            lessons: mapLessons(lessons),
        };
    });
}

export default function CourseDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const { user } = useAuth();
    const { currentCourse, loadDetails, isLoading, error, progress, isEnrolled, enroll } = useCourses();
    const [enrolling, setEnrolling] = useState(false);
    const [moduleLessons, setModuleLessons] = useState<Record<string, any[]>>({});
    const userType = (user?.user_type as 'academic' | 'professional' | 'exams') || 'academic';

    useEffect(() => {
        if (slug) loadDetails(slug);
    }, [slug, loadDetails]);

    // When course has modules but no lessons (e.g. professional API), fetch lessons per module (like mobile).
    const rawModules = (currentCourse as any)?.modules ?? [];
    const isProfessional = !isUuid(slug);
    useEffect(() => {
        if (!course || !rawModules.length) return;
        const modulesNeedingLessons = rawModules.filter((m: any) => {
            const hasLessons = Array.isArray(m.lessons) && m.lessons.length > 0;
            const alreadyFetched = moduleLessons[String(m.id)]?.length;
            const hasCount = (m.lesson_count ?? m.lessons_count) > 0;
            return !hasLessons && !alreadyFetched && (hasCount || isProfessional);
        });
        if (modulesNeedingLessons.length === 0) return;
        let cancelled = false;
        (async () => {
            const next: Record<string, any[]> = {};
            for (const m of modulesNeedingLessons) {
                if (cancelled) break;
                try {
                    const list = isProfessional
                        ? await coursesService.getProfessionalModuleLessons(String(m.id))
                        : await coursesService.getModuleLessons(String(m.id));
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
    }, [currentCourse?.id, rawModules.length, isProfessional, moduleLessons]);

    const course = currentCourse;
    const progressPct = course?.id && progress ? (progress[course.id]?.progress_percentage ?? 0) : 0;
    const enrolled = course && (isEnrolled(course.id) || (course as any).is_enrolled);

    const handleEnroll = async () => {
        if (!course?.id || enrolling) return;
        setEnrolling(true);
        try {
            await enroll(course.id);
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
    const modulesForList = mapModules((course as any).modules ?? [], slug, moduleLessons);
    const lessonCount = modulesForList.reduce((acc, m) => acc + m.lessons.length, 0);
    const durationHours = (course as any).estimated_hours ?? (course as any).duration_hours ?? 0;
    const firstLessonId = modulesForList[0]?.lessons?.[0]?.id;
    const continueLearningHref = firstLessonId
        ? `/app/courses/${slug}/lessons/${firstLessonId}`
        : `/app/courses/${slug}`;

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
                        <ModuleList courseSlug={slug} modules={modulesForList} />
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
