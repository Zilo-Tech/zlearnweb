"use client";

import React, { useMemo, useState, useEffect } from "react";

/**
 * Launch timestamp: persist a computed target so it doesn't move on each page load.
 * - On the first visit we set a target = now + 20 * 24h (full 20 days) and store it in
 *   localStorage. Subsequent visits reuse that timestamp so the countdown actually
 *   decreases across days instead of always being ~19 days.
 */
function getLaunchTimestamp(): number {
  const storageKey = "zlearn_launch_ts_v1";
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!Number.isNaN(parsed) && parsed > 0) return parsed;
      }
      // Use full 20 * 24h from now so the initial value shows 20 days (not 19 when
      // target is set to midnight of the day 20 days ahead).
      const ts = Date.now() + 20 * 24 * 60 * 60 * 1000;
      localStorage.setItem(storageKey, String(ts));
      return ts;
    }
  } catch (err) {
    // If localStorage access fails, fall back to a deterministic date 20 days ahead
    // at midnight (previous behavior).
    // eslint-disable-next-line no-console
    console.warn("Failed to access localStorage for launch timestamp:", err);
  }

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
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    computeTimeLeft(launchTs)
  );

  useEffect(() => {
    const tick = () => setTimeLeft(computeTimeLeft(launchTs));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [launchTs]);

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
