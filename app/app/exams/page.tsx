'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, FileText, Loader2, School, Globe, Building2, Layers, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExamCard } from '@/components/exams/exam-card';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchExams, fetchMyEnrollments } from '@/lib/store/slices/exams.slice';
import { selectExamsList, selectExamEnrollments, selectExamsLoading } from '@/lib/store/slices/exams.slice';
import { useAuth } from '@/lib/hooks/useAuth';
import { educationService } from '@/lib/services';
import type { Institution as InstitutionType, School as SchoolType, Department as DepartmentType } from '@/lib/services/education.service';
import { COUNTRIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function ExamsPage() {
  const dispatch = useAppDispatch();
  const list = useAppSelector(selectExamsList) as Record<string, unknown>[];
  const enrollments = useAppSelector(selectExamEnrollments) as { exam?: string; exam_id?: string }[];
  const isLoading = useAppSelector(selectExamsLoading);
  const { isAuthenticated, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [countryId, setCountryId] = useState<string>('');
  const [institutions, setInstitutions] = useState<InstitutionType[]>([]);
  const [institutionId, setInstitutionId] = useState<string>('');
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [schoolId, setSchoolId] = useState<string>('');
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [departmentId, setDepartmentId] = useState<string>('');
  const [dropdownsLoading, setDropdownsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load institutions when country changes
  useEffect(() => {
    if (!countryId) {
      setInstitutions([]);
      setInstitutionId('');
      setSchools([]);
      setSchoolId('');
      setDepartments([]);
      setDepartmentId('');
      return;
    }
    setDropdownsLoading(true);
    educationService
      .getInstitutions({ country: countryId })
      .then((data) => {
        const arr = Array.isArray(data) ? data : (data as { results?: InstitutionType[] })?.results ?? [];
        setInstitutions(arr);
        setInstitutionId('');
        setSchools([]);
        setSchoolId('');
        setDepartments([]);
        setDepartmentId('');
      })
      .catch(() => {
        setInstitutions([]);
        setInstitutionId('');
      })
      .finally(() => setDropdownsLoading(false));
  }, [countryId]);

  // Load schools: by institution if selected, else by country
  useEffect(() => {
    if (!countryId) return;
    setDropdownsLoading(true);
    if (institutionId) {
      educationService
        .getInstitutionSchools(institutionId)
        .then((data) => {
          const arr = Array.isArray(data) ? data : [];
          setSchools(arr);
          setSchoolId('');
          setDepartments([]);
          setDepartmentId('');
        })
        .catch(() => setSchools([]))
        .finally(() => setDropdownsLoading(false));
    } else {
      educationService
        .getSchools({ country: countryId })
        .then((data) => {
          const arr = Array.isArray(data) ? data : (data as { results?: SchoolType[] })?.results ?? [];
          setSchools(arr);
          setSchoolId('');
          setDepartments([]);
          setDepartmentId('');
        })
        .catch(() => setSchools([]))
        .finally(() => setDropdownsLoading(false));
    }
  }, [countryId, institutionId]);

  // Load departments when school changes
  useEffect(() => {
    if (!schoolId) {
      setDepartments([]);
      setDepartmentId('');
      return;
    }
    setDropdownsLoading(true);
    educationService
      .getSchoolDepartments(schoolId)
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setDepartments(arr);
        setDepartmentId('');
      })
      .catch(() => setDepartments([]))
      .finally(() => setDropdownsLoading(false));
  }, [schoolId]);

  useEffect(() => {
    const params: Record<string, string | boolean | number> = {};
    if (featuredOnly) params.featured = true;
    if (countryId) params.country = countryId;
    if (departmentId) {
      params.department = departmentId;
    } else if (schoolId) {
      params.school = schoolId;
      params.include_global = 1;
    } else if (institutionId) {
      params.institution = institutionId;
    }
    dispatch(fetchExams(Object.keys(params).length ? params : undefined)).catch(() => {});
  }, [dispatch, featuredOnly, countryId, institutionId, schoolId, departmentId]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchMyEnrollments()).catch(() => {});
    }
  }, [dispatch, isAuthenticated, token]);

  const isEnrolled = (examId: string) =>
    enrollments.some((e) => e.exam === examId || e.exam_id === examId);

  const displayExams = useMemo(() => {
    let items = list ?? [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (exam: Record<string, unknown>) =>
          String(exam.title ?? '').toLowerCase().includes(q) ||
          String(exam.description ?? '').toLowerCase().includes(q) ||
          String(exam.exam_board ?? '').toLowerCase().includes(q) ||
          String(exam.exam_code ?? '').toLowerCase().includes(q)
      );
    }
    return items;
  }, [list, searchQuery]);

  const handleRefresh = () => {
    const params: Record<string, string | boolean | number> = {};
    if (featuredOnly) params.featured = true;
    if (countryId) params.country = countryId;
    if (departmentId) params.department = departmentId;
    else if (schoolId) {
      params.school = schoolId;
      params.include_global = 1;
    } else if (institutionId) params.institution = institutionId;
    dispatch(fetchExams(Object.keys(params).length ? params : undefined)).catch(() => {});
  };

  const countryName = COUNTRIES.find((c) => c.id === countryId)?.name ?? '';
  const institutionName = institutions.find((i) => i.id === institutionId)?.name ?? '';
  const schoolName = schools.find((s) => s.id === schoolId)?.name ?? '';
  const departmentName = departments.find((d) => d.id === departmentId)?.name ?? '';
  const selectionParts = [countryName, institutionName, schoolName, departmentName].filter(Boolean);
  const hasSelection = selectionParts.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exams & Assessments</h1>
          <p className="text-gray-500" suppressHydrationWarning>
            {mounted && 'Choose your country and institution to find exams, then enroll and start preparing.'}
          </p>
        </div>
        {hasSelection && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
            Refresh
          </Button>
        )}
      </div>

      {/* Step-by-step flow: Country → Institution → School → Department */}
      <section className="rounded-2xl border-2 border-[#446D6D]/20 bg-[#446D6D]/5 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Find exams by institution</h2>
        <p className="mb-4 text-sm text-gray-600">
          Select your country, then institution (or school), then department to see available exams. Open an exam to view details and enroll.
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-500">Step 1: Country</span>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[#446D6D]" />
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="min-w-[180px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#446D6D] focus:outline-none focus:ring-1 focus:ring-[#446D6D]"
              >
                <option value="">Choose country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {countryId && (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-500">Step 2: Institution</span>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#446D6D]" />
                  <select
                    value={institutionId}
                    onChange={(e) => setInstitutionId(e.target.value)}
                    disabled={dropdownsLoading}
                    className="min-w-[200px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#446D6D] focus:outline-none focus:ring-1 focus:ring-[#446D6D] disabled:opacity-60"
                  >
                    <option value="">All institutions</option>
                    {institutions.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
                {institutions.length === 0 && !dropdownsLoading && (
                  <p className="text-xs text-gray-500">No institutions — use School below</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-500">Step 3: School / Faculty</span>
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-[#446D6D]" />
                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    disabled={dropdownsLoading}
                    className="min-w-[200px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#446D6D] focus:outline-none focus:ring-1 focus:ring-[#446D6D] disabled:opacity-60"
                  >
                    <option value="">{institutionId ? 'All schools' : 'All schools'}</option>
                    {schools.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {schoolId && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">+ global exams</span>
                  )}
                </div>
              </div>
              {schoolId && departments.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-gray-500">Step 4: Department</span>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#446D6D]" />
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      disabled={dropdownsLoading}
                      className="min-w-[180px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#446D6D] focus:outline-none focus:ring-1 focus:ring-[#446D6D] disabled:opacity-60"
                    >
                      <option value="">All departments</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </>
          )}
          <label className="flex items-center gap-2 text-sm text-gray-600 ml-2">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="rounded border-gray-300 text-[#446D6D] focus:ring-[#446D6D]"
            />
            Featured only
          </label>
        </div>
        {hasSelection && (
          <div className="mt-4 flex flex-wrap items-center gap-1 text-sm text-gray-600">
            <span className="font-medium text-gray-700">Your selection:</span>
            {selectionParts.map((part, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
                <span>{part}</span>
              </span>
            ))}
          </div>
        )}
      </section>

      {!countryId && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
          <Globe className="mx-auto mb-4 h-14 w-14 text-gray-300" />
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Choose your country</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Select a country above to see institutions and schools, then browse exams and enroll.
          </p>
        </div>
      )}

      {countryId && (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {hasSelection ? 'Exams for your selection' : 'Exams'}
            </h3>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {isLoading && displayExams.length === 0 ? (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border-2 border-gray-200 bg-white">
              <Loader2 className="h-10 w-10 animate-spin text-[#446D6D]" />
            </div>
          ) : displayExams.length === 0 ? (
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <h2 className="mb-2 text-lg font-semibold text-gray-900">No exams found</h2>
              <p className="text-gray-500">
                {searchQuery
                  ? 'Try adjusting your search.'
                  : 'No exams for this selection. Try another institution, school, or department.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayExams.map((exam: Record<string, unknown>) => (
                <ExamCard
                  key={String(exam.id)}
                  exam={{
                    id: String(exam.id),
                    slug: exam.slug as string | undefined,
                    title: exam.title as string,
                    description: exam.description as string | undefined,
                    exam_type: exam.exam_type as string | undefined,
                    exam_board: exam.exam_board as string | undefined,
                    exam_code: exam.exam_code as string | undefined,
                    price: exam.price as string | undefined,
                    currency: exam.currency as string | undefined,
                    is_free: exam.is_free as boolean | undefined,
                    exam_date: exam.exam_date as string | undefined,
                    enrollment_count: exam.enrollment_count as number | undefined,
                    course_count: (exam.courses_count ?? exam.course_count) as number | undefined,
                    courses_count: exam.courses_count as number | undefined,
                    mock_exam_count: (exam.mock_exams_count ?? exam.mock_exam_count) as number | undefined,
                    mock_exams_count: exam.mock_exams_count as number | undefined,
                    past_paper_count: (exam.past_papers_count ?? exam.past_paper_count) as number | undefined,
                    past_papers_count: exam.past_papers_count as number | undefined,
                    thumbnail: exam.thumbnail as string | null | undefined,
                    featured: exam.featured as boolean | undefined,
                  }}
                  isEnrolled={isEnrolled(String(exam.id))}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
