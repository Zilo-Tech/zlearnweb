'use client';

import { Trophy } from 'lucide-react';
import Link from 'next/link';

export default function AchievementsPage() {
    return (
        <div className="space-y-6 pb-8 text-base antialiased">
            <div>
                <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-1">Gamification</p>
                <h1 className="text-3xl font-black text-primary-900 tracking-tight">Achievements</h1>
                <p className="text-gray-600 mt-2 max-w-xl">
                    Your badges and milestones. This page is being brought in line with the mobile app.
                </p>
            </div>
            <div className="rounded-2xl border-2 border-primary-200 bg-white p-8 md:p-12 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 mb-4">
                    <Trophy className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Coming soon</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                    Achievements and leaderboard are available on the Z-Learn mobile app. We&apos;re adding them here next.
                </p>
                <Link href="/app/dashboard" className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:underline">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
