'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    MessageSquarePlus,
    MessageSquare,
    Users,
    UserCircle,
    Search,
    Bell,
    Lightbulb,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { communityService } from '@/lib/services/community.service';

export function CommunitySidebar() {
    const [stats, setStats] = useState<{
        forums?: { subscribed?: number };
        discussions?: { total?: number };
        study_groups?: { my_groups?: number };
    } | null>(null);

    useEffect(() => {
        communityService
            .getCommunityStats()
            .then((data: unknown) => setStats(data as { forums?: { subscribed?: number }; discussions?: { total?: number }; study_groups?: { my_groups?: number } } | null))
            .catch(() => setStats(null));
    }, []);

    const quickLinks = [
        { href: '/app/community/discussions/create', label: 'Start a discussion', icon: MessageSquarePlus },
        { href: '/app/community/forums', label: 'Browse forums', icon: MessageSquare },
        { href: '/app/community/groups', label: 'Study groups', icon: Users },
        { href: '/app/community/my-groups', label: 'My groups', icon: UserCircle },
        { href: '/app/community/search', label: 'Search', icon: Search },
        { href: '/app/community/notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="space-y-6">
            {/* Quick links */}
            <div className="rounded-xl border-2 border-primary-200 bg-white p-4">
                <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wider mb-3">Quick links</h3>
                <ul className="space-y-1">
                    {quickLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-900 transition-colors group"
                                >
                                    <Icon className="h-4 w-4 shrink-0 text-primary-600" />
                                    <span className="flex-1">{item.label}</span>
                                    <ChevronRight className="h-4 w-4 shrink-0 text-primary-400 group-hover:text-primary-600" />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Stats */}
            <div className="rounded-xl border-2 border-primary-200 bg-white p-4">
                <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wider mb-3">Your activity</h3>
                {stats === null ? (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                    </div>
                ) : (
                    <ul className="space-y-3">
                        <li className="flex items-center justify-between rounded-lg bg-primary-50/50 px-3 py-2 text-sm">
                            <span className="text-gray-700">Forums subscribed</span>
                            <span className="font-bold text-primary-900">{stats?.forums?.subscribed ?? 0}</span>
                        </li>
                        <li className="flex items-center justify-between rounded-lg bg-primary-50/50 px-3 py-2 text-sm">
                            <span className="text-gray-700">Discussions</span>
                            <span className="font-bold text-primary-900">{stats?.discussions?.total ?? 0}</span>
                        </li>
                        <li className="flex items-center justify-between rounded-lg bg-primary-50/50 px-3 py-2 text-sm">
                            <span className="text-gray-700">My groups</span>
                            <span className="font-bold text-primary-900">{stats?.study_groups?.my_groups ?? 0}</span>
                        </li>
                    </ul>
                )}
            </div>

            {/* Tip */}
            <div className="rounded-xl border-2 border-primary-200 bg-primary-50/50 p-4">
                <div className="flex gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                        <Lightbulb className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-primary-900 mb-1">Tip</h3>
                        <p className="text-xs text-gray-700 leading-relaxed">
                            Start a discussion in a forum to get help from peers and tutors. Be clear and respectful to get the best answers.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
