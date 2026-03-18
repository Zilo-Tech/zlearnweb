"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Logo() {
  const { isAuthenticated, user } = useAuth();
  // Wait for client hydration so we don't mismatch SSR hrefs
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const href = mounted && isAuthenticated ? '/app/dashboard' : '/';

  return (
    <Link
      href={href}
      className="text-[22px] md:text-[25px] font-semibold text-white flex items-center px-4 md:px-0 hover:opacity-90 transition-opacity"
      aria-label="Z-Learn home"
    >
      <span className="md:-ml-4"><span className="">Z</span>-Learn</span>
    </Link>
  );
}
