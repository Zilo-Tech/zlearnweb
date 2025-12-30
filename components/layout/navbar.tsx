'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/lib/hooks/useAuth';
import { Menu, Bell, Search, LogOut, User, Settings, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
    onMenuClick?: () => void;
    className?: string;
}

export function Navbar({ onMenuClick, className }: NavbarProps) {
    const pathname = usePathname();
    const { user, logout, isAuthenticated } = useAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const isAuthPage = pathname?.startsWith('/auth');

    if (isAuthPage) return null;

    return (
        <header className={cn("sticky top-0 z-40 w-full border-b bg-white", className)}>
            <div className="flex h-16 items-center px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>

                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#446D6D]">
                        <div className="h-8 w-8 rounded-lg bg-[#446D6D] flex items-center justify-center text-white">
                            Z
                        </div>
                        <span className="hidden md:inline-block">Z-Learn</span>
                    </Link>
                </div>

                <div className="ml-auto flex items-center gap-4">
                    {mounted && isAuthenticated ? (
                        <>
                            <Button variant="ghost" size="icon" className="text-gray-500">
                                <Search className="h-5 w-5" />
                                <span className="sr-only">Search</span>
                            </Button>

                            <Button variant="ghost" size="icon" className="text-gray-500 relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                                <span className="sr-only">Notifications</span>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <UserAvatar
                                            name={user?.name || 'User'}
                                            src={user?.profile_picture}
                                            size="sm"
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user?.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/app/profile">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/app/courses">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            <span>My Courses</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/app/settings">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link href="/auth/login">Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/auth/register">Sign up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
