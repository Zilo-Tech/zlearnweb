'use client';

import Link from 'next/link';
import { ChevronLeft, MessageSquare, ThumbsUp, Share2, MoreHorizontal, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data
const DISCUSSION = {
    id: '1',
    title: 'Help with Calculus Limits problem',
    content: 'I am struggling to understand the concept of limits at infinity. specifically when dealing with rational functions where the degree of the numerator is greater than the denominator. Can someone explain the intuition behind it?',
    author: { name: 'Sarah M.', avatar: '/avatars/sarah.jpg', fallback: 'SM', role: 'Student' },
    createdAt: '2 hours ago',
    category: 'Mathematics',
    likes: 15,
    replies: [
        {
            id: 'r1',
            author: { name: 'David K.', avatar: '/avatars/david.jpg', fallback: 'DK', role: 'Tutor' },
            content: 'Think of it as a race between the top and bottom. If the top has a higher power (like x^3 vs x^2), it grows much faster than the bottom. So as x gets huge, the top wins and the whole fraction goes to infinity.',
            createdAt: '1 hour ago',
            likes: 8,
            isAccepted: true,
        },
        {
            id: 'r2',
            author: { name: 'Mike L.', avatar: '/avatars/mike.jpg', fallback: 'ML', role: 'Student' },
            content: 'Also check out the L\'Hopital\'s rule, it might help in some cases!',
            createdAt: '45 mins ago',
            likes: 3,
            isAccepted: false,
        },
    ],
};

export default function DiscussionDetailsPage({ params }: { params: { discussionId: string } }) {
    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <Link
                href="/app/community"
                className="flex items-center text-sm text-gray-500 hover:text-gray-900"
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Community
            </Link>

            {/* Main Post */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback>{DISCUSSION.author.fallback}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-medium text-gray-900">{DISCUSSION.author.name}</h3>
                            <p className="text-xs text-gray-500">{DISCUSSION.author.role} • {DISCUSSION.createdAt}</p>
                        </div>
                    </div>
                    <Badge variant="secondary">{DISCUSSION.category}</Badge>
                </div>

                <h1 className="mb-4 text-2xl font-bold text-gray-900">{DISCUSSION.title}</h1>
                <div className="prose max-w-none text-gray-700">
                    <p>{DISCUSSION.content}</p>
                </div>

                <div className="mt-6 flex items-center gap-4 border-t border-gray-100 pt-4">
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#446D6D]">
                        <ThumbsUp className="mr-2 h-4 w-4" /> {DISCUSSION.likes} Likes
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                        <MessageSquare className="mr-2 h-4 w-4" /> {DISCUSSION.replies.length} Replies
                    </Button>
                    <Button variant="ghost" size="sm" className="ml-auto text-gray-500">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                </div>
            </div>

            {/* Replies */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Replies</h3>

                {DISCUSSION.replies.map((reply) => (
                    <div key={reply.id} className={`rounded-xl border bg-white p-6 ${reply.isAccepted ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-200'}`}>
                        <div className="mb-4 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{reply.author.fallback}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-gray-900">{reply.author.name}</h4>
                                        {reply.author.role === 'Tutor' && (
                                            <Badge variant="outline" className="border-[#446D6D] text-[#446D6D] text-[10px] h-5 px-1.5">Tutor</Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">{reply.createdAt}</p>
                                </div>
                            </div>
                            {reply.isAccepted && (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                                    Accepted Answer
                                </Badge>
                            )}
                        </div>

                        <div className="text-gray-700">
                            <p>{reply.content}</p>
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-[#446D6D] h-8 px-2">
                                <ThumbsUp className="mr-1.5 h-3.5 w-3.5" /> {reply.likes}
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="ml-auto h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Report</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reply Input */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 font-semibold text-gray-900">Post a Reply</h3>
                <Textarea placeholder="Type your answer here..." className="min-h-[120px] mb-4" />
                <div className="flex justify-end">
                    <Button>Post Reply</Button>
                </div>
            </div>
        </div>
    );
}
