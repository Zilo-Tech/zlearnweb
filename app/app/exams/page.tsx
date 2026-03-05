'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Clock,
    HelpCircle,
    RefreshCw,
    Trophy,
    Lock,
    ChevronRight,
    BookOpen,
    Target,
    Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PracticeTest {
    id: string;
    title: string;
    subject: string;
    duration: number; // minutes
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
    attempts: number;
    bestScore?: number;
    isAvailable: boolean;
    description: string;
}

const MOCK_TESTS: PracticeTest[] = [
    {
        id: '1',
        title: 'Linear Equations Fundamentals',
        subject: 'Mathematics',
        duration: 30,
        questionCount: 15,
        difficulty: 'easy',
        attempts: 2,
        bestScore: 85,
        isAvailable: true,
        description: 'Test your understanding of basic linear equation concepts and solving techniques.',
    },
    {
        id: '2',
        title: 'Quadratic Equations Mastery',
        subject: 'Mathematics',
        duration: 45,
        questionCount: 20,
        difficulty: 'medium',
        attempts: 1,
        bestScore: 72,
        isAvailable: true,
        description: 'Challenge yourself with quadratic equations, factoring, and the quadratic formula.',
    },
    {
        id: '3',
        title: 'Advanced Algebra Concepts',
        subject: 'Mathematics',
        duration: 60,
        questionCount: 25,
        difficulty: 'hard',
        attempts: 0,
        isAvailable: true,
        description: 'Advanced topics including systems of equations, polynomials, and complex numbers.',
    },
    {
        id: '4',
        title: 'Physics Mechanics Basics',
        subject: 'Physics',
        duration: 40,
        questionCount: 18,
        difficulty: 'medium',
        attempts: 0,
        isAvailable: true,
        description: 'Test your knowledge of motion, forces, and energy in classical mechanics.',
    },
    {
        id: '5',
        title: 'Chemistry Periodic Table',
        subject: 'Chemistry',
        duration: 35,
        questionCount: 16,
        difficulty: 'easy',
        attempts: 3,
        bestScore: 93,
        isAvailable: false,
        description: 'Master the periodic table, atomic structure, and element properties.',
    },
    {
        id: '6',
        title: 'Newton\'s Laws of Motion',
        subject: 'Physics',
        duration: 50,
        questionCount: 22,
        difficulty: 'hard',
        attempts: 0,
        isAvailable: true,
        description: 'Deep dive into Newton\'s three laws, applications, and problem solving.',
    },
];

const DIFFICULTY_STYLES = {
    easy: {
        badge: 'bg-green-100 text-green-700 hover:bg-green-100',
        dot: 'bg-green-500',
    },
    medium: {
        badge: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
        dot: 'bg-amber-500',
    },
    hard: {
        badge: 'bg-red-100 text-red-700 hover:bg-red-100',
        dot: 'bg-red-500',
    },
};

export default function ExamsPage() {
    const [selectedSubject, setSelectedSubject] = useState('all');

    const subjects = ['all', ...Array.from(new Set(MOCK_TESTS.map((t) => t.subject)))];
    const filtered =
        selectedSubject === 'all'
            ? MOCK_TESTS
            : MOCK_TESTS.filter((t) => t.subject === selectedSubject);

    const completed = MOCK_TESTS.filter((t) => t.attempts > 0).length;
    const avgScore = (() => {
        const scored = MOCK_TESTS.filter((t) => t.bestScore != null);
        if (!scored.length) return 0;
        return Math.round(scored.reduce((acc, t) => acc + (t.bestScore ?? 0), 0) / scored.length);
    })();
    const available = MOCK_TESTS.filter((t) => t.isAvailable).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Practice Tests</h1>
                <p className="text-gray-500">Test your knowledge and track your progress.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-2xl font-bold text-blue-600">{completed}</p>
                    <p className="text-xs font-medium text-blue-700 mt-0.5">Completed</p>
                </div>
                <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-2xl font-bold text-green-600">{avgScore}%</p>
                    <p className="text-xs font-medium text-green-700 mt-0.5">Avg Score</p>
                </div>
                <div className="rounded-xl bg-purple-50 p-4">
                    <p className="text-2xl font-bold text-purple-600">{available}</p>
                    <p className="text-xs font-medium text-purple-700 mt-0.5">Available</p>
                </div>
            </div>

            {/* Subject Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {subjects.map((subject) => (
                    <button
                        key={subject}
                        onClick={() => setSelectedSubject(subject)}
                        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            selectedSubject === subject
                                ? 'bg-[#446D6D] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {subject === 'all' ? 'All' : subject}
                    </button>
                ))}
            </div>

            {/* Test Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((test) => {
                    const diffStyle = DIFFICULTY_STYLES[test.difficulty];
                    return (
                        <div
                            key={test.id}
                            className={`rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
                                !test.isAvailable ? 'opacity-70' : ''
                            }`}
                        >
                            {/* Title Row */}
                            <div className="mb-3 flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
                                        {test.title}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-gray-500">{test.subject}</p>
                                </div>
                                <Badge className={`shrink-0 capitalize text-xs ${diffStyle.badge}`}>
                                    <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${diffStyle.dot}`} />
                                    {test.difficulty}
                                </Badge>
                            </div>

                            {/* Description */}
                            <p className="mb-4 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                {test.description}
                            </p>

                            {/* Stats */}
                            <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {test.duration} min
                                </span>
                                <span className="flex items-center gap-1">
                                    <HelpCircle className="h-3.5 w-3.5" />
                                    {test.questionCount} Qs
                                </span>
                                <span className="flex items-center gap-1">
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    {test.attempts} attempts
                                </span>
                            </div>

                            {/* Best Score */}
                            {test.bestScore != null && (
                                <div className="mb-4 flex items-center gap-1.5 text-xs text-amber-600">
                                    <Trophy className="h-3.5 w-3.5" />
                                    <span className="font-medium">Best: {test.bestScore}%</span>
                                </div>
                            )}

                            {/* Action */}
                            {test.isAvailable ? (
                                <Button
                                    size="sm"
                                    className="w-full bg-[#446D6D] text-white hover:bg-[#3a5c5c]"
                                    asChild
                                >
                                    <Link href={`/app/exams/${test.id}`}>
                                        {test.attempts > 0 ? 'Retake Test' : 'Start Test'}
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <div className="space-y-1">
                                    <Button size="sm" variant="outline" className="w-full" disabled>
                                        <Lock className="mr-2 h-3.5 w-3.5" />
                                        Locked
                                    </Button>
                                    <p className="text-center text-xs text-gray-400">
                                        Complete the course first
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
                    <BookOpen className="mb-4 h-12 w-12 text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">
                        No tests available for this subject yet.
                    </p>
                </div>
            )}

            {/* Custom Practice Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#446D6D] to-[#5a8c8c] p-6 text-white">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-300" />
                            <h3 className="font-semibold">Custom Practice Session</h3>
                        </div>
                        <p className="text-sm text-white/80">
                            Build a personalized test by choosing your subject, topics, and difficulty.
                        </p>
                    </div>
                    <Button
                        className="shrink-0 bg-white text-[#446D6D] hover:bg-gray-100 font-semibold"
                        asChild
                    >
                        <Link href="/app/exams/practice">
                            <Target className="mr-2 h-4 w-4" />
                            Create Practice Test
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
