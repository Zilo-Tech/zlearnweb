'use client';

import { Lightbulb, X } from 'lucide-react';
import { useState } from 'react';

export function DailyTipCard() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-primary-800 border-2 border-primary-700 p-6 text-primary-50">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-white/20 p-2">
                            <Lightbulb className="h-5 w-5" />
                        </div>
                        <span className="font-bold uppercase tracking-widest text-xs text-primary-200">Daily Study Tip</span>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="rounded-full p-1 hover:bg-white/10 transition-colors"
                        aria-label="Dismiss tip"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <h3 className="text-lg font-black text-white tracking-tight mb-2">Active Recall Technique</h3>
                <p className="text-sm text-primary-100 leading-relaxed">
                    Instead of re-reading your notes, try to summarize them from memory. This strengthens neural pathways and improves long-term retention.
                </p>
            </div>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-primary-950/50 blur-2xl" />
        </div>
    );
}
