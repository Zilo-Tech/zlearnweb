'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ExamCard } from '@/components/exams/exam-card';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchExams, fetchMyEnrollments } from '@/lib/store/slices/exams.slice';
import { selectExamsList, selectExamEnrollments, selectExamsLoading } from '@/lib/store/slices/exams.slice';
import { useAuth } from '@/lib/hooks/useAuth';

export function FeaturedExamsSection() {
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectExamsList) as Record<string, unknown>[];
    const enrollments = useAppSelector(selectExamEnrollments) as { exam?: string; exam_id?: string }[];
    const isLoading = useAppSelector(selectExamsLoading);
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        dispatch(fetchExams({ featured: true })).catch(() => {});
    }, [dispatch]);

    useEffect(() => {
        if (isAuthenticated && token) {
            dispatch(fetchMyEnrollments()).catch(() => {});
        }
    }, [dispatch, isAuthenticated, token]);

    const isEnrolled = (examId: string) =>
        enrollments.some((e) => e.exam === examId || e.exam_id === examId);

    const featuredExams = list ?? [];

    if (isLoading && featuredExams.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-40 bg-primary-100 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-primary-100 rounded animate-pulse" />
                </div>
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 w-[280px] bg-primary-50 rounded-2xl animate-pulse shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    if (featuredExams.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary-900 tracking-tight">Featured Exams</h2>
                <Link
                    href="/app/exams"
                    className="flex items-center text-sm font-bold text-primary-600 hover:text-primary-800 hover:underline"
                >
                    Explore All
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible">
                    {featuredExams.map((exam) => (
                        <ExamCard
                            key={String(exam.id)} 
                            exam={{
                                id: String(exam.id),
                                slug: exam.slug as string | undefined,
                                title: (exam.title as string) ?? 'Exam',
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
                            className="shrink-0 w-[280px] md:w-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
