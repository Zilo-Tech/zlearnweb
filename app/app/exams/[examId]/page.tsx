'use client';

import Link from 'next/link';
import { Clock, HelpCircle, Trophy, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data
const EXAM = {
    id: '1',
    title: 'GCE Advanced Level Mathematics 2023',
    description: 'This is the official GCE Advanced Level Mathematics examination from June 2023. It covers Pure Mathematics, Mechanics, and Statistics. The exam consists of 50 multiple-choice questions.',
    duration: '3h 00m',
    questions: 50,
    totalMarks: 100,
    passMark: 50,
    instructions: [
        'Answer all questions.',
        'Each question carries equal marks.',
        'Calculators are allowed.',
        'You cannot pause the exam once started.',
        'Results will be available immediately after submission.'
    ],
    attempts: 0,
    bestScore: null,
};

export default function ExamDetailsPage({ params }: { params: { examId: string } }) {
    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-4 text-center">
                <Badge className="bg-[#446D6D]/10 text-[#446D6D] hover:bg-[#446D6D]/20">
                    Official Exam
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                    {EXAM.title}
                </h1>
                <p className="text-lg text-gray-600">
                    {EXAM.description}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                    <Clock className="mx-auto mb-2 h-6 w-6 text-blue-500" />
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="text-lg font-bold text-gray-900">{EXAM.duration}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                    <HelpCircle className="mx-auto mb-2 h-6 w-6 text-purple-500" />
                    <p className="text-sm font-medium text-gray-500">Questions</p>
                    <p className="text-lg font-bold text-gray-900">{EXAM.questions}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                    <Trophy className="mx-auto mb-2 h-6 w-6 text-yellow-500" />
                    <p className="text-sm font-medium text-gray-500">Total Marks</p>
                    <p className="text-lg font-bold text-gray-900">{EXAM.totalMarks}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                    <CheckCircle className="mx-auto mb-2 h-6 w-6 text-green-500" />
                    <p className="text-sm font-medium text-gray-500">Pass Mark</p>
                    <p className="text-lg font-bold text-gray-900">{EXAM.passMark}%</p>
                </div>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-yellow-900">Instructions</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-yellow-800">
                            {EXAM.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="w-full sm:w-auto px-8" asChild>
                    <Link href={`/app/exams/${params.examId}/take`}>
                        Start Exam Now
                    </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                    <Link href="/app/exams">Cancel</Link>
                </Button>
            </div>
        </div>
    );
}
