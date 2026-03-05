'use client';

import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import {
  fetchEnrolledCourses,
  fetchAvailableCourses,
  fetchFeaturedCourses,
  fetchCourseDetails,
  enrollInCourse,
} from '@/lib/store/slices/courses.slice';
import type { Course } from '@/lib/types';

export function useCourses() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.courses);
  const userType = useAppSelector((s) => s.auth.user?.user_type as 'academic' | 'professional' | 'exams' | null);

  const loadEnrolled = useCallback(() => dispatch(fetchEnrolledCourses()), [dispatch]);
  const loadAvailable = useCallback(() => dispatch(fetchAvailableCourses()), [dispatch]);
  const loadFeatured = useCallback(() => dispatch(fetchFeaturedCourses()), [dispatch]);
  const loadDetails = useCallback(
    (idOrSlug: string) => dispatch(fetchCourseDetails(idOrSlug)).unwrap(),
    [dispatch]
  );
  const enroll = useCallback(
    (course: Course) => {
      const payload =
        userType === 'professional'
          ? { identifier: course.slug ?? course.id, courseId: course.id }
          : { identifier: course.id, courseId: course.id };
      return dispatch(enrollInCourse(payload)).unwrap();
    },
    [dispatch, userType]
  );

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
    userType: userType ?? null,
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
