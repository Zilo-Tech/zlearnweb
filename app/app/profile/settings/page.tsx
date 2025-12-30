'use client';

import { useState } from 'react';
import { User, Lock, Bell, Globe, Moon, LogOut } from 'lucide-react';
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

export default function SettingsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="flex flex-col gap-6 lg:flex-row">
                <TabsList className="flex h-auto flex-col items-stretch gap-1 bg-transparent p-0 lg:w-64">
                    <TabsTrigger
                        value="profile"
                        className="justify-start gap-3 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        <User className="h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger
                        value="account"
                        className="justify-start gap-3 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        <Lock className="h-4 w-4" /> Account & Security
                    </TabsTrigger>
                    <TabsTrigger
                        value="notifications"
                        className="justify-start gap-3 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        <Bell className="h-4 w-4" /> Notifications
                    </TabsTrigger>
                    <TabsTrigger
                        value="preferences"
                        className="justify-start gap-3 px-4 py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        <Globe className="h-4 w-4" /> Preferences
                    </TabsTrigger>
                </TabsList>

                <div className="flex-1">
                    {/* Profile Settings */}
                    <TabsContent value="profile" className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-0">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20">
                                <AvatarFallback className="text-xl">NF</AvatarFallback>
                            </Avatar>
                            <Button variant="outline">Change Avatar</Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" defaultValue="Neba" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" defaultValue="F." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Input id="bio" defaultValue="Computer Science student passionate about AI." />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" defaultValue="Yaoundé, Cameroon" />
                        </div>

                        <div className="flex justify-end">
                            <Button>Save Changes</Button>
                        </div>
                    </TabsContent>

                    {/* Account Settings */}
                    <TabsContent value="account" className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-0">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900">Email Address</h3>
                            <div className="flex gap-4">
                                <Input defaultValue="neba@example.com" disabled className="bg-gray-50" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className="font-semibold text-gray-900">Change Password</h3>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input id="confirmPassword" type="password" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button>Update Password</Button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
                            <Button variant="destructive" size="sm">Delete Account</Button>
                        </div>
                    </TabsContent>

                    {/* Notification Settings */}
                    <TabsContent value="notifications" className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-0">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Email Notifications</Label>
                                    <p className="text-sm text-gray-500">Receive emails about your account activity.</p>
                                </div>
                                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Push Notifications</Label>
                                    <p className="text-sm text-gray-500">Receive push notifications on your device.</p>
                                </div>
                                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Preferences Settings */}
                    <TabsContent value="preferences" className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-0">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Language</Label>
                                <Select defaultValue="en">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="fr">Français</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Dark Mode</Label>
                                    <p className="text-sm text-gray-500">Switch between light and dark themes.</p>
                                </div>
                                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end">
                            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <LogOut className="mr-2 h-4 w-4" /> Sign Out
                            </Button>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
