'use client';

import { Lightbulb, X } from 'lucide-react';
import { useState } from 'react';

export function DailyTipCard() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 p-6 text-white shadow-lg">
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                            <Lightbulb className="h-5 w-5 text-yellow-200" />
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-orange-100 uppercase tracking-wide">
                                💡 Daily Study Tip
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="rounded-lg p-1.5 hover:bg-white/20 transition-colors"
                        aria-label="Dismiss tip"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                    Active Recall Technique
                </h3>
                <p className="text-sm text-white/90 leading-relaxed">
                    Instead of re-reading your notes, try to summarize them from memory. This strengthens neural pathways and improves long-term retention.
                </p>
            </div>
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
        </div>
    );
}
