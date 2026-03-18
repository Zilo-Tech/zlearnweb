'use client';

import { useState, useCallback } from 'react';

export interface AIChatMessage {
  id: string;
  message_type?: 'user' | 'assistant';
  content?: string;
  [key: string]: unknown;
}

export interface AIChatConversation {
  id: string;
  messages?: AIChatMessage[];
  [key: string]: unknown;
}

export function useAIChat(_options?: { onError?: (e: unknown) => void }) {
  const [conversations, setConversations] = useState<AIChatConversation[]>([]);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [currentConversation, setCurrentConversation] = useState<AIChatConversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | Error | null>(null);

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/lesson-assistant');
      if (!res.ok) throw new Error('Failed to load conversations');
      const data = await res.json();
      setConversations(data?.conversations ?? []);
    } catch (e) {
      setError(e as Error);
      _options?.onError?.(e);
    } finally {
      setIsLoading(false);
    }
  }, [_options]);

  // createConversation accepts optional lessonContext to seed the assistant
  const createConversation = useCallback(async (text?: string, lessonContext?: any) => {
    setIsSending(true);
    try {
      const genId = () => {
        try {
          // modern browsers
          // @ts-ignore
          return typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        } catch {
          return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        }
      };
      const userMsg: AIChatMessage = { id: `user-${genId()}`, message_type: 'user', content: text };
      setMessages([userMsg]);
      setCurrentConversation({ id: `conv-${genId()}`, messages: [userMsg] });

      const res = await fetch('/api/ai/lesson-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text ?? '', lessonContext }),
      });
      if (!res.ok) throw new Error('AI service error');
      const data = await res.json();
      const assistantMsg: AIChatMessage = data?.message ?? { id: `assistant-${genId()}`, message_type: 'assistant', content: 'Sorry, I could not generate a reply.' };

      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        if (assistantMsg?.id && ids.has(assistantMsg.id)) return prev;
        return [...prev, assistantMsg];
      });
      setCurrentConversation((c) => {
        const existing = c ?? { id: `conv-${genId()}`, messages: [userMsg] };
        const ids = new Set((existing.messages ?? []).map((m: any) => m.id));
        const merged = [...(existing.messages ?? [])];
        if (assistantMsg?.id && !ids.has(assistantMsg.id)) merged.push(assistantMsg);
        return { ...existing, messages: merged };
      });
      return assistantMsg;
    } catch (e) {
      setError(e as Error);
      _options?.onError?.(e);
      throw e;
    } finally {
      setIsSending(false);
    }
  }, [_options]);

  const sendMessage = useCallback(async (text?: string, lessonContext?: any) => {
    if (!currentConversation) return createConversation(text, lessonContext);
    setIsSending(true);
    try {
      const genId = () => {
        try {
          // @ts-ignore
          return typeof crypto !== 'undefined' && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        } catch {
          return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        }
      };
      const userMsg: AIChatMessage = { id: `user-${genId()}`, message_type: 'user', content: text };

      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        if (userMsg.id && ids.has(userMsg.id)) return prev;
        return [...prev, userMsg];
      });
      setCurrentConversation((c) => {
        const conv = c ?? { id: `conv-${genId()}`, messages: [] };
        const ids = new Set((conv.messages ?? []).map((m: any) => m.id));
        const merged = [...(conv.messages ?? [])];
        if (userMsg.id && !ids.has(userMsg.id)) merged.push(userMsg);
        return { ...conv, messages: merged };
      });

      const res = await fetch('/api/ai/lesson-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text ?? '', lessonContext }),
      });
      if (!res.ok) throw new Error('AI service error');
      const data = await res.json();
      const assistantMsg: AIChatMessage = data?.message ?? { id: `assistant-${genId()}`, message_type: 'assistant', content: 'Sorry, I could not generate a reply.' };

      setMessages((prev) => {
        const ids = new Set(prev.map((m) => m.id));
        if (assistantMsg?.id && ids.has(assistantMsg.id)) return prev;
        return [...prev, assistantMsg];
      });
      setCurrentConversation((c) => {
        const conv = c ?? { id: `conv-${genId()}`, messages: [] };
        const ids = new Set((conv.messages ?? []).map((m: any) => m.id));
        const merged = [...(conv.messages ?? [])];
        if (userMsg.id && !ids.has(userMsg.id)) merged.push(userMsg);
        if (assistantMsg?.id && !ids.has(assistantMsg.id)) merged.push(assistantMsg);
        return { ...conv, messages: merged };
      });
      return assistantMsg;
    } catch (e) {
      setError(e as Error);
      _options?.onError?.(e);
      throw e;
    } finally {
      setIsSending(false);
    }
  }, [currentConversation, createConversation, _options]);

  const startNewChat = useCallback(() => {
    setCurrentConversation(null);
    setMessages([]);
  }, []);

  return {
    conversations,
    messages,
    currentConversation,
    isLoading,
    isSending,
    error,
    loadConversations,
    createConversation,
    sendMessage,
    startNewChat,
  };
}
