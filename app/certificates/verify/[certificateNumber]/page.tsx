'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Award, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { coursesService } from '@/lib/services';

interface VerifyResult {
  valid: boolean;
  is_verified?: boolean;
  student_name?: string;
  course_title?: string;
  issued_date?: string;
  certificate_number?: string;
  message?: string;
  final_grade?: number | null;
}

export default function CertificateVerifyPage() {
  const params = useParams();
  const certificateNumber = params?.certificateNumber as string;
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!certificateNumber) {
      setIsLoading(false);
      setResult({ valid: false, message: 'No certificate number provided' });
      return;
    }

    coursesService
      .verifyCertificateAny(decodeURIComponent(certificateNumber))
      .then((data) => {
        setResult(data as VerifyResult);
        setError(null);
      })
      .catch((err) => {
        setError(err?.message ?? 'Verification failed');
        setResult({ valid: false, message: err?.message ?? 'Certificate not found' });
      })
      .finally(() => setIsLoading(false));
  }, [certificateNumber]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
              result?.valid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Award className="h-8 w-8" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-[#446D6D]" />
            <p className="text-gray-500">Verifying certificate...</p>
          </div>
        ) : result?.valid ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <CheckCircle className="h-6 w-6" />
              <h1 className="text-xl font-bold">Valid Certificate</h1>
            </div>
            <p className="text-center text-sm text-gray-600">
              This certificate has been verified and is authentic.
            </p>
            <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-4">
              {result.student_name && (
                <p>
                  <span className="text-sm font-medium text-gray-500">Student:</span>{' '}
                  <span className="font-medium text-gray-900">{result.student_name}</span>
                </p>
              )}
              {result.course_title && (
                <p>
                  <span className="text-sm font-medium text-gray-500">Course:</span>{' '}
                  <span className="font-medium text-gray-900">{result.course_title}</span>
                </p>
              )}
              {result.issued_date && (
                <p>
                  <span className="text-sm font-medium text-gray-500">Issued:</span>{' '}
                  <span className="font-medium text-gray-900">
                    {new Date(result.issued_date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </p>
              )}
              {result.certificate_number && (
                <p>
                  <span className="text-sm font-medium text-gray-500">Certificate #:</span>{' '}
                  <span className="font-mono text-gray-900">{result.certificate_number}</span>
                </p>
              )}
              {result.final_grade != null && (
                <p>
                  <span className="text-sm font-medium text-gray-500">Final grade:</span>{' '}
                  <span className="font-medium text-gray-900">{result.final_grade}%</span>
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-red-600">
              <XCircle className="h-6 w-6" />
              <h1 className="text-xl font-bold">Invalid Certificate</h1>
            </div>
            <p className="text-center text-gray-600">
              {result?.message ?? error ?? 'This certificate could not be verified.'}
            </p>
            {certificateNumber && (
              <p className="text-center font-mono text-sm text-gray-500">
                Searched for: {decodeURIComponent(certificateNumber)}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
