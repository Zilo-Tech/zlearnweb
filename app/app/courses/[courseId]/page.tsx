'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModuleList } from '@/components/courses/module-list';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Award, Clock, BookOpen, Star, Share2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
    fetchCourseDetails,
    enrollInCourse,
    fetchEnrolledCourses,
    fetchModuleLessons,
    fetchCertificates,
    selectCurrentCourse,
    selectCurrentCourseModules,
    selectIsEnrolled,
} from '@/lib/store/slices/courses.slice';
import { coursesService } from '@/lib/services';
import { toast } from 'sonner';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';

export default function CourseDetailsPage() {
    const params = useParams();
    const courseId = params?.courseId as string; // slug for professional, id for academic
    const router = useRouter();
    const dispatch = useAppDispatch();
    const course = useAppSelector(selectCurrentCourse);
    const modules = useAppSelector(selectCurrentCourseModules);
    const userType = useAppSelector((s) => s.auth.user?.user_type as 'academic' | 'professional' | 'exams' | undefined);
    const enrollmentsCheck = useAppSelector((state) => selectIsEnrolled(course?.id ?? courseId)(state));
    // Use is_enrolled from course detail API when available; fallback to enrollments list
    const isEnrolled = course?.is_enrolled ?? enrollmentsCheck;
    const isLoading = useAppSelector((state) => state.courses.isLoading);

    // Local loading state for enrollment action
    const [isEnrolling, setIsEnrolling] = useState(false);
    // Academic: course progress for "Request certificate" (100% complete)
    const [courseProgress, setCourseProgress] = useState<{ overall_progress?: number } | null>(null);
    const [isRequestingCert, setIsRequestingCert] = useState(false);

    const isProfessionalCourse = !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId ?? '');

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetails(courseId));
            dispatch(fetchEnrolledCourses({ forceProfessional: isProfessionalCourse }));
        }
    }, [dispatch, courseId, isProfessionalCourse]);

    // Fetch course progress for academic enrolled users (for Request certificate)
    useEffect(() => {
        if (!courseId || !isEnrolled || userType !== 'academic') return;
        coursesService.getCourseProgress(courseId, 'academic').then((data: any) => {
            setCourseProgress(data ?? null);
        }).catch(() => setCourseProgress(null));
    }, [courseId, isEnrolled, userType]);

    useEffect(() => {
        const c = course as { modules?: { id: string; lessons?: unknown[]; lesson_count?: number }[] } | null;
        const mods = c?.modules;
        if (!mods?.length) return;
        const needLessons = mods.filter((m) => (m.lesson_count ?? 0) > 0 && !(m.lessons?.length));
        if (needLessons.length) {
            dispatch(fetchModuleLessons(needLessons.map((m) => m.id)));
        }
    }, [course?.id, course?.modules, dispatch]);

    const handleEnroll = async () => {
        if (!course) return;

        setIsEnrolling(true);
        try {
            const payload =
                userType === 'professional'
                    ? { identifier: course.slug ?? course.id, courseId: course.id }
                    : { identifier: course.id, courseId: course.id };
            await dispatch(enrollInCourse(payload)).unwrap();
            toast.success('Successfully enrolled in course!');
            await dispatch(fetchCourseDetails(courseId)).unwrap();
        } catch (error: any) {
            const msg = error?.message || String(error);
            if (msg.toLowerCase().includes('already enrolled')) {
                toast.info('You are already enrolled in this course.');
                dispatch(fetchCourseDetails(courseId));
            } else {
                toast.error(msg || 'Failed to enroll in course');
            }
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleRequestCertificate = async () => {
        if (!course?.id) return;
        setIsRequestingCert(true);
        try {
            const res = await coursesService.requestContentCertificate(course.id) as { certificate?: { certificate_number?: string }; message?: string };
            toast.success(res.message ?? 'Certificate issued!');
            await dispatch(fetchCertificates()).unwrap();
            if (res.certificate?.certificate_number) {
                router.push(`/certificates/verify/${encodeURIComponent(res.certificate.certificate_number)}`);
            }
        } catch (err: any) {
            const msg = err?.response?.data?.error ?? err?.message ?? 'Failed to request certificate';
            toast.error(msg);
        } finally {
            setIsRequestingCert(false);
        }
    };

    const handleContinue = () => {
        // Go to first incomplete lesson (in module order); if all complete, go to first lesson for review
        for (const module of modules) {
            if (!module.lessons?.length) continue;
            for (const lesson of module.lessons) {
                if (!lesson.isCompleted) {
                    router.push(`/app/courses/${courseId}/lessons/${lesson.id}`);
                    return;
                }
            }
        }
        const firstLessonId = modules[0]?.lessons?.[0]?.id;
        if (firstLessonId && courseId) {
            router.push(`/app/courses/${courseId}/lessons/${firstLessonId}`);
        } else {
            toast.info('No lessons available yet.');
        }
    };

    if (isLoading && !course) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#446D6D]" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex h-96 items-center justify-center flex-col gap-4">
                <p className="text-gray-500">Course not found.</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        {(() => {
                            const c = course as { category_name?: string; category?: { name?: string } | string; subject?: { name?: string } };
                            const label = c.category_name ?? (typeof c.category === 'object' ? c.category?.name : null) ?? c.subject?.name;
                            if (!label) return null;
                            return (
                                <Badge variant="secondary" className="bg-[#446D6D]/10 text-[#446D6D]">
                                    {label}
                                </Badge>
                            );
                        })()}
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{course.level ? String(course.level) : 'Beginner'}</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        {course.title}
                    </h1>

                    <div
                        className="prose prose-gray max-w-none text-gray-600 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_strong]:text-gray-900 prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer"
                        dangerouslySetInnerHTML={{
                            __html: markdownToHtml(course.description ?? ''),
                        }}
                    />

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            {/* <div className="h-8 w-8 rounded-full bg-gray-200" /> */}
                            {(course as { instructor_name?: string }).instructor_name || course.instructor != null ? (
                                <span className="font-medium text-gray-900">
                                    {(course as { instructor_name?: string }).instructor_name ??
                                        (typeof course.instructor === 'object' ? (course.instructor as { name?: string })?.name : null) ??
                                        'Instructor'}
                                </span>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-medium text-gray-900">{Number(course.rating) || 0}</span>
                            <span className="text-gray-500">({Number(course.enrolled_count) || 0} students)</span>
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                    <ModuleList courseId={courseId} modules={modules} />
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                    {/* Video Preview Placeholder */}
                    <div className="relative aspect-video w-full rounded-lg bg-gray-900 flex items-center justify-center group cursor-pointer overflow-hidden">
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        ) : (
                            <div className="absolute inset-0 bg-gray-800" />
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                        <PlayCircle className="h-16 w-16 text-white opacity-90 group-hover:scale-110 transition-transform z-10" />
                    </div>

                    {isEnrolled ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-700">Your Progress</span>
                                    <span className="text-[#446D6D]">
                                        {Number(courseProgress?.overall_progress ?? course.progress_percentage) || 0}%
                                    </span>
                                </div>
                                <Progress value={Number(courseProgress?.overall_progress ?? course.progress_percentage) || 0} className="h-2" />
                            </div>
                            <Button className="w-full bg-[#446D6D] hover:bg-[#3A5F5F]" size="lg" onClick={handleContinue}>
                                Continue Learning
                            </Button>
                            {userType === 'academic' && (courseProgress?.overall_progress ?? 0) >= 100 && (
                                <Button
                                    variant="outline"
                                    className="w-full gap-2 border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                    size="lg"
                                    onClick={handleRequestCertificate}
                                    disabled={isRequestingCert}
                                >
                                    {isRequestingCert ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
                                    {isRequestingCert ? 'Requesting...' : 'Request certificate'}
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-2xl font-bold text-gray-900">
                                {course.is_free ? 'Free' : `$${course.price || 0}`}
                            </div>
                            <Button
                                className="w-full bg-[#446D6D] hover:bg-[#3A5F5F]"
                                size="lg"
                                onClick={handleEnroll}
                                disabled={isEnrolling}
                            >
                                {isEnrolling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                            </Button>
                        </div>
                    )}

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <span>{(() => {
                                const c = course as { duration_hours?: number; estimated_hours?: number };
                                const h = c?.estimated_hours ?? c?.duration_hours;
                                return `${Number(h) || 0}h content`;
                            })()}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <BookOpen className="h-5 w-5 text-gray-400" />
                            <span>{(() => {
                                const fromSelector = modules.reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);
                                if (fromSelector > 0) return `${fromSelector} lessons`;
                                const raw = (course as { total_lessons?: number; modules?: { lessons?: unknown[]; lesson_count?: number }[] });
                                const n = raw?.total_lessons ?? raw?.modules?.reduce((acc, m) => acc + (m.lessons?.length ?? m.lesson_count ?? 0), 0);
                                return `${Number(n) || 0} lessons`;
                            })()}</span>
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
