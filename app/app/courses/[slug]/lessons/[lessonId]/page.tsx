'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CheckCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonPlayer } from '@/components/courses/lesson-player';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const LESSON = {
    id: 'l1',
    title: 'Concept of a Limit',
    description: 'Understanding the intuitive definition of a limit and how it relates to function behavior.',
    videoUrl: 'https://example.com/video.mp4',
    duration: '15m',
    resources: [
        { title: 'Lecture Notes (PDF)', size: '2.4 MB' },
        { title: 'Practice Problems', size: '1.1 MB' },
    ],
    nextLessonId: 'l2',
    prevLessonId: null,
};

export default function LessonViewerPage({ params }: { params: { slug: string; lessonId: string } }) {
    const [isCompleted, setIsCompleted] = useState(false);

    return (
        <div className="flex flex-col gap-6 lg:flex-row">
            {/* Main Content */}
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <Link
                        href={`/app/courses/${params.slug}`}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-900"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Course
                    </Link>
                </div>

                <LessonPlayer src={LESSON.videoUrl} />

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">{LESSON.title}</h1>
                    <Button
                        variant={isCompleted ? "outline" : "default"}
                        className={isCompleted ? "text-green-600 border-green-200 bg-green-50" : ""}
                        onClick={() => setIsCompleted(!isCompleted)}
                    >
                        {isCompleted ? (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Completed
                            </>
                        ) : (
                            "Mark as Complete"
                        )}
                    </Button>
                </div>

                <Tabs defaultValue="description" className="w-full">
                    <TabsList>
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                        <TabsTrigger value="discussion">Discussion</TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-4 text-gray-600 leading-relaxed">
                        {LESSON.description}
                    </TabsContent>

                    <TabsContent value="resources" className="mt-4 space-y-3">
                        {LESSON.resources.map((resource, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                                        <p className="text-xs text-gray-500">{resource.size}</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">Download</Button>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="discussion" className="mt-4">
                        <p className="text-gray-500 text-sm">Discussion thread loading...</p>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Sidebar / Navigation */}
            <div className="w-full lg:w-80 space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Up Next</h3>
                    {/* This would be a mini version of ModuleList or just next lesson card */}
                    <div className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <p className="text-sm font-medium text-gray-900">Calculating Limits</p>
                        <p className="text-xs text-gray-500 mt-1">20m • Video</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
