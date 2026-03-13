'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Bell, Globe, Moon, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import { authService } from '@/lib/services';

const VALID_TABS = ['profile', 'account', 'notifications', 'preferences'] as const;

function SettingsContent() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const defaultTab = (VALID_TABS.includes(tabParam as (typeof VALID_TABS)[number]) ? tabParam : 'profile') || 'profile';

    const { user } = useAuth();
    const { toast } = useToast();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        if (!currentPassword.trim()) {
            setPasswordError('Enter your current password.');
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New password and confirmation do not match.');
            return;
        }
        setPasswordLoading(true);
        try {
            await authService.changePassword(currentPassword, newPassword);
            toast({ title: 'Password updated', description: 'Your password has been changed successfully.', variant: 'success' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: unknown) {
            const message = (err as Error)?.message || 'Failed to update password. Please try again.';
            setPasswordError(message);
            toast({ title: 'Update failed', description: message, variant: 'destructive' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const labelClass = 'block text-sm font-medium text-gray-600 mb-1.5';
    const sectionTitleClass = 'text-lg font-bold text-gray-900 tracking-tight';
    const tabTriggerClass =
        'w-full h-12 min-h-12 flex items-center justify-start gap-3 px-4 rounded-xl text-gray-500 font-medium whitespace-nowrap transition-all duration-200 data-[state=active]:bg-[#446D6D] data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:shadow-sm hover:bg-gray-100 hover:text-gray-800 data-[state=active]:hover:bg-[#3A5F5F]';

    return (
        <div className="min-h-[60vh] text-base antialiased bg-gradient-to-b from-slate-50/80 via-white to-amber-50/30">
            <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                {/* Back link */}
                <Link
                    href="/app/profile"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#446D6D] hover:text-[#3A5F5F] mb-8 rounded-lg px-3 py-1.5 -ml-1 hover:bg-[#446D6D]/10 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Profile
                </Link>

                {/* Page header */}
                <div className="mb-10">
                    <p className="text-xs font-semibold text-[#446D6D] uppercase tracking-wider mb-2">
                        Account
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-600 leading-relaxed max-w-xl">
                        Manage your profile, security, notifications, and preferences.
                    </p>
                </div>

                <Tabs defaultValue={defaultTab} key={defaultTab} className="flex flex-col gap-6 lg:flex-row lg:items-start">
                    <TabsList className="w-full lg:w-56 lg:shrink-0 lg:self-start lg:sticky lg:top-24 h-auto min-h-0 flex flex-col gap-1.5 p-2 rounded-2xl bg-white/90 backdrop-blur border border-gray-200/80 shadow-lg shadow-gray-200/50">
                        <TabsTrigger value="profile" className={tabTriggerClass}>
                            <User className="h-4 w-4 shrink-0 data-[state=active]:text-white text-[#446D6D]" />
                            <span>Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="account" className={tabTriggerClass}>
                            <Lock className="h-4 w-4 shrink-0 data-[state=active]:text-white text-[#446D6D]" />
                            <span>Account & Security</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className={tabTriggerClass}>
                            <Bell className="h-4 w-4 shrink-0 data-[state=active]:text-white text-[#446D6D]" />
                            <span>Notifications</span>
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className={tabTriggerClass}>
                            <Globe className="h-4 w-4 shrink-0 data-[state=active]:text-white text-[#446D6D]" />
                            <span>Preferences</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 min-w-0 min-h-[420px]">
                        {/* Profile */}
                        <TabsContent value="profile" className="mt-0 data-[state=inactive]:hidden">
                            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8 shadow-lg shadow-gray-200/40">
                                <h2 className={sectionTitleClass}>Profile</h2>
                                <p className="text-gray-600 mb-6">Update your name and bio.</p>

                                <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                                    <Avatar className="h-20 w-20 border-2 border-[#446D6D]/20 shadow-md">
                                        <AvatarImage src={user?.profile_picture} />
                                        <AvatarFallback className="bg-[#446D6D]/15 text-[#446D6D] text-xl font-bold">
                                            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center">
                                        <Button type="button" variant="outline" className="border border-gray-200 rounded-lg hover:bg-[#446D6D]/10 hover:border-[#446D6D]/40 text-gray-700">
                                            Change Avatar
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className={labelClass}>First Name</Label>
                                        <Input
                                            id="firstName"
                                            defaultValue={user?.name?.split(' ')[0] ?? ''}
                                            placeholder="First name"
                                            className="border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#446D6D]/20 focus:border-[#446D6D] transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className={labelClass}>Last Name</Label>
                                        <Input
                                            id="lastName"
                                            defaultValue={user?.name?.split(' ').slice(1).join(' ') ?? ''}
                                            placeholder="Last name"
                                            className="border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#446D6D]/20 focus:border-[#446D6D] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <Label htmlFor="bio" className={labelClass}>Bio</Label>
                                    <Input
                                        id="bio"
                                        placeholder="A short bio about you"
                                        className="border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#446D6D]/20 focus:border-[#446D6D] transition-colors"
                                    />
                                </div>

                                <div className="mt-4 space-y-2">
                                    <Label htmlFor="location" className={labelClass}>Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="City, Country"
                                        className="border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#446D6D]/20 focus:border-[#446D6D] transition-colors"
                                    />
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <Button className="bg-[#446D6D] hover:bg-[#3A5F5F] text-white font-semibold rounded-lg shadow-sm">
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Account & Security */}
                        <TabsContent value="account" className="mt-0 data-[state=inactive]:hidden">
                            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8 shadow-lg shadow-gray-200/40">
                                <h2 className={sectionTitleClass}>Account & Security</h2>
                                <p className="text-gray-600 mb-6">Email and password.</p>

                                <div>
                                    <Label htmlFor="account-email" className={labelClass}>Email Address</Label>
                                    <Input
                                        id="account-email"
                                        value={user?.email ?? ''}
                                        disabled
                                        className="bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                                    />
                                </div>

                                <form onSubmit={handleChangePassword} className="mt-8 pt-8 border-t border-gray-200">
                                    <h3 className={sectionTitleClass}>Change Password</h3>
                                    <p className="text-gray-600 mb-4">Set a new password for your account.</p>
                                    {passwordError && (
                                        <p className="text-sm font-semibold text-red-600 mb-3">{passwordError}</p>
                                    )}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword" className={labelClass}>Current Password</Label>
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="••••••••"
                                                disabled={passwordLoading}
                                                autoComplete="current-password"
                                                className="border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#446D6D]/20 focus:border-[#446D6D] transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword" className={labelClass}>New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="••••••••"
                                                disabled={passwordLoading}
                                                autoComplete="new-password"
                                                minLength={8}
                                                className="border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#446D6D]/20 focus:border-[#446D6D] transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword" className={labelClass}>Confirm New Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                disabled={passwordLoading}
                                                autoComplete="new-password"
                                                className="border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#446D6D]/20 focus:border-[#446D6D] transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <Button type="submit" disabled={passwordLoading} className="bg-[#446D6D] hover:bg-[#3A5F5F] text-white font-semibold rounded-lg">
                                            {passwordLoading ? 'Updating…' : 'Update Password'}
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-8 pt-8 border-t border-gray-200 rounded-xl bg-red-50/50 border border-red-200/60 p-4">
                                    <h3 className="text-lg font-bold text-red-700 tracking-tight mb-2">Danger Zone</h3>
                                    <p className="text-sm text-gray-600 mb-3">Permanently delete your account and data.</p>
                                    <Button variant="destructive" size="sm" className="rounded-lg">Delete Account</Button>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Notifications */}
                        <TabsContent value="notifications" className="mt-0 data-[state=inactive]:hidden">
                            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8 shadow-lg shadow-gray-200/40">
                                <h2 className={sectionTitleClass}>Notifications</h2>
                                <p className="text-gray-600 mb-6">Choose how you want to be notified.</p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 hover:bg-gray-50 transition-colors">
                                        <div>
                                            <Label className="text-base font-semibold text-gray-900">Email Notifications</Label>
                                            <p className="text-sm text-gray-600 mt-0.5">Receive emails about your account activity.</p>
                                        </div>
                                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                    </div>
                                    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 hover:bg-gray-50 transition-colors">
                                        <div>
                                            <Label className="text-base font-semibold text-gray-900">Push Notifications</Label>
                                            <p className="text-sm text-gray-600 mt-0.5">Receive push notifications on your device.</p>
                                        </div>
                                        <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Preferences */}
                        <TabsContent value="preferences" className="mt-0 data-[state=inactive]:hidden">
                            <div className="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8 shadow-lg shadow-gray-200/40">
                                <h2 className={sectionTitleClass}>Preferences</h2>
                                <p className="text-gray-600 mb-6">Language and appearance.</p>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className={labelClass}>Language</Label>
                                        <Select defaultValue="en">
                                            <SelectTrigger className="h-11 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#446D6D]/20 focus:border-[#446D6D]">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="fr">Français</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Moon className="h-5 w-5 text-[#446D6D]" />
                                            <div>
                                                <Label className="text-base font-semibold text-gray-900">Dark Mode</Label>
                                                <p className="text-sm text-gray-600 mt-0.5">Switch between light and dark themes.</p>
                                            </div>
                                        </div>
                                        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-200 flex justify-end">
                                    <Button variant="outline" className="border border-gray-200 rounded-lg hover:bg-[#446D6D]/10 hover:border-[#446D6D]/40 font-medium" asChild>
                                        <Link href="/app/profile">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Back to Profile
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-slate-50/80 to-amber-50/30">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#446D6D] border-t-transparent" />
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
