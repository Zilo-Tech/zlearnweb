'use client';

import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { ContinueLearning } from '@/components/dashboard/continue-learning';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { StudyInsights } from '@/components/dashboard/study-insights';
import { LeaderboardPreview } from '@/components/dashboard/leaderboard-preview';
import { UpcomingEvents } from '@/components/dashboard/upcoming-events';
import { DailyTipCard } from '@/components/dashboard/daily-tip';
import { MotivationCard } from '@/components/dashboard/motivation-card';
import { StudyRemindersCard } from '@/components/dashboard/study-reminders';
import { UserTypeSwitcher } from '@/components/dashboard/user-type-switcher';
import { FeaturedCoursesSection } from '@/components/dashboard/featured-courses';
import { RecommendedCoursesSection } from '@/components/dashboard/recommended-courses';
import { useEffect } from 'react';
import { usePersonalization } from '@/lib/hooks/usePersonalization';
import { useAppDispatch } from '@/lib/store/hooks';
import { fetchLearningAnalytics } from '@/lib/store/slices/progress.slice';

export default function DashboardPage() {
    const { loadDashboard } = usePersonalization();
    const dispatch = useAppDispatch();

    useEffect(() => {
        loadDashboard();
        dispatch(fetchLearningAnalytics());
    }, [loadDashboard, dispatch]);

    return (
        <div className="space-y-8 pb-8 max-w-full break-words">
            <WelcomeHeader />

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8 min-w-0">
                    <UserTypeSwitcher />

                    <div className="grid gap-8 md:grid-cols-2">
                        <DailyTipCard />
                        <QuickActions />
                    </div>

                    <ContinueLearning />

                    <FeaturedCoursesSection />

                    <RecommendedCoursesSection />

                    <StudyInsights />
                </div>

                <div className="space-y-8">
                    <UpcomingEvents />
                    <LeaderboardPreview />
                    <StudyRemindersCard />
                    <MotivationCard />
                </div>
            </div>
        </div>
    );
}
