'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, FileText, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/lib/store/hooks';

const navItemsDefault = [
    { label: 'Home', href: '/app/dashboard', icon: Home },
    { label: 'Courses', href: '/app/courses', icon: Library },
    { label: 'Exams', href: '/app/exams', icon: FileText },
    { label: 'Community', href: '/app/community', icon: Users },
    { label: 'Profile', href: '/app/profile', icon: User },
];

/** For exam users: Exams before Courses */
function getNavItems(isExamUser: boolean) {
    if (!isExamUser) return navItemsDefault;
    return [
        navItemsDefault[0],
        navItemsDefault[2], // Exams
        navItemsDefault[1], // Courses
        navItemsDefault[3],
        navItemsDefault[4],
    ];
}

export function BottomNav() {
    const pathname = usePathname();
    const userType = (useAppSelector((s) => s.auth.user?.user_type) ?? '').toString().toLowerCase().trim();
    const isExamUser = userType === 'exams';
    const navItems = getNavItems(isExamUser);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 block border-t-2 border-primary-200 bg-white md:hidden" aria-label="App navigation">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/app/dashboard' && pathname?.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 transition-colors',
                                isActive ? 'text-primary-700' : 'text-gray-500 hover:text-primary-700'
                            )}
                        >
                            <Icon className={cn('h-6 w-6', isActive && 'fill-current')} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
            <div className="h-[env(safe-area-inset-bottom)] bg-white" aria-hidden />
        </nav>
    );
}
