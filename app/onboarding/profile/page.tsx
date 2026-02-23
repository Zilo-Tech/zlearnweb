'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';

export default function ProfileSetupPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => state.onboarding) as { name?: string; age?: number };
    const [name, setName] = useState((data?.name ?? '') as string);
    const [age, setAge] = useState(data?.age != null ? String(data.age) : '');

    const handleContinue = () => {
        const ageNum = age.trim() ? parseInt(age, 10) : undefined;
        if (!name.trim()) return;
        dispatch(updateOnboardingData({ name: name.trim(), age: Number.isFinite(ageNum) ? ageNum : undefined }));
        router.push('/onboarding/country');
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Tell us about you</h1>
                <p className="text-gray-500">Basic info so we can personalize your experience.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input
                        id="name"
                        placeholder="e.g. Jane Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-2 border-primary-200 rounded-lg"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="age">Age (optional)</Label>
                    <Input
                        id="age"
                        type="number"
                        min={5}
                        max={120}
                        placeholder="e.g. 18"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="border-2 border-primary-200 rounded-lg"
                    />
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    Back
                </Button>
                <Button onClick={handleContinue} disabled={!name.trim()} size="lg">
                    Continue
                </Button>
            </div>
        </div>
    );
}
