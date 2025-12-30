'use client';

import { Quote } from 'lucide-react';

export function MotivationCard() {
    return (
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-4">
                <Quote className="h-8 w-8 text-[#446D6D] opacity-20" />
            </div>
            <p className="text-lg font-medium text-gray-800 italic mb-4">
                "Small consistent steps lead to big results. Show up today and your future self will thank you."
            </p>
            <div className="h-1 w-12 bg-[#446D6D]/20 mx-auto rounded-full" />
        </div>
    );
}
