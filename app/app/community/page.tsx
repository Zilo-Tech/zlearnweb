'use client';

import { useState, useEffect } from 'react';
import {
    Newspaper,
    MessageSquare,
    Users,
    UserCircle,
    Bell,
    Search,
    ChevronRight,
    Info,
    Loader2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { communityService } from '@/lib/services/community.service';
import { cn } from '@/lib/utils';

interface CommunityFeature {
    id: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    href: string;
}

export default function CommunityPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await communityService.getCommunityStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch community stats', error);
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
            color: 'text-blue-600',
            href: '/app/community/feed',
        },
        {
            id: 'forums',
            title: 'Forums',
            description: 'Browse and join course forums',
            icon: MessageSquare,
            color: 'text-purple-600',
            href: '/app/community/forums',
        },
        {
            id: 'study-groups',
            title: 'Study Groups',
            description: 'Find and join study groups',
            icon: Users,
            color: 'text-green-600',
            href: '/app/community/groups',
        },
        {
            id: 'my-groups',
            title: 'My Groups',
            description: 'Your study groups and communities',
            icon: UserCircle,
            color: 'text-amber-600',
            href: '/app/community/my-groups',
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Stay updated with community activity',
            icon: Bell,
            color: 'text-red-600',
            href: '/app/community/notifications',
        },
        {
            id: 'search',
            title: 'Search',
            description: 'Find forums, discussions, groups, and users',
            icon: Search,
            color: 'text-indigo-600',
            href: '/app/community/search',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="rounded-2xl bg-[#446D6D] p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome to the Community</h1>
                <p className="text-white/80 text-lg max-w-2xl">
                    Connect with fellow learners, join discussions, and collaborate in study groups.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map((i) => (
                        <Card key={i} className="p-6 flex flex-col items-center justify-center h-24 animate-pulse bg-gray-50" />
                    ))
                ) : (
                    <>
                        <Card className="p-6 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold text-[#446D6D]">{stats?.forums?.subscribed || 0}</span>
                            <span className="text-sm text-gray-500 mt-1 font-medium">Forums Subscribed</span>
                        </Card>
                        <Card className="p-6 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold text-[#446D6D]">{stats?.discussions?.total || 0}</span>
                            <span className="text-sm text-gray-500 mt-1 font-medium">Total Discussions</span>
                        </Card>
                        <Card className="p-6 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-bold text-[#446D6D]">{stats?.study_groups?.my_groups || 0}</span>
                            <span className="text-sm text-gray-500 mt-1 font-medium">My Study Groups</span>
                        </Card>
                    </>
                )}
            </div>

            {/* Features Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Explore Community Features</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Link key={feature.id} href={feature.href}>
                                <Card className="group p-5 transition-all hover:shadow-md hover:border-[#446D6D]/30">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-white",
                                            feature.color
                                        )}>
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 group-hover:text-[#446D6D] transition-colors">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {feature.description}
                                            </p>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#446D6D]" />
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Community Guidelines */}
            <Card className="p-6 bg-blue-50 border-blue-100">
                <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Info className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-900 mb-1">Community Guidelines</h3>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Be respectful, helpful, and constructive. Share knowledge, ask questions, and help others learn.
                            Our community is built on mutual support and academic integrity.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
