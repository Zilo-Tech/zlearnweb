'use client';

import { CheckCircle, Circle, Lock, PlayCircle, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { markdownToHtml } from '@/lib/utils/markdownToHtml';

interface ModuleListProps {
    courseId: string;
    modules: {
        id: string;
        title: string;
        description?: string;
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

export function ModuleList({ courseId, modules }: ModuleListProps) {
    return (
        <div className="space-y-4">
            {modules.map((module, index) => {
                const allLessons = module.lessons ?? [];
                const completedCount = allLessons.filter((l) => l.isCompleted).length;
                const isModuleCompleted = allLessons.length > 0 && completedCount === allLessons.length;

                return (
                    <div key={module.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                        <div className={cn(
                            'px-4 py-3 border-b border-gray-100',
                            isModuleCompleted ? 'bg-green-50 border-green-100' : 'bg-gray-50'
                        )}>
                            <div className="flex items-center justify-between gap-2">
                                <h3 className={cn('font-semibold', isModuleCompleted ? 'text-green-800' : 'text-gray-900')}>
                                    Module {index + 1}: {module.title}
                                </h3>
                                {isModuleCompleted && (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full shrink-0">
                                        <CheckCircle className="h-3.5 w-3.5" />
                                        Completed
                                    </span>
                                )}
                                {!isModuleCompleted && allLessons.length > 0 && (
                                    <span className="text-xs text-gray-400 shrink-0">{completedCount}/{allLessons.length}</span>
                                )}
                            </div>
                            {module.description && (
                                <div
                                    className="mt-2 text-sm text-gray-600 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1"
                                    dangerouslySetInnerHTML={{ __html: markdownToHtml(module.description) }}
                                />
                            )}
                        </div>

                        <div className="divide-y divide-gray-100">
                            {module.lessons?.map((lesson) => {
                                const Icon = lesson.type === 'video' ? PlayCircle : lesson.type === 'quiz' ? HelpCircle : FileText;

                                return (
                                    <Link
                                        key={lesson.id}
                                        href={lesson.isLocked ? '#' : `/app/courses/${courseId}/lessons/${lesson.id}`}
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
                                                <p className={cn('text-sm font-medium', lesson.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900')}>{lesson.title}</p>
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
                );
            })}
        </div>
    );
}
