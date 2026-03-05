'use client';

import { useState, useEffect } from 'react';
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

export type OnSectionCompletePayload = {
    time_spent_seconds?: number;
    metadata?: { video_completed?: boolean; quiz_score?: number; completed_sections?: number };
};

interface LessonSectionBlockProps {
    section: LessonSection;
    className?: string;
    /** When provided (e.g. for academic), called when a section is completed (video marked watched, quiz answered). */
    onSectionComplete?: (sectionId: string, data: OnSectionCompletePayload) => void;
}

/** Interactive quiz: user selects an option, then we reveal correct answer. */
function QuizSection({
    section,
    questions,
    className,
    onSectionComplete,
}: {
    section: LessonSection;
    questions: NonNullable<LessonSection['quiz_questions']>;
    className?: string;
    onSectionComplete?: (sectionId: string, data: OnSectionCompletePayload) => void;
}) {
    const [selected, setSelected] = useState<Record<string, string>>({});
    const [reported, setReported] = useState(false);

    const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);
    const allAnswered = sortedQuestions.length > 0 && sortedQuestions.every((q) => !!selected[q.id]);
    const correctCount = sortedQuestions.filter((q) => {
        const optId = selected[q.id];
        const opt = (q.options || []).find((o) => o.id === optId);
        return opt?.is_correct;
    }).length;
    const quizScore = sortedQuestions.length ? Math.round((correctCount / sortedQuestions.length) * 100) : 0;

    useEffect(() => {
        if (allAnswered && onSectionComplete && !reported) {
            setReported(true);
            onSectionComplete(section.id, { metadata: { quiz_score: quizScore } });
        }
    }, [allAnswered, onSectionComplete, reported, section.id, quizScore]);

    return (
        <div className={cn('rounded-xl border border-gray-200 bg-white p-5 shadow-sm', className)}>
            {section.title && (
                <h3 className="mb-4 text-lg font-semibold text-gray-900">{section.title}</h3>
            )}
            {section.text_content && (
                <div
                    className="mb-4 text-sm text-gray-600 prose prose-sm max-w-none prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer"
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(section.text_content) }}
                />
            )}
            <ul className="space-y-6">
                {sortedQuestions.map((q) => {
                    const selectedOptionId = selected[q.id];
                    const options = (q.options || []).sort((a, b) => a.order - b.order);
                    const correctOption = options.find((o) => o.is_correct);
                    const hasAnswered = !!selectedOptionId;

                    return (
                        <li key={q.id} className="rounded-lg border border-gray-100 p-4">
                            <div
                                className="mb-3 font-medium text-gray-900 prose prose-sm max-w-none prose-p:my-1 prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer"
                                dangerouslySetInnerHTML={{ __html: markdownToHtml(q.text) }}
                            />
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
                                                    <span dangerouslySetInnerHTML={{ __html: markdownToHtml(opt.text) }} />
                                                </span>
                                                {hasAnswered && opt.explanation && (
                                                    <span
                                                        className="mt-1 block text-xs text-gray-500 prose prose-xs max-w-none prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer"
                                                        dangerouslySetInnerHTML={{ __html: markdownToHtml(opt.explanation) }}
                                                    />
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
                                                    Correct answer: <strong dangerouslySetInnerHTML={{ __html: markdownToHtml(correctOption.text) }} />
                                                    {correctOption.explanation && (
                                                        <span className="text-gray-500 prose prose-sm inline prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer" dangerouslySetInnerHTML={{ __html: ` — ${markdownToHtml(correctOption.explanation)}` }} />
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </p>
                            )}
                            {hasAnswered && q.explanation && (
                                <div
                                    className="mt-2 text-xs text-gray-500 prose prose-xs max-w-none prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer"
                                    dangerouslySetInnerHTML={{ __html: markdownToHtml(q.explanation) }}
                                />
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export function LessonSectionBlock({ section, className, onSectionComplete }: LessonSectionBlockProps) {
    const rawType = section.section_type || 'text';
    const type = typeof rawType === 'string' ? rawType.toLowerCase().trim() : 'text';

    if (type === 'text' || type === 'reading') {
        const html = markdownToHtml(section.text_content || '');
        if (!html.trim()) return null;
        return (
            <div className={cn('rounded-xl border border-gray-100 bg-white p-5 shadow-sm', className)}>
                {section.title && (
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">{section.title}</h3>
                )}
                <div
                    className="prose prose-gray max-w-none text-gray-700 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-2 prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2 prose-table:my-4 prose-blockquote:not-italic prose-blockquote:border-primary-200 prose-a:pointer-events-auto prose-a:cursor-pointer prose-a:z-[1] prose-a:text-primary-600 prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        );
    }

    if (type === 'video') {
        const url = String(section.video_url || section.content_url || (section as { url?: string }).url || (section as { file?: string }).file || '').trim();
        const embed = youtubeEmbedUrl(url);
        if (embed) {
            const durationSeconds = (section as { video_duration_seconds?: number }).video_duration_seconds;
            return (
                <div className={cn('rounded-xl overflow-hidden border border-gray-200 bg-black', className)}>
                    {section.title && (
                        <h3 className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900">
                            {section.title}
                        </h3>
                    )}
                    <div className="relative w-full min-h-[200px]" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            src={embed}
                            title={section.title || 'Video'}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                    {onSectionComplete && (
                        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                            <button
                                type="button"
                                onClick={() => onSectionComplete(section.id, {
                                    time_spent_seconds: durationSeconds ?? 0,
                                    metadata: { video_completed: true },
                                })}
                                className="text-sm font-medium text-[#446D6D] hover:underline"
                            >
                                Mark section as watched
                            </button>
                        </div>
                    )}
                    {section.text_content && (
                        <div
                            className="border-t border-gray-100 p-4 text-sm text-gray-600 prose prose-sm max-w-none prose-p:my-2 prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer prose-a:z-[1]"
                            dangerouslySetInnerHTML={{ __html: markdownToHtml(section.text_content) }}
                        />
                    )}
                </div>
            );
        }
        if (url) {
            const durationSeconds = (section as { video_duration_seconds?: number }).video_duration_seconds;
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
                    {onSectionComplete && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => onSectionComplete(section.id, {
                                    time_spent_seconds: durationSeconds ?? 0,
                                    metadata: { video_completed: true },
                                })}
                                className="text-sm font-medium text-[#446D6D] hover:underline"
                            >
                                Mark section as watched
                            </button>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    }

    if (type === 'image') {
        const src = section.image_url || section.content_url || (section as { url?: string }).url || '';
        if (!src) return null;
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
                        <figcaption
                            className="mt-2 text-center text-sm text-gray-500 prose prose-sm max-w-none prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer"
                            dangerouslySetInnerHTML={{ __html: markdownToHtml(section.image_caption) }}
                        />
                    )}
                </figure>
            </div>
        );
    }

    if (type === 'code') {
        const code = section.code_content || '';
        const lang = section.code_language || 'text';
        const hasCode = code.trim().length > 0;
        const textHtml = section.text_content ? markdownToHtml(section.text_content) : '';
        if (!hasCode && !textHtml.trim()) return null;
        return (
            <div className={cn('rounded-xl border border-gray-200 overflow-hidden bg-gray-900', className)}>
                {section.title && (
                    <h3 className="border-b border-gray-700 px-4 py-2 text-sm font-semibold text-gray-200">
                        {section.title}
                    </h3>
                )}
                {textHtml && (
                    <div
                        className="border-b border-gray-700 px-4 py-2 text-sm text-gray-300 prose prose-sm prose-invert max-w-none prose-p:my-1 prose-a:text-primary-300 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer"
                        dangerouslySetInnerHTML={{ __html: textHtml }}
                    />
                )}
                {hasCode && (
                    <pre className="overflow-x-auto p-4 text-sm text-gray-100">
                        <code data-language={lang}>{code}</code>
                    </pre>
                )}
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
                        className="prose prose-gray mb-4 max-w-none text-gray-700 prose-a:pointer-events-auto prose-a:cursor-pointer"
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
                onSectionComplete={onSectionComplete}
            />
        );
    }

    if (type === 'embed') {
        const embedCode = (section as { embed_code?: string }).embed_code;
        const embedUrl = section.content_url || (section as { url?: string }).url || '';
        const embedSrc = youtubeEmbedUrl(embedUrl);
        if (embedCode && typeof embedCode === 'string') {
            return (
                <div className={cn('rounded-xl overflow-hidden border border-gray-200 bg-black', className)}>
                    {section.title && (
                        <h3 className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900">{section.title}</h3>
                    )}
                    <div className="aspect-video w-full [&>iframe]:h-full [&>iframe]:w-full" dangerouslySetInnerHTML={{ __html: embedCode }} />
                    {section.text_content && (
                        <div className="border-t border-gray-100 p-4 text-sm text-gray-600 prose prose-sm max-w-none prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer" dangerouslySetInnerHTML={{ __html: markdownToHtml(section.text_content) }} />
                    )}
                </div>
            );
        }
        if (embedSrc) {
            return (
                <div className={cn('rounded-xl overflow-hidden border border-gray-200 bg-black', className)}>
                    {section.title && (
                        <h3 className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-900">{section.title}</h3>
                    )}
                    <div className="aspect-video w-full">
                        <iframe src={embedSrc} title={section.title || 'Embed'} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                    {section.text_content && (
                        <div className="border-t border-gray-100 p-4 text-sm text-gray-600 prose prose-sm max-w-none prose-a:text-primary-600 prose-a:underline prose-a:pointer-events-auto prose-a:cursor-pointer" dangerouslySetInnerHTML={{ __html: markdownToHtml(section.text_content) }} />
                    )}
                </div>
            );
        }
        if (embedUrl) {
            return (
                <div className={cn('rounded-xl border border-gray-200 p-4', className)}>
                    {section.title && <h3 className="mb-2 text-lg font-semibold text-gray-900">{section.title}</h3>}
                    <a href={embedUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">Open content</a>
                </div>
            );
        }
    }

    // fallback: treat as text (exam_prep, study_guide, mock_exam, assignment, etc.)
    const html = markdownToHtml(section.text_content || '');
    if (!html.trim()) return null;
    return (
        <div className={cn('rounded-xl border border-gray-100 bg-white p-5', className)}>
            {section.title && (
                <h3 className="mb-3 text-lg font-semibold text-gray-900">{section.title}</h3>
            )}
            <div
                className="prose prose-gray max-w-none text-gray-700 prose-a:pointer-events-auto prose-a:cursor-pointer"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}
