'use client';

import { youtubeEmbedUrl } from '@/lib/utils/markdownToHtml';

interface LessonPlayerProps {
    src: string;
    poster?: string;
    title?: string;
    onComplete?: () => void;
}

export function LessonPlayer({ src, poster, title }: LessonPlayerProps) {
    const embedUrl = src ? youtubeEmbedUrl(src) : null;

    if (embedUrl) {
        return (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                    src={embedUrl}
                    title={title || 'Video'}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        );
    }

    if (src && (src.endsWith('.mp4') || src.endsWith('.webm') || src.includes('video/'))) {
        return (
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <video
                    src={src}
                    poster={poster}
                    controls
                    className="h-full w-full"
                    playsInline
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }

    return (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center">
            {src ? (
                <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white underline text-center px-4"
                >
                    Open video in new tab
                </a>
            ) : (
                <p className="text-gray-500 text-sm">No video available</p>
            )}
        </div>
    );
}
