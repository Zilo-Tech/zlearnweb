/**
 * Education API - institutions, schools, departments, faculties, programs (string IDs).
 * Hierarchy: Institution → School/Faculty → Department. Exam filters: institution, school, department.
 * Base path: /education/ (API baseUrl already includes /api)
 * @see EXAMS_INTEGRATION_GUIDE.md
 */

import { apiService } from './api.service';

export interface Institution {
  id: string;
  name: string;
  country?: string;
  type?: string;
  location?: string;
  established?: number;
  description?: string;
  website?: string;
}

export interface School {
  id: string;
  name: string;
  country?: string;
  education_level?: string;
  institution?: { id: string; name: string } | null;
  institution_id?: string | null;
  type?: string;
  location?: string;
  established?: number;
  description?: string;
  website?: string;
}

export interface Department {
  id: string;
  name: string;
  school_id: string;
  school_name: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface Faculty {
  id: string;
  name: string;
  school?: string;
  description?: string;
  type?: string;
}

export interface Program {
  id: string;
  name: string;
  school?: string;
  faculty?: string;
  degree?: string;
  duration?: string;
  description?: string;
}

export const educationService = {
  /** GET /education/institutions/ - country, type (string IDs) */
  getInstitutions: (params?: { country?: string; type?: string }) => {
    const search = new URLSearchParams();
    if (params?.country) search.set('country', params.country);
    if (params?.type) search.set('type', params.type);
    const q = search.toString();
    return apiService.get<{ pagination?: { count: number }; results?: Institution[] } | Institution[]>(
      q ? `/education/institutions/?${q}` : '/education/institutions/'
    );
  },

  /** GET /education/institutions/<id>/schools/ - schools under an institution */
  getInstitutionSchools: (institutionId: string) =>
    apiService.get<School[]>(`/education/institutions/${encodeURIComponent(institutionId)}/schools/`),

  /** GET /education/schools/<id>/departments/ - departments under a school */
  getSchoolDepartments: (schoolId: string) =>
    apiService.get<Department[]>(`/education/schools/${encodeURIComponent(schoolId)}/departments/`),

  /** GET /education/schools/ - country, education_level, type, institution, search (string IDs) */
  getSchools: (params?: {
    country?: string;
    education_level?: string;
    type?: string;
    institution?: string;
    search?: string;
  }) => {
    const search = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') search.set(k, String(v));
      });
    }
    const q = search.toString();
    return apiService.get<{ pagination?: { count: number }; results?: School[] } | School[]>(
      q ? `/education/schools/?${q}` : '/education/schools/'
    );
  },

  /** GET /education/schools/<school_id>/faculties/ */
  getSchoolFaculties: (schoolId: string) =>
    apiService.get<Faculty[]>(`/education/schools/${encodeURIComponent(schoolId)}/faculties/`),

  /** GET /education/programs/?school=<id>&faculty=<id> (string IDs) */
  getPrograms: (params?: { school?: string; faculty?: string }) => {
    const search = new URLSearchParams();
    if (params?.school) search.set('school', params.school);
    if (params?.faculty) search.set('faculty', params.faculty);
    const q = search.toString();
    return apiService.get<{ pagination?: { count: number }; results?: Program[] } | Program[]>(
      q ? `/education/programs/?${q}` : '/education/programs/'
    );
  },
};
