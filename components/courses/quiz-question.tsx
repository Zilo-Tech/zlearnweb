'use client';

import 'katex/dist/katex.min.css';
import Latex from 'react-katex';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuizQuestionProps {
    question: string;
    options: { id: string; text: string; isLatex?: boolean }[];
    selectedOption?: string;
    onSelect: (optionId: string) => void;
    showResult?: boolean;
    correctOptionId?: string;
}

export function QuizQuestion({
    question,
    options,
    selectedOption,
    onSelect,
    showResult,
    correctOptionId,
}: QuizQuestionProps) {
    return (
        <div className="space-y-6">
            <div className="text-lg font-medium text-gray-900">
                <Latex>{question}</Latex>
            </div>

            <RadioGroup value={selectedOption} onValueChange={onSelect} className="space-y-3">
                {options.map((option) => {
                    let optionStyle = "border-gray-200 hover:bg-gray-50 hover:border-gray-300";

                    if (showResult) {
                        if (option.id === correctOptionId) {
                            optionStyle = "border-green-500 bg-green-50 text-green-700";
                        } else if (option.id === selectedOption && option.id !== correctOptionId) {
                            optionStyle = "border-red-500 bg-red-50 text-red-700";
                        } else {
                            optionStyle = "border-gray-200 opacity-50";
                        }
                    } else if (selectedOption === option.id) {
                        optionStyle = "border-[#446D6D] bg-[#446D6D]/5 ring-1 ring-[#446D6D]";
                    }

                    return (
                        <div
                            key={option.id}
                            className={cn(
                                "flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer",
                                optionStyle
                            )}
                            onClick={() => !showResult && onSelect(option.id)}
                        >
                            <RadioGroupItem value={option.id} id={option.id} disabled={showResult} />
                            <Label htmlFor={option.id} className="flex-1 cursor-pointer font-normal">
                                {option.isLatex ? <Latex>{option.text}</Latex> : option.text}
                            </Label>
                        </div>
                    );
                })}
            </RadioGroup>
        </div>
    );
}
