"use client";

import React, { useState, useEffect } from "react";
import LaunchCountdown from "./LaunchCountdown";

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/csrf", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.csrfToken) setCsrfToken(data.csrfToken);
      })
      .catch(() => {
        if (!cancelled) setCsrfToken(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email.");
      return;
    }
    if (!csrfToken) {
      setStatus("error");
      setMessage("Security check loading. Please try again in a moment.");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          csrfToken,
        }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      setMessage(data?.message || "You're on the list!");
      setEmail("");
      setName("");
    } catch {
      setStatus("error");
      setMessage("Please check your connection and try again.");
    }
  };

  return (
    <section className="border-b border-primary-200 bg-primary-50/50 py-10 md:py-14">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm text-primary-600 uppercase tracking-widest mb-2 font-bold">
            Coming soon
          </p>
          <h2 className="text-2xl md:text-3xl xl:text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Join the waitlist
          </h2>
          <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
            Be the first to know when we launch. Get early access and updates.
          </p>

          <div className="mb-8 flex justify-center">
            <LaunchCountdown />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                disabled={status === "submitting" || status === "success"}
                className="flex-1 min-w-0 px-4 py-3 rounded-lg border-2 border-primary-200 bg-white text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition disabled:opacity-60"
                aria-label="Email address"
              />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                disabled={status === "submitting" || status === "success"}
                className="flex-1 min-w-0 px-4 py-3 rounded-lg border-2 border-primary-200 bg-white text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition disabled:opacity-60"
                aria-label="Your name (optional)"
              />
            </div>
            <button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className="w-full sm:w-auto px-8 py-3 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "submitting"
                ? "Joining…"
                : status === "success"
                  ? "You're on the list"
                  : "Notify me at launch"}
            </button>
          </form>

          {message && (
            <p
              role="alert"
              className={`mt-4 text-sm font-medium ${status === "error" ? "text-red-600" : "text-primary-700"}`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
