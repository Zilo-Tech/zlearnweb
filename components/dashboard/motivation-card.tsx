'use client';

import { Quote } from 'lucide-react';

export function MotivationCard() {
    return (
        <div className="rounded-2xl bg-white p-8 border-2 border-primary-200 text-center">
            <div className="flex justify-center mb-4">
                <Quote className="h-8 w-8 text-primary-300" />
            </div>
            <p className="text-lg font-medium text-gray-800 italic mb-4 leading-relaxed">
                &ldquo;Small consistent steps lead to big results. Show up today and your future self will thank you.&rdquo;
            </p>
            <div className="h-1 w-12 bg-primary-200 mx-auto rounded-full" />
        </div>
    );
}
