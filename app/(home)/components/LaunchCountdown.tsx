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
    const tick = () => setTimeLeft(computeTimeLeft(launchTs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [launchTs]);

  if (!mounted) {
    // Return a skeleton or static placeholder to avoid hydration mismatch
    return (
      <div className="flex flex-wrap items-center gap-2 md:gap-4 invisible">
        <span className="text-xs md:text-sm text-primary-200 font-bold uppercase tracking-wider">
          Launching in
        </span>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg bg-primary-800/80 px-4 py-2 text-primary-100">
        <span className="text-sm font-bold uppercase tracking-wider">
          We&apos;re live!
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-4">
      <span className="text-xs md:text-sm text-primary-200 font-bold uppercase tracking-wider">
        Launching in
      </span>
      <div className="flex gap-2 md:gap-3">
        <div className="flex flex-col items-center rounded-lg bg-primary-800/90 px-3 py-2 min-w-[3rem] md:min-w-[4rem]">
          <span className="text-lg md:text-2xl font-black tabular-nums text-primary-100 leading-tight">
            {pad(timeLeft.days)}
          </span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-primary-300">
            Days
          </span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-primary-800/90 px-3 py-2 min-w-[3rem] md:min-w-[4rem]">
          <span className="text-lg md:text-2xl font-black tabular-nums text-primary-100 leading-tight">
            {pad(timeLeft.hours)}
          </span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-primary-300">
            Hrs
          </span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-primary-800/90 px-3 py-2 min-w-[3rem] md:min-w-[4rem]">
          <span className="text-lg md:text-2xl font-black tabular-nums text-primary-100 leading-tight">
            {pad(timeLeft.minutes)}
          </span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-primary-300">
            Min
          </span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-primary-800/90 px-3 py-2 min-w-[3rem] md:min-w-[4rem]">
          <span className="text-lg md:text-2xl font-black tabular-nums text-primary-100 leading-tight">
            {pad(timeLeft.seconds)}
          </span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-primary-300">
            Sec
          </span>
        </div>
      </div>
    </div>
  );
}

