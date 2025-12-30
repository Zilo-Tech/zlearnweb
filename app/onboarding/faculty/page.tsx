'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';
import { FACULTIES } from '@/lib/constants';

export default function FacultySelectionPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);

    const filteredFaculties = FACULTIES.filter((faculty) =>
        faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContinue = () => {
        if (selectedFaculty) {
            dispatch(updateOnboardingData({ faculty: selectedFaculty }));
            router.push('/onboarding/class'); // University students also select their level/year
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Select your faculty</h1>
                <p className="text-gray-500">
                    Choose your field of study to get relevant course recommendations.
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search faculties..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-4">
                {filteredFaculties.map((faculty) => (
                    <SelectionCard
                        key={faculty.id}
                        title={faculty.name}
                        icon={<GraduationCap className="h-6 w-6" />}
                        selected={selectedFaculty === faculty.id}
                        onClick={() => setSelectedFaculty(faculty.id)}
                    />
                ))}

                {filteredFaculties.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                        No faculties found matching "{searchQuery}"
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
                    disabled={!selectedFaculty}
                    size="lg"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
