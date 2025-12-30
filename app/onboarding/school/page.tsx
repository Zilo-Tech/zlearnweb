'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';
import { SCHOOLS } from '@/lib/constants';

export default function SchoolSelectionPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data } = useAppSelector((state) => state.onboarding);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

    // Filter schools based on selected country and education level if needed
    // For now just showing all schools filtered by search
    const filteredSchools = SCHOOLS.filter((school) =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContinue = () => {
        if (selectedSchool) {
            dispatch(updateOnboardingData({ school: selectedSchool }));

            if (data.education_level === 'university') {
                router.push('/onboarding/faculty');
            } else {
                router.push('/onboarding/class');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Select your school</h1>
                <p className="text-gray-500">
                    Find your institution to connect with your peers and curriculum.
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search schools..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-4">
                {filteredSchools.map((school) => (
                    <SelectionCard
                        key={school.id}
                        title={school.name}
                        description={`${school.type} • ${school.city}`}
                        icon={<School className="h-6 w-6" />}
                        selected={selectedSchool === school.id}
                        onClick={() => setSelectedSchool(school.id)}
                    />
                ))}

                {filteredSchools.length === 0 && (
                    <div className="py-8 text-center">
                        <p className="text-gray-500 mb-4">Can&apos;t find your school?</p>
                        <Button variant="outline" onClick={() => {
                            dispatch(updateOnboardingData({ school: 'other' }));
                            if (data.education_level === 'university') {
                                router.push('/onboarding/faculty');
                            } else {
                                router.push('/onboarding/class');
                            }
                        }}>
                            Continue without selecting school
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex justify-between pt-4">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    Back
                </Button>
                <Button
                    onClick={handleContinue}
                    disabled={!selectedSchool}
                    size="lg"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
