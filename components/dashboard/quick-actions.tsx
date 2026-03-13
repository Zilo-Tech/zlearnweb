'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Trophy, Calendar, Bot, Sparkles } from 'lucide-react';
import { AITutorDialog } from './ai-tutor-dialog';
import { cn } from '@/lib/utils';

const linkActions = [
    { title: 'Browse Courses', icon: BookOpen, href: '/app/courses', color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50' },
    { title: 'Community', icon: Users, href: '/app/community', color: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50' },
    { title: 'Leaderboard', icon: Trophy, href: '/app/leaderboard', color: 'from-yellow-500 to-orange-500', bgLight: 'bg-orange-50' },
    { title: 'Study Plan', icon: Calendar, href: '/app/study-plan', color: 'from-green-500 to-green-600', bgLight: 'bg-green-50' },
];

export function QuickActions() {
    const [aiTutorOpen, setAiTutorOpen] = useState(false);

    return (
        <>
            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Sparkles className="h-5 w-5 text-primary-600" />
                    <h3 className="font-bold text-gray-900">Quick Actions</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <button
                        type="button"
                        onClick={() => setAiTutorOpen(true)}
                        className="group flex flex-col items-center gap-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 p-4 text-center transition-all hover:shadow-md hover:border-primary-300 hover:-translate-y-0.5"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md transition-transform group-hover:scale-110">
                            <Bot className="h-7 w-7" />
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                            AI Tutor
                        </span>
                    </button>

                    {linkActions.map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.title}
                                href={action.href}
                                className={cn(
                                    'group flex flex-col items-center gap-3 rounded-xl border border-gray-200 p-4 text-center transition-all hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5',
                                    action.bgLight
                                )}
                            >
                                <div className={cn(
                                    'flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-md transition-transform group-hover:scale-110',
                                    `bg-gradient-to-br ${action.color}`
                                )}>
                                    <Icon className="h-7 w-7" />
                                </div>
                                <span className="text-xs font-bold text-gray-900 leading-tight">
                                    {action.title}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <AITutorDialog open={aiTutorOpen} onOpenChange={setAiTutorOpen} />
        </>
    );
}
