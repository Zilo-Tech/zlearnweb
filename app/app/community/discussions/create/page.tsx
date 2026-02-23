'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';
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
import { communityService } from '@/lib/services/community.service';

function CreateDiscussionForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const forumFromUrl = searchParams.get('forum');

    const [forums, setForums] = useState<{ id: string; name: string }[]>([]);
    const [forumId, setForumId] = useState(forumFromUrl || '');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await communityService.getForums({});
                const list = res?.results ?? [];
                setForums(list.map((f: any) => ({ id: String(f.id), name: f.name || 'Forum' })));
                if (forumFromUrl && !forumId) setForumId(forumFromUrl);
            } catch {
                setForums([]);
            }
        };
        load();
    }, [forumFromUrl]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forumId || !title.trim() || !content.trim() || submitting) return;
        setError(null);
        setSubmitting(true);
        try {
            const created = await communityService.createDiscussion({
                forum: forumId,
                title: title.trim(),
                content: content.trim(),
            });
            router.push(`/app/community/discussions/${created.id}`);
        } catch (err: any) {
            setError(err?.message || 'Failed to create discussion. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-zinc-50 text-base antialiased min-h-[60vh]">
            <div className="container max-w-2xl mx-auto px-6 py-10 md:py-12 space-y-6">
                <Link
                    href="/app/community"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Community
                </Link>

                <div>
                    <p className="text-sm text-primary-600 uppercase tracking-widest font-bold mb-2">Discuss</p>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">Start a New Discussion</h1>
                    <p className="text-gray-600">Ask a question, share a resource, or start a conversation.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border-2 border-primary-200 bg-white p-6 md:p-8">
                    {error && (
                        <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg">{error}</p>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">Title</Label>
                        <Input
                            id="title"
                            placeholder="What's on your mind?"
                            required
                            className="border-2 border-primary-200 rounded-lg focus:ring-primary-500/20"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="forum" className="block text-sm font-semibold text-gray-700 mb-1.5">Forum</Label>
                        <Select required value={forumId} onValueChange={setForumId}>
                            <SelectTrigger id="forum" className="border-2 border-primary-200 rounded-lg h-11">
                                <SelectValue placeholder="Select a forum" />
                            </SelectTrigger>
                            <SelectContent>
                                {forums.map((f) => (
                                    <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1.5">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Describe your question or topic in detail..."
                            className="min-h-[200px] border-2 border-primary-200 rounded-lg focus:ring-primary-500/20"
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t-2 border-primary-200">
                        <Button type="button" variant="outline" onClick={() => router.back()} className="border-2 border-primary-200 hover:bg-primary-50">
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold" disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Post Discussion
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CreateDiscussionPage() {
    return (
        <Suspense fallback={
            <div className="bg-zinc-50 min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        }>
            <CreateDiscussionForm />
        </Suspense>
    );
}
