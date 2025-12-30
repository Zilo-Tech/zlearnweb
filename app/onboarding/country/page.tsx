'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectionCard } from '@/components/onboarding/selection-card';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';
import { COUNTRIES } from '@/lib/constants';

export default function CountrySelectionPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    const filteredCountries = COUNTRIES.filter((country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleContinue = () => {
        if (selectedCountry) {
            dispatch(updateOnboardingData({ country: selectedCountry }));
            router.push('/onboarding/education-level');
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Where are you learning from?</h1>
                <p className="text-gray-500">
                    Select your country to see relevant courses and content.
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search countries..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {filteredCountries.map((country) => (
                    <SelectionCard
                        key={country.code}
                        title={country.name}
                        icon={<span className="text-2xl">{country.flag}</span>}
                        selected={selectedCountry === country.code}
                        onClick={() => setSelectedCountry(country.code)}
                    />
                ))}

                {filteredCountries.length === 0 && (
                    <div className="col-span-full py-8 text-center text-gray-500">
                        No countries found matching "{searchQuery}"
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    onClick={handleContinue}
                    disabled={!selectedCountry}
                    size="lg"
                    className="w-full sm:w-auto"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}
