'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Trophy, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAppSelector } from '@/lib/store/hooks';
import { selectExamResults } from '@/lib/store/slices/exams.slice';
import { examsService } from '@/lib/services';
import { cn } from '@/lib/utils';

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  const mins = m % 60;
  return `${h}h ${mins}m`;
}

export default function ExamResultsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const examId = params?.examId as string;
  const attemptIdFromUrl = searchParams?.get('attempt');
  const resultsFromState = useAppSelector(selectExamResults) as Record<string, unknown>[];
  const [attemptResult, setAttemptResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(!!attemptIdFromUrl);

  useEffect(() => {
    if (attemptIdFromUrl) {
      setLoading(true);
      examsService
        .getAttemptDetails(attemptIdFromUrl)
        .then((data) => setAttemptResult(data as Record<string, unknown>))
        .catch(() => setAttemptResult(null))
        .finally(() => setLoading(false));
    } else if (resultsFromState?.length > 0) {
      setAttemptResult(resultsFromState[0] as Record<string, unknown>);
    } else {
      setAttemptResult(null);
    }
  }, [attemptIdFromUrl, resultsFromState]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#446D6D]" />
      </div>
    );
  }

  const result = attemptResult;
  const score = Number(result?.score ?? 0);
  const passed = !!(result?.passed ?? result?.pass);
  const correctCount = Number(result?.correct_count ?? result?.correct ?? 0);
  const timeTaken = Number(result?.time_taken_seconds ?? 0);
  const totalQuestions = Number((result?.results as { total_questions?: number })?.total_questions) ?? 0;
  const percentage = totalQuestions > 0 ? Math.round((score / 100) * totalQuestions) : Math.round(score);
  const displayScore = typeof result?.score === 'number' ? result.score : percentage;

  return (
    <div className="mx-auto max-w-3xl space-y-8 text-center">
      <div className="space-y-4">
        <div
          className={cn(
            'mx-auto flex h-24 w-24 items-center justify-center rounded-full',
            passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          )}
        >
          <Trophy className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {passed ? 'Congratulations!' : 'Keep Practicing!'}
        </h1>
        <p className="text-gray-500">
          You scored{' '}
          <span className="font-bold text-gray-900">
            {displayScore}%{correctCount > 0 ? ` (${correctCount} correct)` : ''}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {correctCount > 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <CheckCircle className="mx-auto mb-2 h-6 w-6 text-green-500" />
            <p className="text-sm text-gray-500">Correct</p>
            <p className="text-xl font-bold text-gray-900">{correctCount}</p>
          </div>
        )}
        {timeTaken > 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <Clock className="mx-auto mb-2 h-6 w-6 text-blue-500" />
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-xl font-bold text-gray-900">{formatDuration(timeTaken)}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button size="lg" variant="outline" asChild>
          <Link href={`/app/exams/${examId}`}>Back to Exam</Link>
        </Button>
        <Button size="lg" className="bg-[#446D6D] hover:bg-[#3A5F5F]" asChild>
          <Link href="/app/exams">All Exams</Link>
        </Button>
      </div>
    </div>
  );
}
