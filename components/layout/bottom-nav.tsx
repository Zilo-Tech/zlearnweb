'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, FileText, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    {
        label: 'Home',
        href: '/app/dashboard',
        icon: Home,
    },
    {
        label: 'Courses',
        href: '/app/courses',
        icon: Library,
    },
    {
        label: 'Exams',
        href: '/app/exams',
        icon: FileText,
    },
    {
        label: 'Community',
        href: '/app/community',
        icon: Users,
    },
    {
        label: 'Profile',
        href: '/app/profile',
        icon: User,
    },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 block border-t border-gray-200 bg-white md:hidden">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/app/dashboard' && pathname?.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 transition-colors",
                                isActive ? "text-[#446D6D]" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
            {/* Safe area padding for mobile browsers */}
            <div className="h-[env(safe-area-inset-bottom)] bg-white" />
        </nav>
    );
}
