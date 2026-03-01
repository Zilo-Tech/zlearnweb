'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Users, Calendar, MessageSquare, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { communityService } from '@/lib/services/community.service';

export default function StudyGroupDetailsPage({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = use(params);
    const [group, setGroup] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setError(null);
                const data = await communityService.getStudyGroupDetails(groupId);
                setGroup(data);
            } catch {
                setError('Could not load group.');
                setGroup(null);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [groupId]);

    const handleJoin = async () => {
        if (!group || joining) return;
        setJoining(true);
        try {
            await communityService.joinStudyGroup(group.id);
            setGroup((g: any) => (g ? { ...g, member_count: (g.member_count ?? 0) + 1, is_member: true } : null));
        } catch {
            // ignore
        } finally {
            setJoining(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-zinc-50 min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
            </div>
        );
    }

    if (error || !group) {
        return (
            <div className="bg-zinc-50 min-h-[60vh] flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">{error || 'Group not found.'}</p>
                    <Link href="/app/community/groups" className="text-primary-600 font-semibold hover:text-primary-700">
                        Back to Study Groups
                    </Link>
                </div>
            </div>
        );
    }

    const createdDate = group.created_at ? new Date(group.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '';

    return (
        <div className="bg-zinc-50 text-base antialiased min-h-[60vh]">
            <div className="container max-w-5xl mx-auto px-6 py-10 md:py-12 space-y-6">
                <Link
                    href="/app/community/groups"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Study Groups
                </Link>

                <div className="relative overflow-hidden rounded-2xl bg-primary-800 border-2 border-primary-700 text-primary-50 p-8">
                    <div className="relative z-10">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">{group.name}</h1>
                                <p className="mt-2 max-w-2xl text-primary-100">{group.description || 'Study group'}</p>
                                <div className="mt-4 flex items-center gap-4 text-sm text-primary-200">
                                    <span className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {group.member_count ?? 0} members
                                    </span>
                                    {createdDate && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Created {createdDate}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {!group.is_member && (
                                <Button
                                    className="shrink-0 bg-primary-500 hover:bg-primary-600 text-white font-semibold border-0"
                                    onClick={handleJoin}
                                    disabled={joining}
                                >
                                    {joining ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Join Group
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform" aria-hidden />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Tabs defaultValue="feed" className="w-full">
                            <TabsList className="rounded-lg border-2 border-primary-200 bg-white p-1">
                                <TabsTrigger value="feed" className="rounded-lg data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 font-semibold">Discussion Feed</TabsTrigger>
                                <TabsTrigger value="resources" className="rounded-lg data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 font-semibold">Resources</TabsTrigger>
                                <TabsTrigger value="members" className="rounded-lg data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 font-semibold">Members</TabsTrigger>
                            </TabsList>

                            <TabsContent value="feed" className="mt-6 space-y-4">
                                <div className="rounded-lg border-2 border-primary-200 bg-white p-6 text-center text-gray-600">
                                    <MessageSquare className="h-12 w-12 text-primary-300 mx-auto mb-3" />
                                    <p className="font-medium text-gray-900">Group discussions</p>
                                    <p className="text-sm mt-1">Activity and posts from this group will appear here.</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="resources">
                                <div className="rounded-lg border-2 border-primary-200 bg-white p-8 text-center text-gray-600">
                                    No resources shared yet.
                                </div>
                            </TabsContent>

                            <TabsContent value="members">
                                <div className="rounded-lg border-2 border-primary-200 bg-white p-8 text-center text-gray-600">
                                    Member list is available to group members. Join the group to see who’s here.
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-lg border-2 border-primary-200 bg-white p-4">
                            <h3 className="mb-4 font-bold text-primary-900">About</h3>
                            <p className="text-sm text-gray-600">{group.description || 'No description.'}</p>
                            {group.creator_name && (
                                <p className="text-xs text-gray-500 mt-3">Created by {group.creator_name}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
