'use client';

import { FileText, CheckCircle, BarChart2, Trophy } from 'lucide-react';

export default function ExamsPage() {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-12 text-center">
            {/* Icon */}
            <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-teal-50 text-[#446D6D]">
                <FileText className="h-16 w-16" />
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold text-gray-900">Exams & Assessments</h1>

            {/* Description */}
            <p className="mb-12 max-w-lg text-lg leading-relaxed text-gray-500">
                Our comprehensive exam and assessment system is coming soon.
                You'll be able to take practice tests, track your progress, and prepare for your exams.
            </p>

            {/* Features List */}
            <div className="grid w-full max-w-2xl gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900">Practice Tests</h3>
                    <p className="text-sm text-gray-500">Prepare with actual past assessments</p>
                </div>

                <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                        <BarChart2 className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900">Performance</h3>
                    <p className="text-sm text-gray-500">Monitor your progress over time</p>
                </div>

                <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900">Instant Results</h3>
                    <p className="text-sm text-gray-500">Get immediate feedback and insights</p>
                </div>
            </div>
        </div>
    );
}
