'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle, FileText, Loader2, AlertCircle, Target, ExternalLink, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LessonPlayer } from '@/components/courses/lesson-player';
import { LessonSectionBlock, type LessonSection } from '@/components/courses/lesson-section-block';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
    fetchCourseDetails,
    fetchEnrolledCourses,
    fetchModuleLessons,
    markLessonComplete,
    selectIsEnrolled,
    selectCurrentCourse,
    selectCurrentCourseModules
} from '@/lib/store/slices/courses.slice';
import { coursesService } from '@/lib/services';
import { toast } from 'sonner';

export default function LessonViewerPage() {
    const params = useParams();
    const courseId = params?.courseId as string;
    const lessonId = params?.lessonId as string;
    const router = useRouter();
    const dispatch = useAppDispatch();

    const isProfessionalCourse = !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId ?? '');
    const userType = useAppSelector((s) => s.auth.user?.user_type as 'academic' | 'professional' | 'exams' | undefined);

    const course = useAppSelector(selectCurrentCourse);
    const modules = useAppSelector(selectCurrentCourseModules);
    const enrollmentsCheck = useAppSelector((state) =>
        selectIsEnrolled(course?.id ?? courseId)(state)
    );
    const isEnrolled = course?.is_enrolled ?? enrollmentsCheck;

    // Local state
    const [lesson, setLesson] = useState<any>(null);
    const [navigation, setNavigation] = useState<{
        previous_lesson?: string;
        next_lesson?: string;
        related_lessons?: string[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);
    const [certificateModal, setCertificateModal] = useState<{
        certificateNumber: string;
        xpEarned?: number;
    } | null>(null);
    const [quizScores, setQuizScores] = useState<Record<string, number>>({});
    const [quizModal, setQuizModal] = useState<{
        type: 'pass' | 'fail' | 'missing';
        score?: number;
        proceed?: () => void;
    } | null>(null);

    // Initial Data Load & Enrollment Check
    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Ensure course details & enrollment status are loaded
                // Fetch course details if not present or ID doesn't match
                if (!course || course.id !== courseId) {
                    await dispatch(fetchCourseDetails(courseId)).unwrap();
                }

                await dispatch(fetchEnrolledCourses({ forceProfessional: isProfessionalCourse })).unwrap();

                // If modules exist but their lessons haven't been fetched, load them so
                // Prev/Next navigation can be computed reliably.
                const mods = (course?.modules ?? modules ?? []) as any[];
                const modulesNeedingLessons = mods
                    .filter((m: any) => (m.lesson_count ?? 0) > 0 && !(m.lessons && m.lessons.length > 0))
                    .map((m: any) => m.id);
                if (modulesNeedingLessons.length > 0) {
                    try {
                        await dispatch(fetchModuleLessons(modulesNeedingLessons)).unwrap();
                    } catch (err) {
                        // non-fatal; we'll still try to compute navigation from whatever is available
                        console.warn('Failed to fetch module lessons for navigation', err);
                    }
                }

            } catch (error) {
                console.error("Failed to load course context:", error);
                toast.error("Failed to load course context");
            } finally {
                setIsCheckingEnrollment(false);
            }
        };

        if (courseId) {
            loadData();
        }
    }, [dispatch, courseId, course?.id]); // Use optional chaining for course.id

    // Ensure all module lessons are loaded (so next = first lesson of next module when applicable)
    useEffect(() => {
        const c = course as { modules?: { id: string; lessons?: unknown[]; lesson_count?: number }[] } | null;
        const mods = c?.modules;
        if (!mods?.length) return;
        const needLessons = mods.filter((m) => (m.lesson_count ?? 0) > 0 && !(m.lessons?.length));
        if (needLessons.length) {
            dispatch(fetchModuleLessons(needLessons.map((m) => m.id)));
        }
    }, [course?.id, course?.modules, dispatch]);

    // Enrollment Redirect Effect
    useEffect(() => {
        if (!isCheckingEnrollment) {
            // Check enrollment using the selector result from courseId
            if (!isEnrolled) {
                toast.error("You must be enrolled to view this lesson.");
                router.push(`/app/courses/${courseId}`);
            }
        }
    }, [isCheckingEnrollment, isEnrolled, courseId, router]);


    // Fetch Lesson Content, start progress, and navigation
    useEffect(() => {
        const fetchLesson = async () => {
            if (!isEnrolled && !isCheckingEnrollment) return; // Don't fetch if not enrolled (unless checking)

            setIsLoading(true);
            try {
                const [lessonData, navData] = await Promise.all([
                    coursesService.getLessonDetails(lessonId, undefined, isProfessionalCourse),
                    isProfessionalCourse ? coursesService.getLessonNavigation(lessonId) : Promise.resolve(null),
                ]);
                setLesson(lessonData);
                setNavigation(navData as { previous_lesson?: string; next_lesson?: string; related_lessons?: string[] } | null);

                // Start tracking + update position (professional only)
                if (isProfessionalCourse) {
                    coursesService.startLessonProgress(lessonId).catch(() => {});
                }
                const courseUuid = course?.id ?? (lessonData as { course?: string })?.course ?? (lessonData as { module?: { course?: { id?: string } } })?.module?.course?.id;
                if (courseUuid) {
                    coursesService.updateCoursePosition(
                        courseUuid,
                        {
                            current_module: (lessonData as { module?: string })?.module ?? (lessonData as { module?: { id?: string } })?.module?.id,
                            current_lesson: lessonId,
                        },
                        isProfessionalCourse ? 'professional' : 'academic'
                    ).catch(() => {});
                }
            } catch (error) {
                console.error("Failed to load lesson:", error);
                toast.error("Failed to load lesson content");
            } finally {
                setIsLoading(false);
            }
        };

        if (lessonId && !isCheckingEnrollment && isEnrolled) {
            fetchLesson();
        }
    }, [lessonId, isEnrolled, isCheckingEnrollment, isProfessionalCourse]);


    

    const handleComplete = async () => {
        if (!lesson || !course) return;

        setIsCompleting(true);
        try {
            const result = await dispatch(markLessonComplete({
                lessonId: lesson.id,
                courseId: course.id,
                isProfessionalCourse,
                timeSpentMinutes: lesson.estimated_time_minutes ?? lesson.duration_minutes,
            })).unwrap();

            setLesson((prev: any) => ({ ...prev, isCompleted: true }));

            // Certificate earned (last lesson completed)
            const cert = result as { certificate_issued?: boolean; certificate_number?: string; xp_awarded?: number; xp_earned?: number };
            if (cert?.certificate_issued && cert?.certificate_number) {
                setCertificateModal({
                    certificateNumber: cert.certificate_number,
                    xpEarned: cert.xp_awarded ?? cert.xp_earned ?? 500,
                });
                toast.success("Course completed! Certificate earned!");
                return;
            }

            toast.success("Lesson marked as complete!");

            // Auto-navigate to next lesson (prefer API navigation)
            const nextLessonId = (result as { next_lesson?: string })?.next_lesson ?? navigation?.next_lesson ?? getNextLessonId();
            if (nextLessonId) {
                setTimeout(() => {
                    router.push(`/app/courses/${courseId}/lessons/${nextLessonId}`);
                }, 1500);
            } else {
                setTimeout(() => {
                    router.push(`/app/courses/${courseId}`);
                }, 1500);
            }
        } catch (error: any) {
            toast.error(error?.message ?? error ?? "Failed to mark lesson complete");
        } finally {
            setIsCompleting(false);
        }
    };

    const handleCertificateModalClose = () => {
        setCertificateModal(null);
        router.push(`/app/certificates`);
    };

    const getNextLessonId = () => {
        if (!modules || modules.length === 0) return null;
        let foundCurrent = false;
        for (const module of modules) {
            if (!module.lessons) continue;
            for (const modLesson of module.lessons) {
                if (foundCurrent) return modLesson.id;
                if (modLesson.id === lessonId) foundCurrent = true;
            }
        }
        return null;
    };

    const getPreviousLessonId = () => {
        if (!modules || modules.length === 0) return null;
        let prevId: string | null = null;
        for (const module of modules) {
            if (!module.lessons) continue;
            for (const modLesson of module.lessons) {
                if (modLesson.id === lessonId) return prevId;
                prevId = modLesson.id;
            }
        }
        return null;
    };

    // Compute resolved previous/next ids (prefer API-provided navigation then fallback traversal)
    const previousLessonId = navigation?.previous_lesson ?? getPreviousLessonId();
    const nextLessonId = navigation?.next_lesson ?? getNextLessonId();

    if (isCheckingEnrollment || (isLoading && !lesson)) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#446D6D] mx-auto" />
                    <p className="text-gray-500">Loading lesson...</p>
                </div>
            </div>
        );
    }

    if (!isEnrolled) {
        return null; // Will redirect via useEffect
    }

    if (!lesson) {
        return (
            <div className="flex h-screen items-center justify-center flex-col gap-4">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <p className="text-gray-900 font-medium">Lesson not found</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/app/courses/${courseId}`}
                            className="flex items-center text-sm text-gray-500 hover:text-gray-900"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Course
                        </Link>
                        <nav className="flex items-center gap-2 text-sm">
                            {previousLessonId ? (
                                <Link
                                    href={`/app/courses/${courseId}/lessons/${previousLessonId}`}
                                    className="flex items-center text-gray-500 hover:text-gray-900"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-0.5" />
                                    Previous
                                </Link>
                            ) : null}
                            {previousLessonId && nextLessonId ? (
                                <span className="text-gray-300">|</span>
                            ) : null}
                            {nextLessonId ? (
                                <Link
                                    href={`/app/courses/${courseId}/lessons/${nextLessonId}`}
                                    className="flex items-center text-gray-500 hover:text-gray-900"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-0.5" />
                                </Link>
                            ) : null}
                        </nav>
                    </div>
                </div>

                {(lesson.video_url || lesson.videoUrl) && (
                    <LessonPlayer
                        src={lesson.video_url || lesson.videoUrl || ''}
                        poster={lesson.video_thumbnail}
                        title={lesson.title}
                    />
                )}

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                    {/* Removed manual "Mark as Complete" button per UX decision; show read-only status */}
                    {lesson.isCompleted || lesson.completed ? (
                        <Badge variant="secondary" className="text-green-700 bg-green-50 border-green-100">
                            <CheckCircle className="mr-2 h-4 w-4 inline-block" />
                            Completed
                        </Badge>
                    ) : null}
                </div>

                {/* Lesson sections (text, video, quiz, etc.) */}
                {lesson.sections && lesson.sections.length > 0 && (
                    <div className="space-y-6">
                        {([...lesson.sections] as LessonSection[])
                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                            .map((section) => (
                                <LessonSectionBlock
                                    key={section.id}
                                    section={section}
                                    onSectionComplete={(sectionId, data) => {
                                        // Persist quiz scores locally for navigation gating
                                        const quizScore = data?.metadata?.quiz_score;
                                        if (typeof quizScore === 'number') {
                                            setQuizScores((prev) => ({ ...prev, [sectionId]: quizScore }));
                                        }

                                        // For academic flow, still notify the backend about section completion
                                        if (userType === 'academic') {
                                            coursesService.completeContentSection(sectionId, {
                                                time_spent_seconds: data.time_spent_seconds,
                                                metadata: data.metadata,
                                            }).catch(() => {});
                                        }
                                    }}
                                />
                            ))}
                    </div>
                )}

                <Tabs defaultValue="description" className="w-full">
                    <TabsList>
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                        <TabsTrigger value="discussion">Discussion</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-4 space-y-4">
                        {(lesson.content || lesson.description) && (
                            <div
                                className="prose prose-gray max-w-none text-gray-600 leading-relaxed prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer"
                                dangerouslySetInnerHTML={{ __html: markdownToHtml(lesson.content || lesson.description || '') }}
                            />
                        )}
                        {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
                            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                                    <Target className="h-4 w-4" />
                                    Learning objectives
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    {lesson.learning_objectives.map((obj: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {!lesson.content && !lesson.description && (!lesson.learning_objectives || lesson.learning_objectives.length === 0) && (
                            <p className="text-gray-500">No description available.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="resources" className="mt-4 space-y-3">
                        {lesson.resources && lesson.resources.length > 0 ? (
                            lesson.resources.map((resource: { id?: string; title: string; description?: string; url?: string; resource_type?: string; file?: unknown }, i: number) => (
                                <div key={resource.id ?? i} className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
                                    <div className="flex min-w-0 flex-1 items-start gap-3">
                                        <FileText className="h-5 w-5 shrink-0 text-gray-400" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                                            {resource.description && (
                                                <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{resource.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    {((resource.resource_type === 'link' || resource.resource_type === 'url') && resource.url) ? (
                                        <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0"
                                        >
                                            <Button variant="ghost" size="sm">
                                                <ExternalLink className="mr-1.5 h-4 w-4" />
                                                Open
                                            </Button>
                                        </a>
                                    ) : null}
                                    {resource.file ? (
                                        <Button variant="ghost" size="sm">Download</Button>
                                    ) : null}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No resources available.</p>
                        )}
                    </TabsContent>

                    <TabsContent value="discussion" className="mt-4">
                        <p className="text-gray-500 text-sm">Discussion thread implementation pending...</p>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Certificate celebration modal */}
            <Dialog open={!!certificateModal} onOpenChange={(open) => !open && setCertificateModal(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Award className="h-6 w-6 text-amber-500" />
                            Course Completed!
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-gray-600">
                            Congratulations! You&apos;ve earned a certificate for completing this course.
                        </p>
                        {certificateModal && (
                            <>
                                <p className="text-sm font-mono text-gray-700 bg-gray-100 px-3 py-2 rounded">
                                    {certificateModal.certificateNumber}
                                </p>
                                {certificateModal.xpEarned && (
                                    <p className="text-sm text-green-600">
                                        +{certificateModal.xpEarned} XP awarded
                                    </p>
                                )}
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={handleCertificateModalClose}
                                        className="bg-[#446D6D] hover:bg-[#3A5F5F]"
                                    >
                                        View My Certificates
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setCertificateModal(null);
                                            router.push(`/certificates/verify/${certificateModal.certificateNumber}`);
                                        }}
                                    >
                                        Verify Certificate
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Quiz gating modal: informs user of pass/fail or missing quiz and allows proceeding when passed */}
            <Dialog open={!!quizModal} onOpenChange={(open) => !open && setQuizModal(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            {quizModal?.type === 'pass' ? 'Well done!' : quizModal?.type === 'fail' ? 'Keep trying' : 'Quiz required'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-2">
                        {quizModal?.type === 'missing' && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-700">You need to complete the lesson quiz before proceeding to the next lesson. Please take the quiz and aim for at least 70% to unlock the next lesson.</p>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline" onClick={() => setQuizModal(null)}>Close</Button>
                                </div>
                            </div>
                        )}

                        {quizModal?.type === 'fail' && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-700">You scored {quizModal.score ?? 0}%. This is below the required 70% passing score. Please revisit the lesson and try the quiz again to improve your score.</p>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline" onClick={() => setQuizModal(null)}>Review lesson</Button>
                                </div>
                            </div>
                        )}

                        {quizModal?.type === 'pass' && (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-700">Congratulations — you scored {quizModal.score ?? 0}% on the quiz. You may proceed to the next lesson.</p>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="outline" onClick={() => setQuizModal(null)}>Stay</Button>
                                    <Button onClick={() => { setQuizModal(null); quizModal?.proceed && quizModal.proceed(); }} className="bg-[#446D6D] hover:bg-[#3A5F5F]">Proceed</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
