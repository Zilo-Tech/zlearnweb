import { apiService } from './api.service';

export interface Subject {
    id: number;
    name: string;
    code: string;
    description: string;
    icon: string;
    color: string;
    course_count: number;
}

class SubjectsService {
    /**
     * Get all subjects
     * Backend: GET /api/content/subjects/
     */
    async getSubjects(): Promise<Subject[]> {
        return apiService.get<Subject[]>('/api/content/subjects/');
    }
}

export const subjectsService = new SubjectsService();
