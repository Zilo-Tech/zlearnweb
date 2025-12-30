'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

export default function QuizViewerPage({ params }: { params: { slug: string; quizId: string } }) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(QUIZ.duration);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, isSubmitted]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (optionId: string) => {
        setAnswers({ ...answers, [QUIZ.questions[currentQuestionIndex].id]: optionId });
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        // Here we would typically send answers to API
    };

    const currentQuestion = QUIZ.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / QUIZ.questions.length) * 100;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    href={`/app/courses/${params.slug}`}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-900"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Exit Quiz
                </Link>
                <div className="flex items-center gap-2 font-mono text-lg font-medium text-[#446D6D]">
                    <Timer className="h-5 w-5" />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Question {currentQuestionIndex + 1} of {QUIZ.questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Question Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                <QuizQuestion
                    question={currentQuestion.question}
                    options={currentQuestion.options}
                    selectedOption={answers[currentQuestion.id]}
                    onSelect={handleAnswer}
                    showResult={isSubmitted}
                    correctOptionId={currentQuestion.correctOptionId}
                />
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </Button>

                {currentQuestionIndex === QUIZ.questions.length - 1 ? (
                    !isSubmitted ? (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="lg">Submit Quiz</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to submit? You won't be able to change your answers after submission.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : (
                        <Button size="lg" onClick={() => router.push(`/app/courses/${params.slug}`)}>
                            Return to Course
                        </Button>
                    )
                ) : (
                    <Button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.min(QUIZ.questions.length - 1, prev + 1))}
                    >
                        Next Question
                    </Button>
                )}
            </div>
        </div>
    );
}
