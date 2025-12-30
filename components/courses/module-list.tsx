'use client';

import { CheckCircle, Circle, Lock, PlayCircle, FileText, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ModuleListProps {
    courseSlug: string;
    modules: {
        id: string;
        title: string;
        lessons: {
            id: string;
            title: string;
            type: 'video' | 'text' | 'quiz';
            duration: string;
            isCompleted: boolean;
            isLocked: boolean;
        }[];
    }[];
}

export function ModuleList({ courseSlug, modules }: ModuleListProps) {
    return (
        <div className="space-y-4">
            {modules.map((module, index) => (
                <div key={module.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">
                            Module {index + 1}: {module.title}
                        </h3>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {module.lessons.map((lesson) => {
                            const Icon = lesson.type === 'video' ? PlayCircle : lesson.type === 'quiz' ? HelpCircle : FileText;

                            return (
                                <Link
                                    key={lesson.id}
                                    href={lesson.isLocked ? '#' : `/app/courses/${courseSlug}/lessons/${lesson.id}`}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 transition-colors",
                                        lesson.isLocked
                                            ? "cursor-not-allowed opacity-60 bg-gray-50/50"
                                            : "hover:bg-gray-50 cursor-pointer"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {lesson.isCompleted ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : lesson.isLocked ? (
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Circle className="h-5 w-5 text-gray-300" />
                                        )}

                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Icon className="h-3 w-3" />
                                                <span className="capitalize">{lesson.type}</span>
                                                <span>•</span>
                                                <span>{lesson.duration}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {lesson.type === 'video' && !lesson.isLocked && (
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                            <PlayCircle className="h-5 w-5 text-[#446D6D]" />
                                        </Button>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

import { Button } from '@/components/ui/button';
