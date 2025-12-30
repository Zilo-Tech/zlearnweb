'use client';

import Link from 'next/link';
import { ChevronLeft, Users, Calendar, MessageSquare, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const GROUP = {
    id: '1',
    name: 'Advanced Math Enthusiasts',
    description: 'A dedicated group for students who love challenging math problems, preparing for competitions, or just want to explore advanced topics beyond the curriculum.',
    members: 128,
    created: 'Jan 2023',
    admins: [
        { name: 'Prof. X', avatar: '/avatars/prof.jpg', fallback: 'PX' },
    ],
    upcomingEvents: [
        { id: 'e1', title: 'Weekly Problem Solving Session', date: 'Fri, 4:00 PM', attendees: 12 },
        { id: 'e2', title: 'Calculus Review', date: 'Mon, 2:00 PM', attendees: 25 },
    ],
    recentPosts: [
        { id: 'p1', author: 'Alice', content: 'Has anyone solved the challenge problem from yesterday?', time: '2h ago', replies: 5 },
        { id: 'p2', author: 'Bob', content: 'Sharing some useful resources for Linear Algebra.', time: '5h ago', replies: 2 },
    ],
};

export default function StudyGroupDetailsPage({ params }: { params: { groupId: string } }) {
    return (
        <div className="space-y-6">
            <Link
                href="/app/community"
                className="flex items-center text-sm text-gray-500 hover:text-gray-900"
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Community
            </Link>

            {/* Header */}
            <div className="relative overflow-hidden rounded-xl bg-[#446D6D] text-white p-8">
                <div className="relative z-10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">{GROUP.name}</h1>
                            <p className="mt-2 max-w-2xl text-white/90">{GROUP.description}</p>
                            <div className="mt-4 flex items-center gap-4 text-sm text-white/80">
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {GROUP.members} members
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Created {GROUP.created}
                                </div>
                            </div>
                        </div>
                        <Button variant="secondary" className="shrink-0">
                            Join Group
                        </Button>
                    </div>
                </div>
                {/* Background Pattern */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform"></div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="feed" className="w-full">
                        <TabsList>
                            <TabsTrigger value="feed">Discussion Feed</TabsTrigger>
                            <TabsTrigger value="resources">Resources</TabsTrigger>
                            <TabsTrigger value="members">Members</TabsTrigger>
                        </TabsList>

                        <TabsContent value="feed" className="mt-6 space-y-4">
                            {/* Post Input */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4">
                                <div className="flex gap-3">
                                    <Avatar>
                                        <AvatarFallback>ME</AvatarFallback>
                                    </Avatar>
                                    <input
                                        type="text"
                                        placeholder="Write something to the group..."
                                        className="flex-1 bg-gray-50 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#446D6D]/20"
                                    />
                                </div>
                            </div>

                            {/* Posts */}
                            {GROUP.recentPosts.map((post) => (
                                <div key={post.id} className="rounded-xl border border-gray-200 bg-white p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{post.author[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-gray-900">{post.author}</span>
                                            <span className="text-xs text-gray-500">• {post.time}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">{post.content}</p>
                                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                        <button className="hover:text-[#446D6D]">Like</button>
                                        <button className="hover:text-[#446D6D]">Reply ({post.replies})</button>
                                    </div>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="resources">
                            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                                No resources shared yet.
                            </div>
                        </TabsContent>

                        <TabsContent value="members">
                            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                                Member list hidden for non-members.
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <h3 className="mb-4 font-semibold text-gray-900">Admins</h3>
                        <div className="flex items-center gap-3">
                            {GROUP.admins.map((admin, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{admin.fallback}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-gray-700">{admin.name}</span>
                                    <Shield className="h-3 w-3 text-[#446D6D]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <h3 className="mb-4 font-semibold text-gray-900">Upcoming Events</h3>
                        <div className="space-y-4">
                            {GROUP.upcomingEvents.map((event) => (
                                <div key={event.id} className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#446D6D]/10 text-[#446D6D]">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                        <p className="text-xs text-gray-500">{event.date} • {event.attendees} going</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
