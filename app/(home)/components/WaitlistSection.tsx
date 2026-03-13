"use client";

import React, { useState, useEffect } from "react";
import LaunchCountdown from "./LaunchCountdown";
import { Mail, User, CheckCircle2, Loader2 } from "lucide-react";

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
    <section className="relative border-b border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(68,109,109,0.05),transparent_50%)]" />
      
      <div className="container max-w-5xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 rounded-full bg-primary-100 border border-primary-200 text-primary-700 font-semibold text-sm mb-6">
            Coming Soon
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Join the Waitlist
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Be the first to know when we launch. Get early access, exclusive updates, and special launch offers.
          </p>

          <div className="mb-12">
            <LaunchCountdown />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  disabled={status === "submitting" || status === "success"}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Email address"
                />
              </div>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  disabled={status === "submitting" || status === "success"}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Your name (optional)"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={status === "submitting" || status === "success"}
              className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl hover:from-primary-600 hover:to-primary-700 transition shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Joining...</span>
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>You're on the list!</span>
                </>
              ) : (
                <span>Notify Me at Launch</span>
              )}
            </button>
          </form>

          {message && (
            <div
              role="alert"
              className={`mt-6 p-4 rounded-xl font-medium text-center ${
                status === "error" 
                  ? "bg-red-50 text-red-700 border border-red-200" 
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            🔒 Your information is safe with us. No spam, ever.
          </p>
        </div>
      </div>
    </section>
  );
}
