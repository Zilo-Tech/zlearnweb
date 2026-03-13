/**
 * Exam package state - @docs/EXAMS_USER_API.md
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examsService } from '@/lib/services/exams.service';

interface ExamsState {
  /** List of exams from GET /exams/ */
  list: unknown[];
  /** Current exam detail from GET /exams/<id>/ */
  currentExam: unknown | null;
  /** My enrollments from GET /exams/enrollments/my/ */
  enrollments: unknown[];
  /** Current in-progress mock attempt (after start) */
  currentAttempt: unknown | null;
  /** Mock exams for current exam */
  mockExams: unknown[];
  /** Results from GET mock-exam-attempts/my/ or single attempt result */
  results: unknown[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ExamsState = {
  list: [],
  currentExam: null,
  enrollments: [],
  currentAttempt: null,
  mockExams: [],
  results: [],
  isLoading: false,
  error: null,
};

function toArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const obj = data as { results?: unknown[] };
  return obj?.results ?? [];
}
function toPagination(data: unknown): { count: number; results: unknown[] } {
  const arr = toArray(data);
  const obj = data as { pagination?: { count?: number } };
  return { count: obj?.pagination?.count ?? arr.length, results: arr };
}

export const fetchExams = createAsyncThunk(
  'exams/fetchList',
  async (params?: Record<string, string | boolean | number>) => {
    const data = await examsService.getExams(params);
    return toPagination(data).results;
  }
);

export const fetchExamDetails = createAsyncThunk(
  'exams/fetchDetails',
  async (slugOrId: string) => examsService.getExamDetails(slugOrId)
);

export const fetchMyEnrollments = createAsyncThunk(
  'exams/fetchEnrollments',
  async (status?: string) => {
    const data = await examsService.getMyEnrollments(status);
    return toArray(data);
  }
);

export const enrollInExam = createAsyncThunk(
  'exams/enroll',
  async (
    arg: { examId: string; payment_method?: string; payment_reference?: string },
    { dispatch }
  ) => {
    await examsService.enrollInExam(arg.examId, {
      payment_method: arg.payment_method,
      payment_reference: arg.payment_reference,
    });
    dispatch(fetchExamDetails(arg.examId));
    dispatch(fetchMyEnrollments());
    return arg.examId;
  }
);

export const fetchMockExams = createAsyncThunk(
  'exams/fetchMockExams',
  async (examId: string) => {
    const data = await examsService.getMockExams(examId);
    return Array.isArray(data) ? data : (data as { results?: unknown[] })?.results ?? [];
  }
);

export const startMockAttempt = createAsyncThunk(
  'exams/startMockAttempt',
  async (mockExamId: string) => examsService.startMockExamAttempt(mockExamId)
);

export const submitMockAttempt = createAsyncThunk(
  'exams/submitMockAttempt',
  async (
    { attemptId, answers }: { attemptId: string; answers: Record<string, string> },
    { dispatch }
  ) => {
    const result = await examsService.submitMockExamAttempt(attemptId, answers);
    dispatch(fetchMyEnrollments());
    return result;
  }
);

export const fetchMyAttempts = createAsyncThunk(
  'exams/fetchMyAttempts',
  async (examId?: string) => {
    const data = await examsService.getMyAttempts(examId);
    return toArray(data);
  }
);

export const fetchAttemptDetails = createAsyncThunk(
  'exams/fetchAttemptDetails',
  async (attemptId: string) => examsService.getAttemptDetails(attemptId)
);

export const completeExamLesson = createAsyncThunk(
  'exams/completeLesson',
  async (
    { lessonId, timeSpentMinutes }: { lessonId: string; timeSpentMinutes?: number },
    { getState, dispatch }
  ) => {
    await examsService.completeLesson(lessonId, {
      time_spent_minutes: timeSpentMinutes,
    });
    const state = getState() as { exams: { currentExam: { id?: string } | null } };
    const examId = state.exams.currentExam?.id;
    if (examId) dispatch(fetchMyEnrollments());
    return lessonId;
  }
);

export const fetchExamResults = createAsyncThunk(
  'exams/fetchResults',
  async (examId?: string) => {
    const data = await examsService.getMyAttempts(examId);
    return toArray(data);
  }
);

const examsSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    clearCurrentExam: (state) => {
      state.currentExam = null;
      state.mockExams = [];
    },
    clearCurrentAttempt: (state) => {
      state.currentAttempt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.list = action.payload ?? [];
        state.isLoading = false;
      })
      .addCase(fetchExams.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to load exams';
        state.isLoading = false;
      })
      .addCase(fetchExamDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExamDetails.fulfilled, (state, action) => {
        state.currentExam = action.payload as unknown;
        state.isLoading = false;
      })
      .addCase(fetchExamDetails.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to load exam';
        state.isLoading = false;
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.enrollments = action.payload ?? [];
      })
      .addCase(fetchMockExams.fulfilled, (state, action) => {
        state.mockExams = action.payload ?? [];
      })
      .addCase(startMockAttempt.fulfilled, (state, action) => {
        state.currentAttempt = action.payload as unknown;
      })
      .addCase(startMockAttempt.rejected, (state) => {
        state.currentAttempt = null;
      })
      .addCase(submitMockAttempt.fulfilled, (state, action) => {
        state.currentAttempt = null;
        state.results = [action.payload as unknown];
      })
      .addCase(fetchMyAttempts.fulfilled, (state, action) => {
        state.results = action.payload ?? [];
      })
      .addCase(fetchAttemptDetails.fulfilled, (state, action) => {
        state.results = [action.payload as unknown];
      });
  },
});

export const { clearCurrentExam, clearCurrentAttempt } = examsSlice.actions;

export const selectExamsList = (state: { exams: ExamsState }) => state.exams.list;
export const selectCurrentExam = (state: { exams: ExamsState }) => state.exams.currentExam;
export const selectExamEnrollments = (state: { exams: ExamsState }) => state.exams.enrollments;
export const selectCurrentAttempt = (state: { exams: ExamsState }) => state.exams.currentAttempt;
export const selectMockExams = (state: { exams: ExamsState }) => state.exams.mockExams;
export const selectExamResults = (state: { exams: ExamsState }) => state.exams.results;
export const selectExamsLoading = (state: { exams: ExamsState }) => state.exams.isLoading;
export const selectExamsError = (state: { exams: ExamsState }) => state.exams.error;

/** Check if user is enrolled in exam (by exam id) */
export function selectIsEnrolledInExam(examId: string) {
  return (state: { exams: ExamsState }) =>
    (state.exams.enrollments as { exam?: string; exam_id?: string }[]).some(
      (e) => e.exam === examId || e.exam_id === examId
    );
}

export default examsSlice.reducer;
