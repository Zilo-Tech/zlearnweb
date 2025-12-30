'use client';

import { Button } from '@/components/ui/button';
import { ModuleList } from '@/components/courses/module-list';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Award, Clock, BookOpen, Star, Share2 } from 'lucide-react';

// Mock data
const COURSE = {
    id: '1',
    title: 'Advanced Mathematics: Calculus I',
    slug: 'calculus-1',
    description: 'This comprehensive course covers the fundamental concepts of calculus, including limits, derivatives, integrals, and their applications. Designed for students preparing for university-level mathematics.',
    instructor: {
        name: 'Dr. Sarah Wilson',
        title: 'Professor of Mathematics',
        avatar: '/images/sarah.jpg',
    },
    rating: 4.8,
    students: 1250,
    duration: '12h 30m',
    lessons: 24,
    level: 'Advanced',
    category: 'Mathematics',
    progress: 35,
    modules: [
        {
            id: 'm1',
            title: 'Introduction to Limits',
            lessons: [
                { id: 'l1', title: 'Concept of a Limit', type: 'video' as const, duration: '15m', isCompleted: true, isLocked: false },
                { id: 'l2', title: 'Calculating Limits', type: 'video' as const, duration: '20m', isCompleted: true, isLocked: false },
                { id: 'l3', title: 'Limit Laws', type: 'text' as const, duration: '10m', isCompleted: false, isLocked: false },
                { id: 'q1', title: 'Limits Quiz', type: 'quiz' as const, duration: '15m', isCompleted: false, isLocked: false },
            ],
        },
        {
            id: 'm2',
            title: 'Derivatives',
            lessons: [
                { id: 'l4', title: 'Definition of Derivative', type: 'video' as const, duration: '25m', isCompleted: false, isLocked: true },
                { id: 'l5', title: 'Power Rule', type: 'video' as const, duration: '18m', isCompleted: false, isLocked: true },
                { id: 'l6', title: 'Product and Quotient Rules', type: 'video' as const, duration: '22m', isCompleted: false, isLocked: true },
            ],
        },
    ],
};

export default function CourseDetailsPage({ params }: { params: { slug: string } }) {
    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-[#446D6D]/10 text-[#446D6D]">
                            {COURSE.category}
                        </Badge>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{COURSE.level}</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        {COURSE.title}
                    </h1>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        {COURSE.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gray-200" />
                            <span className="font-medium text-gray-900">{COURSE.instructor.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-medium text-gray-900">{COURSE.rating}</span>
                            <span className="text-gray-500">({COURSE.students} students)</span>
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                    <ModuleList courseSlug={COURSE.slug} modules={COURSE.modules} />
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                    {/* Video Preview Placeholder */}
                    <div className="relative aspect-video w-full rounded-lg bg-gray-900 flex items-center justify-center group cursor-pointer overflow-hidden">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                        <PlayCircle className="h-16 w-16 text-white opacity-90 group-hover:scale-110 transition-transform" />
                    </div>

                    {COURSE.progress > 0 ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-700">Your Progress</span>
                                    <span className="text-[#446D6D]">{COURSE.progress}%</span>
                                </div>
                                <Progress value={COURSE.progress} className="h-2" />
                            </div>
                            <Button className="w-full" size="lg">
                                Continue Learning
                            </Button>
                        </div>
                    ) : (
                        <Button className="w-full" size="lg">
                            Enroll Now
                        </Button>
                    )}

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <span>{COURSE.duration} of content</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <BookOpen className="h-5 w-5 text-gray-400" />
                            <span>{COURSE.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Award className="h-5 w-5 text-gray-400" />
                            <span>Certificate of completion</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full gap-2">
                        <Share2 className="h-4 w-4" />
                        Share Course
                    </Button>
                </div>
            </div>
        </div>
    );
}
