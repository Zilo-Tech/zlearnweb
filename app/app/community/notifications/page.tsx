'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, MessageSquare, Trophy, BookOpen, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunitySidebar } from '@/components/community/community-sidebar';
import { communityService } from '@/lib/services/community.service';

function getIcon(type: string) {
    switch (type) {
        case 'achievement': return Trophy;
        case 'discussion': return MessageSquare;
        case 'course': return BookOpen;
        default: return CheckCircle;
    }
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [marking, setMarking] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await communityService.getNotifications({});
                setNotifications(res?.results ?? []);
            } catch {
                setNotifications([]);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const handleMarkAllRead = async () => {
        setMarking(true);
        try {
            await communityService.markAllNotificationsAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch {
            // ignore
        } finally {
            setMarking(false);
        }
    };

    const displayList = (notifications || []).map((n) => {
        const type = n.notification_type || n.type || 'system';
        return {
            ...n,
            read: n.is_read ?? n.read,
            icon: getIcon(type),
        };
    });

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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <p className="text-sm text-primary-600 uppercase tracking-widest font-bold mb-2">Updates</p>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-1">
                            Notifications
                        </h1>
                        <p className="text-gray-600">Stay updated with learning and community activity.</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-primary-200 hover:bg-primary-50 font-semibold shrink-0"
                        onClick={handleMarkAllRead}
                        disabled={marking}
                    >
                        {marking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Mark all as read'}
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                    </div>
                ) : displayList.length === 0 ? (
                    <div className="rounded-xl border-2 border-primary-200 bg-white p-10 text-center text-gray-600">
                        <Bell className="h-14 w-14 text-primary-300 mx-auto mb-3" />
                        <p className="font-semibold text-gray-900">No notifications yet</p>
                        <p className="text-sm mt-1">When you get replies, mentions, or updates, they’ll show up here.</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {displayList.map((notification) => {
                            const Icon = notification.icon;
                            const read = !!notification.read;
                            return (
                                <li
                                    key={notification.id}
                                    className={`rounded-lg border-2 p-4 transition-all ${
                                        read
                                            ? 'border-primary-200 bg-white'
                                            : 'border-primary-300 bg-primary-50/50'
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className={`font-semibold ${read ? 'text-gray-900' : 'text-primary-900'}`}>
                                                    {notification.title}
                                                </h3>
                                                <span className="text-xs text-gray-500 shrink-0">
                                                    {notification.created_at
                                                        ? new Date(notification.created_at).toLocaleDateString()
                                                        : notification.time}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {notification.message || notification.body}
                                            </p>
                                        </div>
                                        {!read && (
                                            <span className="h-2 w-2 rounded-full bg-primary-500 shrink-0 mt-2" aria-hidden />
                                        )}
                                    </div>
                                </li>
                            );
                        })}
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
