"use client";

import React, { useMemo, useState, useEffect } from "react";

/** Launch date: 20 days from the first mount (fixed for the session). */
function getLaunchTimestamp(): number {
  const d = new Date();
  d.setDate(d.getDate() + 20);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function computeTimeLeft(launchTs: number): TimeLeft {
  const now = Date.now();
  const diff = launchTs - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, isPast: false };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function LaunchCountdown() {
  const launchTs = useMemo(getLaunchTimestamp, []);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    computeTimeLeft(launchTs)
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const tick = () => setTimeLeft(computeTimeLeft(launchTs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [launchTs, mounted]);

  if (!mounted) {
    return (
      <div className="flex gap-3 md:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center rounded-2xl bg-gray-100 border-2 border-gray-200 px-4 py-3 min-w-[4.5rem] md:min-w-[5rem] animate-pulse">
            <span className="text-3xl md:text-4xl font-black text-gray-300 leading-tight">00</span>
            <span className="text-xs font-semibold text-gray-400 mt-1">...</span>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-white shadow-lg">
        <span className="text-base font-bold">
          We&apos;re Live!
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
        Launching in
      </span>
      <div className="flex gap-3 md:gap-4">
        <div className="flex flex-col items-center rounded-2xl bg-white border-2 border-gray-200 shadow-md px-4 py-3 min-w-[4.5rem] md:min-w-[5rem] hover:border-primary-300 transition-colors">
          <span className="text-3xl md:text-4xl font-black tabular-nums text-gray-900 leading-tight">
            {pad(timeLeft.days)}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">
            Days
          </span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white border-2 border-gray-200 shadow-md px-4 py-3 min-w-[4.5rem] md:min-w-[5rem] hover:border-primary-300 transition-colors">
          <span className="text-3xl md:text-4xl font-black tabular-nums text-gray-900 leading-tight">
            {pad(timeLeft.hours)}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">
            Hours
          </span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white border-2 border-gray-200 shadow-md px-4 py-3 min-w-[4.5rem] md:min-w-[5rem] hover:border-primary-300 transition-colors">
          <span className="text-3xl md:text-4xl font-black tabular-nums text-gray-900 leading-tight">
            {pad(timeLeft.minutes)}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">
            Minutes
          </span>
        </div>
        <div className="flex flex-col items-center rounded-2xl bg-white border-2 border-gray-200 shadow-md px-4 py-3 min-w-[4.5rem] md:min-w-[5rem] hover:border-primary-300 transition-colors">
          <span className="text-3xl md:text-4xl font-black tabular-nums text-gray-900 leading-tight">
            {pad(timeLeft.seconds)}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">
            Seconds
          </span>
        </div>
      </div>
    </div>
  );
}

