'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Timer, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuizQuestion } from '@/components/courses/quiz-question';
import { Progress } from '@/components/ui/progress';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mock data
const QUIZ = {
    id: 'q1',
    title: 'Limits Quiz',
    duration: 15 * 60, // 15 minutes in seconds
    questions: [
        {
            id: '1',
            question: 'Evaluate the limit: $\\lim_{x \\to 2} (x^2 + 3x - 1)$',
            options: [
                { id: 'a', text: '$9$', isLatex: true },
                { id: 'b', text: '$7$', isLatex: true },
                { id: 'c', text: '$5$', isLatex: true },
                { id: 'd', text: 'Undefined', isLatex: false },
            ],
            correctOptionId: 'a',
        },
        {
            id: '2',
            question: 'What is the derivative of $\\sin(x)$?',
            options: [
                { id: 'a', text: '$\\cos(x)$', isLatex: true },
                { id: 'b', text: '$-\\cos(x)$', isLatex: true },
                { id: 'c', text: '$\\tan(x)$', isLatex: true },
                { id: 'd', text: '$\\sec^2(x)$', isLatex: true },
            ],
            correctOptionId: 'a',
        },
    ],
};

export default function QuizViewerPage() {
    const params = useParams();
    const courseId = params?.courseId as string;
    const quizId = params?.quizId as string;
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // Mock quiz data - replace with API call
    const quiz = {
        id: quizId,
        title: "Module 1 Assessment",
        questions: [
            {
                id: "q1",
                text: "What is the primary function of Python's 'print' statement?",
                options: [
                    { id: "a", text: "To save data to a file" },
                    { id: "b", text: "To display output to the console" },
                    { id: "c", text: "To calculate mathematical values" },
                    { id: "d", text: "To define a variable" }
                ],
                correctAnswer: "b"
            },
            {
                id: "q2",
                text: "Which of the following is a valid variable name?",
                options: [
                    { id: "a", text: "2variable" },
                    { id: "b", text: "my-variable" },
                    { id: "c", text: "my_variable" },
                    { id: "d", text: "class" }
                ],
                correctAnswer: "c"
            }
        ]
    };

    const handleOptionSelect = (questionId: string, optionId: string) => {
        if (isSubmitted) return;
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        quiz.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore((correctCount / quiz.questions.length) * 100);
        setIsSubmitted(true);
        toast.success("Quiz submitted successfully!");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-4">
                <Link
                    href={`/app/courses/${courseId}`}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-900"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Course
                </Link>
            </div>

            <Card className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                    <p className="text-gray-500 mt-1">{quiz.questions.length} questions • Passing score: 80%</p>
                </div>

                {!isSubmitted ? (
                    <div className="space-y-8">
                        {quiz.questions.map((question, idx) => (
                            <div key={question.id} className="space-y-4">
                                <h3 className="font-medium text-gray-900">
                                    {idx + 1}. {question.text}
                                </h3>
                                <div className="space-y-2">
                                    {question.options.map((option) => (
                                        <div
                                            key={option.id}
                                            onClick={() => handleOptionSelect(question.id, option.id)}
                                            className={cn(
                                                "flex items-center p-3 rounded-lg border cursor-pointer transition-colors",
                                                answers[question.id] === option.id
                                                    ? "border-[#446D6D] bg-[#446D6D]/5"
                                                    : "border-gray-200 hover:bg-gray-50"
                                            )}
                                        >
                                            <div className={cn(
                                                "h-4 w-4 rounded-full border mr-3 flex items-center justify-center",
                                                answers[question.id] === option.id
                                                    ? "border-[#446D6D]"
                                                    : "border-gray-300"
                                            )}>
                                                {answers[question.id] === option.id && (
                                                    <div className="h-2 w-2 rounded-full bg-[#446D6D]" />
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-700">{option.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <div className="pt-4 flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                disabled={Object.keys(answers).length !== quiz.questions.length}
                                className="bg-[#446D6D] hover:bg-[#3A5F5F]"
                            >
                                Submit Quiz
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 space-y-6">
                        <div className="relative inline-flex items-center justify-center">
                            <svg className="h-32 w-32 transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    className="stroke-gray-100 fill-none"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="60"
                                    className={cn(
                                        "fill-none transition-all duration-1000",
                                        score >= 80 ? "stroke-green-500" : "stroke-yellow-500"
                                    )}
                                    strokeWidth="8"
                                    strokeDasharray={2 * Math.PI * 60}
                                    strokeDashoffset={2 * Math.PI * 60 * (1 - score / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-3xl font-bold text-gray-900">{Math.round(score)}%</span>
                                <span className="text-sm text-gray-500">Score</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {score >= 80 ? "Congratulations! Passed" : "Keep practicing!"}
                            </h3>
                            <p className="text-gray-500 mt-2">
                                {score >= 80
                                    ? "You have successfully completed this module assessment."
                                    : "You need 80% to pass. Review the material and try again."}
                            </p>
                        </div>

                        <Button size="lg" onClick={() => router.push(`/app/courses/${courseId}`)}>
                            Return to Course
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
