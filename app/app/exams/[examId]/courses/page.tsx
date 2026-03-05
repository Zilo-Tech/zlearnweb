'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchExamDetails, selectCurrentExam } from '@/lib/store/slices/exams.slice';

export default function ExamCoursesPage() {
  const params = useParams();
  const examId = params?.examId as string;
  const dispatch = useAppDispatch();
  const exam = useAppSelector(selectCurrentExam) as Record<string, unknown> | null;

  useEffect(() => {
    if (examId && (!exam || exam.id !== examId)) {
      dispatch(fetchExamDetails(examId)).catch(() => {});
    }
  }, [dispatch, examId, exam?.id]);

  const courses = (exam?.courses as Record<string, unknown>[]) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/app/exams/${examId}`}>Back to Exam</Link>
        </Button>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Course Content</h1>
        <p className="text-gray-500">Select a course to view modules and lessons.</p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          No courses in this exam yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course: Record<string, unknown>) => {
            const cId = course.id as string;
            const modules = (course.modules as Record<string, unknown>[]) ?? [];
            let lessonCount = 0;
            for (const m of modules) {
              const les = m.lessons as unknown[] | undefined;
              lessonCount += les?.length ?? (m.lesson_count as number) ?? 0;
            }
            return (
              <Link key={cId} href={`/app/exams/${examId}/courses/${cId}`}>
                <div className="rounded-xl border-2 border-gray-200 bg-white p-5 hover:border-[#446D6D]/30 hover:shadow-md">
                  <BookOpen className="mb-3 h-10 w-10 text-[#446D6D]" />
                  <h2 className="font-semibold text-gray-900">{course.title as string}</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {modules.length} modules, {lessonCount} lessons
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
