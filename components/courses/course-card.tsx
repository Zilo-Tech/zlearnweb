'use client';

import { Clock, BookOpen, Star, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isUuid(id: string): boolean {
    return UUID_REGEX.test(id || '');
}

interface CourseCardProps {
    course: Course;
    variant?: 'default' | 'compact' | 'featured';
    showEnrollButton?: boolean;
    /** When 'academic' or 'exams', use course.id (like mobile) so detail page calls content API and gets modules with lessons. */
    userType?: 'academic' | 'professional' | 'exams';
    className?: string;
}

export function CourseCard({
    course,
    variant = 'default',
    showEnrollButton = false,
    userType,
    className
}: CourseCardProps) {
    const formatDuration = (hours: number): string => {
        if (hours < 1) {
            return `${Math.round(hours * 60)}m`;
        }
        return `${Math.round(hours)}h`;
    };

    const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title || 'Course')}&background=446D6D&color=ffffff&size=400`;
    const imageSrc = course.thumbnail || fallbackImage;
    const isSvgFallback = imageSrc.startsWith('https://ui-avatars.com');
    const subjectLabel = course.subject?.name || 'Course';

    // Professional API uses slug for course detail URL; academic uses id
    const courseIdentifier = userType === 'professional' ? (course.slug ?? course.id) : course.id;
    const courseHref = `/app/courses/${courseIdentifier}`;

    if (variant === 'compact') {
        return (
            <Link href={courseHref}>
                <Card className={cn("overflow-hidden transition-all hover:shadow-md border-2 border-primary-200", className)}>
                    <div className="flex items-center p-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                            <Image
                                src={imageSrc}
                                alt={course.title}
                                fill
                                className="object-cover"
                                unoptimized={isSvgFallback}
                            />
                        </div>
                        <div className="ml-3 flex-1 overflow-hidden">
                            <h3 className="truncate text-sm font-semibold text-gray-900">{course.title}</h3>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-xs font-medium text-primary-600">{subjectLabel}</span>
                                {course.estimated_hours && (
                                    <>
                                        <span className="text-[10px] text-gray-400">•</span>
                                        <span className="text-xs text-gray-500">{formatDuration(course.estimated_hours)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </Link>
        );
    }

    if (variant === 'featured') {
        return (
            <Link href={courseHref} className="block h-full">
                <Card className={cn("group relative overflow-hidden transition-all hover:shadow-lg border-2 border-primary-200 hover:border-primary-400 bg-white h-full flex flex-col", className)}>
                    <div className="relative h-36 sm:h-40 w-full shrink-0 bg-primary-100">
                        <Image
                            src={imageSrc}
                            alt={course.title || 'Course'}
                            fill
                            sizes="(max-width: 768px) 280px, 320px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            unoptimized={isSvgFallback}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                            <span className="rounded-full bg-primary-700 px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider shrink-0">
                                {subjectLabel}
                            </span>
                            {course.difficulty && (
                                <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-primary-700 shrink-0">
                                    {course.difficulty.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col min-h-0">
                        <h3 className="line-clamp-2 text-sm font-bold text-gray-900 leading-snug mb-2 min-h-[2.5rem]">
                            {course.title || 'Untitled Course'}
                        </h3>

                        <div className="flex items-center justify-between mt-auto pt-2 flex-wrap gap-x-3 gap-y-1">
                            <div className="flex items-center gap-3 text-gray-600">
                                {course.estimated_hours != null && (
                                    <span className="flex items-center gap-1 text-[11px] font-medium">
                                        <Clock className="h-3.5 w-3.5 shrink-0" />
                                        {formatDuration(course.estimated_hours)}
                                    </span>
                                )}
                                {course.lesson_count != null && (
                                    <span className="flex items-center gap-1 text-[11px] font-medium">
                                        <BookOpen className="h-3.5 w-3.5 shrink-0" />
                                        {course.lesson_count} lessons
                                    </span>
                                )}
                            </div>

                            {showEnrollButton && (
                                <span className="rounded-full bg-primary-500 px-3 py-1 text-[10px] font-bold text-white">
                                    Enroll
                                </span>
                            )}
                        </div>
                    </div>
                </Card>
            </Link>
        );
    }

    return (
        <Link href={courseHref}>
            <Card className={cn("group overflow-hidden transition-all hover:shadow-md border-2 border-primary-200 hover:border-primary-300", className)}>
                <div className="relative h-48 w-full">
                    <Image
                        src={imageSrc}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized={isSvgFallback}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <div className="absolute bottom-3 left-3">
                        <span className="rounded-full bg-primary-700 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                            {subjectLabel}
                        </span>
                    </div>
                </div>

                <div className="p-4 bg-white">
                    <h3 className="line-clamp-2 text-base font-bold text-gray-900 leading-tight mb-2 min-h-[2.75rem]">
                        {course.title || 'Untitled Course'}
                    </h3>
                    <p className="line-clamp-2 text-xs text-gray-500 leading-relaxed mb-4">
                        {course.description || 'Start learning today.'}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {course.estimated_hours && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                                    {formatDuration(course.estimated_hours)}
                                </div>
                            )}
                            {course.lesson_count && (
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                    <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                                    {course.lesson_count} lessons
                                </div>
                            )}
                        </div>

                        {showEnrollButton && (
                            <Button size="sm" className="h-8 rounded-full font-semibold">
                                Enroll
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
