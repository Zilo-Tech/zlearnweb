'use client';

import { Clock, BookOpen, FileText, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ExamCardProps {
  exam: {
    id: string;
    slug?: string;
    title?: string;
    description?: string;
    exam_type?: string;
    exam_board?: string;
    exam_code?: string;
    price?: string;
    currency?: string;
    is_free?: boolean;
    exam_date?: string;
    enrollment_count?: number;
    /** API list/detail use courses_count */
    course_count?: number;
    courses_count?: number;
    /** API uses mock_exams_count */
    mock_exam_count?: number;
    mock_exams_count?: number;
    /** API uses past_papers_count */
    past_paper_count?: number;
    past_papers_count?: number;
    thumbnail?: string | null;
    featured?: boolean;
  };
  isEnrolled?: boolean;
  className?: string;
}

export function ExamCard({ exam, isEnrolled, className }: ExamCardProps) {
  const identifier = exam.slug ?? exam.id;
  const title = exam.title ?? 'Exam';
  const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=446D6D&color=ffffff&size=400`;
  const imageSrc = exam.thumbnail || fallbackImage;
  const isSvgFallback = imageSrc.startsWith('https://ui-avatars.com');

  return (
    <Link href={`/app/exams/${identifier}`}>
      <Card
        className={cn(
          'overflow-hidden transition-all hover:shadow-md border-2 border-primary-200',
          className
        )}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            unoptimized={isSvgFallback}
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {exam.featured && (
              <Badge className="bg-amber-500/90 text-white border-0">Featured</Badge>
            )}
            {exam.is_free && (
              <Badge className="bg-green-600/90 text-white border-0">Free</Badge>
            )}
            {isEnrolled && (
              <Badge className="bg-[#446D6D]/90 text-white border-0">Enrolled</Badge>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            {exam.exam_board && (
              <span className="font-medium text-[#446D6D]">{exam.exam_board}</span>
            )}
            {exam.exam_date && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {new Date(exam.exam_date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
            {(exam.courses_count ?? exam.course_count ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {exam.courses_count ?? exam.course_count} courses
              </span>
            )}
            {(exam.mock_exams_count ?? exam.mock_exam_count ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {exam.mock_exams_count ?? exam.mock_exam_count} mocks
              </span>
            )}
            {(exam.past_papers_count ?? exam.past_paper_count ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {exam.past_papers_count ?? exam.past_paper_count} past papers
              </span>
            )}
            {(exam.enrollment_count ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" />
                {exam.enrollment_count} enrolled
              </span>
            )}
          </div>
          {exam.price != null && !exam.is_free && (
            <p className="mt-2 text-sm font-medium text-gray-700">
              {exam.currency === 'USD' ? '$' : ''}{exam.price}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
