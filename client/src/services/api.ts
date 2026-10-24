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
    return this.post<AuthResponse>('/auth/login', { email, password });
  }

  public register(email: string, username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.post<AuthResponse>('/auth/register', { email, username, password });
  }

  public getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    return this.get<AuthUser>('/auth/me');
  }

  // --- Exam Endpoints ---
  public createExam(config: ExamConfig): Promise<ApiResponse<{ examId: string }>> {
    return this.post<{ examId: string }>('/exams', config);
  }

  public startExam(examId: string): Promise<ApiResponse<ExamStateResponse>> {
    return this.post<ExamStateResponse>(`/exams/${examId}/start`);
  }

  public getExamState(examId: string): Promise<ApiResponse<ExamStateResponse>> {
    return this.get<ExamStateResponse>(`/exams/${examId}/state`);
  }

  public getExamQuestion(examId: string, index: number): Promise<ApiResponse<ExamQuestionView>> {
    return this.get<ExamQuestionView>(`/exams/${examId}/question/${index}`);
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
  }): Promise<ApiResponse<QuestionListItem[]>> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') {
          query.set(k, String(v));
        }
      });
    }
    const qs = query.toString();
    return this.get<QuestionListItem[]>(`/questions${qs ? `?${qs}` : ''}`);
  }

  public getQuestionDetail(id: string): Promise<ApiResponse<QuestionDetail>> {
    return this.get<QuestionDetail>(`/questions/${id}`);
  }

  // --- Admin Endpoints ---
  public importQuestions(questions: QuestionImportItem[]): Promise<ApiResponse<ImportResult>> {
    return this.post<ImportResult>('/admin/import', { questions });
  }

  public updateQuestionStatus(id: string, status: ValidationStatus): Promise<ApiResponse<QuestionDetail>> {
    return this.put<QuestionDetail>(`/admin/questions/${id}/status`, { status });
  }

  public getAdminStats(): Promise<ApiResponse<{
    totalQuestions: number;
    validatedQuestions: number;
    pendingQuestions: number;
    rejectedQuestions: number;
    coverageByArea: Record<string, number>;
  }>> {
    return this.get('/admin/stats');
  }
}

export const api = new ApiService();
export default api;
