'use client';

import { usePersonalization } from '@/lib/hooks/usePersonalization';
import { useEffect } from 'react';
import { CourseCard } from '@/components/courses/course-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';

export function RecommendedCoursesSection() {
    const { recommendations, loadRecommendations, isLoading } = usePersonalization();

    useEffect(() => {
        loadRecommendations();
    }, [loadRecommendations]);

    if (isLoading && !recommendations) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-64 w-[280px] bg-gray-100 rounded-2xl animate-pulse shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    const allRecs = [
        ...(recommendations?.academic_recommendations || []),
        ...(recommendations?.skill_gap_courses || []),
        ...(recommendations?.career_aligned_courses || [])
    ];

    if (allRecs.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
                </div>
                <Link href="/app/courses" className="flex items-center text-sm font-semibold text-[#446D6D] hover:underline">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible">
                    {allRecs.map((rec, index) => (
                        <div key={rec.course?.id || index} className="shrink-0 w-[280px] md:w-full">
                            <CourseCard
                                course={rec.course}
                                variant="featured"
                                className="w-full"
                            />
                            {rec.reason && (
                                <p className="mt-2 text-[11px] text-gray-500 italic px-1">
                                    {rec.reason}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
