'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Settings,
    Trophy,
    Star,
    Flame,
    Library,
    CheckCircle,
    ChevronRight,
    Download,
    Wifi,
    BarChart2,
    User,
    Lock,
    Bell,
    HelpCircle,
    LogOut,
    RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/useAuth';
import { useGamification } from '@/lib/hooks/useGamification';
import { useProgress } from '@/lib/hooks/useProgress';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const { xpData, levelData, streakData, loadXP, loadLevel, loadStreak, isLoading: gamificationLoading } = useGamification();
    const { userProgress, loadUserProgress, isLoading: progressLoading } = useProgress();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const loadData = useCallback(async () => {
        await Promise.all([
            loadXP(),
            loadLevel(),
            loadStreak(),
            loadUserProgress()
        ]);
    }, [loadXP, loadLevel, loadStreak, loadUserProgress]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const handleLogout = async () => {
        if (confirm('Are you sure you want to log out?')) {
            await logout();
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="text-gray-500"
                >
                    <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
                    Refresh
                </Button>
            </div>

            {/* Profile Header Card */}
            <Card className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-teal-50">
                        <AvatarImage src={user?.profile_picture} />
                        <AvatarFallback className="bg-[#446D6D] text-white text-2xl">
                            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                            {user?.name || 'Student'}
                        </h2>
                        <p className="text-gray-500 mb-4">{user?.email}</p>
                        {user?.onboarding_complete && (
                            <div className="flex items-center justify-center md:justify-start gap-1.5 text-green-600 text-sm font-medium">
                                <CheckCircle className="h-4 w-4" />
                                Profile Verified
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="rounded-xl" asChild>
                            <Link href="/app/settings">
                                <Settings className="h-5 w-5 text-gray-600" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Gamification Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Level Card */}
                <div className="rounded-2xl bg-gradient-to-br from-[#446D6D] to-[#5A8A8A] p-6 text-white shadow-md">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                            <Trophy className="h-8 w-8" />
                        </div>
                        <span className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">Level</span>
                        <span className="text-3xl font-bold mb-4">{levelData?.current_level || 1}</span>

                        <div className="w-full space-y-2">
                            <Progress
                                value={levelData?.progress_percentage || 0}
                                className="h-2 bg-white/20"
                            // indicatorClassName="bg-white"
                            />
                            <p className="text-[10px] opacity-90">
                                {levelData?.current_xp || 0} / {levelData?.xp_for_next_level || 100} XP
                            </p>
                        </div>
                    </div>
                </div>

                {/* XP Card */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white shadow-md">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                            <Star className="h-8 w-8" />
                        </div>
                        <span className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">Total XP</span>
                        <span className="text-3xl font-bold mb-4">{(xpData?.total_xp || 0).toLocaleString()}</span>

                        <div className="flex w-full justify-around gap-4 mt-2">
                            <div className="text-center">
                                <p className="text-[10px] opacity-80 mb-0.5">This Week</p>
                                <p className="text-sm font-bold">{xpData?.xp_this_week || 0}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] opacity-80 mb-0.5">This Month</p>
                                <p className="text-sm font-bold">{xpData?.xp_this_month || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Streak Card */}
                <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 p-6 text-white shadow-md">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                            <Flame className="h-8 w-8" />
                        </div>
                        <span className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">Current Streak</span>
                        <span className="text-3xl font-bold mb-2">
                            {streakData?.current_streak || 0} {streakData?.current_streak === 1 ? 'Day' : 'Days'}
                        </span>

                        {streakData?.current_streak && streakData.current_streak > 0 ? (
                            <div className="mt-2 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold">
                                🔥 ON FIRE!
                            </div>
                        ) : (
                            <p className="text-[10px] opacity-80 mt-2">Start learning to build a streak!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            <Card className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Progress Overview</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Library className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Courses Enrolled</p>
                                <p className="text-2xl font-bold text-gray-900">{userProgress?.enrollments_count || 0}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Courses Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{userProgress?.completed_courses || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-700">Overall Progress</span>
                            <span className="text-2xl font-bold text-[#446D6D]">
                                {Math.round(userProgress?.total_progress_percentage || 0)}%
                            </span>
                        </div>
                        <Progress value={userProgress?.total_progress_percentage || 0} className="h-3" />
                    </div>
                </div>
            </Card>

            {/* Quick Actions Grid */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Achievements', icon: Trophy, color: 'from-amber-400 to-amber-600', href: '/app/achievements' },
                        { label: 'Analytics', icon: BarChart2, color: 'from-green-400 to-green-600', href: '/app/analytics' },
                        { label: 'Resources', icon: Download, color: 'from-blue-400 to-blue-600', href: '/app/resources' },
                        { label: 'Offline', icon: Wifi, color: 'from-purple-400 to-purple-600', href: '/app/offline' },
                    ].map((action) => {
                        const Icon = action.icon;
                        return (
                            <Link key={action.label} href={action.href}>
                                <div className={cn(
                                    "flex flex-col items-center justify-center rounded-2xl p-6 text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]",
                                    "bg-gradient-to-br",
                                    action.color
                                )}>
                                    <Icon className="h-8 w-8 mb-3" />
                                    <span className="text-sm font-bold">{action.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Account Settings List */}
            <Card className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h3>
                <div className="divide-y divide-gray-100">
                    {[
                        { label: 'Edit Profile', icon: User, href: '/app/settings/profile' },
                        { label: 'Change Password', icon: Lock, href: '/app/settings/password' },
                        { label: 'Notifications', icon: Bell, href: '/app/settings/notifications' },
                        { label: 'Help & Support', icon: HelpCircle, href: '/app/help' },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link key={item.label} href={item.href} className="flex items-center justify-between py-4 hover:px-2 transition-all rounded-lg hover:bg-gray-50 group">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-[#446D6D]">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium text-gray-900">{item.label}</span>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#446D6D]" />
                            </Link>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}
