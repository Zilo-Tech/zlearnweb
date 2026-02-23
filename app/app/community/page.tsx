'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Newspaper,
    MessageSquare,
    Users,
    UserCircle,
    Bell,
    Search,
    ChevronRight,
    Info,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunitySidebar } from '@/components/community/community-sidebar';
import { communityService } from '@/lib/services/community.service';
import { cn } from '@/lib/utils';

interface CommunityFeature {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    href: string;
}

export default function CommunityPage() {
    const [stats, setStats] = useState<{
        forums?: { total?: number; subscribed?: number };
        discussions?: { total?: number; my_discussions?: number };
        study_groups?: { my_groups?: number };
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await communityService.getCommunityStats();
                setStats(data as typeof stats);
            } catch {
                setStats(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    const features: CommunityFeature[] = [
        {
            id: 'feed',
            title: 'Discussion Feed',
            description: 'See all recent discussions and updates',
            icon: Newspaper,
            href: '/app/community/feed',
        },
        {
            id: 'forums',
            title: 'Forums',
            description: 'Browse and join course forums',
            icon: MessageSquare,
            href: '/app/community/forums',
        },
        {
            id: 'study-groups',
            title: 'Study Groups',
            description: 'Find and join study groups',
            icon: Users,
            href: '/app/community/groups',
        },
        {
            id: 'my-groups',
            title: 'My Groups',
            description: 'Your study groups and communities',
            icon: UserCircle,
            href: '/app/community/my-groups',
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Stay updated with community activity',
            icon: Bell,
            href: '/app/community/notifications',
        },
        {
            id: 'search',
            title: 'Search',
            description: 'Find forums, discussions, groups, and users',
            icon: Search,
            href: '/app/community/search',
        },
    ];

    return (
        <div className="bg-zinc-50 text-base antialiased min-h-[60vh]">
            <div className="container max-w-6xl mx-auto px-6 py-10 md:py-12">
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 min-w-0 space-y-8">
                {/* Page header — matches contact / home */}
                <div className="mb-10">
                    <p className="text-sm text-primary-600 uppercase tracking-widest font-bold mb-2">
                        Connect
                    </p>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
                        Community
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Join discussions, study groups, and stay updated with peers.
                    </p>
                </div>

                {/* Welcome card — brand primary */}
                <div className="rounded-2xl bg-primary-800 border-2 border-primary-700 p-6 md:p-8 text-primary-50 mb-10">
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-2">
                        Welcome to the Community
                    </h2>
                    <p className="text-primary-100 leading-relaxed max-w-2xl">
                        Connect with fellow learners, join discussions, and collaborate in study groups.
                    </p>
                </div>

                {/* Quick stats — brand cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="rounded-lg border-2 border-primary-200 bg-white p-6 h-24 animate-pulse"
                            />
                        ))
                    ) : (
                        <>
                            <div className="rounded-lg border-2 border-primary-200 bg-white p-6 text-center">
                                <span className="text-2xl font-black text-primary-900 tracking-tight">
                                    {stats?.forums?.subscribed ?? 0}
                                </span>
                                <p className="text-sm font-semibold text-gray-600 mt-1">Forums Subscribed</p>
                            </div>
                            <div className="rounded-lg border-2 border-primary-200 bg-white p-6 text-center">
                                <span className="text-2xl font-black text-primary-900 tracking-tight">
                                    {stats?.discussions?.total ?? 0}
                                </span>
                                <p className="text-sm font-semibold text-gray-600 mt-1">Discussions</p>
                            </div>
                            <div className="rounded-lg border-2 border-primary-200 bg-white p-6 text-center">
                                <span className="text-2xl font-black text-primary-900 tracking-tight">
                                    {stats?.study_groups?.my_groups ?? 0}
                                </span>
                                <p className="text-sm font-semibold text-gray-600 mt-1">My Study Groups</p>
                            </div>
                        </>
                    )}
                </div>

                {/* Features grid — brand styling */}
                <div className="mb-10">
                    <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4">
                        Explore
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <Link key={feature.id} href={feature.href}>
                                    <div className="rounded-lg border-2 border-primary-200 bg-white p-5 transition-all hover:border-primary-300 hover:bg-primary-50/50 hover:shadow-md group">
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-200">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 group-hover:text-primary-900 transition-colors">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-0.5">
                                                    {feature.description}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-5 w-5 shrink-0 text-primary-500 group-hover:text-primary-700" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Guidelines — primary accent */}
                <div className="rounded-lg border-2 border-primary-200 bg-primary-50/50 p-6">
                    <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                            <Info className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-primary-900 mb-1">Community Guidelines</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Be respectful, helpful, and constructive. Share knowledge, ask questions, and help others learn.
                                Our community is built on mutual support and academic integrity.
                            </p>
                        </div>
                    </div>
                </div>
                    </div>

                    <aside className="space-y-6">
                        <CommunitySidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
}
