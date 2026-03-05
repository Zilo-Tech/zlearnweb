'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Award, ExternalLink, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchCertificates } from '@/lib/store/slices/courses.slice';

interface CertificateItem {
  id: string;
  course_title?: string;
  certificate_number?: string;
  issued_date?: string;
  pdf_file?: string;
  is_verified?: boolean;
}

export default function CertificatesPage() {
  const dispatch = useAppDispatch();
  const certificates = useAppSelector((state) => state.courses.certificates) as CertificateItem[];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchCertificates())
      .unwrap()
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  return (
    <div className="space-y-6 pb-8 text-base antialiased">
      <div>
        <p className="mb-1 text-sm font-bold uppercase tracking-widest text-[#446D6D]">
          Achievements
        </p>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">My Certificates</h1>
        <p className="mt-2 max-w-xl text-gray-600">
          Certificates earned from completed courses. Share your certificate number for verification.
        </p>
      </div>

      {isLoading && certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-gray-200 bg-white py-16">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#446D6D]" />
          <p className="text-gray-500">Loading certificates...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 text-center md:p-12">
          <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <Award className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">No certificates yet</h2>
          <p className="mx-auto mb-6 max-w-md text-gray-600">
            Complete a course to earn your first certificate. Certificates are issued automatically
            when you finish the final lesson.
          </p>
          <Link href="/app/courses">
            <Button className="bg-[#446D6D] hover:bg-[#3A5F5F]">Browse Courses</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 line-clamp-2">
                {cert.course_title ?? 'Course Certificate'}
              </h3>
              <p className="mb-3 font-mono text-xs text-gray-500">
                {cert.certificate_number ?? '—'}
              </p>
              {cert.issued_date && (
                <p className="mb-4 text-sm text-gray-500">
                  Issued {new Date(cert.issued_date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              <div className="mt-auto flex flex-wrap gap-2">
                <Link href={`/certificates/verify/${encodeURIComponent(cert.certificate_number ?? '')}`}>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-1.5 h-4 w-4" />
                    Verify
                  </Button>
                </Link>
                {cert.pdf_file ? (
                  <a href={cert.pdf_file} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <FileText className="mr-1.5 h-4 w-4" />
                      PDF
                    </Button>
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
