'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonPlayer } from '@/components/courses/lesson-player';
import { LessonSectionBlock } from '@/components/courses/lesson-section-block';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { coursesService } from '@/lib/services';
import { useCourses } from '@/lib/hooks/useCourses';
import { youtubeEmbedUrl } from '@/lib/utils/markdownToHtml';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUuid(id: string): boolean {
    return UUID_REGEX.test(id || '');
}

export default function LessonViewerPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
    const { slug, lessonId } = use(params);
    const { currentCourse, completeLesson } = useCourses();
    const courseId = currentCourse?.id ?? slug;
    const isProfessional = !isUuid(slug);
    const [lesson, setLesson] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setError(null);
            setIsLoading(true);
            try {
                const data = isProfessional
                    ? await coursesService.getProfessionalLessonDetails(lessonId)
                    : await coursesService.getLessonDetails(lessonId);
                if (!cancelled) setLesson(data);
            } catch (e: any) {
                if (!cancelled) setError(e?.message || 'Failed to load lesson');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [lessonId, isProfessional]);

    const handleMarkComplete = async () => {
        if (isCompleted || isCompleting) return;
        setIsCompleting(true);
        try {
            await completeLesson(lessonId, courseId, {});
            setIsCompleted(true);
        } catch {
            // keep button clickable
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
                <Link href={`/app/courses/${slug}`} className="inline-flex items-center gap-2 text-primary-600 hover:underline text-sm">
                    <ChevronLeft className="h-4 w-4" /> Back to Course
                </Link>
                <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-center">
                    <p className="text-red-700">{error || 'Lesson not found.'}</p>
                    <Button asChild className="mt-4">
                        <Link href={`/app/courses/${slug}`}>Back to Course</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const sections = (lesson as any).sections ?? [];
    const hasSections = Array.isArray(sections) && sections.length > 0;
    const firstVideoSection = hasSections && sections.find((s: any) => s.section_type === 'video' && (s.video_url || s.content_url));
    const topLevelVideo = (lesson as any).video_url ?? (lesson as any).videoUrl ?? (lesson.resources?.find((r: any) => r.resource_type === 'video' || r.file?.includes('.mp4'))?.file) ?? null;
    const videoUrl = topLevelVideo || (firstVideoSection && (firstVideoSection.video_url || firstVideoSection.content_url));
    const youtubeEmbed = videoUrl ? youtubeEmbedUrl(videoUrl) : null;
    const resources = (lesson.resources || []).filter((r: any) => r.title || r.name || r.file);

    return (
        <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <Link
                        href={`/app/courses/${slug}`}
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
                                <LessonPlayer src={videoUrl} />
                            )
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
            </div>

            <div className="w-full lg:w-80 space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Up Next</h3>
                    <Link href={`/app/courses/${slug}`}>
                        <div className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                            <p className="text-sm font-medium text-gray-900">Back to course</p>
                            <p className="text-xs text-gray-500 mt-1">View all modules and lessons</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
