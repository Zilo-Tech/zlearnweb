'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Trophy, Calendar, Bot } from 'lucide-react';
import { AITutorDialog } from './ai-tutor-dialog';

const linkActions = [
    { title: 'Browse Courses', icon: BookOpen, href: '/app/courses' },
    { title: 'Community', icon: Users, href: '/app/community' },
    { title: 'Leaderboard', icon: Trophy, href: '/app/leaderboard' },
    { title: 'Study Plan', icon: Calendar, href: '/app/study-plan' },
];

const color = 'text-primary-600';
const bg = 'bg-primary-100';

export function QuickActions() {
    const [aiTutorOpen, setAiTutorOpen] = useState(false);

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <button
                    type="button"
                    onClick={() => setAiTutorOpen(true)}
                    className="group flex flex-col items-center justify-center gap-3 rounded-xl bg-white p-4 sm:p-5 text-center transition-all hover:bg-primary-50/80 hover:shadow-md min-h-[120px] sm:min-h-[130px]"
                >
                    <div className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${bg} ${color} transition-transform group-hover:scale-105 shrink-0`}>
                        <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-primary-900 line-clamp-2 min-h-[2.25rem] flex items-center justify-center">
                        AI Tutor
                    </span>
                </button>
                {linkActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="group flex flex-col items-center justify-center gap-3 rounded-xl bg-white p-4 sm:p-5 text-center transition-all hover:bg-primary-50/80 hover:shadow-md min-h-[120px] sm:min-h-[130px]"
                        >
                            <div className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl ${bg} ${color} transition-transform group-hover:scale-105 shrink-0`}>
                                <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-primary-900 line-clamp-2 min-h-[2.25rem] flex items-center justify-center">
                                {action.title}
                            </span>
                        </Link>
                    );
                })}
            </div>
            <AITutorDialog open={aiTutorOpen} onOpenChange={setAiTutorOpen} />
        </>
    );
}
