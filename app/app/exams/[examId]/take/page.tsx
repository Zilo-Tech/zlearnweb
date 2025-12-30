'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Timer, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuizQuestion } from '@/components/courses/quiz-question';
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

// Mock data - would be fetched from API
const EXAM_DATA = {
    id: '1',
    title: 'GCE Advanced Level Mathematics 2023',
    duration: 3 * 60 * 60, // 3 hours
    questions: Array.from({ length: 50 }, (_, i) => ({
        id: `${i + 1}`,
        question: `Question ${i + 1}: Solve for x in the equation $x^2 + 5x + 6 = 0$.`,
        options: [
            { id: 'a', text: '$x = -2, -3$', isLatex: true },
            { id: 'b', text: '$x = 2, 3$', isLatex: true },
            { id: 'c', text: '$x = 1, 6$', isLatex: true },
            { id: 'd', text: '$x = -1, -6$', isLatex: true },
        ],
    })),
};

export default function TakeExamPage({ params }: { params: { examId: string } }) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(EXAM_DATA.duration);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitting) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isSubmitting) {
            handleSubmit(); // Auto-submit on time up
        }
    }, [timeLeft, isSubmitting]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (optionId: string) => {
        setAnswers({ ...answers, [EXAM_DATA.questions[currentQuestionIndex].id]: optionId });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push(`/app/exams/${params.examId}/results`);
    };

    const currentQuestion = EXAM_DATA.questions[currentQuestionIndex];
    const progress = (Object.keys(answers).length / EXAM_DATA.questions.length) * 100;
    const isLastQuestion = currentQuestionIndex === EXAM_DATA.questions.length - 1;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
                <div className="mx-auto max-w-5xl flex items-center justify-between">
                    <div>
                        <h1 className="text-sm font-semibold text-gray-900 md:text-base truncate max-w-[200px] md:max-w-md">
                            {EXAM_DATA.title}
                        </h1>
                        <div className="text-xs text-gray-500">
                            Question {currentQuestionIndex + 1} of {EXAM_DATA.questions.length}
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 font-mono font-medium ${timeLeft < 300 ? 'text-red-600 animate-pulse' : 'text-[#446D6D]'}`}>
                        <Timer className="h-5 w-5" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                    <div
                        className="h-full bg-[#446D6D] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-3xl pt-24 px-4">
                <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {EXAM_DATA.questions.map((_, idx) => {
                        const isAnswered = answers[EXAM_DATA.questions[idx].id];
                        const isCurrent = idx === currentQuestionIndex;
                        return (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={`
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors
                  ${isCurrent
                                        ? 'bg-[#446D6D] text-white ring-2 ring-[#446D6D] ring-offset-2'
                                        : isAnswered
                                            ? 'bg-[#446D6D]/20 text-[#446D6D]'
                                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                    }
                `}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                    <QuizQuestion
                        question={currentQuestion.question}
                        options={currentQuestion.options}
                        selectedOption={answers[currentQuestion.id]}
                        onSelect={handleAnswer}
                    />
                </div>

                <div className="mt-8 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>

                    {isLastQuestion ? (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                    Submit Exam
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        You have answered {Object.keys(answers).length} out of {EXAM_DATA.questions.length} questions.
                                        Are you sure you want to finish?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Keep Working</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                                        Submit
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : (
                        <Button
                            onClick={() => setCurrentQuestionIndex((prev) => Math.min(EXAM_DATA.questions.length - 1, prev + 1))}
                        >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
