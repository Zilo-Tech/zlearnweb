'use client';

import { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonPlayer } from '@/components/courses/lesson-player';
import { LessonSectionBlock } from '@/components/courses/lesson-section-block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCourseService } from '@/lib/services/courses.service';
import { useCourses } from '@/lib/hooks/useCourses';
import { useAuth } from '@/lib/hooks/useAuth';
import { youtubeEmbedUrl } from '@/lib/utils/markdownToHtml';

interface LessonNav {
  previous: { id: string; title: string } | null;
  next: { id: string; title: string } | null;
}

export default function LessonViewerPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
    const { courseId: courseIdFromParams, lessonId } = use(params);
    const router = useRouter();
    const { currentCourse, completeLesson } = useCourses();
    const { user } = useAuth();
    const courseId = currentCourse?.id ?? courseIdFromParams;
    const userType = (user?.user_type as 'academic' | 'professional' | 'exams') || 'academic';
    const [lesson, setLesson] = useState<any | null>(null);
    const [nav, setNav] = useState<LessonNav>({ previous: null, next: null });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    // Derive prev/next from currentCourse modules when API nav is unavailable
    const deriveNavFromCourse = useCallback((lessonId: string) => {
        if (!currentCourse) return { previous: null, next: null };
        const allLessons: { id: string; title: string }[] = [];
        ((currentCourse as any).modules ?? []).forEach((m: any) => {
            (m.lessons ?? []).forEach((l: any) => {
                allLessons.push({ id: String(l.id), title: l.title || 'Lesson' });
            });
        });
        const idx = allLessons.findIndex((l) => l.id === lessonId);
        return {
            previous: idx > 0 ? allLessons[idx - 1] : null,
            next: idx >= 0 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
        };
    }, [currentCourse]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setError(null);
            setIsLoading(true);
            try {
                const svc = getCourseService(userType);
                const [data, navData] = await Promise.allSettled([
                    svc.getLessonDetails(lessonId),
                    // Navigation only available for professional (has dedicated endpoint)
                    userType === 'professional'
                        ? (svc as any).getLessonNavigation?.(lessonId)
                        : Promise.reject('no-nav'),
                ]);
                if (!cancelled) {
                    if (data.status === 'fulfilled') setLesson(data.value);
                    else throw new Error((data as any).reason?.message || 'Failed to load lesson');

                    if (navData.status === 'fulfilled' && navData.value) {
                        setNav({ previous: navData.value.previous, next: navData.value.next });
                    } else {
                        // Fallback: derive nav from course modules already in Redux
                        setNav(deriveNavFromCourse(lessonId));
                    }
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message || 'Failed to load lesson');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [lessonId, userType, deriveNavFromCourse]);

    // Also re-derive nav whenever currentCourse loads (may arrive after lesson)
    useEffect(() => {
        if (!nav.next && !nav.previous && currentCourse) {
            setNav(deriveNavFromCourse(lessonId));
        }
    }, [currentCourse, lessonId, nav.next, nav.previous, deriveNavFromCourse]);

    const goToLesson = useCallback((id: string) => {
        router.push(`/app/courses/${courseIdFromParams}/lessons/${id}`);
    }, [router, courseIdFromParams]);

    const handleMarkComplete = async () => {
        if (isCompleted || isCompleting) return;
        setIsCompleting(true);
        try {
            const result: any = await completeLesson(lessonId, courseId, {});
            setIsCompleted(true);
            // Navigate to next lesson from API response or derived nav
            const nextId = result?.next_unlocked?.id ?? nav.next?.id;
            if (nextId) {
                setTimeout(() => goToLesson(nextId), 800);
            }
        } catch {
            // mark locally even if backend fails
            setIsCompleted(true);
        } finally {
            setIsCompleting(false);
        }
    };

    if (isLoading && !lesson) {
        return (
            <div className="flex flex-col gap-6 lg:flex-row">
                <div className="flex-1 space-y-6">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="aspect-video bg-gray-100 rounded-xl animate-pulse" />
                    <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="space-y-4">
                <Link href={`/app/courses/${courseIdFromParams}`} className="inline-flex items-center gap-2 text-primary-600 hover:underline text-sm">
                    <ChevronLeft className="h-4 w-4" /> Back to Course
                </Link>
                <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-center">
                    <p className="text-red-700">{error || 'Lesson not found.'}</p>
                    <Button asChild className="mt-4">
                        <Link href={`/app/courses/${courseIdFromParams}`}>Back to Course</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const sections = (lesson as any).sections ?? [];
    const hasSections = Array.isArray(sections) && sections.length > 0;
    const firstVideoSection = hasSections && sections.find((s: any) => s.section_type === 'video' && (s.video_url || s.content_url));
    const firstAudioSection = hasSections && sections.find((s: any) => s.section_type === 'audio' && (s.audio_url || s.content_url));
    const topLevelVideo = (lesson as any).video_url ?? (lesson as any).videoUrl ?? (lesson.resources?.find((r: any) => r.resource_type === 'video' || r.file?.includes('.mp4'))?.file) ?? null;
    const topLevelAudio = (lesson as any).audio_url ?? (lesson as any).audioUrl ?? (lesson.resources?.find((r: any) => r.resource_type === 'audio' || r.file?.match(/\.(mp3|ogg|wav|aac|m4a)$/i))?.file) ?? null;
    const videoUrl = topLevelVideo || (firstVideoSection && (firstVideoSection.video_url || firstVideoSection.content_url));
    const audioUrl = topLevelAudio || (firstAudioSection && (firstAudioSection.audio_url || firstAudioSection.content_url));
    const youtubeEmbed = videoUrl ? youtubeEmbedUrl(videoUrl) : null;
    const resources = (lesson.resources || []).filter((r: any) => r.title || r.name || r.file);

    return (
        <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <Link
                        href={`/app/courses/${courseIdFromParams}`}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-900"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Course
                    </Link>
                </div>

                {!hasSections && (
                    <>
                        {videoUrl ? (
                            youtubeEmbed ? (
                                <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                                    <iframe
                                        src={youtubeEmbed}
                                        title={lesson.title}
                                        className="h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <LessonPlayer src={videoUrl} onComplete={handleMarkComplete} />
                            )
                        ) : audioUrl ? (
                            <div className="rounded-xl bg-gray-900 p-6 flex flex-col items-center gap-4">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#446D6D]/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#7bbcbc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                                        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                                    </svg>
                                </div>
                                <p className="text-white font-medium">{lesson.title}</p>
                                <audio
                                    src={audioUrl}
                                    controls
                                    className="w-full max-w-md"
                                    onEnded={handleMarkComplete}
                                />
                            </div>
                        ) : (
                            <div className="aspect-video rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                                No video for this lesson
                            </div>
                        )}
                    </>
                )}

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                    <Button
                        variant={isCompleted ? "outline" : "default"}
                        className={isCompleted ? "text-green-600 border-green-200 bg-green-50" : ""}
                        onClick={handleMarkComplete}
                        disabled={isCompleting}
                    >
                        {isCompleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {isCompleted ? (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Completed
                            </>
                        ) : (
                            "Mark as Complete"
                        )}
                    </Button>
                </div>

                {lesson.description && (
                    <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
                )}

                {hasSections ? (
                    <div className="space-y-6">
                        {(sections as any[])
                            .slice()
                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                            .map((section: any) => (
                                <LessonSectionBlock key={section.id} section={section} />
                            ))}
                    </div>
                ) : (
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList>
                            <TabsTrigger value="description">Description</TabsTrigger>
                            <TabsTrigger value="resources">Resources</TabsTrigger>
                            <TabsTrigger value="discussion">Discussion</TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-4 text-gray-600 leading-relaxed">
                            {lesson.description || 'No description.'}
                            {lesson.learning_objectives && (
                                <div className="mt-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Learning objectives</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {(Array.isArray(lesson.learning_objectives) ? lesson.learning_objectives : [lesson.learning_objectives]).filter(Boolean).map((obj: string, i: number) => (
                                            <li key={i}>{obj}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="resources" className="mt-4 space-y-3">
                            {resources.length === 0 ? (
                                <p className="text-gray-500 text-sm">No resources for this lesson.</p>
                            ) : (
                                resources.map((resource: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{resource.title || resource.name || 'Resource'}</p>
                                                {resource.file && <p className="text-xs text-gray-500">{resource.file}</p>}
                                            </div>
                                        </div>
                                        {resource.file && (
                                            <a href={resource.file} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="sm">Download</Button>
                                            </a>
                                        )}
                                    </div>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="discussion" className="mt-4">
                            <p className="text-gray-500 text-sm">Discussion thread loading...</p>
                        </TabsContent>
                    </Tabs>
                )}

                {hasSections && resources.length > 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <h3 className="mb-3 font-semibold text-gray-900">Resources</h3>
                        <ul className="space-y-2">
                            {resources.map((resource: any, i: number) => (
                                <li key={i} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-900">{resource.title || resource.name || 'Resource'}</span>
                                    </div>
                                    {resource.file && (
                                        <a href={resource.file} target="_blank" rel="noopener noreferrer">
                                            <Button variant="ghost" size="sm">Download</Button>
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* ── Bottom prev / next bar ── */}
                <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-6 mt-2">
                    {nav.previous ? (
                        <button
                            onClick={() => goToLesson(nav.previous!.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="truncate max-w-[140px]">{nav.previous.title}</span>
                        </button>
                    ) : <div />}

                    {nav.next && (
                        <button
                            onClick={() => goToLesson(nav.next!.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#446D6D] hover:bg-[#375959] transition-colors text-sm font-semibold text-white"
                        >
                            <span className="truncate max-w-[140px]">{nav.next.title}</span>
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="w-full lg:w-80 space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                    <h3 className="font-semibold text-gray-900">Navigation</h3>

                    {nav.previous && (
                        <button
                            onClick={() => goToLesson(nav.previous!.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-left group"
                        >
                            <ChevronLeft className="h-4 w-4 text-gray-400 shrink-0 group-hover:text-[#446D6D]" />
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400 font-medium">Previous</p>
                                <p className="text-sm font-medium text-gray-900 truncate">{nav.previous.title}</p>
                            </div>
                        </button>
                    )}

                    {nav.next ? (
                        <button
                            onClick={() => goToLesson(nav.next!.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg border border-[#446D6D]/30 bg-[#446D6D]/5 hover:bg-[#446D6D]/10 transition-colors text-left group"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-[#446D6D] font-medium">Next Lesson</p>
                                <p className="text-sm font-medium text-gray-900 truncate">{nav.next.title}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-[#446D6D] shrink-0" />
                        </button>
                    ) : (
                        <Link href={`/app/courses/${courseIdFromParams}`}>
                            <div className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                                <p className="text-sm font-medium text-gray-900">Back to course</p>
                                <p className="text-xs text-gray-500 mt-1">View all modules and lessons</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
