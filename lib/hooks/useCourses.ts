'use client';

import { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import {
  fetchEnrolledCourses,
  fetchAvailableCourses,
  fetchFeaturedCourses,
  fetchCourseDetails,
  enrollInCourse,
  completeLessonThunk,
  setUserType,
} from '@/lib/store/slices/courses.slice';
import type { UserCourseType } from '@/lib/services/courses.service';

export function useCourses() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((s) => s.courses);
  // Read user_type from auth — same source of truth as mobile's HomeScreen
  const authUserType = useAppSelector((s) => s.auth.user?.user_type) as UserCourseType;
  const userType: UserCourseType = authUserType ?? state.userType ?? null;

  // Keep courses slice in sync whenever auth user_type changes
  useEffect(() => {
    if (authUserType && authUserType !== state.userType) {
      dispatch(setUserType(authUserType));
    }
  }, [authUserType, state.userType, dispatch]);

  const loadEnrolled = useCallback(
    () => dispatch(fetchEnrolledCourses(userType)),
    [dispatch, userType]
  );
  const loadAvailable = useCallback(
    (params?: object) => dispatch(fetchAvailableCourses({ userType, params })),
    [dispatch, userType]
  );
  const loadFeatured = useCallback(
    () => dispatch(fetchFeaturedCourses(userType)),
    [dispatch, userType]
  );
  const loadDetails = useCallback(
    (idOrSlug: string) =>
      dispatch(fetchCourseDetails({ idOrSlug, userType: userType ?? undefined })).unwrap(),
    [dispatch, userType]
  );
  const enroll = useCallback(
    (courseId: string, courseSlug?: string) =>
      dispatch(enrollInCourse({ courseId, courseSlug, userType: userType ?? undefined })).unwrap(),
    [dispatch, userType]
  );
  const isEnrolled = useCallback(
    (courseId: string, courseSlug?: string) => {
      const ids = state.enrolledCourseIds || [];
      return ids.includes(courseId) || (!!courseSlug && ids.includes(courseSlug));
    },
    [state.enrolledCourseIds]
  );
  const completeLesson = useCallback(
    (lessonId: string, _courseId: string, body?: object) =>
      dispatch(completeLessonThunk({ lessonId, userType: userType ?? undefined, body })).unwrap(),
    [dispatch, userType]
  );

  return {
    enrolled: state.enrolled ?? [],
    available: state.available ?? [],
    featured: state.featured ?? [],
    currentCourse: state.currentCourse ?? null,
    progress: state.progress ?? null,
    enrolledCourseIds: state.enrolledCourseIds ?? [],
    userType,
    isLoading: state.isLoading ?? false,
    error: state.error ?? null,
    loadEnrolled,
    loadAvailable,
    loadFeatured,
    loadDetails,
    enroll,
    isEnrolled,
    completeLesson,
  };
}
