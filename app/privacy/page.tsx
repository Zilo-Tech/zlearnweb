'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 text-start md:text-center max-w-2xl mx-auto leading-relaxed">
            How we collect, use, and protect your information.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white border-2 border-primary-200 p-6 md:p-10 rounded-2xl shadow-sm prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              Last updated: {new Date().toLocaleDateString('en-US')}
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We collect information you provide when you register, use our courses, or contact support.
              This may include your name, email, profile details, learning progress, and any content
              you submit. We also collect usage data to improve the Service.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use your information to provide and personalize the Service, process enrollments,
              communicate with you, improve our offerings, and comply with legal obligations.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Sharing and Disclosure</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We do not sell your personal data. We may share information with service providers who
              assist in operating the Service, or when required by law or to protect our rights and users.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Data Security</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your data against
              unauthorized access, loss, or alteration.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">5. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Depending on your location, you may have rights to access, correct, delete, or port your
              data, or to object to or restrict certain processing. Contact us to exercise these rights.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">6. Contact</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For privacy-related questions, please reach out via our{' '}
              <Link href="/contact" className="text-primary-600 font-medium hover:underline">
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
