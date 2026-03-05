'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchMyEnrollments } from '@/lib/store/slices/exams.slice';
import { selectExamEnrollments, selectExamsLoading } from '@/lib/store/slices/exams.slice';
import { useAuth } from '@/lib/hooks/useAuth';

export function ContinueExamPrep() {
    const dispatch = useAppDispatch();
    const enrollments = useAppSelector(selectExamEnrollments) as {
        exam?: string;
        exam_id?: string;
        exam_title?: string;
        exam_slug?: string;
    }[];
    const isLoading = useAppSelector(selectExamsLoading);
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        if (isAuthenticated && token) {
            dispatch(fetchMyEnrollments()).catch(() => {});
        }
    }, [dispatch, isAuthenticated, token]);

    const firstEnrollment = enrollments?.[0];
    const enrollmentCount = enrollments?.length ?? 0;
    // Support both flat (exam_id, exam_title, exam_slug) and nested (exam: { id, slug, title })
    const examRef = firstEnrollment as Record<string, unknown> | undefined;
    const examObj = examRef?.exam && typeof examRef.exam === 'object' ? (examRef.exam as Record<string, unknown>) : null;
    const examSlugOrId = (examRef?.exam_slug as string) ?? (examObj?.slug as string) ?? (examRef?.exam_id as string) ?? (examRef?.exam as string) ?? (examObj?.id as string);
    const examTitle = (examRef?.exam_title as string) ?? (examObj?.title as string) ?? 'My exam';

    if (isLoading && !firstEnrollment) {
        return (
            <div className="rounded-2xl bg-white p-6 border-2 border-primary-200 animate-pulse">
                <div className="h-6 w-48 bg-primary-100 rounded mb-4" />
                <div className="h-24 bg-primary-100 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="rounded-2xl bg-white p-6 border-2 border-primary-200">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-primary-900 tracking-tight">Continue exam prep</h2>
                <Link
                    href="/app/exams"
                    className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:underline flex items-center gap-1"
                >
                    View all
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>

            {firstEnrollment ? (
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="h-24 w-full shrink-0 rounded-xl bg-primary-700 md:w-40 flex items-center justify-center text-white p-4">
                        <FileText className="h-10 w-10" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                            {examTitle}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {enrollmentCount === 1
                                ? 'Continue your preparation'
                                : `${enrollmentCount} exams enrolled`}
                        </p>
                    </div>
                    <Link href={examSlugOrId ? `/app/exams/${encodeURIComponent(String(examSlugOrId))}` : '/app/exams'}>
                        <Button className="w-full md:w-auto shrink-0 font-semibold" size="lg">
                            Open
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">You haven&apos;t enrolled in any exams yet.</p>
                    <Link href="/app/exams">
                        <Button>Browse exams</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
