'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { markdownToHtml, youtubeEmbedUrl } from '@/lib/utils/markdownToHtml';
import { cn } from '@/lib/utils';

export interface LessonSection {
    id: string;
    title: string;
    section_type: string;
    order: number;
    text_content?: string;
    image_url?: string;
    image_caption?: string;
    content_url?: string;
    video_url?: string;
    code_content?: string;
    code_language?: string;
    quiz_questions?: Array<{
        id: string;
        text: string;
        explanation?: string;
        order: number;
        points?: number;
        options?: Array<{ id: string; text: string; is_correct: boolean; explanation?: string; order: number }>;
    }>;
    [key: string]: unknown;
}

interface LessonSectionBlockProps {
    section: LessonSection;
    className?: string;
}

/** Interactive quiz: user selects an option, then we reveal correct answer. */
function QuizSection({
    section,
    questions,
    className,
}: {
    section: LessonSection;
    questions: NonNullable<LessonSection['quiz_questions']>;
    className?: string;
}) {
    const [selected, setSelected] = useState<Record<string, string>>({});

    const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

    return (
        <div className={cn('rounded-xl border border-gray-200 bg-white p-5 shadow-sm', className)}>
            {section.title && (
                <h3 className="mb-4 text-lg font-semibold text-gray-900">{section.title}</h3>
            )}
            {section.text_content && (
                <p className="mb-4 text-sm text-gray-600">{section.text_content}</p>
            )}
            <ul className="space-y-6">
                {sortedQuestions.map((q) => {
                    const selectedOptionId = selected[q.id];
                    const options = (q.options || []).sort((a, b) => a.order - b.order);
                    const correctOption = options.find((o) => o.is_correct);
                    const hasAnswered = !!selectedOptionId;

                    return (
                        <li key={q.id} className="rounded-lg border border-gray-100 p-4">
                            <p className="mb-3 font-medium text-gray-900">{q.text}</p>
                            <ul className="space-y-2">
                                {options.map((opt) => {
                                    const isSelected = selectedOptionId === opt.id;
                                    const showCorrect = hasAnswered && opt.is_correct;
                                    const showWrong = hasAnswered && isSelected && !opt.is_correct;

                                    return (
                                        <li key={opt.id}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (hasAnswered) return;
                                                    setSelected((prev) => ({ ...prev, [q.id]: opt.id }));
                                                }}
                                                disabled={hasAnswered}
                                                className={cn(
                                                    'w-full rounded-md border px-3 py-2.5 text-left text-sm transition-colors',
                                                    hasAnswered
                                                        ? 'cursor-default'
                                                        : 'hover:border-primary-300 hover:bg-primary-50/50 cursor-pointer',
                                                    !hasAnswered && isSelected && 'border-primary-500 bg-primary-50 ring-1 ring-primary-500',
                                                    showCorrect && 'border-green-500 bg-green-50 text-green-900',
                                                    showWrong && 'border-red-300 bg-red-50 text-red-800'
                                                )}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {showCorrect && <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />}
                                                    {showWrong && <XCircle className="h-4 w-4 shrink-0 text-red-600" />}
                                                    {opt.text}
                                                </span>
                                                {hasAnswered && opt.explanation && (
                                                    <span className="mt-1 block text-xs text-gray-500">
                                                        {opt.explanation}
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            {hasAnswered && (
                                <p className="mt-3 text-sm text-gray-600">
                                    {selectedOptionId === correctOption?.id ? (
                                        <span className="flex items-center gap-1.5 text-green-700">
                                            <CheckCircle className="h-4 w-4" /> Correct!
                                        </span>
                                    ) : (
                                        <span>
                                            <span className="flex items-center gap-1.5 text-red-700">
                                                <XCircle className="h-4 w-4" /> Incorrect.
                                            </span>
                                            {correctOption && (
                                                <span className="mt-1 block text-gray-700">
                                                    Correct answer: <strong>{correctOption.text}</strong>
                                                    {correctOption.explanation && (
                                                        <span className="text-gray-500"> — {correctOption.explanation}</span>
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </p>
                            )}
                            {hasAnswered && q.explanation && (
                                <p className="mt-2 text-xs text-gray-500">{q.explanation}</p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export function LessonSectionBlock({ section, className }: LessonSectionBlockProps) {
    const type = section.section_type || 'text';

    if (type === 'text' || type === 'reading') {
        const html = markdownToHtml(section.text_content || '');
        if (!html.trim()) return null;
        return (
            <div className={cn('rounded-xl border border-gray-100 bg-white p-5 shadow-sm', className)}>
                {section.title && (
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">{section.title}</h3>
                )}
                <div
                    className="prose prose-gray max-w-none text-gray-700 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        );
    }

    if (type === 'video') {
        const url = section.video_url || section.content_url || '';
        const embed = youtubeEmbedUrl(url);
        if (embed) {
            return (
                <div className={cn('rounded-xl overflow-hidden border border-gray-200 bg-black', className)}>
                    {section.title && (
                        <h3 className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900">
                            {section.title}
                        </h3>
                    )}
                    <div className="aspect-video w-full">
                        <iframe
                            src={embed}
                            title={section.title || 'Video'}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                    {section.text_content && (
                        <p className="border-t border-gray-100 p-4 text-sm text-gray-600">
                            {section.text_content}
                        </p>
                    )}
                </div>
            );
        }
        if (url) {
            return (
                <div className={cn('rounded-xl border border-gray-200 p-4', className)}>
                    {section.title && (
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">{section.title}</h3>
                    )}
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 underline"
                    >
                        Watch video
                    </a>
                </div>
            );
        }
        return null;
    }

    if (type === 'audio') {
        const url = (section as any).audio_url || section.content_url || '';
        if (!url) return null;
        return (
            <div className={cn('rounded-xl border border-gray-200 bg-gray-900 p-5', className)}>
                {section.title && (
                    <h3 className="mb-3 text-sm font-semibold text-gray-200">{section.title}</h3>
                )}
                <audio src={url} controls className="w-full" />
                {section.text_content && (
                    <p className="mt-3 text-sm text-gray-400">{section.text_content}</p>
                )}
            </div>
        );
    }

    if (type === 'image') {
        return (
            <div className={cn('rounded-xl border border-gray-200 overflow-hidden bg-gray-50', className)}>
                {section.title && (
                    <h3 className="bg-white px-4 py-2 text-sm font-semibold text-gray-900">
                        {section.title}
                    </h3>
                )}
                <figure className="p-4">
                    <img
                        src={src}
                        alt={section.image_caption || section.title || 'Image'}
                        className="max-h-[400px] w-full object-contain"
                    />
                    {section.image_caption && (
                        <figcaption className="mt-2 text-center text-sm text-gray-500">
                            {section.image_caption}
                        </figcaption>
                    )}
                </figure>
            </div>
        );
    }

    if (type === 'code') {
        const code = section.code_content || section.text_content || '';
        const lang = section.code_language || 'text';
        if (!code.trim()) return null;
        return (
            <div className={cn('rounded-xl border border-gray-200 overflow-hidden bg-gray-900', className)}>
                {section.title && (
                    <h3 className="border-b border-gray-700 px-4 py-2 text-sm font-semibold text-gray-200">
                        {section.title}
                    </h3>
                )}
                {section.text_content && (
                    <p className="border-b border-gray-700 px-4 py-2 text-sm text-gray-300">
                        {section.text_content}
                    </p>
                )}
                <pre className="overflow-x-auto p-4 text-sm text-gray-100">
                    <code data-language={lang}>{code}</code>
                </pre>
            </div>
        );
    }

    if (type === 'practice') {
        const html = markdownToHtml(section.text_content || '');
        const code = section.code_content || '';
        return (
            <div className={cn('rounded-xl border-2 border-primary-200 bg-primary-50/30 p-5', className)}>
                {section.title && (
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">{section.title}</h3>
                )}
                {html && (
                    <div
                        className="prose prose-gray mb-4 max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                )}
                {code && (
                    <pre className="rounded-lg bg-gray-900 p-4 text-sm text-gray-100 overflow-x-auto">
                        <code>{code}</code>
                    </pre>
                )}
            </div>
        );
    }

    if (type === 'quiz') {
        const questions = section.quiz_questions || [];
        if (questions.length === 0) return null;
        return (
            <QuizSection
                section={section}
                questions={questions}
                className={className}
            />
        );
    }

    // fallback: treat as text
    const html = markdownToHtml(section.text_content || '');
    if (!html.trim()) return null;
    return (
        <div className={cn('rounded-xl border border-gray-100 bg-white p-5', className)}>
            {section.title && (
                <h3 className="mb-3 text-lg font-semibold text-gray-900">{section.title}</h3>
            )}
            <div
                className="prose prose-gray max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
