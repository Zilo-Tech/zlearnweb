'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, Zap, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURES = [
    { title: 'Personalized Learning', description: 'AI-driven recommendations tailored to your goals', icon: <Zap className="h-6 w-6 text-[#446D6D]" /> },
    { title: 'Expert Instructors', description: 'Learn from industry professionals and seasoned educators', icon: <CheckCircle className="h-6 w-6 text-[#446D6D]" /> },
    { title: 'Certification', description: 'Earn recognized certificates upon course completion', icon: <Shield className="h-6 w-6 text-[#446D6D]" /> },
    { title: 'Multi-device Sync', description: 'Switch between web and mobile apps seamlessly', icon: <Smartphone className="h-6 w-6 text-[#446D6D]" /> },
];

export default function FeaturesPage() {
    const router = useRouter();

    return (
        <div className="space-y-8 py-4">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-gray-900">What to expect on Z-Learn</h1>
                <p className="text-gray-500 max-w-md mx-auto">
                    We've designed Z-Learn to give you the most effective digital education experience.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {FEATURES.map((feature, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                        <div className="mt-1 h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                            {feature.icon}
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-8 border-t">
                <Button
                    onClick={() => router.push('/onboarding/complete')}
                    size="lg"
                    className="bg-[#446D6D] hover:bg-[#3A5F5F] px-12 py-6 text-lg rounded-xl"
                >
                    Got it, Let's go!
                </Button>
            </div>
        </div>
    );
}
