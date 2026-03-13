'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle, FileText, Loader2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonSectionBlock, type LessonSection } from '@/components/courses/lesson-section-block';
import { LessonPlayer } from '@/components/courses/lesson-player';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { completeExamLesson, selectCurrentExam } from '@/lib/store/slices/exams.slice';
import { examsService } from '@/lib/services';
import { toast } from 'sonner';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUuid(s: string): boolean {
  return UUID_REGEX.test(s ?? '');
}

export default function ExamLessonPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.examId as string;
  const courseId = params?.courseId as string;
  const moduleId = params?.moduleId as string;
  const lessonId = params?.lessonId as string;
  const dispatch = useAppDispatch();
  const exam = useAppSelector(selectCurrentExam);

  const [lesson, setLesson] = useState<Record<string, unknown> | null>(null);
  const [moduleLessons, setModuleLessons] = useState<{ id: string }[]>([]);
  const [moduleListLoaded, setModuleListLoaded] = useState(false);
  const [courseModules, setCourseModules] = useState<{ id: string; order: number }[]>([]);
  const [nextModuleFirstLesson, setNextModuleFirstLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!moduleId || !lessonId) return;
    setLoading(true);
    examsService
      .getLessonDetails(moduleId, lessonId)
      .then((data) => setLesson(data as Record<string, unknown>))
      .catch(() => setLesson(null))
      .finally(() => setLoading(false));
  }, [moduleId, lessonId]);

  useEffect(() => {
    if (!courseId || !moduleId) return;
    setModuleListLoaded(false);
    const loadModule = () => {
      if (isUuid(courseId)) {
        return examsService.getModuleDetails(courseId, moduleId);
      }
      return examsService
        .getExamCourseDetails(examId, courseId)
        .then((c: Record<string, unknown>) => examsService.getModuleDetails((c.id as string), moduleId));
    };
    loadModule()
      .then((data: Record<string, unknown>) => {
        const lessons = (data.lessons as Record<string, unknown>[]) ?? [];
        const ordered = [...lessons].sort((a, b) => ((a.order as number) ?? 0) - ((b.order as number) ?? 0));
        setModuleLessons(ordered.map((l) => ({ id: l.id as string })));
      })
      .catch(() => setModuleLessons([]))
      .finally(() => setModuleListLoaded(true));
  }, [examId, courseId, moduleId]);

  // Load course modules (ordered) so we can offer "Next module" when at last lesson of current module
  useEffect(() => {
    if (!examId || !courseId) return;
    const loadCourse = () => {
      if (isUuid(courseId)) {
        return examsService.getExamCourseDetails(examId, courseId);
      }
      return examsService.getExamCourseDetails(examId, courseId);
    };
    loadCourse()
      .then((data: Record<string, unknown>) => {
        const mods = (data.modules as Record<string, unknown>[]) ?? [];
        const ordered = [...mods].sort((a, b) => ((a.order as number) ?? 0) - ((b.order as number) ?? 0));
        setCourseModules(ordered.map((m) => ({ id: m.id as string, order: (m.order as number) ?? 0 })));
      })
      .catch(() => setCourseModules([]));
  }, [examId, courseId]);

  // When at last lesson of module, resolve first lesson of next module (for "Next module" button)
  useEffect(() => {
    if (!moduleListLoaded || nextLessonId != null || !courseModules.length) {
      setNextModuleFirstLesson(null);
      return;
    }
    const currentIndex = courseModules.findIndex((m) => m.id === moduleId);
    if (currentIndex < 0 || currentIndex >= courseModules.length - 1) {
      setNextModuleFirstLesson(null);
      return;
    }
    const nextMod = courseModules[currentIndex + 1];
    const courseUuid = isUuid(courseId) ? courseId : null;
    const resolveCourseUuid = courseUuid
      ? Promise.resolve(courseUuid)
      : examsService.getExamCourseDetails(examId, courseId).then((c: Record<string, unknown>) => c.id as string);
    resolveCourseUuid
      .then((uuid) => examsService.getModuleDetails(uuid, nextMod.id))
      .then((modData: Record<string, unknown>) => {
        const lessons = (modData.lessons as Record<string, unknown>[]) ?? [];
        const ordered = [...lessons].sort((a, b) => ((a.order as number) ?? 0) - ((b.order as number) ?? 0));
        const first = ordered[0];
        if (first?.id) {
          setNextModuleFirstLesson({ moduleId: nextMod.id, lessonId: first.id as string });
        } else {
          setNextModuleFirstLesson(null);
        }
      })
      .catch(() => setNextModuleFirstLesson(null));
  }, [moduleListLoaded, nextLessonId, courseModules, moduleId, examId, courseId]);

  const getPrevNext = () => {
    const idx = moduleLessons.findIndex((l) => l.id === lessonId);
    if (idx < 0) return { prev: null, next: null };
    return {
      prev: idx > 0 ? moduleLessons[idx - 1].id : null,
      next: idx < moduleLessons.length - 1 && idx >= 0 ? moduleLessons[idx + 1].id : null,
    };
  };
  const { prev: previousLessonId, next: nextLessonId } = getPrevNext();

  const handleComplete = async (): Promise<boolean> => {
    setCompleting(true);
    try {
      await dispatch(completeExamLesson({ lessonId })).unwrap();
      toast.success('Lesson marked complete!');
      setLesson((prev) => (prev ? { ...prev, is_completed: true, completed: true } : null));
      return true;
    } catch {
      toast.error('Could not mark lesson complete.');
      return false;
    } finally {
      setCompleting(false);
    }
  };

  const handlePrevious = () => {
    if (previousLessonId) {
      router.push(`/app/exams/${examId}/courses/${courseId}/modules/${moduleId}/lessons/${previousLessonId}`);
    }
  };

  const handleNext = async () => {
    const completed = !!(lesson?.is_completed ?? lesson?.completed);
    if (!completed && !completing) {
      const ok = await handleComplete();
      if (!ok) return;
    }
    if (nextLessonId) {
      router.push(`/app/exams/${examId}/courses/${courseId}/modules/${moduleId}/lessons/${nextLessonId}`);
    } else if (nextModuleFirstLesson) {
      router.push(
        `/app/exams/${examId}/courses/${courseId}/modules/${nextModuleFirstLesson.moduleId}/lessons/${nextModuleFirstLesson.lessonId}`
      );
    } else {
      router.push(`/app/exams/${examId}/courses/${courseId}/modules/${moduleId}`);
    }
  };

  if (loading && !lesson) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#446D6D]" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Lesson not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`/app/exams/${examId}/courses/${courseId}`}>Back to Course</Link>
        </Button>
      </div>
    );
  }

  const sections = (lesson.sections as LessonSection[] | undefined) ?? [];
  const isCompleted = !!(lesson.is_completed ?? lesson.completed);
  const isPreview = lesson.is_preview as boolean | undefined;
  const durationMinutes = lesson.duration_minutes as number | undefined;
  const resources = (lesson.resources as Record<string, unknown>[] | undefined) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/app/exams/${examId}/courses/${courseId}/modules/${moduleId}`}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Module
          </Link>
        </Button>
      </div>

      {Boolean(lesson.video_url || lesson.videoUrl) && (
        <LessonPlayer
          src={(lesson.video_url ?? lesson.videoUrl) as string}
          poster={lesson.video_thumbnail as string | undefined}
          title={lesson.title as string}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title as string}</h1>
            {isPreview && (
              <span className="rounded bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                Preview
              </span>
            )}
          </div>
          {durationMinutes != null && durationMinutes > 0 && (
            <p className="mt-1 text-sm text-gray-500">{durationMinutes} min</p>
          )}
        </div>
        <Button
          variant={isCompleted ? 'outline' : 'default'}
          className={isCompleted ? 'text-green-600 border-green-200 bg-green-50' : 'bg-[#446D6D] hover:bg-[#3A5F5F]'}
          onClick={handleComplete}
          disabled={completing || isCompleted}
        >
          {completing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isCompleted ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Completed
            </>
          ) : (
            'Mark as Complete'
          )}
        </Button>
      </div>

      {sections.length > 0 && (
        <div className="space-y-6">
          {([...sections] as LessonSection[])
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
        </TabsList>
        <TabsContent value="description" className="mt-4 space-y-4">
          {Boolean(lesson.content || lesson.description) && (
            <div
              className="prose prose-gray max-w-none text-gray-600 leading-relaxed prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml((lesson.content ?? lesson.description) as string),
              }}
            />
          )}
          {Array.isArray(lesson.learning_objectives) && lesson.learning_objectives.length > 0 && (
            <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Target className="h-4 w-4" />
                Learning objectives
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                {(lesson.learning_objectives as string[]).map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {Boolean(!lesson.content && !lesson.description && (!Array.isArray(lesson.learning_objectives) || (lesson.learning_objectives as unknown[])?.length === 0)) && (
            <p className="text-gray-500">No description available.</p>
          )}
        </TabsContent>
        <TabsContent value="resources" className="mt-4 space-y-3">
          {resources.length > 0 ? (
            resources.map((resource: Record<string, unknown>, i: number) => {
              const url = (resource.url ?? resource.file) as string | undefined;
              const typeDisplay = resource.resource_type_display as string | undefined;
              return (
                <div
                  key={(resource.id as string) ?? i}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{resource.title as string}</p>
                    {typeDisplay && (
                      <span className="mt-0.5 inline-block text-xs font-medium text-[#446D6D]">{typeDisplay}</span>
                    )}
                    {Boolean(resource.description) && (
                      <p className="mt-0.5 text-xs text-gray-500">{resource.description as string}</p>
                    )}
                  </div>
                  {url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-sm font-medium text-[#446D6D] hover:underline"
                    >
                      Open
                    </a>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No resources.</p>
          )}
        </TabsContent>
      </Tabs>

      {/* Bottom navigation: Prev / Mark as complete + Next (Next auto-triggers complete if not done) */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={!previousLessonId}
            className="gap-2"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous lesson
          </Button>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!isCompleted && (
              <Button
                variant="secondary"
                size="lg"
                onClick={handleComplete}
                disabled={completing}
                className="gap-2 order-2 sm:order-1"
              >
                {completing ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                {completing ? 'Saving...' : 'Mark as complete'}
              </Button>
            )}
            <Button
              size="lg"
              onClick={handleNext}
              disabled={completing || (!moduleListLoaded && !nextLessonId && !nextModuleFirstLesson)}
              className="gap-2 bg-[#446D6D] hover:bg-[#3A5F5F] order-1 sm:order-2"
            >
              {!moduleListLoaded ? (
                <>
                  Loading…
                  <Loader2 className="h-5 w-5 animate-spin" />
                </>
              ) : nextLessonId ? (
                <>
                  {isCompleted ? 'Next lesson' : 'Complete & next'}
                  <ChevronRight className="h-5 w-5" />
                </>
              ) : nextModuleFirstLesson ? (
                <>
                  {isCompleted ? 'Next module' : 'Complete & next'}
                  <ChevronRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  Back to module
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center sm:text-right">
          {!moduleListLoaded
            ? 'Loading lesson list…'
            : nextLessonId
                ? (isCompleted
                    ? 'Go to the next lesson.'
                    : 'Click "Complete & next" to mark this lesson complete and continue.')
                : nextModuleFirstLesson
                    ? (isCompleted
                        ? 'Go to the next module.'
                        : 'Click "Complete & next" to mark this lesson complete and continue to the next module.')
                    : "You’ve reached the end of this module."}
        </p>
      </div>
    </div>
  );
}
