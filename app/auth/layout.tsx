import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row">
            {/* Left Side: Form */}
            <div className="flex-1 flex flex-col">
                <div className="p-4 md:p-8">
                    <Button variant="ghost" asChild className="w-fit">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center lg:text-left">
                            <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-[#446D6D]">
                                <div className="h-10 w-10 rounded-lg bg-[#446D6D] flex items-center justify-center text-white">
                                    Z
                                </div>
                                <span>Z-Learn</span>
                            </Link>
                        </div>

                        {children}
                    </div>
                </div>

                <div className="p-4 md:p-8 text-center lg:text-left text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Z-Learn. All rights reserved.
                </div>
            </div>

            {/* Right Side: Image (Desktop only) */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-[#446D6D]">
                <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=1600&fit=crop&q=80"
                    alt="Professional learning environment"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f1f]/80 to-transparent flex items-end p-12">
                    <div className="text-white max-w-lg">
                        <h2 className="text-4xl font-black mb-4 leading-tight">
                            Your Journey to Professional Excellence Starts Here
                        </h2>
                        <p className="text-lg text-primary-100 opacity-90">
                            Join thousands of professionals who are transforming their careers through expert-led courses and industry-recognized certifications.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
