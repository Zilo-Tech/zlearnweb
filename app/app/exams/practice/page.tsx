'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Clock, Settings, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export default function PracticePage() {
    const router = useRouter();
    const [questionCount, setQuestionCount] = useState([20]);
    const [isTimed, setIsTimed] = useState(true);

    const handleStartPractice = () => {
        // In a real app, this would create a practice session ID via API
        // For now, we'll just redirect to a mock exam ID
        router.push('/app/exams/practice-session-123/take');
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">Practice Mode</h1>
                <p className="text-gray-500">Customize your practice session to focus on specific topics or simulate exam conditions.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-8">

                {/* Subject Selection */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">Subject</Label>
                    <Select defaultValue="math">
                        <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="math">Mathematics</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="biology">Biology</SelectItem>
                            <SelectItem value="computer-science">Computer Science</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Topics Selection (Mock) */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">Topics</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {['Algebra', 'Calculus', 'Geometry', 'Trigonometry', 'Statistics', 'Mechanics'].map((topic) => (
                            <div key={topic} className="flex items-center space-x-2 rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                                <input type="checkbox" id={topic} className="h-4 w-4 rounded border-gray-300 text-[#446D6D] focus:ring-[#446D6D]" defaultChecked />
                                <label htmlFor={topic} className="text-sm font-medium text-gray-700 cursor-pointer select-none">{topic}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Difficulty */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">Difficulty Level</Label>
                    <RadioGroup defaultValue="medium" className="grid grid-cols-3 gap-4">
                        <div>
                            <RadioGroupItem value="easy" id="easy" className="peer sr-only" />
                            <Label
                                htmlFor="easy"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#446D6D] peer-data-[state=checked]:text-[#446D6D] cursor-pointer"
                            >
                                Easy
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
                            <Label
                                htmlFor="medium"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#446D6D] peer-data-[state=checked]:text-[#446D6D] cursor-pointer"
                            >
                                Medium
                            </Label>
                        </div>
                        <div>
                            <RadioGroupItem value="hard" id="hard" className="peer sr-only" />
                            <Label
                                htmlFor="hard"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[#446D6D] peer-data-[state=checked]:text-[#446D6D] cursor-pointer"
                            >
                                Hard
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Question Count */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Number of Questions</Label>
                        <span className="text-sm font-medium text-gray-500">{questionCount[0]} Questions</span>
                    </div>
                    <Slider
                        value={questionCount}
                        onValueChange={setQuestionCount}
                        max={50}
                        min={5}
                        step={5}
                        className="py-4"
                    />
                </div>

                {/* Settings */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base font-semibold">Timed Practice</Label>
                            <p className="text-sm text-gray-500">Limit the time per question</p>
                        </div>
                        <Switch checked={isTimed} onCheckedChange={setIsTimed} />
                    </div>
                </div>

                <Button size="lg" className="w-full" onClick={handleStartPractice}>
                    <Play className="mr-2 h-4 w-4" /> Start Practice Session
                </Button>
            </div>
        </div>
    );
}
