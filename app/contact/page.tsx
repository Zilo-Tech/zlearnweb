'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Globe, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_CONFIG } from '@/lib/constants';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [csrfToken, setCsrfToken] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        let cancelled = false;
        fetch('/api/csrf', { credentials: 'include' })
            .then((res) => res.json())
            .then((data: { csrfToken?: string }) => {
                if (!cancelled && data?.csrfToken) setCsrfToken(data.csrfToken);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            setSubmitStatus('error');
            setSubmitMessage('Please fill in all fields.');
            return;
        }
        if (!csrfToken) {
            setSubmitStatus('error');
            setSubmitMessage('Security token not loaded. Please refresh the page.');
            return;
        }
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setSubmitMessage('');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({
                    ...formData,
                    csrfToken,
                }),
                credentials: 'include',
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.success) {
                setSubmitStatus('success');
                setSubmitMessage(data.message || 'Thank you for your message! We will get back to you soon.');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setSubmitStatus('error');
                setSubmitMessage(data.error || 'Something went wrong. Please try again.');
            }
        } catch {
            setSubmitStatus('error');
            setSubmitMessage('Failed to send. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email us',
            info: APP_CONFIG.supportEmail,
            link: `mailto:${APP_CONFIG.supportEmail}`,
        },
        {
            icon: Globe,
            title: 'Website',
            info: APP_CONFIG.website,
            link: APP_CONFIG.website,
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen text-base antialiased">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-20">
                <div className="mb-10 md:mb-14">
                    <p className="text-sm text-primary-600 uppercase tracking-widest font-bold mb-2">
                        Contact
                    </p>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight text-start md:text-center mb-4">
                        Get in touch
                    </h1>
                    <p className="text-lg text-gray-600 text-start md:text-center max-w-2xl mx-auto leading-relaxed">
                        Have a question or feedback? We&apos;re here to help.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-start justify-center gap-8 md:gap-12 max-w-6xl mx-auto">
                    {/* Form */}
                    <div className="flex-1 w-full">
                        <div className="bg-white border-2 border-primary-200 p-6 md:p-8 rounded-2xl shadow-sm">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-6">
                                Send us a message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Your name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full h-11 px-4 py-2.5 border-2 border-primary-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full h-11 px-4 py-2.5 border-2 border-primary-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full h-11 px-4 py-2.5 border-2 border-primary-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full px-4 py-2.5 border-2 border-primary-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>
                                {submitStatus === 'success' && (
                                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                        {submitMessage}
                                    </p>
                                )}
                                {submitStatus === 'error' && (
                                    <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                        {submitMessage}
                                    </p>
                                )}
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg"
                                    disabled={isSubmitting || !csrfToken}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send message'
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Contact info */}
                    <div className="flex-1 w-full">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-3">
                                    Contact information
                                </h2>
                                <p className="text-base text-gray-600 leading-relaxed mb-6">
                                    We&apos;re here to help. Reach out by email or visit our website.
                                </p>
                            </div>
                            <div className="space-y-4">
                                {contactInfo.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={item.title}
                                            href={item.link}
                                            target={item.link.startsWith('http') ? '_blank' : undefined}
                                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="flex items-start gap-4 p-4 bg-white border-2 border-primary-200 rounded-xl hover:border-primary-300 hover:bg-primary-50/50 transition"
                                        >
                                            <div className="p-2.5 bg-primary-600 rounded-lg shrink-0 text-white">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-0.5">{item.title}</h3>
                                                <p className="text-gray-600 text-sm">{item.info}</p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                            <div className="pt-4">
                                <Link
                                    href="/app/support"
                                    className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:underline"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Help &amp; Support
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
