"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/lib/store/hooks';
import { useAuth } from '@/lib/hooks/useAuth';
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Users,
    User,
    Settings,
    HelpCircle,
    Trophy,
    Award,
    Bell,
    Search,
    BarChart2,
    LogOut,
    ChevronRight,
    Mail,
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

const sidebarItemsDefault = [
    { title: 'Dashboard', description: 'Dashboard and overview', href: '/app/dashboard', icon: LayoutDashboard },
    { title: 'Courses', description: 'Browse and continue courses', href: '/app/courses', icon: BookOpen },
    { title: 'Certificates', description: 'Your earned certificates', href: '/app/certificates', icon: Award },
    { title: 'Exams', description: 'Practice and mock exams', href: '/app/exams', icon: GraduationCap },
    { title: 'Community', description: 'Connect with learners', href: '/app/community', icon: Users },
    { title: 'Notifications', description: 'Alerts and updates', href: '/app/notifications', icon: Bell },
    { title: 'Search', description: 'Find courses and content', href: '/app/search', icon: Search },
    { title: 'Achievements', description: 'Badges and milestones', href: '/app/achievements', icon: Trophy },
    { title: 'Analytics', description: 'Your learning stats', href: '/app/analytics', icon: BarChart2 },
    { title: 'Profile', description: 'View and edit profile', href: '/app/profile', icon: User },
    { title: 'Settings', description: 'App preferences', href: '/app/profile/settings', icon: Settings },
    { title: 'Help & Support', description: 'FAQs and contact us', href: '/app/support', icon: HelpCircle },
];

/** For exam users: Exams before Courses */
function getSidebarItems(isExamUser: boolean) {
    if (!isExamUser) return sidebarItemsDefault;
    const items = [...sidebarItemsDefault];
    const coursesIdx = items.findIndex((i) => i.href === '/app/courses');
    const examsIdx = items.findIndex((i) => i.href === '/app/exams');
    if (examsIdx > -1 && coursesIdx > -1 && examsIdx > coursesIdx) {
        const [examsItem] = items.splice(examsIdx, 1);
        items.splice(coursesIdx, 0, examsItem);
    }
    return items;
}

/** Get user display name with priority chain */
function getUserDisplayName(user: { display_name?: string; first_name?: string; last_name?: string; name?: string; username?: string; email?: string } | null): string {
    if (!user) return 'User';
    if (user.display_name) return user.display_name;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    if (user.name) return user.name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    return 'User';
}

/** Get avatar initials (up to 2 letters) */
function getAvatarInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const userType = (useAppSelector((s) => s.auth.user?.user_type) ?? '').toString().toLowerCase().trim();
    const isExamUser = userType === 'exams';
    const sidebarItems = getSidebarItems(isExamUser);

    const displayName = getUserDisplayName(user);
    const [mounted, setMounted] = useState(false);
    const [initials, setInitials] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            setInitials(getAvatarInitials(displayName));
        }
    }, [displayName, mounted]);
    const email = user?.email ?? '';
    const avatar = (user as { profile_picture?: string } | null)?.profile_picture ?? '';

    const handleNav = (href: string) => {
        onClose();
        router.push(href);
    };

    const handleLogout = async () => {
        onClose();
        await logout();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40"
                    onClick={onClose}
                    aria-hidden
                />
            )}

            {/* Sidebar panel */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-40 h-full w-72 transform bg-white shadow-2xl transition-transform duration-200 ease-in-out overflow-hidden',
                    'md:top-16 md:h-[calc(100vh-4rem)]',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                    className
                )}
            >
                <div className="flex h-full flex-col">
                    {/* ─── Green Header ─────────────────────────────── */}
                    <div className="bg-[#446D6D] px-6 pt-10 pb-5 md:pt-6">
                        {/* Avatar + name/email */}
                        <div className="flex items-center gap-4 mb-4">
                            {avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={avatar}
                                    alt={displayName}
                                    className="h-14 w-14 rounded-full object-cover border-2 border-white/40"
                                />
                            ) : (
                                <div className="h-14 w-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0">
                                    <span className="text-white text-lg font-bold">{initials}</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-lg font-bold leading-tight truncate">{displayName}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Mail className="h-3.5 w-3.5 text-white/80 shrink-0" />
                                    <p className="text-white/80 text-sm truncate">{email || 'No email'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex border-t border-white/20 pt-4">
                            <button
                                onClick={() => handleNav('/app/profile')}
                                className="flex flex-1 flex-col items-center gap-1 py-1 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <User className="h-5 w-5 text-white" />
                                <span className="text-white/90 text-[11px] font-medium">Profile</span>
                            </button>
                            <button
                                onClick={() => handleNav('/app/notifications')}
                                className="flex flex-1 flex-col items-center gap-1 py-1 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <Bell className="h-5 w-5 text-white" />
                                <span className="text-white/90 text-[11px] font-medium">Notifications</span>
                            </button>
                            <button
                                onClick={() => handleNav('/app/profile/settings')}
                                className="flex flex-1 flex-col items-center gap-1 py-1 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <Settings className="h-5 w-5 text-white" />
                                <span className="text-white/90 text-[11px] font-medium">Settings</span>
                            </button>
                        </div>
                    </div>

                    {/* ─── Menu Items ────────────────────────────────── */}
                    <nav className="flex-1 overflow-y-auto py-3 bg-white" aria-label="App navigation">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.href}
                                    onClick={() => handleNav(item.href)}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                                        isActive
                                            ? 'bg-[#446D6D]/10'
                                            : 'hover:bg-gray-50'
                                    )}
                                >
                                    {/* Icon pill */}
                                    <div className={cn(
                                        'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
                                        isActive ? 'bg-[#446D6D]' : 'bg-[#F1F5F9]'
                                    )}>
                                        <Icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-[#446D6D]')} />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className={cn('text-sm font-semibold truncate', isActive ? 'text-[#446D6D]' : 'text-gray-900')}>
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">{item.description}</p>
                                    </div>

                                    {/* Chevron */}
                                    <ChevronRight className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#446D6D]' : 'text-gray-300')} />
                                </button>
                            );
                        })}
                    </nav>

                    {/* ─── Footer: Sign Out + version ───────────────── */}
                    <div className="border-t-2 border-gray-100 bg-white">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-5 w-5 text-red-600 shrink-0" />
                            <span className="text-red-600 text-sm font-semibold">Sign Out</span>
                        </button>
                        <div className="px-6 pb-4 pt-1">
                            <p className="text-center text-xs text-gray-400">Z-Learn v1.0.0</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
