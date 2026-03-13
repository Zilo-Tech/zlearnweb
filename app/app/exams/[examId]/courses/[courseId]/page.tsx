'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { BookOpen, Loader2, Clock, ChevronRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { examsService } from '@/lib/services';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchMyEnrollments } from '@/lib/store/slices/exams.slice';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUuid(s: string): boolean {
  return UUID_REGEX.test(s ?? '');
}

export default function ExamCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const examId = params?.examId as string;
  const courseId = params?.courseId as string;
  const [course, setCourse] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [continueLoading, setContinueLoading] = useState(false);
  const enrollments = useAppSelector((state) => state.exams.enrollments) as Record<string, unknown>[];

  useEffect(() => {
    if (examId) dispatch(fetchMyEnrollments());
  }, [examId, dispatch]);

  useEffect(() => {
    if (!examId || !courseId) return;
    setLoading(true);
    examsService
      .getExamCourseDetails(examId, courseId)
      .then((data) => {
        setCourse(data as Record<string, unknown>);
      })
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [examId, courseId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#446D6D]" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-12 text-center text-gray-500">
        Course not found.
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`/app/exams/${examId}/courses`}>Back to Courses</Link>
        </Button>
      </div>
    );
  }

  const modules = (course.modules as Record<string, unknown>[]) ?? [];
  const title = (course.title as string) ?? 'Course';
  const description = (course.description as string) ?? '';
  const shortDescription = course.short_description as string | undefined;
  const estimatedHours = course.estimated_hours as number | undefined;
  const difficultyDisplay = course.difficulty_display as string | undefined;
  const learningObjectives = (course.learning_objectives as string[]) ?? [];
  const courseUuid = course.id as string;
  const sortedModules = [...modules].sort(
    (a, b) => ((a.order as number) ?? 0) - ((b.order as number) ?? 0)
  );

  const handleContinue = async () => {
    if (!sortedModules.length) return;
    setContinueLoading(true);
    try {
      const enrollment = enrollments?.find(
        (e) => (e.exam as string) === examId || (e.exam as { id?: string })?.id === examId
      ) as { completed_lessons?: string[] } | undefined;
      const completedSet = new Set(enrollment?.completed_lessons ?? []);

      for (const mod of sortedModules) {
        const modLessons = (mod.lessons as Record<string, unknown>[]) ?? [];
        let lessonIds: string[] = [];
        if (modLessons.length > 0) {
          const ordered = [...modLessons].sort((a, b) => ((a.order as number) ?? 0) - ((b.order as number) ?? 0));
          lessonIds = ordered.map((l) => l.id as string);
        } else {
          const modData = await examsService.getModuleDetails(courseUuid, mod.id as string) as Record<string, unknown>;
          const lessons = (modData.lessons as Record<string, unknown>[]) ?? [];
          const ordered = [...lessons].sort((a, b) => ((a.order as number) ?? 0) - ((b.order as number) ?? 0));
          lessonIds = ordered.map((l) => l.id as string);
        }
        for (const lid of lessonIds) {
          if (!completedSet.has(lid)) {
            router.push(`/app/exams/${examId}/courses/${courseId}/modules/${mod.id}/lessons/${lid}`);
            return;
          }
        }
      }
      const firstMod = sortedModules[0];
      const firstModLessons = (firstMod.lessons as Record<string, unknown>[]) ?? [];
      const firstLessonId =
        firstModLessons.length > 0
          ? (firstModLessons.sort((a, b) => ((a.order as number) ?? 0) - ((b.order as number) ?? 0))[0].id as string)
          : null;
      if (!firstLessonId) {
        const modData = await examsService.getModuleDetails(courseUuid, firstMod.id as string) as Record<string, unknown>;
        const lessons = (modData.lessons as Record<string, unknown>[]) ?? [];
        const ordered = [...lessons].sort((a, b) => ((a.order as number) ?? 0) - ((b.order as number) ?? 0));
        const first = ordered[0];
        if (first?.id) {
          router.push(`/app/exams/${examId}/courses/${courseId}/modules/${firstMod.id}/lessons/${first.id}`);
        }
      } else {
        router.push(`/app/exams/${examId}/courses/${courseId}/modules/${firstMod.id}/lessons/${firstLessonId}`);
      }
    } finally {
      setContinueLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/app/exams/${examId}/courses`}>← Back to Courses</Link>
        </Button>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{title}</h1>
        {(shortDescription || estimatedHours != null || difficultyDisplay) && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            {shortDescription && <span>{shortDescription}</span>}
            {estimatedHours != null && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {estimatedHours} hours
              </span>
            )}
            {difficultyDisplay && (
              <span className="rounded bg-gray-100 px-2 py-0.5 font-medium">{difficultyDisplay}</span>
            )}
          </div>
        )}
        {description && (
          <div
            className="mt-3 prose prose-sm max-w-none text-gray-600 prose-a:text-primary-600 prose-a:underline"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(description) }}
          />
        )}
        {learningObjectives.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900">Learning objectives</h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
              {learningObjectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6">
          <Button
            className="bg-[#446D6D] hover:bg-[#3A5F5F] gap-2"
            size="lg"
            onClick={handleContinue}
            disabled={continueLoading || sortedModules.length === 0}
          >
            {continueLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <PlayCircle className="h-5 w-5" />
            )}
            Continue learning
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Modules</h2>
        {modules.length === 0 ? (
          <p className="text-gray-500">No modules yet.</p>
        ) : (
          <ul className="space-y-3">
            {(modules as Record<string, unknown>[])
              .sort((a, b) => (a.order as number) - (b.order as number))
              .map((mod: Record<string, unknown>) => {
                const moduleId = mod.id as string;
                const lessonsCount = (mod.lessons_count as number) ?? 0;
                const modLessons = (mod.lessons as Record<string, unknown>[]) ?? [];
                const hasLessonsList = modLessons.length > 0;
                return (
                  <li
                    key={moduleId}
                    className="rounded-xl border border-gray-200 bg-white overflow-hidden"
                  >
                    <Link
                      href={`/app/exams/${examId}/courses/${courseId}/modules/${moduleId}`}
                      className="flex items-center justify-between gap-4 px-4 py-4 text-left hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900">{mod.title as string}</div>
                        {(mod.description as string) && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {mod.description as string}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                          <BookOpen className="inline h-3.5 w-3.5" />
                          {hasLessonsList
                            ? `${modLessons.length} lessons`
                            : `${lessonsCount} lesson${lessonsCount === 1 ? '' : 's'}`}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
                    </Link>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}
