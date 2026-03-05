'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FileText, Download, Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { examsService } from '@/lib/services';
import { toast } from 'sonner';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';

const FILE_TYPES: { key: 'question_paper' | 'answer_key' | 'marking_scheme' | 'solutions_pdf'; label: string }[] = [
  { key: 'question_paper', label: 'Question paper' },
  { key: 'answer_key', label: 'Answer key' },
  { key: 'marking_scheme', label: 'Marking scheme' },
  { key: 'solutions_pdf', label: 'Solutions (PDF)' },
];

export default function PastPaperDetailPage() {
  const params = useParams();
  const examId = params?.examId as string;
  const pastPaperId = params?.pastPaperId as string;
  const [paper, setPaper] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!examId || !pastPaperId) return;
    setLoading(true);
    examsService
      .getPastPaperDetails(examId, pastPaperId)
      .then((data) => setPaper(data as Record<string, unknown>))
      .catch(() => setPaper(null))
      .finally(() => setLoading(false));
  }, [examId, pastPaperId]);

  const handleDownload = async (fileType: 'question_paper' | 'answer_key' | 'marking_scheme' | 'solutions_pdf') => {
    if (!pastPaperId) return;
    setDownloading(fileType);
    try {
      const res = await examsService.downloadPastPaper(pastPaperId, fileType);
      const url = (res as { download_url?: string })?.download_url;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
        toast.success('Download started');
      } else {
        toast.error('Download link not available');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Download failed');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#446D6D]" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Past paper not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href={`/app/exams/${examId}`}>Back to Exam</Link>
        </Button>
      </div>
    );
  }

  const title = (paper.title as string) ?? 'Past paper';
  const description = paper.description as string | undefined;
  const year = paper.year as number | undefined;
  const session = paper.session as string | undefined;
  const totalMarks = paper.total_marks as number | undefined;
  const durationMinutes = paper.duration_minutes as number | undefined;
  const isFree = paper.is_free as boolean | undefined;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/app/exams/${examId}`} className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Exam
        </Link>
      </Button>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {(year != null || session) && (
              <p className="mt-1 text-sm text-gray-500">
                {[session, year].filter(Boolean).join(' ')}
                {totalMarks != null && ` · ${totalMarks} marks`}
                {durationMinutes != null && durationMinutes > 0 && ` · ${durationMinutes} min`}
                {isFree && (
                  <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-800">
                    Free
                  </span>
                )}
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100">
            <FileText className="h-6 w-6 text-primary-700" />
          </div>
        </div>

        {description && (
          <div
            className="mt-4 prose prose-sm max-w-none text-gray-600 prose-a:text-primary-600 prose-a:underline"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(description) }}
          />
        )}

        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Downloads</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {FILE_TYPES.map(({ key, label }) => {
              const hasFile =
                paper[key] != null &&
                paper[key] !== '' &&
                (typeof paper[key] === 'string' || (paper[key] as Record<string, unknown>)?.url != null);
              return (
                <Button
                  key={key}
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => handleDownload(key)}
                  disabled={downloading !== null}
                >
                  {downloading === key ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {label}
                  {!hasFile && (
                    <span className="ml-1 text-xs font-normal text-gray-400">(may not be available)</span>
                  )}
                </Button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Download links are valid for 24 hours. Enrollment may be required for some papers.
          </p>
        </div>
      </div>
    </div>
  );
}
