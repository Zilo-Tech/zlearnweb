'use client';

import { WelcomeHeader } from '@/components/dashboard/welcome-header';
import { ContinueLearning } from '@/components/dashboard/continue-learning';
import { ContinueExamPrep } from '@/components/dashboard/continue-exam-prep';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { StudyInsights } from '@/components/dashboard/study-insights';
import { LeaderboardPreview } from '@/components/dashboard/leaderboard-preview';
import { UpcomingEvents } from '@/components/dashboard/upcoming-events';
import { DailyTipCard } from '@/components/dashboard/daily-tip';
import { MotivationCard } from '@/components/dashboard/motivation-card';
import { StudyRemindersCard } from '@/components/dashboard/study-reminders';
import { UserTypeSwitcher } from '@/components/dashboard/user-type-switcher';
import { FeaturedCoursesSection } from '@/components/dashboard/featured-courses';
import { FeaturedExamsSection } from '@/components/dashboard/featured-exams';
import { RecommendedCoursesSection } from '@/components/dashboard/recommended-courses';
import { useEffect } from 'react';
import { usePersonalization } from '@/lib/hooks/usePersonalization';
import { useAppDispatch } from '@/lib/store/hooks';
import { useAuth } from '@/lib/hooks/useAuth';
import { fetchLearningAnalytics } from '@/lib/store/slices/progress.slice';

export default function DashboardPage() {
    const { loadDashboard } = usePersonalization();
    const { user, isAuthenticated, token } = useAuth();
    const dispatch = useAppDispatch();

    const userType = (user?.user_type?.toLowerCase?.() ?? '').trim();
    const isExamUser = userType === 'exams';

    useEffect(() => {
        if (isAuthenticated && token) {
            loadDashboard();
            dispatch(fetchLearningAnalytics());
        }
    }, [loadDashboard, dispatch, isAuthenticated, token]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <WelcomeHeader />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    <div className="lg:col-span-8 space-y-6">
                        <UserTypeSwitcher />

                        <DailyTipCard />
                        
                        <QuickActions />

                        {isExamUser ? (
                            <>
                                <ContinueExamPrep />
                                <FeaturedExamsSection />
                            </>
                        ) : (
                            <>
                                <ContinueLearning />
                                <FeaturedCoursesSection />
                                <RecommendedCoursesSection />
                            </>
                        )}

                        <StudyInsights />
                    </div>

                    <aside className="lg:col-span-4 space-y-6">
                        <UpcomingEvents />
                        <LeaderboardPreview />
                        <StudyRemindersCard />
                        <MotivationCard />
                    </aside>
                </div>
            </div>
        </div>
    );
}
