import { apiService } from './api.service';
import { Course, CourseFilters, CourseProgress, PaginatedResponse } from '../types';

class CoursesService {
    // Get enrolled courses (academic)
    async getEnrolledCourses(): Promise<Course[]> {
        const response = await apiService.get<any>('/api/content/enrollments/');
        return response.results || response;
    }

    // Get available courses (academic)
    async getAvailableCourses(filters?: CourseFilters): Promise<PaginatedResponse<Course>> {
        const params = new URLSearchParams();

        if (filters?.subject) params.append('subject', filters.subject);
        if (filters?.curriculum) params.append('curriculum', filters.curriculum);
        if (filters?.difficulty) params.append('difficulty', filters.difficulty);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.ordering) params.append('ordering', filters.ordering);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const queryString = params.toString();
        const endpoint = `/api/content/courses/${queryString ? `?${queryString}` : ''}`;

        return apiService.get<PaginatedResponse<Course>>(endpoint);
    }

    // Get featured courses (academic)
    async getFeaturedCourses(): Promise<Course[]> {
        const response = await apiService.get<any>('/api/content/courses/?featured=true');
        return response.results || response;
    }

    // Get course details
    async getCourseDetails(courseId: string): Promise<Course> {
        return apiService.get<Course>(`/api/content/courses/${courseId}/`);
    }

    // Enroll in course
    async enrollInCourse(courseId: string): Promise<any> {
        return apiService.post(`/api/content/courses/${courseId}/enroll/`);
    }

    // Get course modules
    async getCourseModules(courseId: string): Promise<any[]> {
        const response = await apiService.get<any>(`/api/content/courses/${courseId}/modules/`);
        return response.results || response;
    }

    // Get module lessons
    async getModuleLessons(moduleId: string): Promise<any[]> {
        const response = await apiService.get<any>(`/api/content/modules/${moduleId}/lessons/`);
        return response.results || response;
    }

    // Get lesson details
    async getLessonDetails(lessonId: string): Promise<any> {
        return apiService.get(`/api/content/lessons/${lessonId}/`);
    }

    // Mark lesson as complete
    async markLessonComplete(lessonId: string, data?: { time_spent_minutes?: number; notes?: string }): Promise<any> {
        return apiService.post(`/api/content/lessons/${lessonId}/complete/`, data);
    }

    // Get course progress
    async getCourseProgress(courseId: string): Promise<CourseProgress> {
        return apiService.get<CourseProgress>(`/api/content/courses/${courseId}/progress/`);
    }

    // Update lesson progress
    async updateLessonProgress(lessonId: string, data: {
        time_spent_seconds: number;
        video_progress_seconds?: number;
        completed?: boolean;
    }): Promise<any> {
        return apiService.post(`/api/content/lessons/${lessonId}/update-progress/`, data);
    }

    // Get course stats
    async getCourseStats(courseId: string): Promise<any> {
        return apiService.get(`/api/content/courses/${courseId}/stats/`);
    }
}

export const coursesService = new CoursesService();
