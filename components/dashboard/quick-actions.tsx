'use client';

import Link from 'next/link';
import { BookOpen, GraduationCap, Users, Trophy, Search, Calendar } from 'lucide-react';

const actions = [
    {
        title: 'Browse Courses',
        icon: BookOpen,
        href: '/app/courses',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
    },
    {
        title: 'Take Exam',
        icon: GraduationCap,
        href: '/app/exams',
        color: 'text-purple-600',
        bg: 'bg-purple-50',
    },
    {
        title: 'Community',
        icon: Users,
        href: '/app/community',
        color: 'text-green-600',
        bg: 'bg-green-50',
    },
    {
        title: 'Leaderboard',
        icon: Trophy,
        href: '/app/leaderboard',
        color: 'text-orange-600',
        bg: 'bg-orange-50',
    },
    {
        title: 'Find Tutor',
        icon: Search,
        href: '/app/tutors',
        color: 'text-pink-600',
        bg: 'bg-pink-50',
    },
    {
        title: 'Study Plan',
        icon: Calendar,
        href: '/app/study-plan',
        color: 'text-teal-600',
        bg: 'bg-teal-50',
    },
];

export function QuickActions() {
    return (
        <div className="grid grid-cols-1 min-[320px]:grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {actions.map((action) => {
                const Icon = action.icon;
                return (
                    <Link
                        key={action.title}
                        href={action.href}
                        className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all hover:border-[#446D6D]/20 hover:shadow-md"
                    >
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${action.bg} ${action.color} transition-transform group-hover:scale-110`}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            {action.title}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
