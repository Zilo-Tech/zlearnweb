'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Clock,
  BookOpen,
  Trophy,
  FileText,
  AlertTriangle,
  CheckCircle,
  Loader2,
  PlayCircle,
  Award,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchExamDetails,
  fetchMyEnrollments,
  fetchMockExams,
  enrollInExam,
  selectCurrentExam,
  selectExamEnrollments,
  selectMockExams,
  selectExamsLoading,
  selectIsEnrolledInExam,
} from '@/lib/store/slices/exams.slice';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ExamDetailsPage() {
  const params = useParams();
  const examId = params?.examId as string;
  const dispatch = useAppDispatch();
  const exam = useAppSelector(selectCurrentExam) as Record<string, unknown> | null;
  const enrollments = useAppSelector(selectExamEnrollments) as { exam?: string }[];
  const mockExams = useAppSelector(selectMockExams) as Record<string, unknown>[];
  const isLoading = useAppSelector(selectExamsLoading);
  const isEnrolled = useAppSelector(selectIsEnrolledInExam(exam?.id as string ?? examId));

  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    if (examId) {
      dispatch(fetchExamDetails(examId)).catch(() => {});
      dispatch(fetchMyEnrollments()).catch(() => {});
    }
  }, [dispatch, examId]);

  useEffect(() => {
    if (examId && isEnrolled) {
      dispatch(fetchMockExams(examId)).catch(() => {});
    }
  }, [dispatch, examId, isEnrolled]);

  const handleEnroll = async () => {
    if (!examId) return;
    setIsEnrolling(true);
    try {
      await dispatch(enrollInExam({ examId })).unwrap();
      toast.success('Enrolled successfully!');
      dispatch(fetchExamDetails(examId));
      dispatch(fetchMockExams(examId));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Enrollment failed';
      if (String(msg).toLowerCase().includes('already enrolled')) {
        toast.info('You are already enrolled.');
        dispatch(fetchExamDetails(examId));
      } else {
        toast.error(msg);
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const courses = (exam?.courses as Record<string, unknown>[] | undefined) ?? [];
  const progress = Number((exam as { progress_percentage?: number })?.progress_percentage) ?? 0;
  // Detail API can embed mock_exams; fall back to slice when fetched separately
  const mockExamsFromDetail = (exam?.mock_exams as Record<string, unknown>[] | undefined) ?? [];
  const mockList = mockExamsFromDetail.length > 0 ? mockExamsFromDetail : mockExams;
  const pastPapers = (exam?.past_papers as Record<string, unknown>[] | undefined) ?? [];
  const coursesCount = (exam?.courses_count ?? exam?.course_count) as number | undefined;
  const mockExamsCount = (exam?.mock_exams_count ?? exam?.mock_exam_count) as number | undefined;
  const pastPapersCount = (exam?.past_papers_count ?? exam?.past_paper_count) as number | undefined;

  if (isLoading && !exam) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#446D6D]" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-gray-500">Exam not found.</p>
        <Button variant="outline" asChild>
          <Link href="/app/exams">Back to Exams</Link>
        </Button>
      </div>
    );
  }

  const title = (exam.title as string) ?? 'Exam';
  const description = (exam.description as string) ?? '';
  const examBoard = exam.exam_board as string | undefined;
  const examDate = exam.exam_date as string | undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex flex-wrap items-center gap-2">
          {examBoard && (
            <Badge className="bg-[#446D6D]/10 text-[#446D6D] hover:bg-[#446D6D]/20">
              {examBoard}
            </Badge>
          )}
          {((exam as { exam_type_display?: string }).exam_type_display ?? (exam as { exam_type?: string }).exam_type) && (
            <Badge variant="secondary">
              {(exam as { exam_type_display?: string }).exam_type_display ?? (exam as { exam_type?: string }).exam_type}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{title}</h1>

        {(exam as { short_description?: string }).short_description && (
          <p className="text-lg text-gray-600">
            {(exam as { short_description?: string }).short_description}
          </p>
        )}

        {description && (
          <div
            className="prose prose-gray max-w-none text-gray-600 [&_h2]:text-xl [&_h3]:text-lg prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(description) }}
          />
        )}

        {/* Course content */}
        {courses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
            <ul className="space-y-3">
              {courses.map((course: Record<string, unknown>) => {
                const cId = (course.slug as string) ?? (course.id as string);
                const modules = (course.modules as Record<string, unknown>[]) ?? [];
                const modulesCount = (course.modules_count as number) ?? modules.length;
                const lessonCount =
                  (course.total_lessons as number) ??
                  modules.reduce(
                    (sum, m) => sum + ((m.lessons as unknown[])?.length ?? (m.lesson_count as number) ?? 0),
                    0
                  );
                return (
                  <li key={String(course.id)} className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{course.title as string}</h3>
                        <p className="text-sm text-gray-500">
                          {modulesCount} modules · {lessonCount} lessons
                        </p>
                      </div>
                      {isEnrolled && (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/app/exams/${examId}/courses/${cId}`}>
                            View
                          </Link>
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Mock exams */}
        {mockList.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Mock Exams</h2>
            <ul className="space-y-3">
              {mockList.map((mock: Record<string, unknown>) => {
                const mockId = mock.id as string;
                const totalQuestions = (mock.total_questions as number) ?? 0;
                const duration = (mock.time_limit_minutes as number) ?? (mock.duration_minutes as number) ?? 0;
                const passingMarks = (mock.passing_marks as number) ?? 0;
                const bestScore = (mock.user_best_score as number | null) ?? (mock.best_score as number | null) ?? null;
                return (
                  <li
                    key={mockId}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{mock.title as string}</h3>
                      <p className="text-sm text-gray-500">
                        {totalQuestions} questions · {duration} min · Pass: {passingMarks} marks
                        {bestScore != null && ` · Best: ${bestScore}`}
                      </p>
                    </div>
                    {isEnrolled ? (
                      <Button size="sm" className="bg-[#446D6D] hover:bg-[#3A5F5F]" asChild>
                        <Link href={`/app/exams/${examId}/mock/${mockId}/take`}>
                          {bestScore != null ? 'Retake' : 'Start'}
                        </Link>
                      </Button>
                    ) : (
                      <span className="text-sm text-gray-500">Enroll to access</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Past papers */}
        {pastPapers.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Past Papers</h2>
            <ul className="space-y-3">
              {pastPapers.map((pp: Record<string, unknown>) => (
                <li key={String(pp.id)}>
                  <Link
                    href={`/app/exams/${exam?.id ?? examId}/past-papers/${pp.id}`}
                    className="block rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#446D6D]/40 hover:bg-gray-50/80"
                  >
                    <h3 className="font-semibold text-gray-900">{pp.title as string}</h3>
                    {(pp.year as number) != null || (pp.session as string) ? (
                      <p className="mt-1 text-sm text-gray-500">
                        {[pp.session, pp.year].filter(Boolean).join(' ')}
                        {(pp.total_marks as number) != null && ` · ${pp.total_marks} marks`}
                        {(pp.duration_minutes as number) > 0 && ` · ${pp.duration_minutes} min`}
                      </p>
                    ) : null}
                    {(pp.description as string) && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{pp.description as string}</p>
                    )}
                    <p className="mt-2 text-xs font-medium text-[#446D6D]">View & download →</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {examDate && (
              <>
                <Clock className="h-5 w-5 text-gray-400" />
                <span>Exam date: {new Date(examDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </>
            )}
          </div>

          {isEnrolled ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-700">Your Progress</span>
                  <span className="text-[#446D6D]">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Button className="w-full bg-[#446D6D] hover:bg-[#3A5F5F]" size="lg" asChild>
                <Link href={`/app/exams/${examId}/courses`}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Continue Learning
                </Link>
              </Button>
              {mockExams.length > 0 && (
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link href={`/app/exams/${examId}/mock`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Practice Tests
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-lg font-semibold text-gray-900">
                {(exam as { is_free?: boolean }).is_free
                  ? 'Free'
                  : `${(exam as { currency?: string }).currency === 'USD' ? '$' : ''}${exam.price ?? '—'} ${(exam as { currency?: string }).currency ?? ''}`.trim()}
              </div>
              <Button
                className="w-full bg-[#446D6D] hover:bg-[#3A5F5F]"
                size="lg"
                onClick={handleEnroll}
                disabled={isEnrolling}
              >
                {isEnrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </Button>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-gray-100">
            {coursesCount != null && coursesCount > 0 && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <span>{coursesCount} courses</span>
              </div>
            )}
            {mockExamsCount != null && mockExamsCount > 0 && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FileText className="h-5 w-5 text-gray-400" />
                <span>{mockExamsCount} mock exams</span>
              </div>
            )}
            {pastPapersCount != null && pastPapersCount > 0 && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FileText className="h-5 w-5 text-gray-400" />
                <span>{pastPapersCount} past papers</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Award className="h-5 w-5 text-gray-400" />
              <span>Certificate on completion</span>
            </div>
          </div>

          <Button variant="outline" className="w-full gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
