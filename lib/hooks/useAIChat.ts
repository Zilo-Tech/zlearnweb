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
    setConversations([]);
  }, []);
  const createConversation = useCallback(async (_text?: string) => {
    setCurrentConversation({ id: '', messages: [] });
    setMessages([]);
  }, []);
  const sendMessage = useCallback(async (_text?: string) => {}, []);
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
