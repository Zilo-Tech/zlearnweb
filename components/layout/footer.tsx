'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-[#446D6D]">
                            <div className="h-8 w-8 rounded-lg bg-[#446D6D] flex items-center justify-center text-white">
                                Z
                            </div>
                            <span>Z-Learn</span>
                        </Link>
                        <p className="text-sm text-gray-500">
                            Empowering learners worldwide with quality education and professional development.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-[#446D6D]">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#446D6D]">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#446D6D]">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#446D6D]">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-[#446D6D]">
                                <Youtube className="h-5 w-5" />
                                <span className="sr-only">YouTube</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/courses" className="text-sm text-gray-500 hover:text-[#446D6D]">
                                    Browse Courses
                                </Link>
                            </li>
                            <li>
                                <Link href="/exams" className="text-sm text-gray-500 hover:text-[#446D6D]">
                                    Exams & Tests
                                </Link>
                            </li>
                            <li>
                                <Link href="/community" className="text-sm text-gray-500 hover:text-[#446D6D]">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-sm text-gray-500 hover:text-[#446D6D]">
                                    Pricing
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Support</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/help" className="text-sm text-gray-500 hover:text-[#446D6D]">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-500 hover:text-[#446D6D]">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-sm text-gray-500 hover:text-[#446D6D]">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="/feedback" className="text-sm text-gray-500 hover:text-[#446D6D]">
                                    Feedback
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#446D6D]">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-gray-500 hover:text-[#446D6D]">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-sm text-gray-500 hover:text-[#446D6D]">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; {currentYear} Z-Learn. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
