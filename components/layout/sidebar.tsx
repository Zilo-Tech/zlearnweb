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
    Trophy
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/app/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Courses',
        href: '/app/courses',
        icon: BookOpen,
    },
    {
        title: 'Exams',
        href: '/app/exams',
        icon: GraduationCap,
    },
    {
        title: 'Community',
        href: '/app/community',
        icon: Users,
    },
    {
        title: 'Achievements',
        href: '/app/achievements',
        icon: Trophy,
    },
    {
        title: 'Profile',
        href: '/app/profile',
        icon: User,
    },
    {
        title: 'Settings',
        href: '/app/settings',
        icon: Settings,
    },
    {
        title: 'Help & Support',
        href: '/app/support',
        icon: HelpCircle,
    },
];

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-45 bg-black/50 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 transform border-r bg-white transition-transform duration-200 ease-in-out md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    className
                )}
            >
                <div className="flex h-full flex-col overflow-y-auto py-4">
                    <nav className="space-y-1 px-2">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => {
                                        if (window.innerWidth < 768) {
                                            onClose();
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-[#446D6D]/10 text-[#446D6D]"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", isActive ? "text-[#446D6D]" : "text-gray-500")} />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto px-4 py-4">
                        <div className="rounded-lg bg-[#446D6D]/5 p-4">
                            <h4 className="mb-2 text-sm font-semibold text-[#446D6D]">Upgrade to Pro</h4>
                            <p className="mb-3 text-xs text-gray-600">
                                Get access to all professional courses and features.
                            </p>
                            <Button size="sm" className="w-full">
                                Upgrade Now
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
