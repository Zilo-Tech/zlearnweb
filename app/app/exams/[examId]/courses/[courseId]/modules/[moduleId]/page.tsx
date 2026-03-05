'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpen, Loader2, PlayCircle, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { examsService } from '@/lib/services';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUuid(s: string): boolean {
  return UUID_REGEX.test(s ?? '');
}

export default function ExamModulePage() {
  const params = useParams();
  const examId = params?.examId as string;
  const courseId = params?.courseId as string;
  const moduleId = params?.moduleId as string;
  const [module, setModule] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId || !courseId || !moduleId) return;
    setLoading(true);
    const courseIdIsUuid = isUuid(courseId);
    if (courseIdIsUuid) {
      examsService
        .getModuleDetails(courseId, moduleId)
        .then((data) => setModule(data as Record<string, unknown>))
        .catch(() => setModule(null))
        .finally(() => setLoading(false));
    } else {
      examsService
        .getExamCourseDetails(examId, courseId)
        .then((courseData) => {
          const c = courseData as Record<string, unknown>;
          const uuid = c.id as string;
          return examsService.getModuleDetails(uuid, moduleId);
        })
        .then((data) => setModule(data as Record<string, unknown>))
        .catch(() => setModule(null))
        .finally(() => setLoading(false));
    }
  }, [examId, courseId, moduleId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#446D6D]" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="py-12 text-center text-gray-500">
        Module not found.
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`/app/exams/${examId}/courses/${courseId}`}>Back to Course</Link>
        </Button>
      </div>
    );
  }

  const lessons = (module.lessons as Record<string, unknown>[]) ?? [];
  const title = (module.title as string) ?? 'Module';
  const description = module.description as string | undefined;
  const durationMinutes = module.duration_minutes as number | undefined;
  const learningObjectives = (module.learning_objectives as string[]) ?? [];
  const lessonsCount = module.lessons_count as number | undefined;

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/app/exams/${examId}/courses/${courseId}`}>← Back to Course</Link>
        </Button>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          {durationMinutes != null && durationMinutes > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {durationMinutes >= 60 ? `${Math.round(durationMinutes / 60)} hours` : `${durationMinutes} min`}
            </span>
          )}
          {lessonsCount != null && lessonsCount > 0 && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {lessonsCount} lesson{lessonsCount === 1 ? '' : 's'}
            </span>
          )}
        </p>
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
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Lessons</h2>
        {lessons.length === 0 ? (
          <p className="text-gray-500">No lessons in this module yet.</p>
        ) : (
          <ul className="space-y-2">
            {(lessons as Record<string, unknown>[])
              .sort((a, b) => ((a.order as number) ?? 0) - ((b.order as number) ?? 0))
              .map((lesson: Record<string, unknown>) => {
                const lessonId = lesson.id as string;
                const lessonType = (lesson.lesson_type as string) ?? (lesson.content_type as string) ?? 'mixed';
                const duration = lesson.duration_minutes as number | undefined;
                const isPreview = lesson.is_preview as boolean | undefined;
                const sectionsCount = lesson.sections_count as number | undefined;
                const resourcesCount = lesson.resources_count as number | undefined;
                const isVideo = lessonType === 'video';
                return (
                  <li key={lessonId}>
                    <Link
                      href={`/app/exams/${examId}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`}
                      className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium text-gray-900">
                          {lesson.title as string}
                        </span>
                        {(lesson.description as string) && (
                          <p className="mt-0.5 line-clamp-1 text-sm text-gray-500">
                            {lesson.description as string}
                          </p>
                        )}
                      </div>
                      <span className="flex shrink-0 items-center gap-2 text-sm text-gray-500">
                        {isPreview && (
                          <span className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-700">
                            Preview
                          </span>
                        )}
                        {isVideo ? <PlayCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        {duration != null && duration > 0 && `${duration} min`}
                        {sectionsCount != null && sectionsCount > 0 && ` · ${sectionsCount} sections`}
                        {resourcesCount != null && resourcesCount > 0 && ` · ${resourcesCount} resources`}
                      </span>
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
