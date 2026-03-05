'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Users,
    User,
    Settings,
    HelpCircle,
    Trophy,
    Bell,
    Search,
    BarChart2,
    LogOut,
    ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

const sidebarItems = [
    { title: 'Home', description: 'Dashboard and overview', href: '/app/dashboard', icon: LayoutDashboard },
    { title: 'Courses', description: 'Browse all courses', href: '/app/courses', icon: BookOpen },
    { title: 'Exams', description: 'Practice tests & exams', href: '/app/exams', icon: GraduationCap },
    { title: 'Community', description: 'Forums, discussions & groups', href: '/app/community', icon: Users },
    { title: 'Notifications', description: 'View all notifications', href: '/app/notifications', icon: Bell },
    { title: 'Search', description: 'Search forums, discussions & users', href: '/app/community/search', icon: Search },
    { title: 'Profile', description: 'View your profile', href: '/app/profile', icon: User },
    { title: 'Analytics', description: 'Learning progress & insights', href: '/app/analytics', icon: BarChart2 },
    { title: 'Achievements', description: 'View your achievements', href: '/app/achievements', icon: Trophy },
    { title: 'Settings', description: 'App settings & preferences', href: '/app/profile/settings', icon: Settings },
    { title: 'Help & Support', description: 'Help & support', href: '/app/support', icon: HelpCircle },
];

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const rawName = user?.display_name
        || (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}`.trim() : null)
        || user?.first_name
        || user?.name
        || user?.full_name
        || user?.username
        || 'User';
    const userName = rawName as string;
    const userEmail = user?.email || '';
    // Initials for avatar fallback
    const initials = userName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const handleClose = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) onClose();
    };

    const handleLogout = async () => {
        onClose();
        await logout();
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 md:hidden"
                    onClick={onClose}
                    aria-hidden
                />
            )}

            <aside
                className={cn(
                    'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 transform bg-white transition-transform duration-200 ease-in-out flex flex-col',
                    'border-r border-gray-200 shadow-xl',
                    'md:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    className
                )}
            >
                {/* ── User Header (matches mobile SidebarHeader) ── */}
                <div className="bg-[#446D6D] px-6 pt-6 pb-5 shrink-0">
                    {/* Avatar + name + email */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 ring-2 ring-white/30">
                            <span className="text-white font-bold text-base">{initials}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-white font-bold text-lg leading-tight truncate">{userName}</p>
                            <p className="text-white/80 text-sm mt-0.5 truncate">{userEmail}</p>
                        </div>
                    </div>

                    {/* Quick-action buttons: Profile · Notifications · Settings */}
                    <div className="flex border-t border-white/20 pt-3">
                        {[
                            { label: 'Profile', icon: User, href: '/app/profile' },
                            { label: 'Notifications', icon: Bell, href: '/app/notifications' },
                            { label: 'Settings', icon: Settings, href: '/app/profile/settings' },
                        ].map(({ label, icon: Icon, href }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={handleClose}
                                className="flex-1 flex flex-col items-center gap-1 py-2 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <Icon className="h-5 w-5 text-white" />
                                <span className="text-white/90 text-xs font-medium">{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Menu Items (matches mobile MenuItem) ── */}
                <nav className="flex-1 overflow-y-auto py-2" aria-label="App navigation">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={handleClose}
                                className={cn(
                                    'flex items-center gap-4 px-6 py-3.5 border-b border-slate-100 last:border-b-0 transition-colors',
                                    isActive ? 'bg-[#446D6D]/8' : 'hover:bg-slate-50'
                                )}
                            >
                                {/* Icon pill */}
                                <div className={cn(
                                    'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
                                    isActive ? 'bg-[#446D6D]/15' : 'bg-slate-100'
                                )}>
                                    <Icon className={cn('h-5 w-5', isActive ? 'text-[#446D6D]' : 'text-slate-500')} />
                                </div>
                                {/* Label + description */}
                                <div className="flex-1 min-w-0">
                                    <p className={cn('text-sm font-semibold leading-tight', isActive ? 'text-[#446D6D]' : 'text-slate-800')}>
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5 truncate">{item.description}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                            </Link>
                        );
                    })}
                </nav>

                {/* ── Sign Out + Footer ── */}
                <div className="shrink-0 border-t-2 border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-50 transition-colors text-left"
                    >
                        <LogOut className="h-5 w-5 text-red-600" />
                        <span className="text-base font-semibold text-red-600">Sign Out</span>
                    </button>
                    <p className="text-center text-xs text-slate-400 pb-4 pt-1">Z-Learn v1.0.0</p>
                </div>
            </aside>
        </>
    );
}
