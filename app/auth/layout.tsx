'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isForgotPassword = pathname === '/auth/forgot-password';

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col lg:flex-row antialiased">
            {/* Left Side: Form - overflow-hidden so signup fits without scrolling */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="py-3 px-4 md:py-4 md:px-8 shrink-0">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-800 transition"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8 min-h-0">
                    <div className={`w-full max-w-md ${isForgotPassword ? '' : 'space-y-6'}`}>
                        {!isForgotPassword && (
                            <div className="text-center lg:text-left">
                                <Link href="/" className="font-black text-2xl text-primary-900 tracking-tight hover:text-primary-800 transition">
                                    Z-Learn
                                </Link>
                            </div>
                        )}

                        {children}
                    </div>
                </div>

                <div className="py-3 px-4 md:py-4 md:px-8 shrink-0 text-center lg:text-left text-sm text-gray-600 font-medium">
                    &copy; {new Date().getFullYear()} Z-Learn. All rights reserved.
                </div>
            </div>

            {/* Right Side: Image (Desktop only) - brand primary-950 */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-primary-950">
                <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=1600&fit=crop&q=80"
                    alt="Professional learning environment"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 to-transparent flex items-end p-12 pb-28">
                    <div className="text-primary-100 max-w-lg">
                        <p className="text-xs uppercase tracking-widest font-bold text-primary-200 mb-2">
                            One platform, every goal
                        </p>
                        <h2 className="text-3xl xl:text-4xl font-black mb-4 leading-tight tracking-tight text-white">
                            YOUR JOURNEY STARTS HERE
                        </h2>
                        <p className="text-base md:text-lg text-primary-100 leading-relaxed">
                            Courses, exam prep, and curriculum-aligned learning. Join learners who study on their schedule and track progress with Z-Learn.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
