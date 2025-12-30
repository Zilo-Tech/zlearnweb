import { apiService } from './api.service';
import { Exam, ExamAttempt, ExamFilters, PaginatedResponse } from '../types';

class ExamsService {
    // Get all exams
    async getExams(filters?: ExamFilters): Promise<PaginatedResponse<Exam>> {
        const params = new URLSearchParams();

        if (filters?.subject) params.append('subject', filters.subject);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.ordering) params.append('ordering', filters.ordering);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.page_size) params.append('page_size', filters.page_size.toString());

        const queryString = params.toString();
        const endpoint = `/api/assessments/exams/${queryString ? `?${queryString}` : ''}`;

        return apiService.get<PaginatedResponse<Exam>>(endpoint);
    }

    // Get exam details
    async getExamDetails(examId: string): Promise<Exam> {
        return apiService.get<Exam>(`/api/assessments/exams/${examId}/`);
    }

    // Get practice tests
    async getPracticeTests(): Promise<Exam[]> {
        const response = await apiService.get<any>('/api/assessments/practice-tests/');
        return response.results || response;
    }

    // Start exam
    async startExam(examId: string): Promise<{
        attempt_id: string;
        exam: Exam;
        time_limit_minutes: number;
    }> {
        return apiService.post(`/api/assessments/exams/${examId}/start/`);
    }

    // Submit exam
    async submitExam(examId: string, answers: Array<{
        question_id: string;
        answer: string;
    }>): Promise<{
        attempt_id: string;
        score: number;
        grade: string;
        completed_at: string;
        passed: boolean;
    }> {
        return apiService.post(`/api/assessments/exams/${examId}/submit/`, { answers });
    }

    // Get exam results
    async getExamResults(): Promise<ExamAttempt[]> {
        const response = await apiService.get<any>('/api/assessments/results/');
        return response.results || response;
    }

    // Get specific exam result
    async getExamResult(resultId: string): Promise<ExamAttempt> {
        return apiService.get<ExamAttempt>(`/api/assessments/results/${resultId}/`);
    }

    // Attempt quiz
    async attemptQuiz(quizId: string, answers: Array<{
        question_id: string;
        answer: string;
    }>): Promise<{
        attempt_id: string;
        score: number;
        passed: boolean;
    }> {
        return apiService.post(`/api/assessments/quizzes/${quizId}/attempt/`, { answers });
    }

    // Get assessments
    async getAssessments(): Promise<any[]> {
        const response = await apiService.get<any>('/api/assessments/assessments/');
        return response.results || response;
    }
}

export const examsService = new ExamsService();
