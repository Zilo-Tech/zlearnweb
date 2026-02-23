'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, ThumbsUp, Loader2, ArrowLeft, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CommunitySidebar } from '@/components/community/community-sidebar';
import { communityService } from '@/lib/services/community.service';

function relativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const sec = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (sec < 60) return 'Just now';
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
    if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
    if (sec < 2592000) return `${Math.floor(sec / 604800)}w ago`;
    return date.toLocaleDateString();
}

export default function DiscussionFeedPage() {
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [likingId, setLikingId] = useState<string | null>(null);

    const loadFeed = async () => {
        try {
            setError(null);
            const res = await communityService.getDiscussionsFeed({});
            setDiscussions(res?.results ?? []);
        } catch {
            setError('Could not load feed.');
            setDiscussions([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFeed();
    }, []);

    const handleLike = async (e: React.MouseEvent, discussionId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (likingId) return;
        setLikingId(discussionId);
        try {
            const res = await communityService.likeDiscussion(discussionId);
            setDiscussions((prev) =>
                prev.map((d) =>
                    d.id === discussionId ? { ...d, like_count: res.like_count, is_liked: res.liked } : d
                )
            );
        } catch {
            // ignore
        } finally {
            setLikingId(null);
        }
    };

    return (
        <div className="bg-zinc-50 text-base antialiased min-h-[60vh]">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
                <Link
                    href="/app/community"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Community
                </Link>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 min-w-0 space-y-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Feed</h1>
                            <p className="text-gray-600 mt-0.5">Recent discussions from your forums.</p>
                        </div>

                        {error && (
                    <div className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-gray-600 mb-6">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                    </div>
                ) : discussions.length === 0 ? (
                    <div className="rounded-xl border-2 border-primary-200 bg-white p-10 text-center">
                        <MessageSquare className="h-14 w-14 text-primary-300 mx-auto mb-4" />
                        <p className="font-semibold text-gray-900 text-lg">No posts yet</p>
                        <p className="text-gray-600 mt-1">Start a discussion from a forum or check back later.</p>
                        <Link
                            href="/app/community/forums"
                            className="mt-5 inline-block rounded-lg bg-primary-500 px-5 py-2.5 text-white font-semibold hover:bg-primary-600"
                        >
                            Browse Forums
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {discussions.map((d) => (
                            <article
                                key={d.id}
                                className="rounded-xl border-2 border-primary-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <Link href={`/app/community/discussions/${d.id}`} className="block">
                                    {/* Post header — author + time + forum */}
                                    <div className="p-4 pb-2 flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar className="h-10 w-10 shrink-0 border-2 border-primary-100">
                                                <AvatarImage src={d.author_avatar} />
                                                <AvatarFallback className="bg-primary-100 text-primary-800 text-sm font-semibold">
                                                    {(d.author_name || 'U').slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{d.author_name || 'Anonymous'}</p>
                                                <p className="text-xs text-gray-500">
                                                    {relativeTime(d.created_at)} · <span className="text-primary-600 font-medium">{d.forum_name || 'Forum'}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 shrink-0"
                                            onClick={(e) => e.preventDefault()}
                                            aria-label="More options"
                                        >
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </div>

                                    {/* Post body */}
                                    <div className="px-4 pb-3">
                                        <h2 className="font-bold text-gray-900 text-lg leading-snug mb-1 line-clamp-2">{d.title || 'Untitled'}</h2>
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{d.content || ''}</p>
                                    </div>
                                </Link>

                                {/* Actions — like, comment */}
                                <div className="px-4 py-2.5 flex items-center gap-1 border-t border-primary-100">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1 justify-center gap-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 h-9"
                                        onClick={(e) => handleLike(e, d.id)}
                                        disabled={likingId === d.id}
                                    >
                                        {likingId === d.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <ThumbsUp className={`h-4 w-4 ${d.is_liked ? 'fill-primary-500 text-primary-500' : ''}`} />
                                        )}
                                        <span className="font-medium">{d.like_count ?? 0}</span>
                                    </Button>
                                    <Link
                                        href={`/app/community/discussions/${d.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg h-9 font-medium text-sm"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        {d.reply_count ?? 0} replies
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                    </div>

                    <aside className="space-y-6">
                        <CommunitySidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
}
