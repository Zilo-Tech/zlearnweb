'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';
import { User, Calendar, ArrowRight } from 'lucide-react';

export default function ProfileSetupPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => state.onboarding) as { name?: string; age?: number };
    const [name, setName] = useState((data?.name ?? '') as string);
    const [age, setAge] = useState(data?.age != null ? String(data.age) : '');
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        const ageNum = age.trim() ? parseInt(age, 10) : undefined;
        if (!name.trim()) return;
        
        setIsLoading(true);
        try {
            dispatch(updateOnboardingData({ name: name.trim(), age: Number.isFinite(ageNum) ? ageNum : undefined }));
            // Small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 300));
            router.push('/onboarding/country');
        } catch (error) {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-2 shadow-lg">
                    <User className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Tell us about yourself</h1>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                    Help us personalize your learning experience
                </p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
                <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <User className="h-4 w-4 text-primary-600" />
                        Full Name
                    </Label>
                    <Input
                        id="name"
                        placeholder="e.g. Jane Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="age" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary-600" />
                        Age <span className="text-sm font-normal text-gray-500">(optional)</span>
                    </Label>
                    <Input
                        id="age"
                        type="number"
                        min={5}
                        max={120}
                        placeholder="e.g. 18"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        disabled={isLoading}
                        className="h-12 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                    />
                    <p className="text-sm text-gray-500">
                        This helps us recommend age-appropriate content
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()} 
                    disabled={isLoading}
                    className="font-semibold"
                >
                    Back
                </Button>
                <Button 
                    onClick={handleContinue} 
                    disabled={!name.trim() || isLoading}
                    loading={isLoading}
                    size="lg"
                    className="font-semibold px-8"
                >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
