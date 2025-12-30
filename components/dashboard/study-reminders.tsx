'use client';

import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function StudyRemindersCard() {
    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-orange-50 p-2 text-orange-600">
                        <Bell className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Study Reminders</h3>
                </div>
                <Link href="/app/profile/settings">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#446D6D]">
                        <Settings className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                        <p className="text-sm font-medium text-gray-900">Daily Review</p>
                        <p className="text-xs text-gray-500">Every day at 9:00 AM</p>
                    </div>
                    <div className="h-5 w-10 rounded-full bg-[#446D6D] relative">
                        <div className="absolute right-1 top-1 h-3 w-3 rounded-full bg-white" />
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                        <p className="text-sm font-medium text-gray-900">Exam Prep</p>
                        <p className="text-xs text-gray-500">Mon, Wed, Fri at 4:00 PM</p>
                    </div>
                    <div className="h-5 w-10 rounded-full bg-gray-200 relative">
                        <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-white" />
                    </div>
                </div>
            </div>

            <Button variant="outline" className="w-full mt-6 text-[#446D6D] border-[#446D6D]/20 hover:bg-[#446D6D]/5">
                Manage All Reminders
            </Button>
        </div>
    );
}
