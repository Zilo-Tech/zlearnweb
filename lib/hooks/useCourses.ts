'use client';

import { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import {
  fetchEnrolledCourses,
  fetchAvailableCourses,
  fetchFeaturedCourses,
  fetchCourseDetails,
  enrollInCourse,
} from '@/lib/store/slices/courses.slice';

export function useCourses() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.courses);

  const loadEnrolled = useCallback(() => dispatch(fetchEnrolledCourses()), [dispatch]);
  const loadAvailable = useCallback(() => dispatch(fetchAvailableCourses()), [dispatch]);
  const loadFeatured = useCallback(() => dispatch(fetchFeaturedCourses()), [dispatch]);
  const loadDetails = useCallback(
    (idOrSlug: string) => dispatch(fetchCourseDetails(idOrSlug)).unwrap(),
    [dispatch]
  );
  const enroll = useCallback((courseId: string) => dispatch(enrollInCourse(courseId)).unwrap(), [dispatch]);

  const isEnrolled = useCallback(
    (courseId: string) => (state.enrolledCourseIds || []).includes(courseId),
    [state.enrolledCourseIds]
  );

  return {
    enrolled: state.enrolled ?? [],
    available: state.available ?? [],
    featured: state.featured ?? [],
    currentCourse: state.currentCourse ?? null,
    progress: state.progress ?? null,
    enrolledCourseIds: state.enrolledCourseIds ?? [],
    userType: state.userType ?? null,
    isLoading: state.isLoading ?? false,
    error: state.error ?? null,
    loadEnrolled,
    loadAvailable,
    loadFeatured,
    loadDetails,
    enroll,
    isEnrolled,
    completeLesson: async (_lessonId: string, _courseId: string, _body?: object) => {},
  };
}
