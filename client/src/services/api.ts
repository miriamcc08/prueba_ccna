import {
  ApiResponse,
  ExamConfig,
  ExamStateResponse,
  ExamQuestionView,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  ExamResultResponse,
  ReviewQuestionItem,
  ExamHistoryItem,
  QuestionListItem,
  QuestionDetail,
  TopicWithCount,
  QuestionImportItem,
  ImportResult,
  ValidationStatus,
  UserRole
} from '@shared/types';

export type QuestionDraftInput = Omit<QuestionImportItem, 'primaryTopicExamArea' | 'sourceName'> & {
  primaryTopicId: string;
  validationStatus?: 'draft' | 'pending_review';
};

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const TOKEN_KEY = 'ccna_token';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  public setToken(token: string | null) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      console.error('Failed to update auth token', e);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          error: data?.error || data?.message || `Request failed with status ${response.status}`,
          message: data?.message,
        };
      }

      if (data && typeof data === 'object' && 'success' in data) {
        return data as ApiResponse<T>;
      }

      return {
        success: true,
        data: data as T,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Network error or server unreachable',
      };
    }
  }

  public get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // --- Auth Endpoints ---
  public login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/users/login', { email, password });
  }

  public register(email: string, username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/users/register', { email, username, password });
  }

  public getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    return this.get<AuthUser>('/users/me');
  }

  // --- Exam Endpoints ---
  public getExamAvailability(config: ExamConfig): Promise<ApiResponse<{ available: number }>> {
    return this.post('/exams/availability', config);
  }

  public createExam(config: ExamConfig): Promise<ApiResponse<{ examId: string }>> {
    return this.post<{ examId: string }>('/exams', config);
  }

  public changeStudyTopic(examId: string, topicId: string, questionCount: number): Promise<ApiResponse<ExamStateResponse>> {
    return this.post(`/exams/${examId}/change-study-topic`, { topicId, questionCount });
  }

  public restartStudyExercise(examId: string, examQuestionId: string): Promise<ApiResponse<ExamStateResponse>> {
    return this.post(`/exams/${examId}/restart-exercise`, { examQuestionId });
  }

  public startExam(examId: string): Promise<ApiResponse<ExamStateResponse>> {
    return this.post<ExamStateResponse>(`/exams/${examId}/start`);
  }

  public getExamState(examId: string): Promise<ApiResponse<ExamStateResponse>> {
    return this.get<ExamStateResponse>(`/exams/${examId}`);
  }

  public clearExamHistory(): Promise<ApiResponse<unknown>> {
    return this.delete('/users/me/history');
  }

  public getExamQuestion(examId: string, index: number): Promise<ApiResponse<ExamQuestionView>> {
    return this.get<ExamQuestionView>(`/exams/${examId}/question?index=${index}`);
  }

  public submitExamAnswer(examId: string, data: SubmitAnswerRequest): Promise<ApiResponse<SubmitAnswerResponse>> {
    return this.post<SubmitAnswerResponse>(`/exams/${examId}/answer`, data);
  }

  public completeExam(examId: string): Promise<ApiResponse<ExamResultResponse>> {
    return this.post<ExamResultResponse>(`/exams/${examId}/complete`);
  }

  public getExamResults(examId: string): Promise<ApiResponse<ExamResultResponse>> {
    return this.get<ExamResultResponse>(`/exams/${examId}/results`);
  }

  public getExamReview(examId: string): Promise<ApiResponse<ReviewQuestionItem[]>> {
    return this.get<ReviewQuestionItem[]>(`/exams/${examId}/review`);
  }

  public getExamHistory(): Promise<ApiResponse<ExamHistoryItem[]>> {
    return this.get<ExamHistoryItem[]>('/exams/history');
  }

  // --- Topics Endpoints ---
  public getTopics(): Promise<ApiResponse<TopicWithCount[]>> {
    return this.get<TopicWithCount[]>('/topics');
  }

  // --- Questions Bank Endpoints ---
  public getQuestions(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    topic?: string;
    difficulty?: string;
    type?: string;
    status?: string;
    language?: string;
    favoritesOnly?: boolean;
  }): Promise<ApiResponse<QuestionListItem[]>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') {
          query.set(k === 'type' ? 'questionType' : k === 'status' ? 'validationStatus' : k, String(v));
        }
      });
    }
    const qs = query.toString();
    return this.get<QuestionListItem[]>(`/questions${qs ? `?${qs}` : ''}`);
  }

  public getQuestionDetail(id: string): Promise<ApiResponse<QuestionDetail>> {
    return this.get<QuestionDetail>(`/questions/${id}`);
  }

  public getLearningProfile(language: string): Promise<ApiResponse<import('@shared/types').LearningProfile>> {
    return this.get(`/users/me/learning-profile?language=${encodeURIComponent(language)}`);
  }

  public getFavorites(): Promise<ApiResponse<string[]>> {
    return this.get<string[]>('/users/me/favorites');
  }

  public setFavorite(id: string, favorite: boolean): Promise<ApiResponse<{ favorite: boolean }>> {
    return favorite ? this.put(`/questions/${id}/favorite`) : this.delete(`/questions/${id}/favorite`);
  }

  // --- Admin Endpoints ---
  public createQuestion(question: QuestionDraftInput): Promise<ApiResponse<QuestionDetail>> {
    return this.post('/questions', question);
  }

  public validateQuestion(id: string): Promise<ApiResponse<{ valid: boolean; answerValidation: { valid: boolean; errors: string[] }; subnetValidation: { valid: boolean; errors: string[] } | null }>> {
    return this.post(`/questions/${id}/validate`);
  }

  public importQuestions(questions: QuestionImportItem[]): Promise<ApiResponse<ImportResult>> {
    return this.post<ImportResult>('/questions/import', { questions });
  }

  public createQuestionRevision(id: string, changes: Partial<QuestionDetail>): Promise<ApiResponse<QuestionDetail>> {
    return this.post(`/questions/${id}/revisions`, changes);
  }

  public updateQuestionStatus(id: string, status: ValidationStatus, notes: string, evidenceUrl?: string): Promise<ApiResponse<QuestionDetail>> {
    return this.post<QuestionDetail>(`/questions/${id}/review`, { status, notes, evidenceUrl, technicalReviewConfirmed: status === 'validated' });
  }

  public getAdminStats(): Promise<ApiResponse<{
    totalQuestions: number;
    validatedQuestions: number;
    pendingQuestions: number;
    rejectedQuestions: number;
    coverageByArea: Record<string, number>;
  }>> {
    return this.get<{ total: number; byValidationStatus: Record<string, number>; byExamArea: Record<string, number> }>('/questions/stats').then(res => ({
      ...res,
      data: res.data ? {
        totalQuestions: res.data.total,
        validatedQuestions: res.data.byValidationStatus.validated || 0,
        pendingQuestions: (res.data.byValidationStatus.pending_review || 0) + (res.data.byValidationStatus.draft || 0),
        rejectedQuestions: res.data.byValidationStatus.rejected || 0,
        coverageByArea: res.data.byExamArea,
      } : undefined,
    }));
  }
}

export const api = new ApiService();
export default api;
