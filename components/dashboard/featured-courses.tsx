'use client';

import { useCourses } from '@/lib/hooks/useCourses';
import { useEffect } from 'react';
import { CourseCard } from '@/components/courses/course-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function FeaturedCoursesSection() {
    const { featured, loadFeatured, isLoading } = useCourses();

    useEffect(() => {
        loadFeatured();
    }, [loadFeatured]);

    if (isLoading && featured.length === 0) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 w-[280px] bg-gray-100 rounded-2xl animate-pulse shrink-0" />
                    ))}
                </div>
            </div>
        );
    }

    if (featured.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Featured Courses</h2>
                <Link href="/app/courses" className="flex items-center text-sm font-semibold text-[#446D6D] hover:underline">
                    Explore All
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible">
                    {featured.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            variant="featured"
                            className="shrink-0 w-[280px] md:w-full"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
