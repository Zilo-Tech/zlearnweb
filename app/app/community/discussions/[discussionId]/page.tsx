'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, MessageSquare, ThumbsUp, Share2, MoreHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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

export default function DiscussionDetailsPage({ params }: { params: Promise<{ discussionId: string }> }) {
    const { discussionId } = use(params);
    const [discussion, setDiscussion] = useState<any>(null);
    const [replies, setReplies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);
    const [liking, setLiking] = useState(false);

    const load = async () => {
        try {
            setError(null);
            const [disc, reps] = await Promise.all([
                communityService.getDiscussionDetails(discussionId),
                communityService.getReplies(discussionId),
            ]);
            setDiscussion(disc);
            setReplies(Array.isArray(reps) ? reps : []);
        } catch {
            setError('Could not load discussion.');
            setDiscussion(null);
            setReplies([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, [discussionId]);

    const handleLike = async () => {
        if (!discussion || liking) return;
        setLiking(true);
        try {
            const res = await communityService.likeDiscussion(discussion.id);
            setDiscussion((d: any) => (d ? { ...d, like_count: res.like_count, is_liked: res.liked } : null));
        } catch {
            // ignore
        } finally {
            setLiking(false);
        }
    };

    const handlePostReply = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = replyContent.trim();
        if (!content || !discussion || submittingReply) return;
        setSubmittingReply(true);
        try {
            await communityService.createReply({ discussion: discussion.id, content });
            setReplyContent('');
            const reps = await communityService.getReplies(discussionId);
            setReplies(Array.isArray(reps) ? reps : []);
            if (discussion.reply_count != null) setDiscussion((d: any) => (d ? { ...d, reply_count: (d.reply_count ?? 0) + 1 } : null));
        } catch {
            // ignore
        } finally {
            setSubmittingReply(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-zinc-50 min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
            </div>
        );
    }

    if (error || !discussion) {
        return (
            <div className="bg-zinc-50 min-h-[60vh] flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">{error || 'Discussion not found.'}</p>
                    <Link href="/app/community" className="text-primary-600 font-semibold hover:text-primary-700">
                        Back to Community
                    </Link>
                </div>
            </div>
        );
    }

    const forumId = discussion.forum ?? discussion.forum_id;

    return (
        <div className="bg-zinc-50 text-base antialiased min-h-[60vh]">
            <div className="container max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                    {forumId ? (
                        <Link
                            href={`/app/community/forums/${forumId}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Back to {discussion.forum_name || 'Forum'}
                        </Link>
                    ) : null}
                    <Link
                        href="/app/community"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-600"
                    >
                        {forumId ? '· Community' : <><ChevronLeft className="h-4 w-4" /> Back to Community</>}
                    </Link>
                </div>

                {/* Main Post — social card */}
                <article className="rounded-xl border-2 border-primary-200 bg-white overflow-hidden shadow-sm">
                    <div className="p-4 md:p-6">
                        <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <Avatar className="h-11 w-11 shrink-0 border-2 border-primary-100">
                                    <AvatarImage src={discussion.author_avatar} />
                                    <AvatarFallback className="bg-primary-100 text-primary-800 font-semibold">
                                        {(discussion.author_name || 'U').slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900">{discussion.author_name || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-500">
                                        {relativeTime(discussion.created_at)} · <span className="text-primary-600 font-medium">{discussion.forum_name || 'Forum'}</span>
                                    </p>
                                </div>
                            </div>
                            {(discussion.is_pinned || discussion.status === 'pinned') && (
                                <Badge className="bg-primary-100 text-primary-800 border-0">Pinned</Badge>
                            )}
                        </div>

                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{discussion.title}</h1>
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                            {discussion.content}
                        </div>

                        <div className="mt-5 flex items-center gap-4 pt-4 border-t border-primary-100">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                                onClick={handleLike}
                                disabled={liking}
                            >
                                {liking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className={`h-4 w-4 ${discussion.is_liked ? 'fill-primary-500 text-primary-500' : ''}`} />}
                                {discussion.like_count ?? 0}
                            </Button>
                            <span className="flex items-center gap-2 text-sm text-gray-500">
                                <MessageSquare className="h-4 w-4" />
                                {discussion.reply_count ?? replies.length} replies
                            </span>
                            <Button variant="ghost" size="sm" className="ml-auto text-gray-500">
                                <Share2 className="h-4 w-4 mr-1.5" /> Share
                            </Button>
                        </div>
                    </div>
                </article>

                {/* Replies */}
                <section>
                    <h2 className="text-lg font-bold text-primary-900 mb-4">Replies</h2>
                    <div className="space-y-4">
                        {replies.length === 0 ? (
                            <p className="text-gray-500 text-sm py-4">No replies yet. Be the first to reply.</p>
                        ) : (
                            replies.map((reply) => (
                                <div
                                    key={reply.id}
                                    className="rounded-xl border-2 border-primary-200 bg-white p-4"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <Avatar className="h-9 w-9 border border-primary-100">
                                            <AvatarImage src={reply.author_avatar} />
                                            <AvatarFallback className="bg-primary-50 text-primary-700 text-xs">
                                                {(reply.author_name || 'U').slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{reply.author_name || 'Anonymous'}</p>
                                            <p className="text-xs text-gray-500">{relativeTime(reply.created_at)}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap pl-12">{reply.content}</p>
                                    <div className="mt-2 pl-12">
                                        <Button variant="ghost" size="sm" className="h-8 text-gray-500 hover:text-primary-600">
                                            <ThumbsUp className="h-3.5 w-3.5 mr-1" /> {reply.like_count ?? 0}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Reply form */}
                <form onSubmit={handlePostReply} className="rounded-xl border-2 border-primary-200 bg-white p-4 md:p-5">
                    <h3 className="font-bold text-primary-900 mb-3">Post a reply</h3>
                    <Textarea
                        placeholder="Write your reply..."
                        className="min-h-[100px] border-2 border-primary-200 rounded-lg focus:ring-primary-500/20 mb-3"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        disabled={submittingReply}
                    />
                    <Button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold" disabled={submittingReply || !replyContent.trim()}>
                        {submittingReply ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Post Reply
                    </Button>
                </form>
            </div>
        </div>
    );
}
