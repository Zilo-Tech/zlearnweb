'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Timer, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAppDispatch } from '@/lib/store/hooks';
import { submitMockAttempt } from '@/lib/store/slices/exams.slice';
import { examsService } from '@/lib/services';
import { toast } from 'sonner';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  text?: string;
  question_text?: string;
  options?: { id: string; text?: string; option_text?: string }[];
}

export default function TakeMockExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.examId as string;
  const mockExamId = params?.mockExamId as string;
  const dispatch = useAppDispatch();

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mockExamInfo, setMockExamInfo] = useState<Record<string, unknown> | null>(null);
  const isTimed = mockExamInfo?.is_timed !== false && durationMinutes > 0;

  useEffect(() => {
    if (!mockExamId) return;
    setLoading(true);
    setError(null);
    examsService
      .startMockExamAttempt(mockExamId)
      .then((res: Record<string, unknown>) => {
        setAttemptId(res.id as string);
        const rawQs = (res.questions as Question[]) ?? [];
        const sorted = [...rawQs].sort(
          (a, b) => ((a as { order?: number }).order ?? 0) - ((b as { order?: number }).order ?? 0)
        );
        setQuestions(sorted);
        const info = res.mock_exam_info as Record<string, unknown> | undefined;
        const timeLimit = (info?.time_limit_minutes as number) ?? (res.duration_minutes as number) ?? 0;
        setDurationMinutes(timeLimit);
        setTimeLeftSeconds(timeLimit * 60);
        setTitle(
          (res.mock_exam_title as string) ??
            (info?.title as string) ??
            (res.mock_exam as { title?: string })?.title ??
            'Mock Exam'
        );
        if (info && typeof info === 'object') setMockExamInfo(info);
      })
      .catch((e) => {
        setError(e?.message ?? 'Failed to start attempt');
      })
      .finally(() => setLoading(false));
  }, [mockExamId]);

  useEffect(() => {
    if (!isTimed || durationMinutes <= 0 || isSubmitting) return;
    const t = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          submitRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isTimed, durationMinutes, isSubmitting]);

  const handleSubmit = useCallback(async () => {
    if (!attemptId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await dispatch(submitMockAttempt({ attemptId, answers })).unwrap();
      toast.success('Exam submitted!');
      router.push(`/app/exams/${examId}/results`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Submit failed');
      setIsSubmitting(false);
    }
  }, [attemptId, answers, dispatch, examId, router, isSubmitting]);

  const submitRef = useRef(handleSubmit);
  submitRef.current = handleSubmit;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#446D6D]" />
      </div>
    );
  }

  if (error || !attemptId || questions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">{error ?? 'No questions loaded.'}</p>
        <Button variant="outline" className="mt-4" asChild>
          <a href={`/app/exams/${examId}`}>Back to Exam</a>
        </Button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const questionText = currentQ.text ?? currentQ.question_text ?? '';
  const options = currentQ.options ?? [];
  const progress = (Object.keys(answers).length / questions.length) * 100;
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="truncate text-sm font-semibold text-gray-900 md:max-w-md md:text-base">
              {title}
            </h1>
            <p className="text-xs text-gray-500">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
          {isTimed && (
            <div
              className={cn(
                'flex items-center gap-2 font-mono font-medium',
                timeLeftSeconds < 300 ? 'animate-pulse text-red-600' : 'text-[#446D6D]'
              )}
            >
              <Timer className="h-5 w-5" />
              {formatTime(timeLeftSeconds)}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
          <div
            className="h-full bg-[#446D6D] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-24">
        {(mockExamInfo?.instructions as string) && (
          <div className="mb-6 rounded-xl border border-primary-200 bg-primary-50/50 p-4 text-sm text-gray-700 whitespace-pre-wrap">
            {(mockExamInfo?.instructions as string)}
          </div>
        )}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {questions.map((_, idx) => {
            const q = questions[idx];
            const answered = !!answers[q.id];
            const current = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  current && 'ring-2 ring-[#446D6D] ring-offset-2 bg-[#446D6D] text-white',
                  !current && answered && 'bg-[#446D6D]/20 text-[#446D6D]',
                  !current && !answered && 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div
            className="prose prose-gray max-w-none prose-p:my-2 prose-a:text-primary-600 prose-a:underline"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(questionText) }}
          />
          <ul className="mt-4 space-y-2">
            {options.map((opt) => {
              const optId = opt.id;
              const optText = opt.text ?? opt.option_text ?? '';
              const selected = answers[currentQ.id] === optId;
              return (
                <li key={optId}>
                  <button
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [currentQ.id]: optId }))
                    }
                    className={cn(
                      'w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors',
                      selected
                        ? 'border-[#446D6D] bg-[#446D6D]/10 text-[#446D6D]'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <span dangerouslySetInnerHTML={{ __html: markdownToHtml(optText) }} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {isLast ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Submit Exam
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit exam?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have answered {Object.keys(answers).length} of {questions.length} questions.
                    Submit now?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep working</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleSubmit()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              onClick={() =>
                setCurrentIndex((p) => Math.min(questions.length - 1, p + 1))
              }
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
