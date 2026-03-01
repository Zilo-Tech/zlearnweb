'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { CommunitySidebar } from '@/components/community/community-sidebar';
import { communityService } from '@/lib/services/community.service';

export default function MyStudyGroupsPage() {
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setError(null);
                const list = await communityService.getMyStudyGroups();
                setGroups(Array.isArray(list) ? list : []);
            } catch (e) {
                setError('Could not load your groups.');
                setGroups([]);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="bg-zinc-50 text-base antialiased min-h-[60vh]">
            <div className="container max-w-6xl mx-auto px-6 py-10 md:py-12">
                <Link
                    href="/app/community"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Community
                </Link>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 min-w-0 space-y-6">
                        <div className="mb-8">
                            <p className="text-sm text-primary-600 uppercase tracking-widest font-bold mb-2">My Groups</p>
                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
                                My Study Groups
                            </h1>
                            <p className="text-lg text-gray-600">Groups you’ve joined.</p>
                        </div>

                        {error && (
                    <div className="rounded-lg border-2 border-primary-200 bg-white p-4 text-center text-gray-600">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                    </div>
                ) : groups.length === 0 ? (
                    <div className="rounded-lg border-2 border-primary-200 bg-white p-8 text-center">
                        <Users className="h-12 w-12 text-primary-300 mx-auto mb-3" />
                        <p className="font-semibold text-gray-900">You haven’t joined any groups yet</p>
                        <p className="text-sm text-gray-600 mt-1">Browse study groups and join to appear here.</p>
                        <Link
                            href="/app/community/groups"
                            className="mt-4 inline-block rounded-lg bg-primary-500 px-4 py-2 text-white font-semibold hover:bg-primary-600"
                        >
                            Browse Groups
                        </Link>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {groups.map((g) => (
                            <li key={g.id}>
                                <Link href={`/app/community/groups/${g.id}`}>
                                    <div className="rounded-lg border-2 border-primary-200 bg-white p-5 transition-all hover:border-primary-300 hover:bg-primary-50/50 flex items-center gap-4 group">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 group-hover:text-primary-900">
                                                {g.name || 'Study Group'}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                                                {g.description || 'Study group'} · {g.member_count ?? 0} members
                                            </p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 shrink-0 text-primary-500" />
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
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
