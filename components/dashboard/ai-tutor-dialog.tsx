'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAIChat } from '@/lib/hooks/useAIChat';
import { Bot, Send, MessageSquarePlus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AITutorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // Optional context passed from the page (lesson, user info, etc.) to personalize replies
    initialContext?: any;
}

export function AITutorDialog({ open, onOpenChange, initialContext }: AITutorDialogProps) {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const isHandlingSendRef = useRef(false);
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
        if (!text || isSending || isHandlingSendRef.current) return;
        // guard against double-submit (rapid Enter + click or duplicate events)
        isHandlingSendRef.current = true;
        setInput('');
        try {
            if (currentConversation) {
                await sendMessage(text, initialContext);
            } else {
                await createConversation(text, initialContext);
            }
        } catch {
            // onError already called
        } finally {
            isHandlingSendRef.current = false;
        }
    };

    const handleNewChat = () => {
        startNewChat();
        setInput('');
    };

    return (
        <>
            {/* Overlay when open (tap to close on mobile) */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:bg-black/20"
                    onClick={() => onOpenChange(false)}
                    aria-hidden
                />
            )}

            {/* Right-side panel (now constrained height so it does not fill the entire screen) */}
            <aside
                className={cn(
                    'fixed right-4 top-8 bottom-8 z-50 w-full sm:w-[28rem] max-w-[calc(100vw-2rem)]',
                    'bg-white shadow-2xl border border-gray-200',
                    'flex flex-col transition-transform duration-300 ease-out',
                    'rounded-2xl overflow-hidden',
                    open ? 'translate-x-0' : 'translate-x-full'
                )}
            >
                {/* Header */}
                <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-4 bg-gradient-to-r from-[#446D6D] to-[#3A5F5F] text-white">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-bold text-lg truncate">AI Tutor</h2>
                            <p className="text-xs text-white/80 truncate">Your study assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleNewChat}
                            className="text-white/90 hover:bg-white/20 hover:text-white h-9 px-2"
                        >
                            <MessageSquarePlus className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                            className="text-white/90 hover:bg-white/20 hover:text-white h-9 w-9 shrink-0"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Messages */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4 bg-gray-50/50"
                >
                    {messages.length === 0 && !isSending && (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="h-14 w-14 rounded-2xl bg-[#446D6D]/10 flex items-center justify-center mb-4">
                                <Bot className="h-7 w-7 text-[#446D6D]" />
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Hi! I&apos;m your AI study assistant.</p>
                            <p className="text-sm text-gray-500">
                                Ask me anything about your courses or subjects.
                            </p>
                        </div>
                    )}
                    {messages.map((msg: { id?: string; message_type?: string; content?: string }) => (
                        <div
                            key={msg.id ?? ''}
                            className={cn(
                                'flex',
                                msg.message_type === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            <div
                                className={cn(
                                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
                                    msg.message_type === 'user'
                                        ? 'bg-[#446D6D] text-white rounded-br-md'
                                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                                )}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isSending && (
                        <div className="flex justify-start">
                            <div className="rounded-2xl rounded-bl-md px-4 py-2.5 bg-white border border-gray-200 text-gray-500 text-sm shadow-sm flex items-center gap-2">
                                <span className="inline-block h-2 w-2 rounded-full bg-[#446D6D]/60 animate-pulse" />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    )}
                    {error && (
                        <p className="text-sm text-red-600 text-center py-2">
                            {typeof error === 'string' ? error : (error as Error)?.message}
                        </p>
                    )}
                </div>

                {/* Input */}
                <div className="shrink-0 p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Ask a question..."
                            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#446D6D]/30 focus:border-[#446D6D] transition-colors"
                            disabled={isSending}
                        />
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={!input.trim() || isSending}
                            className="shrink-0 h-10 w-10 rounded-xl bg-[#446D6D] hover:bg-[#3A5F5F] text-white"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}
