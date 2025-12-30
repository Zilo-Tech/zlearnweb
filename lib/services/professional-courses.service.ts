import { apiService } from './api.service';
import { ProfessionalCourse, CourseFilters, PaginatedResponse } from '../types';

class ProfessionalCoursesService {
    // Get professional courses
    async getCourses(filters?: CourseFilters): Promise<PaginatedResponse<ProfessionalCourse>> {
        const params = new URLSearchParams();

        if (filters?.subject) params.append('category', filters.subject);
        if (filters?.difficulty) params.append('level', filters.difficulty);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.ordering) params.append('ordering', filters.ordering);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const queryString = params.toString();
        const endpoint = `/api/courses/${queryString ? `?${queryString}` : ''}`;

        return apiService.get<PaginatedResponse<ProfessionalCourse>>(endpoint);
    }

    // Get course by slug
    async getCourseBySlug(slug: string): Promise<ProfessionalCourse> {
        return apiService.get<ProfessionalCourse>(`/api/courses/${slug}/`);
    }

    // Get featured courses
    async getFeaturedCourses(): Promise<ProfessionalCourse[]> {
        return apiService.get<ProfessionalCourse[]>('/api/courses/featured/');
    }

    // Get popular courses
    async getPopularCourses(): Promise<ProfessionalCourse[]> {
        return apiService.get<ProfessionalCourse[]>('/api/courses/popular/');
    }

    // Get course categories
    async getCategories(): Promise<any[]> {
        return apiService.get<any[]>('/api/courses/categories/');
    }

    // Enroll in course
    async enrollInCourse(data: {
        course: string;
        amount_paid?: number;
        payment_method?: string;
        payment_reference?: string;
    }): Promise<any> {
        return apiService.post('/api/courses/enroll/', data);
    }

    // Get course progress
    async getProgress(courseId: string): Promise<any> {
        return apiService.get(`/api/courses/progress/${courseId}/`);
    }

    // Complete lesson
    async completeLesson(lessonId: string, data?: {
        time_spent_minutes?: number;
        metadata?: any;
    }): Promise<any> {
        return apiService.post(`/api/courses/lessons/${lessonId}/complete/`, data);
    }

    // Complete section
    async completeSection(sectionId: string): Promise<any> {
        return apiService.post(`/api/courses/sections/${sectionId}/complete/`);
    }

    // Complete module
    async completeModule(moduleId: string): Promise<any> {
        return apiService.post(`/api/courses/modules/${moduleId}/complete/`);
    }

    // Get lesson navigation
    async getLessonNavigation(lessonId: string): Promise<{
        previous: any;
        next: any;
        current: any;
    }> {
        return apiService.get(`/api/courses/lessons/${lessonId}/navigation/`);
    }

    // Update course position
    async updateCoursePosition(courseId: string, data: {
        current_module: string;
        current_lesson: string;
    }): Promise<any> {
        return apiService.post(`/api/courses/progress/${courseId}/update-position/`, data);
    }

    // Wishlist operations
    async getWishlist(): Promise<any[]> {
        return apiService.get('/api/courses/wishlist/');
    }

    async addToWishlist(courseId: string): Promise<any> {
        return apiService.post('/api/courses/wishlist/', { course: courseId });
    }

    async removeFromWishlist(wishlistId: string): Promise<void> {
        return apiService.delete(`/api/courses/wishlist/${wishlistId}/`);
    }

    async toggleWishlist(courseId: string): Promise<any> {
        return apiService.post(`/api/courses/${courseId}/wishlist/toggle/`);
    }

    // Reviews
    async getCourseReviews(courseId: string, page: number = 1): Promise<PaginatedResponse<any>> {
        return apiService.get(`/api/courses/${courseId}/reviews/?page=${page}`);
    }

    async createReview(data: {
        course: string;
        rating: number;
        comment: string;
    }): Promise<any> {
        return apiService.post('/api/courses/reviews/create/', data);
    }

    // Download resource
    async downloadResource(resourceId: string): Promise<any> {
        return apiService.post(`/api/courses/resources/${resourceId}/download/`);
    }

    // Get course stats
    async getCourseStats(courseId: string): Promise<any> {
        return apiService.get(`/api/courses/${courseId}/stats/`);
    }
}

export const professionalCoursesService = new ProfessionalCoursesService();
