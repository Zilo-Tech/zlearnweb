'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, ChevronRight, Loader2, ArrowLeft, MessageSquarePlus } from 'lucide-react';
import { CommunitySidebar } from '@/components/community/community-sidebar';
import { communityService } from '@/lib/services/community.service';

export default function ForumDetailPage({ params }: { params: Promise<{ forumId: string }> }) {
    const { forumId } = use(params);
    const [forum, setForum] = useState<any>(null);
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setError(null);
                const [forumRes, discussionsRes] = await Promise.all([
                    communityService.getForumDetails(forumId),
                    communityService.getForumDiscussions(forumId),
                ]);
                setForum(forumRes);
                setDiscussions(Array.isArray(discussionsRes) ? discussionsRes : []);
            } catch {
                setError('Could not load forum.');
                setForum(null);
                setDiscussions([]);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [forumId]);

    return (
        <div className="bg-zinc-50 text-base antialiased min-h-[60vh]">
            <div className="container max-w-6xl mx-auto px-6 py-10 md:py-12">
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 min-w-0 space-y-6">
                        <Link
                            href="/app/community/forums"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mb-6"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Forums
                        </Link>

                        {error && (
                            <div className="rounded-lg border-2 border-primary-200 bg-white p-4 text-center text-gray-600">
                                {error}
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                            </div>
                        ) : forum ? (
                            <>
                                <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-primary-600 uppercase tracking-widest font-bold mb-2">Forum</p>
                                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
                                            {forum.name || 'Forum'}
                                        </h1>
                                        {forum.description && (
                                            <p className="text-lg text-gray-600">{forum.description}</p>
                                        )}
                                    </div>
                                    <Link
                                        href={`/app/community/discussions/create?forum=${forum.id}`}
                                        className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2.5 text-white font-semibold hover:bg-primary-600 shrink-0"
                                    >
                                        <MessageSquarePlus className="h-5 w-5" />
                                        Start discussion
                                    </Link>
                                </div>

                                <h2 className="text-lg font-bold text-primary-900 tracking-tight mb-4">Discussions</h2>
                                {discussions.length === 0 ? (
                                    <div className="rounded-lg border-2 border-primary-200 bg-white p-8 text-center">
                                        <MessageSquare className="h-12 w-12 text-primary-300 mx-auto mb-3" />
                                        <p className="font-semibold text-gray-900">No discussions yet</p>
                                        <p className="text-sm text-gray-600 mt-1">Be the first to start a discussion.</p>
                                        <Link
                                            href={`/app/community/discussions/create?forum=${forum.id}`}
                                            className="mt-4 inline-block rounded-lg bg-primary-500 px-4 py-2 text-white font-semibold hover:bg-primary-600"
                                        >
                                            Start discussion
                                        </Link>
                                    </div>
                                ) : (
                                    <ul className="space-y-4">
                                        {discussions.map((d) => (
                                            <li key={d.id}>
                                                <Link href={`/app/community/discussions/${d.id}`}>
                                                    <div className="rounded-lg border-2 border-primary-200 bg-white p-5 transition-all hover:border-primary-300 hover:bg-primary-50/50 flex items-center gap-4 group">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                                                            <MessageSquare className="h-5 w-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-gray-900 group-hover:text-primary-900 line-clamp-1">
                                                                {d.title || 'Untitled'}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mt-0.5">
                                                                {d.reply_count ?? 0} replies
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 shrink-0 text-primary-500" />
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        ) : !isLoading && !error && (
                            <div className="rounded-lg border-2 border-primary-200 bg-white p-8 text-center text-gray-600">
                                Forum not found.
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
