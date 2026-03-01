'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Search, BookOpen, MessageSquare, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunitySidebar } from '@/components/community/community-sidebar';
import { communityService } from '@/lib/services/community.service';

type TabType = 'all' | 'forums' | 'discussions' | 'groups';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [results, setResults] = useState<{ forums: any[]; discussions: any[]; groups: any[]; users: any[] }>({ forums: [], discussions: [], groups: [], users: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [searched, setSearched] = useState(false);

    const runSearch = useCallback(async (q: string) => {
        const term = q.trim();
        if (!term) {
            setResults({ forums: [], discussions: [], groups: [], users: [] });
            setSearched(false);
            return;
        }
        setIsSearching(true);
        setSearched(true);
        try {
            const data = await communityService.search(term, 'all', 20);
            const r = (data as { results?: { forums?: unknown[]; discussions?: unknown[]; groups?: unknown[]; users?: unknown[] }; forums?: unknown[]; discussions?: unknown[]; groups?: unknown[]; users?: unknown[] }) ?? {};
            const res = r.results ?? r;
            setResults({
                forums: Array.isArray(res?.forums) ? res.forums : [],
                discussions: Array.isArray(res?.discussions) ? res.discussions : [],
                groups: Array.isArray(res?.groups) ? res.groups : [],
                users: Array.isArray(res?.users) ? res.users : [],
            });
        } catch {
            setResults({ forums: [], discussions: [], groups: [], users: [] });
        } finally {
            setIsSearching(false);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        runSearch(query);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'course':
            case 'forums': return <BookOpen className="h-5 w-5 text-primary-600" />;
            case 'discussion':
            case 'discussions': return <MessageSquare className="h-5 w-5 text-primary-600" />;
            case 'group':
            case 'groups': return <Users className="h-5 w-5 text-primary-600" />;
            default: return <Search className="h-5 w-5 text-gray-500" />;
        }
    };

    const renderForums = () =>
        results.forums.length === 0 ? (
            <p className="text-gray-500 text-sm py-6 text-center">No forums found.</p>
        ) : (
            results.forums.map((f) => (
                <Link key={f.id} href={`/app/community/forums/${f.id}`}>
                    <div className="flex items-center gap-4 rounded-lg border-2 border-primary-200 bg-white p-4 transition-all hover:border-primary-300 hover:bg-primary-50/50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100">{getIcon('forums')}</div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900">{f.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-1">{f.description || f.course_title || 'Forum'}</p>
                        </div>
                        <span className="text-xs font-semibold text-primary-600">{f.discussion_count ?? 0} discussions</span>
                    </div>
                </Link>
            ))
        );

    const renderDiscussions = () =>
        results.discussions.length === 0 ? (
            <p className="text-gray-500 text-sm py-6 text-center">No discussions found.</p>
        ) : (
            results.discussions.map((d) => (
                <Link key={d.id} href={`/app/community/discussions/${d.id}`}>
                    <div className="flex items-center gap-4 rounded-lg border-2 border-primary-200 bg-white p-4 transition-all hover:border-primary-300 hover:bg-primary-50/50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100">{getIcon('discussions')}</div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 line-clamp-1">{d.title}</h3>
                            <p className="text-sm text-gray-600">{d.author_name && `${d.author_name} · `}{d.forum_name} · {d.reply_count ?? 0} replies</p>
                        </div>
                    </div>
                </Link>
            ))
        );

    const renderGroups = () =>
        results.groups.length === 0 ? (
            <p className="text-gray-500 text-sm py-6 text-center">No groups found.</p>
        ) : (
            results.groups.map((g) => (
                <Link key={g.id} href={`/app/community/groups/${g.id}`}>
                    <div className="flex items-center gap-4 rounded-lg border-2 border-primary-200 bg-white p-4 transition-all hover:border-primary-300 hover:bg-primary-50/50">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100">{getIcon('groups')}</div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900">{g.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-1">{g.description || `${g.member_count ?? 0} members`}</p>
                        </div>
                        <span className="text-xs font-semibold text-primary-600">{g.member_count ?? 0} members</span>
                    </div>
                </Link>
            ))
        );

    const hasAny = results.forums.length > 0 || results.discussions.length > 0 || results.groups.length > 0 || results.users.length > 0;

    return (
        <div className="bg-zinc-50 text-base antialiased min-h-[60vh]">
            <div className="container max-w-6xl mx-auto px-6 py-10 md:py-12">
                <Link href="/app/community" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mb-6">
                    <ArrowLeft className="h-4 w-4" /> Back to Community
                </Link>
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 min-w-0 space-y-6">
                <div className="mb-6">
                    <p className="text-sm text-primary-600 uppercase tracking-widest font-bold mb-2">Search</p>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">Find content</h1>
                    <p className="text-gray-600 mb-4">Search forums, discussions, and groups.</p>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-primary-500" />
                            <Input
                                placeholder="Search..."
                                className="pl-10 h-12 border-2 border-primary-200 focus:ring-primary-500/20 rounded-lg"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold h-12 px-6" disabled={isSearching}>
                            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
                        </Button>
                    </form>
                </div>

                {isSearching && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                    </div>
                )}

                {!isSearching && searched && !hasAny && query.trim() && (
                    <div className="rounded-xl border-2 border-primary-200 bg-white p-10 text-center text-gray-600">
                        No results for &quot;{query}&quot;. Try different keywords.
                    </div>
                )}

                {!isSearching && (!searched || hasAny) && (
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
                        <TabsList className="w-full h-auto flex flex-wrap gap-1 p-2 rounded-lg border-2 border-primary-200 bg-white">
                            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 font-semibold">All</TabsTrigger>
                            <TabsTrigger value="forums" className="rounded-lg data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 font-semibold">Forums</TabsTrigger>
                            <TabsTrigger value="discussions" className="rounded-lg data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 font-semibold">Discussions</TabsTrigger>
                            <TabsTrigger value="groups" className="rounded-lg data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 font-semibold">Groups</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="mt-6 space-y-4">
                            {!searched ? (
                                <p className="text-gray-500 text-sm py-6">Enter a search term and click Search.</p>
                            ) : (
                                <>
                                    {results.forums.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wider mb-3">Forums</h3>
                                            <div className="space-y-3">{renderForums()}</div>
                                        </div>
                                    )}
                                    {results.discussions.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wider mb-3">Discussions</h3>
                                            <div className="space-y-3">{renderDiscussions()}</div>
                                        </div>
                                    )}
                                    {results.groups.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wider mb-3">Groups</h3>
                                            <div className="space-y-3">{renderGroups()}</div>
                                        </div>
                                    )}
                                    {!hasAny && <p className="text-gray-500 text-sm py-6 text-center">No results.</p>}
                                </>
                            )}
                        </TabsContent>
                        <TabsContent value="forums" className="mt-6 space-y-4">
                            {renderForums()}
                        </TabsContent>
                        <TabsContent value="discussions" className="mt-6 space-y-4">
                            {renderDiscussions()}
                        </TabsContent>
                        <TabsContent value="groups" className="mt-6 space-y-4">
                            {renderGroups()}
                        </TabsContent>
                    </Tabs>
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
