'use client';

import { Bell, MessageSquare, Trophy, BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data
const NOTIFICATIONS = [
    {
        id: '1',
        type: 'achievement',
        title: 'New Achievement Unlocked!',
        message: 'You unlocked "Quiz Master" for scoring 100% on 5 quizzes.',
        time: '2 hours ago',
        read: false,
        icon: Trophy,
        color: 'text-yellow-600 bg-yellow-100',
    },
    {
        id: '2',
        type: 'discussion',
        title: 'New Reply to your Discussion',
        message: 'David K. replied to "Help with Calculus Limits problem".',
        time: '5 hours ago',
        read: true,
        icon: MessageSquare,
        color: 'text-blue-600 bg-blue-100',
    },
    {
        id: '3',
        type: 'course',
        title: 'New Lesson Available',
        message: 'A new lesson "Integration by Parts" has been added to Calculus I.',
        time: '1 day ago',
        read: true,
        icon: BookOpen,
        color: 'text-[#446D6D] bg-[#446D6D]/10',
    },
    {
        id: '4',
        type: 'system',
        title: 'Welcome to Z-Learn!',
        message: 'Thanks for joining. Complete your profile to get started.',
        time: '2 days ago',
        read: true,
        icon: CheckCircle,
        color: 'text-green-600 bg-green-100',
    },
];

export default function NotificationsPage() {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500">Stay updated with your learning progress and community.</p>
                </div>
                <Button variant="outline" size="sm">Mark all as read</Button>
            </div>

            <div className="space-y-4">
                {NOTIFICATIONS.map((notification) => {
                    const Icon = notification.icon;
                    return (
                        <div
                            key={notification.id}
                            className={`flex gap-4 rounded-xl border p-4 transition-all hover:bg-gray-50 ${notification.read ? 'border-gray-100 bg-white' : 'border-[#446D6D]/20 bg-[#446D6D]/5'}`}
                        >
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.color}`}>
                                <Icon className="h-5 w-5" />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <h3 className={`font-medium ${notification.read ? 'text-gray-900' : 'text-[#446D6D]'}`}>
                                        {notification.title}
                                    </h3>
                                    <span className="text-xs text-gray-500">{notification.time}</span>
                                </div>
                                <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                            </div>

                            {!notification.read && (
                                <div className="mt-2 h-2 w-2 rounded-full bg-[#446D6D]"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
