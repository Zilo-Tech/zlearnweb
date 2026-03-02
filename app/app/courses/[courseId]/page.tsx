'use client';

import { useEffect, useState, use } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModuleList } from '@/components/courses/module-list';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Award, Clock, BookOpen, Star, Share2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
    fetchCourseDetails,
    enrollInCourse,
    fetchEnrolledCourses,
    selectCurrentCourse,
    selectCurrentCourseModules,
    selectIsEnrolled
} from '@/lib/store/slices/courses.slice';
import { toast } from 'sonner';

export default function CourseDetailsPage() {
    const params = useParams();
    const courseId = params?.courseId as string;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const course = useAppSelector(selectCurrentCourse);
    const modules = useAppSelector(selectCurrentCourseModules);
    const isEnrolled = useAppSelector((state) => selectIsEnrolled(course?.id)(state));
    const isLoading = useAppSelector((state) => state.courses.isLoading);

    // Local loading state for enrollment action
    const [isEnrolling, setIsEnrolling] = useState(false);

    useEffect(() => {
        if (courseId) {
            dispatch(fetchCourseDetails(courseId));
            // Also ensure enrolled courses are loaded to check status
            dispatch(fetchEnrolledCourses());
        }
    }, [dispatch, courseId]);

    const handleEnroll = async () => {
        if (!course) return;

        setIsEnrolling(true);
        try {
            await dispatch(enrollInCourse(course.id)).unwrap();
            toast.success('Successfully enrolled in course!');
            // Refresh details to ensure UI updates
            dispatch(fetchCourseDetails(course.id));
        } catch (error: any) {
            toast.error(error || 'Failed to enroll in course');
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleContinue = () => {
        // Logic to find next lesson
        if (course?.last_accessed) {
            // TODO: Implement resume functionality
        }

        // Find the first available lesson across all modules
        let firstLessonId: string | null = null;

        for (const module of modules) {
            if (module.lessons && module.lessons.length > 0) {
                firstLessonId = module.lessons[0].id;
                break;
            }
        }

        if (firstLessonId && courseId) {
            router.push(`/app/courses/${courseId}/lessons/${firstLessonId}`);
        } else {
            toast.info('No lessons available yet.');
        }
    };

    // ... inside render ...

    {/* Course Content */ }
    <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
        <ModuleList courseId={course.id} modules={modules} />
    </div>

    if (isLoading && !course) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#446D6D]" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex h-96 items-center justify-center flex-col gap-4">
                <p className="text-gray-500">Course not found.</p>
                <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        {course.category && (
                            <Badge variant="secondary" className="bg-[#446D6D]/10 text-[#446D6D]">
                                {typeof course.category === 'object' ? (course.category as any).name : course.category}
                            </Badge>
                        )}
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{course.level || 'Beginner'}</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                        {course.title}
                    </h1>

                    <p className="text-lg text-gray-600 leading-relaxed">
                        {course.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            {/* <div className="h-8 w-8 rounded-full bg-gray-200" /> */}
                            {course.instructor && (
                                <span className="font-medium text-gray-900">
                                    {typeof course.instructor === 'object' ? (course.instructor as any).name : 'Instructor'}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-medium text-gray-900">{course.rating || 0}</span>
                            <span className="text-gray-500">({course.enrolled_count || 0} students)</span>
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                    <ModuleList courseId={course.id} modules={modules} />
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
                    {/* Video Preview Placeholder */}
                    <div className="relative aspect-video w-full rounded-lg bg-gray-900 flex items-center justify-center group cursor-pointer overflow-hidden">
                        {course.thumbnail ? (
                            <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        ) : (
                            <div className="absolute inset-0 bg-gray-800" />
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                        <PlayCircle className="h-16 w-16 text-white opacity-90 group-hover:scale-110 transition-transform z-10" />
                    </div>

                    {isEnrolled ? (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-700">Your Progress</span>
                                    <span className="text-[#446D6D]">{course.progress_percentage || 0}%</span>
                                </div>
                                <Progress value={course.progress_percentage || 0} className="h-2" />
                            </div>
                            <Button className="w-full bg-[#446D6D] hover:bg-[#3A5F5F]" size="lg" onClick={handleContinue}>
                                Continue Learning
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-2xl font-bold text-gray-900">
                                {course.is_free ? 'Free' : `$${course.price || 0}`}
                            </div>
                            <Button
                                className="w-full bg-[#446D6D] hover:bg-[#3A5F5F]"
                                size="lg"
                                onClick={handleEnroll}
                                disabled={isEnrolling}
                            >
                                {isEnrolling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                            </Button>
                        </div>
                    )}

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <span>{course.duration_hours || 0}h content</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <BookOpen className="h-5 w-5 text-gray-400" />
                            <span>{course.total_lessons || 0} lessons</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Award className="h-5 w-5 text-gray-400" />
                            <span>Certificate of completion</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full gap-2">
                        <Share2 className="h-4 w-4" />
                        Share Course
                    </Button>
                </div>
            </div>
        </div>
    );
}
