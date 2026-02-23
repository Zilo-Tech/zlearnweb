'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen text-base antialiased">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <div className="mb-10 md:mb-14">
          <p className="text-sm text-primary-600 uppercase tracking-widest font-bold mb-2">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight text-start md:text-center mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 text-start md:text-center max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using Z-Learn.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white border-2 border-primary-200 p-6 md:p-10 rounded-2xl shadow-sm prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              Last updated: {new Date().toLocaleDateString('en-US')}
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              By accessing or using Z-Learn (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree, please do not use the Service.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Use of the Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You may use the Service for personal learning, exam preparation, and professional development
              in accordance with these terms and any applicable policies. You are responsible for maintaining
              the confidentiality of your account and for all activity under your account.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. User Content and Conduct</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You agree not to misuse the Service, including by uploading unlawful content, infringing
              intellectual property, or harassing other users. We may suspend or terminate access for
              violations of these terms.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Service and its content (excluding user-generated content) are owned by Z-Learn or its
              licensors. You may not copy, modify, or distribute our materials without permission.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">5. Contact</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For questions about these terms, please contact us at{' '}
              <Link href="/contact" className="text-primary-600 font-medium hover:underline">
                our contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
