'use client';

import Link from 'next/link';
import { Trophy, CheckCircle, XCircle, Clock, Share2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Mock results data
const RESULTS = {
    score: 85,
    total: 100,
    correct: 42,
    incorrect: 5,
    skipped: 3,
    timeSpent: '2h 15m',
    percentile: 92,
    xpEarned: 500,
};

export default function ExamResultsPage({ params }: { params: { examId: string } }) {
    const percentage = Math.round((RESULTS.score / RESULTS.total) * 100);
    const isPass = percentage >= 50;

    return (
        <div className="mx-auto max-w-3xl space-y-8 text-center">
            <div className="space-y-4">
                <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${isPass ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <Trophy className="h-12 w-12" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isPass ? 'Congratulations!' : 'Keep Practicing!'}
                </h1>
                <p className="text-gray-500">
                    You scored <span className="font-bold text-gray-900">{RESULTS.score}/{RESULTS.total}</span> ({percentage}%)
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <CheckCircle className="mx-auto mb-2 h-6 w-6 text-green-500" />
                    <p className="text-sm text-gray-500">Correct</p>
                    <p className="text-xl font-bold text-gray-900">{RESULTS.correct}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <XCircle className="mx-auto mb-2 h-6 w-6 text-red-500" />
                    <p className="text-sm text-gray-500">Incorrect</p>
                    <p className="text-xl font-bold text-gray-900">{RESULTS.incorrect}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <Clock className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="text-xl font-bold text-gray-900">{RESULTS.timeSpent}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                    <Trophy className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
                    <p className="text-sm text-gray-500">XP Earned</p>
                    <p className="text-xl font-bold text-gray-900">+{RESULTS.xpEarned}</p>
                </div>
            </div>

            <div className="rounded-xl bg-[#446D6D]/5 p-6">
                <h3 className="mb-2 font-semibold text-[#446D6D]">Performance Analysis</h3>
                <p className="mb-4 text-sm text-gray-600">
                    You performed better than {RESULTS.percentile}% of students who took this exam.
                </p>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-500">
                        <span>Percentile</span>
                        <span>{RESULTS.percentile}%</span>
                    </div>
                    <Progress value={RESULTS.percentile} className="h-2" />
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" variant="outline" asChild>
                    <Link href={`/app/exams/${params.examId}/review`}>
                        Review Answers
                    </Link>
                </Button>
                <Button size="lg" asChild>
                    <Link href="/app/exams">
                        Back to Exams
                    </Link>
                </Button>
            </div>
        </div>
    );
}
