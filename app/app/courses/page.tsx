'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Grid, Star, BookOpen, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CourseCard } from '@/components/courses/course-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCourses } from '@/lib/hooks/useCourses';
import { cn } from '@/lib/utils';

export default function CoursesPage() {
    const {
        enrolled,
        available,
        featured,
        isLoading,
        error,
        loadAvailable,
        loadFeatured,
        loadEnrolled
    } = useCourses();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'featured' | 'available'>('all');

    useEffect(() => {
        loadFeatured();
        loadAvailable();
        loadEnrolled();
    }, [loadFeatured, loadAvailable, loadEnrolled]);

    const displayCourses = useMemo(() => {
        let courses = [];
        switch (selectedFilter) {
            case 'featured':
                courses = featured || [];
                break;
            case 'available':
                courses = available || [];
                break;
            case 'all':
            default:
                // Combine and deduplicate
                const all = [...(featured || []), ...(available || [])];
                courses = all.filter((course, index, self) =>
                    index === self.findIndex((c) => c.id === course.id)
                );
        }

        if (searchQuery.trim()) {
            courses = courses.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return courses;
    }, [selectedFilter, featured, available, searchQuery]);

    const handleRefresh = () => {
        loadFeatured();
        loadAvailable();
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
                    <p className="text-gray-500">Explore our wide range of academic and professional courses.</p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="gap-2"
                >
                    <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    Refresh
                </Button>
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search courses..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {[
                        { key: 'all', label: 'All', icon: Grid },
                        { key: 'featured', label: 'Featured', icon: Star },
                        { key: 'available', label: 'Available', icon: BookOpen },
                    ].map((filter) => {
                        const Icon = filter.icon;
                        const isActive = selectedFilter === filter.key;
                        return (
                            <button
                                key={filter.key}
                                onClick={() => setSelectedFilter(filter.key as any)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-white text-[#446D6D] shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {filter.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {error && (
                <div className="rounded-xl bg-red-50 p-4 border border-red-100 text-red-700 text-sm">
                    {error}
                </div>
            )}

            {isLoading && displayCourses.length === 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : displayCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                        <BookOpen className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                        {searchQuery
                            ? "Try adjusting your search terms to find what you're looking for."
                            : "We couldn't find any courses in this category."}
                    </p>
                    <Button
                        variant="link"
                        onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}
                        className="mt-4 text-[#446D6D]"
                    >
                        Clear all filters
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {displayCourses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            showEnrollButton={!enrolled?.some(c => c.id === course.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
