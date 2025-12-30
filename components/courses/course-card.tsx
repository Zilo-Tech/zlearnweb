'use client';

import { Clock, BookOpen, Star, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CourseCardProps {
    course: Course;
    variant?: 'default' | 'compact' | 'featured';
    showEnrollButton?: boolean;
    className?: string;
}

export function CourseCard({
    course,
    variant = 'default',
    showEnrollButton = false,
    className
}: CourseCardProps) {
    const formatDuration = (hours: number): string => {
        if (hours < 1) {
            return `${Math.round(hours * 60)}m`;
        }
        return `${Math.round(hours)}h`;
    };

    const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.title)}&background=446D6D&color=ffffff&size=200`;

    if (variant === 'compact') {
        return (
            <Link href={`/app/courses/${course.id}`}>
                <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
                    <div className="flex items-center p-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                            <Image
                                src={course.thumbnail || fallbackImage}
                                alt={course.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="ml-3 flex-1 overflow-hidden">
                            <h3 className="truncate text-sm font-semibold text-gray-900">{course.title}</h3>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-xs font-medium text-[#446D6D]">{course.subject?.name}</span>
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
            <Link href={`/app/courses/${course.id}`}>
                <Card className={cn("group relative overflow-hidden transition-all hover:shadow-lg", className)}>
                    <div className="relative h-40 w-full">
                        <Image
                            src={course.thumbnail || fallbackImage}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        <div className="absolute bottom-3 left-3">
                            <span className="rounded-full bg-[#446D6D]/90 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                                {course.subject?.name}
                            </span>
                        </div>

                        {course.difficulty && (
                            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-[#446D6D] shadow-sm">
                                {course.difficulty.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="p-4">
                        <h3 className="line-clamp-2 h-10 text-sm font-bold text-gray-900 leading-tight mb-2">
                            {course.title}
                        </h3>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                                {course.estimated_hours && (
                                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                                        <Clock className="h-3 w-3" />
                                        {formatDuration(course.estimated_hours)}
                                    </div>
                                )}
                                {course.lesson_count && (
                                    <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                                        <BookOpen className="h-3 w-3" />
                                        {course.lesson_count}
                                    </div>
                                )}
                            </div>

                            {showEnrollButton && (
                                <div className="rounded-full bg-[#446D6D] px-3 py-1 text-[10px] font-bold text-white">
                                    Enroll
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            </Link>
        );
    }

    return (
        <Link href={`/app/courses/${course.id}`}>
            <Card className={cn("group overflow-hidden transition-all hover:shadow-md", className)}>
                <div className="relative h-48 w-full">
                    <Image
                        src={course.thumbnail || fallbackImage}
                        alt={course.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    <div className="absolute bottom-3 left-3">
                        <span className="rounded-full bg-[#446D6D]/90 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                            {course.subject?.name}
                        </span>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="line-clamp-2 h-12 text-base font-bold text-gray-900 leading-tight mb-2">
                        {course.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-gray-500 leading-relaxed mb-4">
                        {course.description}
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
                            <Button size="sm" className="h-8 rounded-full bg-[#446D6D] hover:bg-[#365757]">
                                Enroll
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
