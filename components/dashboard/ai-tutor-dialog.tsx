'use client';

import { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAIChat } from '@/lib/hooks/useAIChat';
import { Bot, Send, MessageSquarePlus } from 'lucide-react';

interface AITutorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AITutorDialog({ open, onOpenChange }: AITutorDialogProps) {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const {
        currentConversation,
        isSending,
        error,
        createConversation,
        sendMessage,
        startNewChat,
        loadConversations,
    } = useAIChat({ onError: (e: unknown) => console.error('AI Chat:', e) });

    const messages = currentConversation?.messages ?? [];

    useEffect(() => {
        if (open) loadConversations();
    }, [open, loadConversations]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages.length]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isSending) return;
        setInput('');
        try {
            if (currentConversation) {
                await sendMessage(text);
            } else {
                await createConversation(text);
            }
        } catch {
            // onError already called
        }
    };

    const handleNewChat = () => {
        startNewChat();
        setInput('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[85vh] flex flex-col p-0 gap-0 border-2 border-primary-200">
                <DialogHeader className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="flex items-center gap-2 text-primary-900">
                            <Bot className="h-5 w-5 text-primary-600" />
                            AI Tutor
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleNewChat}
                            className="gap-1 text-primary-600"
                        >
                            <MessageSquarePlus className="h-4 w-4" />
                            New chat
                        </Button>
                    </div>
                </DialogHeader>

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto min-h-[240px] max-h-[360px] p-4 space-y-3"
                >
                    {messages.length === 0 && !isSending && (
                        <p className="text-sm text-gray-500 text-center py-6">
                            Hi! I&apos;m your AI study assistant. Ask me anything about your courses or subjects.
                        </p>
                    )}
                    {messages.map((msg: { id?: string; message_type?: string; content?: string }) => (
                        <div
                            key={msg.id ?? ''}
                            className={`flex ${msg.message_type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                                    msg.message_type === 'user'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isSending && (
                        <div className="flex justify-start">
                            <div className="rounded-2xl px-4 py-2 bg-gray-100 text-gray-500 text-sm">
                                Thinking...
                            </div>
                        </div>
                    )}
                    {error && (
                        <p className="text-sm text-red-600 text-center">{typeof error === 'string' ? error : (error as Error)?.message}</p>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Ask a question..."
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        disabled={isSending}
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={!input.trim() || isSending}
                        className="shrink-0 bg-primary-600 hover:bg-primary-700"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
