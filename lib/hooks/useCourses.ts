import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
    fetchEnrolledCourses,
    fetchAvailableCourses,
    fetchFeaturedCourses,
    fetchCourseDetails,
    enrollInCourse,
    fetchCourseProgress,
    markLessonComplete,
    setCurrentCourse,
    clearCoursesError
} from '@/lib/store/slices/courses.slice';
import { useCallback } from 'react';
import { CourseFilters } from '@/lib/types';

export function useCourses() {
    const dispatch = useAppDispatch();
    const {
        enrolled,
        available,
        featured,
        currentCourse,
        progress,
        isLoading,
        error
    } = useAppSelector((state) => state.courses);

    const loadEnrolled = useCallback(async () => {
        return dispatch(fetchEnrolledCourses()).unwrap();
    }, [dispatch]);

    const loadAvailable = useCallback(async (filters?: CourseFilters) => {
        return dispatch(fetchAvailableCourses(filters)).unwrap();
    }, [dispatch]);

    const loadFeatured = useCallback(async () => {
        return dispatch(fetchFeaturedCourses()).unwrap();
    }, [dispatch]);

    const loadDetails = useCallback(async (courseId: string) => {
        return dispatch(fetchCourseDetails(courseId)).unwrap();
    }, [dispatch]);

    const enroll = useCallback(async (courseId: string) => {
        return dispatch(enrollInCourse(courseId)).unwrap();
    }, [dispatch]);

    const loadProgress = useCallback(async (courseId: string) => {
        return dispatch(fetchCourseProgress(courseId)).unwrap();
    }, [dispatch]);

    const completeLesson = useCallback(async (lessonId: string, courseId: string, data?: any) => {
        return dispatch(markLessonComplete({ lessonId, courseId, data })).unwrap();
    }, [dispatch]);

    const setCourse = useCallback((course: any) => {
        dispatch(setCurrentCourse(course));
    }, [dispatch]);

    const clearError = useCallback(() => {
        dispatch(clearCoursesError());
    }, [dispatch]);

    return {
        enrolled,
        available,
        featured,
        currentCourse,
        progress,
        isLoading,
        error,
        loadEnrolled,
        loadAvailable,
        loadFeatured,
        loadDetails,
        enroll,
        loadProgress,
        completeLesson,
        setCourse,
        clearError,
    };
}
