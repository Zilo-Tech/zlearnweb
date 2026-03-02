'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Users,
    User,
    Settings,
    HelpCircle,
    Trophy,
    Award
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

const sidebarItems = [
    { title: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { title: 'Courses', href: '/app/courses', icon: BookOpen },
    { title: 'Certificates', href: '/app/certificates', icon: Award },
    { title: 'Exams', href: '/app/exams', icon: GraduationCap },
    { title: 'Community', href: '/app/community', icon: Users },
    { title: 'Achievements', href: '/app/achievements', icon: Trophy },
    { title: 'Profile', href: '/app/profile', icon: User },
    { title: 'Settings', href: '/app/profile/settings', icon: Settings },
    { title: 'Help & Support', href: '/app/support', icon: HelpCircle },
];

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-primary-950/40 md:hidden"
                    onClick={onClose}
                    aria-hidden
                />
            )}

            {/* Sidebar: starts below header (top-16), same z-40 as header so overlay is below both */}
            <aside
                className={cn(
                    'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform bg-white transition-transform duration-200 ease-in-out',
                    'border-r-2 border-primary-200',
                    'md:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    className
                )}
            >
                <div className="flex h-full flex-col overflow-y-auto py-4 px-3">
                    <nav className="space-y-1" aria-label="App navigation">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => {
                                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                                            onClose();
                                        }
                                    }}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                        isActive
                                            ? 'bg-primary-100 text-primary-900'
                                            : 'text-gray-700 hover:bg-primary-50 hover:text-primary-900'
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            'h-5 w-5 shrink-0',
                                            isActive ? 'text-primary-700' : 'text-gray-500'
                                        )}
                                    />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto px-3 py-4">
                        <div className="rounded-lg border-2 border-primary-200 bg-primary-50/80 p-4">
                            <h4 className="mb-2 text-sm font-bold text-primary-900 uppercase tracking-wider">
                                Upgrade to Pro
                            </h4>
                            <p className="mb-3 text-xs text-gray-600 leading-relaxed">
                                Get access to all professional courses and features.
                            </p>
                            <Button size="sm" className="w-full font-semibold" variant="default">
                                Upgrade Now
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
