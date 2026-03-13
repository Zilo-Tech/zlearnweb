'use client';

import { Quote } from 'lucide-react';

export function MotivationCard() {
    return (
        <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 border border-gray-200 text-center shadow-sm">
            <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary-100 p-3">
                    <Quote className="h-6 w-6 text-primary-600" />
                </div>
            </div>
            <p className="text-base font-medium text-gray-700 italic mb-4 leading-relaxed">
                &ldquo;Small consistent steps lead to big results. Show up today and your future self will thank you.&rdquo;
            </p>
            <div className="h-1 w-12 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full" />
        </div>
    );
}
