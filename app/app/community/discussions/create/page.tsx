'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function CreateDiscussionPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        router.push('/app/community');
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <Link
                href="/app/community"
                className="flex items-center text-sm text-gray-500 hover:text-gray-900"
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Community
            </Link>

            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Start a New Discussion</h1>
                <p className="text-gray-500">Ask a question, share a resource, or start a conversation.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="What's on your mind?" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="math">Mathematics</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="biology">Biology</SelectItem>
                            <SelectItem value="general">General Discussion</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                        id="content"
                        placeholder="Describe your question or topic in detail..."
                        className="min-h-[200px]"
                        required
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm">
                        <ImageIcon className="mr-2 h-4 w-4" /> Add Image
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                        <LinkIcon className="mr-2 h-4 w-4" /> Add Link
                    </Button>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit">Post Discussion</Button>
                </div>
            </form>
        </div>
    );
}
