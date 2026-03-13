'use client';

import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function StudyRemindersCard() {
    return (
        <div className="rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary-100 p-2.5 text-primary-600">
                        <Bell className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-gray-900">Study Reminders</h3>
                </div>
                <Link href="/app/profile/settings">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-primary-600">
                        <Settings className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-primary-50 border border-primary-100">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Daily Review</p>
                        <p className="text-xs text-gray-600 mt-0.5">Every day at 9:00 AM</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-primary-500 relative shadow-sm">
                        <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform" />
                    </div>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Exam Prep</p>
                        <p className="text-xs text-gray-600 mt-0.5">Mon, Wed, Fri at 4:00 PM</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-gray-300 relative">
                        <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform" />
                    </div>
                </div>
            </div>

            <Button variant="outline" className="w-full mt-5 font-semibold">
                Manage Reminders
            </Button>
        </div>
    );
}
