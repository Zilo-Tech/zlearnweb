'use client';

import { usePersonalization } from '@/lib/hooks/usePersonalization';
import { useAuth } from '@/lib/hooks/useAuth';
import { useEffect } from 'react';
import { CourseCard } from '@/components/courses/course-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';

export function RecommendedCoursesSection() {
    const { recommendations, loadRecommendations, isLoading } = usePersonalization();
    const { user } = useAuth();
    const userType = (user?.user_type as 'academic' | 'professional' | 'exams') ?? undefined;

    useEffect(() => {
        loadRecommendations();
    }, [loadRecommendations]);

    if (isLoading && !recommendations) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-48 bg-primary-100 rounded animate-pulse" />
                </div>
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-64 w-[280px] bg-primary-50 rounded-2xl animate-pulse shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    // Backend returns flat recommendations[]; support legacy nested shape
    const recs = recommendations && typeof recommendations === 'object' ? recommendations : null;
    const flatRecs = Array.isArray(recs?.recommendations) ? recs.recommendations : [];
    const legacyRecs = [
        ...(Array.isArray(recs?.academic_recommendations) ? recs.academic_recommendations : []).map((r: { course?: unknown; reason?: string }) => ({ ...(typeof r.course === 'object' && r.course !== null ? r.course as Record<string, unknown> : {}), reason: r.reason })),
        ...(Array.isArray(recs?.skill_gap_courses) ? recs.skill_gap_courses : []).map((r: { course?: unknown; reason?: string }) => ({ ...(typeof r.course === 'object' && r.course !== null ? r.course as Record<string, unknown> : {}), reason: r.reason })),
        ...(Array.isArray(recs?.career_aligned_courses) ? recs.career_aligned_courses : []).map((r: { course?: unknown; reason?: string }) => ({ ...(typeof r.course === 'object' && r.course !== null ? r.course as Record<string, unknown> : {}), reason: r.reason })),
    ].filter((c: Record<string, unknown>) => c?.id != null);
    const allRecs = flatRecs.length > 0 ? flatRecs : legacyRecs;

    if (allRecs.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary-500" />
                    <h2 className="text-lg font-bold text-primary-900 tracking-tight">Recommended for You</h2>
                </div>
                <Link href="/app/courses" className="flex items-center text-sm font-bold text-primary-600 hover:text-primary-800 hover:underline">
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible">
                    {allRecs.map((rec: any, index: number) => (
                        <div key={rec.id ?? index} className="shrink-0 w-[280px] md:w-full">
                            <CourseCard
                                course={{
                                    id: String(rec.id),
                                    title: rec.title ?? 'Course',
                                    description: rec.description ?? '',
                                    subject: typeof rec.subject === 'object' ? rec.subject : { name: rec.subject ?? rec.category ?? '', code: '' },
                                    slug: rec.slug ?? '',
                                    ...rec,
                                }}
                                variant="featured"
                                className="w-full"
                                userType={userType}
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
