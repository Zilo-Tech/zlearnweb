'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import NavItems from './NavItems';
import ActionButton from './ActionButton';
import LanguageActions from './LanguageActions';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useAuth } from '@/lib/hooks/useAuth';
import { UserAvatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, BookOpen, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  /** When provided, show sidebar toggle (e.g. on app/dashboard layout) */
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  // Treat user as source of truth so we show menu as soon as rehydration has user (even if isAuthenticated lags)
  const showUserMenu = Boolean(user || isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between pr-4 md:px-2 xl:px-8 py-4 bg-primary-950 h-16">
        <div className="left-section flex items-center gap-4 lg:gap-10">
          {/* Single mobile menu trigger (left): opens sidebar when on app layout, or mobile menu on public */}
          <button
            type="button"
            className="min-[1400px]:hidden text-white p-2 -ml-2"
            onClick={onMenuClick ?? (() => setIsMobileMenuOpen((o) => !o))}
            aria-label={onMenuClick ? 'Open sidebar' : isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <Icon icon={!onMenuClick && isMobileMenuOpen ? 'ion:close' : 'hugeicons:menu-11'} width="24" height="24" />
          </button>
          <Logo />
          {mounted && !showUserMenu && (
            <div className="hidden min-[1300px]:block text-gray-800">
              <NavItems />
            </div>
          )}
        </div>
        <div className="right-section flex items-center gap-2 sm:gap-4 pl-2 sm:pl-4">
          {/* Search removed per request */}
          {mounted && showUserMenu ? (
            <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 hover:bg-primary-800">
                      <UserAvatar
                        name={user?.name || user?.email || 'User'}
                        src={user?.profile_picture}
                        size="sm"
                        className="ring-2 ring-primary-200"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/app/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
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
                      <Link href="/app/profile/settings">
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
          ) : mounted ? (
            <div className="hidden min-[1400px]:block">
              <ActionButton />
            </div>
          ) : null}
          <div className="pl-1 sm:pl-2 py-1">
            <LanguageActions />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="min-[1400px]:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="container mx-auto px-8 py-6">
            {mounted && showUserMenu ? (
              <div className="space-y-2">
                <div className="pb-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <Link href="/app/dashboard" className="block py-3 px-4 hover:bg-primary-50 rounded-lg text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                <Link href="/app/profile" className="block py-3 px-4 hover:bg-primary-50 rounded-lg text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Profile</Link>
                <Link href="/app/courses" className="block py-3 px-4 hover:bg-primary-50 rounded-lg text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>My Courses</Link>
                <Link href="/app/profile/settings" className="block py-3 px-4 hover:bg-primary-50 rounded-lg text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>Settings</Link>
                <button type="button" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 hover:bg-red-50 rounded-lg text-sm font-medium text-red-600">
                  Log out
                </button>
              </div>
            ) : (
              <NavItems isMobile={true} onClose={() => setIsMobileMenuOpen(false)} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
