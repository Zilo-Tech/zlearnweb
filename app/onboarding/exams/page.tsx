'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateOnboardingData } from '@/lib/store/slices/onboarding.slice';
import { completeOnboarding } from '@/lib/store/slices/auth.slice';
import { useToast } from '@/lib/hooks/useToast';

const EXAM_TYPES = [
    { id: 'jamb', label: 'JAMB UTME' },
    { id: 'sat', label: 'SAT' },
    { id: 'waec', label: 'WAEC' },
    { id: 'neco', label: 'NECO' },
    { id: 'gce', label: 'GCE' },
    { id: 'toefl', label: 'TOEFL' },
    { id: 'ielts', label: 'IELTS' },
    { id: 'gre', label: 'GRE' },
    { id: 'gmat', label: 'GMAT' },
    { id: 'other', label: 'Other' },
];

const STUDY_GOALS = [
    { value: 'pass', label: 'Pass the exam' },
    { value: 'high_score', label: 'Achieve high score' },
    { value: 'improve', label: 'Improve weak areas' },
    { value: 'practice', label: 'Practice and prepare' },
    { value: 'time_management', label: 'Improve time management' },
];

const STUDY_TIMES = [
    { value: 'morning', label: 'Morning (6am - 12pm)' },
    { value: 'afternoon', label: 'Afternoon (12pm - 6pm)' },
    { value: 'evening', label: 'Evening (6pm - 10pm)' },
    { value: 'night', label: 'Night (10pm - 2am)' },
    { value: 'flexible', label: 'Flexible' },
];

export default function ExamsOnboardingPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const data = useAppSelector((state) => state.onboarding) as {
        target_exam?: string; exam_date?: string; study_goals?: string[]; preferred_study_time?: string[]; study_reminders_exams?: boolean; [key: string]: unknown
    };
    const { toast } = useToast();
    const [targetExam, setTargetExam] = useState(data?.target_exam ?? '');
    const [examDate, setExamDate] = useState(data?.exam_date ?? '');
    const [studyGoals, setStudyGoals] = useState<string[]>(data?.study_goals ?? []);
    const [studyTimes, setStudyTimes] = useState<string[]>(data?.preferred_study_time ?? []);
    const [studyReminders, setStudyReminders] = useState(data?.study_reminders_exams ?? false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleGoal = (v: string) => {
        setStudyGoals((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
    };
    const toggleTime = (v: string) => {
        setStudyTimes((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
    };

    const handleComplete = async () => {
        dispatch(
            updateOnboardingData({
                user_type: 'exams',
                target_exam: targetExam || undefined,
                exam_date: examDate || undefined,
                study_goals: studyGoals.length ? studyGoals : undefined,
                preferred_study_time: studyTimes.length ? studyTimes : undefined,
                study_reminders_exams: studyReminders,
            })
        );
        setIsSubmitting(true);
        try {
            const payload = {
                ...(typeof data === 'object' && data !== null ? data : {}),
                user_type: 'exams' as const,
                target_exam: targetExam || undefined,
                exam_date: examDate || undefined,
                study_goals: studyGoals.length ? studyGoals : undefined,
                preferred_study_time: studyTimes.length ? studyTimes : undefined,
                study_reminders_exams: studyReminders,
            };
            await dispatch(completeOnboarding(payload)).unwrap();
            toast({
                title: 'Onboarding complete!',
                description: 'Welcome to Z-Learn Exams. Your dashboard is ready.',
                variant: 'success',
            });
            router.push('/app/dashboard');
        } catch (error: any) {
            toast({
                title: 'Something went wrong',
                description: error?.message || 'Could not complete onboarding. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Exam preferences</h1>
                <p className="text-gray-500">We&apos;ll tailor practice and content to your exam and schedule.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Target exam</Label>
                    <div className="flex flex-wrap gap-2">
                        {EXAM_TYPES.map((e) => (
                            <button
                                key={e.id}
                                type="button"
                                onClick={() => setTargetExam(e.id)}
                                className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                                    targetExam === e.id ? 'border-primary-500 bg-primary-50 text-primary-900' : 'border-primary-200 hover:border-primary-300'
                                }`}
                            >
                                {e.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="examDate">Target exam date (optional)</Label>
                    <Input
                        id="examDate"
                        type="date"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        className="border-2 border-primary-200 rounded-lg"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Study goals</Label>
                    <div className="flex flex-wrap gap-2">
                        {STUDY_GOALS.map((g) => (
                            <button
                                key={g.value}
                                type="button"
                                onClick={() => toggleGoal(g.value)}
                                className={`rounded-lg border-2 px-3 py-2 text-sm transition-all ${
                                    studyGoals.includes(g.value) ? 'border-primary-500 bg-primary-50' : 'border-primary-200 hover:border-primary-300'
                                }`}
                            >
                                {g.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Preferred study time</Label>
                    <div className="flex flex-wrap gap-2">
                        {STUDY_TIMES.map((t) => (
                            <button
                                key={t.value}
                                type="button"
                                onClick={() => toggleTime(t.value)}
                                className={`rounded-lg border-2 px-3 py-2 text-sm transition-all ${
                                    studyTimes.includes(t.value) ? 'border-primary-500 bg-primary-50' : 'border-primary-200 hover:border-primary-300'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={studyReminders}
                        onChange={(e) => setStudyReminders(e.target.checked)}
                        className="rounded border-2 border-primary-300 text-primary-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable study reminders</span>
                </label>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
                    Back
                </Button>
                <Button onClick={handleComplete} disabled={isSubmitting} size="lg">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Finish setup
                </Button>
            </div>
        </div>
    );
}
