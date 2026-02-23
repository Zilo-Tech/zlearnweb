'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    HelpCircle,
    Search,
    X,
    Mail,
    Bug,
    ChevronDown,
    ChevronRight,
    MessageCircle,
    BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { APP_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

const FAQ_DATA: FAQItem[] = [
    {
        id: '1',
        question: 'How do I enroll in a course?',
        answer:
            'Browse courses from the Courses tab, select a course you\'re interested in, and tap "Enroll". Once enrolled, you can start learning immediately.',
        category: 'Courses',
    },
    {
        id: '2',
        question: 'How does the learning streak work?',
        answer:
            'Your learning streak tracks consecutive days of study. Complete at least one lesson or activity each day to maintain your streak. Longer streaks earn you bonus XP!',
        category: 'Gamification',
    },
    {
        id: '3',
        question: 'Can I download courses for offline learning?',
        answer:
            'Yes! Go to the course details page and tap the download icon. You can access downloaded content in the Offline Learning section of your profile.',
        category: 'Offline',
    },
    {
        id: '4',
        question: 'How do I unlock achievements?',
        answer:
            'Achievements are unlocked by completing activities like finishing courses, maintaining streaks, completing quizzes, and more. Check your Achievements tab to see your progress.',
        category: 'Gamification',
    },
    {
        id: '5',
        question: 'How do I change my password?',
        answer:
            'Go to Profile > Settings > Account & Security, then use "Change Password". You\'ll receive an email with instructions to reset your password.',
        category: 'Account',
    },
    {
        id: '6',
        question: 'What is XP and how do I earn it?',
        answer:
            'XP (Experience Points) are earned by completing lessons, quizzes, courses, and maintaining study streaks. Accumulate XP to level up and unlock new features!',
        category: 'Gamification',
    },
    {
        id: '7',
        question: 'How do I join a study group?',
        answer:
            'Go to the Community tab, select Study Groups, browse available groups, and tap "Join Group" on any group you\'re interested in.',
        category: 'Community',
    },
    {
        id: '8',
        question: 'Can I switch between academic and professional modes?',
        answer:
            'Yes! You can switch between academic and professional learning from your Dashboard. Use the mode switcher to change your focus.',
        category: 'Account',
    },
];

const CATEGORIES = ['All', 'Courses', 'Account', 'Gamification', 'Community', 'Offline'];

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filtered = FAQ_DATA.filter((faq) => {
        const matchSearch =
            !searchQuery.trim() ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat =
            selectedCategory === 'All' || faq.category === selectedCategory;
        return matchSearch && matchCat;
    });

    return (
        <div className="space-y-6 pb-8">
            <div>
                <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-1">
                    Help
                </p>
                <h1 className="text-3xl font-black text-primary-900 tracking-tight">
                    Help & Support
                </h1>
                <p className="text-gray-600 mt-2 max-w-xl">
                    FAQs, guides, and how to get in touch. Search below or reach out to our team.
                </p>
            </div>

            {/* Hero card */}
            <div className="rounded-2xl border-2 border-primary-200 bg-primary-600 p-6 md:p-8 text-white shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <HelpCircle className="h-8 w-8 shrink-0" />
                    <h2 className="text-xl font-bold">How can we help?</h2>
                </div>
                <p className="text-primary-100 text-sm md:text-base max-w-xl">
                    Search our knowledge base or reach out to our support team.
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search for help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl border-2 border-primary-200 bg-white"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-500"
                        aria-label="Clear search"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/contact" className="block">
                    <div className="rounded-xl border-2 border-primary-200 bg-white p-5 hover:border-primary-300 hover:bg-primary-50/50 transition h-full">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary-100 p-2.5 text-primary-600">
                                <MessageCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Contact Support</h3>
                                <p className="text-sm text-gray-600">
                                    Send a message or email us
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
                <a
                    href={`mailto:${APP_CONFIG.supportEmail}?subject=Bug Report`}
                    className="block"
                >
                    <div className="rounded-xl border-2 border-primary-200 bg-white p-5 hover:border-primary-300 hover:bg-primary-50/50 transition h-full">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-amber-100 p-2.5 text-amber-700">
                                <Bug className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Report a Bug</h3>
                                <p className="text-sm text-gray-600">
                                    Help us improve by reporting issues
                                </p>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                            'rounded-full px-4 py-2 text-sm font-medium transition',
                            selectedCategory === cat
                                ? 'bg-primary-600 text-white'
                                : 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* FAQ */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary-600" />
                    Frequently Asked Questions
                </h2>
                <div className="space-y-2">
                    {filtered.length === 0 ? (
                        <div className="rounded-xl border-2 border-primary-200 bg-white p-8 text-center text-gray-500">
                            No questions match your search. Try a different term or{' '}
                            <Link href="/contact" className="text-primary-600 font-medium hover:underline">
                                contact us
                            </Link>
                            .
                        </div>
                    ) : (
                        filtered.map((faq) => {
                            const isOpen = expandedId === faq.id;
                            return (
                                <div
                                    key={faq.id}
                                    className="rounded-xl border-2 border-primary-200 bg-white overflow-hidden"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setExpandedId(isOpen ? null : faq.id)}
                                        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-primary-50/50 transition"
                                    >
                                        <span className="font-medium text-gray-900">
                                            {faq.question}
                                        </span>
                                        <span className="shrink-0 text-primary-600">
                                            {isOpen ? (
                                                <ChevronDown className="h-5 w-5" />
                                            ) : (
                                                <ChevronRight className="h-5 w-5" />
                                            )}
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="border-t border-primary-100 px-4 py-3 bg-gray-50/50">
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {faq.answer}
                                            </p>
                                            <span className="inline-block mt-2 text-xs text-primary-600 font-medium">
                                                {faq.category}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="rounded-xl border-2 border-primary-200 bg-white p-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-gray-600">
                    Still need help? Email us at{' '}
                    <a
                        href={`mailto:${APP_CONFIG.supportEmail}`}
                        className="font-semibold text-primary-600 hover:underline"
                    >
                        {APP_CONFIG.supportEmail}
                    </a>
                </p>
                <Button asChild variant="outline" size="sm" className="border-primary-300">
                    <Link href="/contact">Go to Contact page</Link>
                </Button>
            </div>
        </div>
    );
}
