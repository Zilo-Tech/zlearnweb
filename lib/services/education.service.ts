import { apiService } from './api.service';

export interface Country {
    code: string;
    name: string;
    flag: string;
    id: string;
    curricula: string[];
}

export interface EducationLevel {
    id: string;
    name: string;
    ageRange: string;
    country: string;
    order: number;
}

export interface School {
    id: string;
    name: string;
    type: string;
    country: string;
    educationLevel: string;
    location: string;
    established: number;
    website: string | null;
}

export interface Faculty {
    id: string;
    name: string;
    schoolId: string;
    type: string;
    description: string;
    icon: string;
}

export interface Program {
    id: string;
    name: string;
    facultyId: string;
    duration: string;
    degree_type: string;
    description: string;
    icon: string;
    difficulty: string;
}

export interface ClassLevel {
    id: string;
    name: string;
    educationLevel: string;
    order: number;
}

export interface Curriculum {
    id: string;
    name: string;
    country: string;
    description: string;
}

export interface EducationOptions {
    countries: Country[];
    educationLevels: EducationLevel[];
    schools: School[];
    faculties: Faculty[];
    programs: Program[];
    classLevels: ClassLevel[];
    curricula: Curriculum[];
    learningGoals: any[];
    learningStyles: any[];
    dailyStudyTimeOptions: any[];
    themes: any[];
}

class EducationService {
    private cachedData: EducationOptions | null = null;

    /**
     * Fetch education options from the backend
     */
    async getEducationOptions(): Promise<EducationOptions> {
        if (this.cachedData) return this.cachedData;

        const response = await apiService.getUnauthenticated<any>('/api/auth/education-options/');

        if (response.success && response.data) {
            this.cachedData = response.data.academic || response.data;
            return this.cachedData!;
        }

        throw new Error(response.message || 'Failed to fetch education options');
    }

    /**
     * Filter education levels by country
     */
    async getEducationLevelsByCountry(countryCode: string): Promise<EducationLevel[]> {
        const data = await this.getEducationOptions();
        const normalizedCode = countryCode.toUpperCase();
        return data.educationLevels
            .filter(level => level.country.toUpperCase() === normalizedCode)
            .sort((a, b) => a.order - b.order);
    }

    /**
     * Filter schools by country and education level
     */
    async getSchoolsByCountryAndLevel(countryCode: string, educationLevelId: string): Promise<School[]> {
        const data = await this.getEducationOptions();
        const normalizedCode = countryCode.toUpperCase();
        return data.schools.filter(
            school => school.country.toUpperCase() === normalizedCode &&
                school.educationLevel === educationLevelId
        );
    }

    /**
     * Filter faculties by school
     */
    async getFacultiesBySchool(schoolId: string): Promise<Faculty[]> {
        const data = await this.getEducationOptions();
        return data.faculties.filter(faculty => faculty.schoolId === schoolId);
    }

    /**
     * Filter programs by faculty
     */
    async getProgramsByFaculty(facultyId: string): Promise<Program[]> {
        const data = await this.getEducationOptions();
        return data.programs.filter(program => program.facultyId === facultyId);
    }

    /**
     * Filter class levels by education level
     */
    async getClassLevelsByEducationLevel(educationLevelId: string): Promise<ClassLevel[]> {
        const data = await this.getEducationOptions();
        return data.classLevels
            .filter(level => level.educationLevel === educationLevelId)
            .sort((a, b) => a.order - b.order);
    }

    /**
     * Filter curricula by country
     */
    async getCurriculaByCountry(countryCode: string): Promise<Curriculum[]> {
        const data = await this.getEducationOptions();
        const normalizedCode = countryCode.toUpperCase();
        return data.curricula.filter(
            curriculum => curriculum.country.toUpperCase() === normalizedCode ||
                curriculum.country.toUpperCase() === 'INTERNATIONAL'
        );
    }
}

export const educationService = new EducationService();
