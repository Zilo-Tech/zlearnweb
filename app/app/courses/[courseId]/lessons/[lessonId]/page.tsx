'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, CheckCircle, FileText, Loader2, AlertCircle, Target, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonPlayer } from '@/components/courses/lesson-player';
import { LessonSectionBlock, type LessonSection } from '@/components/courses/lesson-section-block';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
    fetchCourseDetails,
    fetchEnrolledCourses,
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

    const course = useAppSelector(selectCurrentCourse);
    const modules = useAppSelector(selectCurrentCourseModules);
    const enrollmentsCheck = useAppSelector((state) =>
        selectIsEnrolled(course?.id ?? courseId)(state)
    );
    const isEnrolled = course?.is_enrolled ?? enrollmentsCheck;

    // Local state
    const [lesson, setLesson] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true);

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


    // Fetch Lesson Content
    useEffect(() => {
        const fetchLesson = async () => {
            if (!isEnrolled && !isCheckingEnrollment) return; // Don't fetch if not enrolled (unless checking)

            setIsLoading(true);
            try {
                const data = await coursesService.getLessonDetails(lessonId, undefined, isProfessionalCourse);
                setLesson(data);
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
            await dispatch(markLessonComplete({
                lessonId: lesson.id,
                courseId: course.id
            })).unwrap();

            toast.success("Lesson marked as complete!");

            // Update local state to reflect completion instantly
            setLesson((prev: any) => ({ ...prev, isCompleted: true }));

            // Auto-navigate to next lesson
            const nextLessonId = getNextLessonId();
            if (nextLessonId) {
                toast.success("Moving to next lesson...");
                setTimeout(() => {
                    router.push(`/app/courses/${courseId}/lessons/${nextLessonId}`);
                }, 1500);
            } else {
                toast.success("Course Completed!");
                setTimeout(() => {
                    router.push(`/app/courses/${courseId}`);
                }, 1500);
            }
        } catch (error: any) {
            toast.error(error || "Failed to mark lesson complete");
        } finally {
            setIsCompleting(false);
        }
    };

    const getNextLessonId = () => {
        if (!modules || modules.length === 0) return null;

        let foundCurrent = false;

        for (const module of modules) {
            if (!module.lessons) continue;

            for (const modLesson of module.lessons) {
                if (foundCurrent) {
                    return modLesson.id;
                }
                if (modLesson.id === lessonId) {
                    foundCurrent = true;
                }
            }
        }
        return null;
    };

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
                <div className="flex items-center gap-4 mb-4">
                    <Link
                        href={`/app/courses/${courseId}`}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-900"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Course
                    </Link>
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
                    <Button
                        variant={lesson.isCompleted || lesson.completed ? "outline" : "default"} // API might return 'completed'
                        className={lesson.isCompleted || lesson.completed ? "text-green-600 border-green-200 bg-green-50" : "bg-[#446D6D] hover:bg-[#3A5F5F]"}
                        onClick={handleComplete}
                        disabled={isCompleting || lesson.isCompleted || lesson.completed}
                    >
                        {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {lesson.isCompleted || lesson.completed ? (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Completed
                            </>
                        ) : (
                            "Mark as Complete"
                        )}
                    </Button>
                </div>

                {/* Lesson sections (text, video, quiz, etc.) */}
                {lesson.sections && lesson.sections.length > 0 && (
                    <div className="space-y-6">
                        {([...lesson.sections] as LessonSection[])
                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                            .map((section) => (
                                <LessonSectionBlock key={section.id} section={section} />
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
                                className="prose prose-gray max-w-none text-gray-600 leading-relaxed prose-p:my-2 prose-ul:my-2 prose-ol:my-2"
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
                                    {resource.resource_type === 'link' && resource.url && (
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
                                    )}
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

            {/* Sidebar / Navigation could go here (e.g., duplicate ModuleList for quick nav) */}
        </div>
    );
}
