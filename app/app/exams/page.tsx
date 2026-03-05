'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExamCard } from '@/components/exams/exam-card';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchExams, fetchMyEnrollments } from '@/lib/store/slices/exams.slice';
import { selectExamsList, selectExamEnrollments, selectExamsLoading } from '@/lib/store/slices/exams.slice';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils';

export default function ExamsPage() {
  const dispatch = useAppDispatch();
  const list = useAppSelector(selectExamsList) as Record<string, unknown>[];
  const enrollments = useAppSelector(selectExamEnrollments) as { exam?: string; exam_id?: string }[];
  const isLoading = useAppSelector(selectExamsLoading);
  const { isAuthenticated, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    dispatch(
      fetchExams(
        featuredOnly ? { featured: true } : undefined
      )
    ).catch(() => {});
  }, [dispatch, featuredOnly]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchMyEnrollments()).catch(() => {});
    }
  }, [dispatch, isAuthenticated, token]);

  const isEnrolled = (examId: string) =>
    enrollments.some((e) => e.exam === examId || e.exam_id === examId);

  const displayExams = useMemo(() => {
    let items = list ?? [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (exam: Record<string, unknown>) =>
          String(exam.title ?? '').toLowerCase().includes(q) ||
          String(exam.description ?? '').toLowerCase().includes(q) ||
          String(exam.exam_board ?? '').toLowerCase().includes(q) ||
          String(exam.exam_code ?? '').toLowerCase().includes(q)
      );
    }
    return items;
  }, [list, searchQuery]);

  const handleRefresh = () => {
    dispatch(fetchExams(featuredOnly ? { featured: true } : undefined)).catch(() => {});
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exams & Assessments</h1>
          <p className="text-gray-500" suppressHydrationWarning>
            {mounted &&
              'Browse exam packages, practice with mock exams, and access past papers.'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search exams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => setFeaturedOnly(e.target.checked)}
            className="rounded border-gray-300 text-[#446D6D] focus:ring-[#446D6D]"
          />
          Featured only
        </label>
      </div>

      {isLoading && displayExams.length === 0 ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border-2 border-gray-200 bg-white">
          <Loader2 className="h-10 w-10 animate-spin text-[#446D6D]" />
        </div>
      ) : displayExams.length === 0 ? (
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h2 className="mb-2 text-lg font-semibold text-gray-900">No exams found</h2>
          <p className="text-gray-500">
            {searchQuery
              ? "Try adjusting your search."
              : 'No exam packages available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayExams.map((exam: Record<string, unknown>) => (
            <ExamCard
              key={String(exam.id)} 
              exam={{
                id: String(exam.id),
                slug: exam.slug as string | undefined,
                title: exam.title as string,
                description: exam.description as string | undefined,
                exam_type: exam.exam_type as string | undefined,
                exam_board: exam.exam_board as string | undefined,
                exam_code: exam.exam_code as string | undefined,
                price: exam.price as string | undefined,
                currency: exam.currency as string | undefined,
                is_free: exam.is_free as boolean | undefined,
                exam_date: exam.exam_date as string | undefined,
                enrollment_count: exam.enrollment_count as number | undefined,
                course_count: (exam.courses_count ?? exam.course_count) as number | undefined,
                courses_count: exam.courses_count as number | undefined,
                mock_exam_count: (exam.mock_exams_count ?? exam.mock_exam_count) as number | undefined,
                mock_exams_count: exam.mock_exams_count as number | undefined,
                past_paper_count: (exam.past_papers_count ?? exam.past_paper_count) as number | undefined,
                past_papers_count: exam.past_papers_count as number | undefined,
                thumbnail: exam.thumbnail as string | null | undefined,
                featured: exam.featured as boolean | undefined,
              }}
              isEnrolled={isEnrolled(String(exam.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
