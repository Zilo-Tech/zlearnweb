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

    const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';
    const sectionTitleClass = 'text-lg font-black text-gray-900 tracking-tight';

    return (
        <div className="bg-zinc-50 text-base antialiased min-h-[60vh]">
            <div className="container max-w-4xl mx-auto px-6 py-10 md:py-12">
                {/* Back link */}
                <Link
                    href="/app/profile"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Profile
                </Link>

                {/* Page header — matches contact / home section pattern */}
                <div className="mb-10">
                    <p className="text-sm text-primary-600 uppercase tracking-widest font-bold mb-2">
                        Account
                    </p>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">
                        Settings
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Manage your profile, security, notifications, and preferences.
                    </p>
                </div>

                <Tabs defaultValue={defaultTab} key={defaultTab} className="flex flex-col gap-6 lg:flex-row">
                    {/* Tab list: single column, all triggers same size */}
                    <TabsList className="w-full lg:w-52 shrink-0 h-auto min-h-0 flex flex-col gap-1 p-2 rounded-lg border-2 border-primary-200 bg-white">
                        <TabsTrigger
                            value="profile"
                            className="w-full h-12 min-h-12 flex items-center justify-start gap-3 px-4 rounded-lg text-gray-600 font-medium whitespace-nowrap data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 data-[state=active]:font-semibold hover:bg-primary-50/50 hover:text-primary-800 transition-colors"
                        >
                            <User className="h-4 w-4 shrink-0 text-primary-600" />
                            <span>Profile</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="account"
                            className="w-full h-12 min-h-12 flex items-center justify-start gap-3 px-4 rounded-lg text-gray-600 font-medium whitespace-nowrap data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 data-[state=active]:font-semibold hover:bg-primary-50/50 hover:text-primary-800 transition-colors"
                        >
                            <Lock className="h-4 w-4 shrink-0 text-primary-600" />
                            <span>Account & Security</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="notifications"
                            className="w-full h-12 min-h-12 flex items-center justify-start gap-3 px-4 rounded-lg text-gray-600 font-medium whitespace-nowrap data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 data-[state=active]:font-semibold hover:bg-primary-50/50 hover:text-primary-800 transition-colors"
                        >
                            <Bell className="h-4 w-4 shrink-0 text-primary-600" />
                            <span>Notifications</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="preferences"
                            className="w-full h-12 min-h-12 flex items-center justify-start gap-3 px-4 rounded-lg text-gray-600 font-medium whitespace-nowrap data-[state=active]:bg-primary-50 data-[state=active]:text-primary-900 data-[state=active]:font-semibold hover:bg-primary-50/50 hover:text-primary-800 transition-colors"
                        >
                            <Globe className="h-4 w-4 shrink-0 text-primary-600" />
                            <span>Preferences</span>
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 min-w-0 min-h-[420px]">
                        {/* Profile */}
                        <TabsContent value="profile" className="mt-0 data-[state=inactive]:hidden">
                            <div className="rounded-lg border-2 border-primary-200 bg-white p-6 md:p-8 shadow-sm">
                                <h2 className={sectionTitleClass}>Profile</h2>
                                <p className="text-gray-600 mb-6">Update your name and bio.</p>

                                <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                                    <Avatar className="h-20 w-20 border-2 border-primary-200">
                                        <AvatarImage src={user?.profile_picture} />
                                        <AvatarFallback className="bg-primary-100 text-primary-800 text-xl font-bold">
                                            {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex items-center">
                                        <Button type="button" variant="outline" className="border-2 border-primary-200 hover:bg-primary-50">
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
                                            className="border-2 border-primary-200 focus:ring-primary-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className={labelClass}>Last Name</Label>
                                        <Input
                                            id="lastName"
                                            defaultValue={user?.name?.split(' ').slice(1).join(' ') ?? ''}
                                            placeholder="Last name"
                                            className="border-2 border-primary-200 focus:ring-primary-500/20"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <Label htmlFor="bio" className={labelClass}>Bio</Label>
                                    <Input
                                        id="bio"
                                        placeholder="A short bio about you"
                                        className="border-2 border-primary-200 focus:ring-primary-500/20"
                                    />
                                </div>

                                <div className="mt-4 space-y-2">
                                    <Label htmlFor="location" className={labelClass}>Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="City, Country"
                                        className="border-2 border-primary-200 focus:ring-primary-500/20"
                                    />
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <Button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold">
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Account & Security */}
                        <TabsContent value="account" className="mt-0 data-[state=inactive]:hidden">
                            <div className="rounded-lg border-2 border-primary-200 bg-white p-6 md:p-8 shadow-sm">
                                <h2 className={sectionTitleClass}>Account & Security</h2>
                                <p className="text-gray-600 mb-6">Email and password.</p>

                                <div>
                                    <Label htmlFor="account-email" className={labelClass}>Email Address</Label>
                                    <Input
                                        id="account-email"
                                        value={user?.email ?? ''}
                                        disabled
                                        className="bg-primary-50 border-2 border-primary-200"
                                    />
                                </div>

                                <form onSubmit={handleChangePassword} className="mt-8 pt-8 border-t-2 border-primary-200">
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
                                                className="border-2 border-primary-200 focus:ring-primary-500/20"
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
                                                className="border-2 border-primary-200 focus:ring-primary-500/20"
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
                                                className="border-2 border-primary-200 focus:ring-primary-500/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <Button type="submit" disabled={passwordLoading} className="bg-primary-500 hover:bg-primary-600 text-white font-semibold">
                                            {passwordLoading ? 'Updating…' : 'Update Password'}
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-8 pt-8 border-t-2 border-primary-200">
                                    <h3 className="text-lg font-bold text-red-600 tracking-tight mb-2">Danger Zone</h3>
                                    <p className="text-sm text-gray-600 mb-3">Permanently delete your account and data.</p>
                                    <Button variant="destructive" size="sm">Delete Account</Button>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Notifications */}
                        <TabsContent value="notifications" className="mt-0 data-[state=inactive]:hidden">
                            <div className="rounded-lg border-2 border-primary-200 bg-white p-6 md:p-8 shadow-sm">
                                <h2 className={sectionTitleClass}>Notifications</h2>
                                <p className="text-gray-600 mb-6">Choose how you want to be notified.</p>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between gap-4 rounded-lg border-2 border-primary-200 bg-primary-50/30 p-4">
                                        <div>
                                            <Label className="text-base font-semibold text-gray-900">Email Notifications</Label>
                                            <p className="text-sm text-gray-600 mt-0.5">Receive emails about your account activity.</p>
                                        </div>
                                        <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                                    </div>
                                    <div className="flex items-center justify-between gap-4 rounded-lg border-2 border-primary-200 bg-primary-50/30 p-4">
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
                            <div className="rounded-lg border-2 border-primary-200 bg-white p-6 md:p-8 shadow-sm">
                                <h2 className={sectionTitleClass}>Preferences</h2>
                                <p className="text-gray-600 mb-6">Language and appearance.</p>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className={labelClass}>Language</Label>
                                        <Select defaultValue="en">
                                            <SelectTrigger className="h-11 border-2 border-primary-200 rounded-lg focus:ring-primary-500/20">
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="fr">Français</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 rounded-lg border-2 border-primary-200 bg-primary-50/30 p-4">
                                        <div className="flex items-center gap-2">
                                            <Moon className="h-5 w-5 text-primary-600" />
                                            <div>
                                                <Label className="text-base font-semibold text-gray-900">Dark Mode</Label>
                                                <p className="text-sm text-gray-600 mt-0.5">Switch between light and dark themes.</p>
                                            </div>
                                        </div>
                                        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t-2 border-primary-200 flex justify-end">
                                    <Button variant="outline" className="border-2 border-primary-200 hover:bg-primary-50 font-semibold" asChild>
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
            <div className="bg-zinc-50 min-h-[60vh] flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
