import { useState, useCallback, useRef } from 'react';
import {
  ExamConfig,
  ExamStateResponse,
  ExamQuestionView,
  SubmitAnswerResponse,
  ExamResultResponse
} from '@shared/types';
import api from '../services/api';

export type ExamStatusLifecycle = 'idle' | 'configuring' | 'loading' | 'in_progress' | 'completed' | 'error';

export interface UseExamReturn {
  status: ExamStatusLifecycle;
  examState: ExamStateResponse | null;
  currentQuestion: ExamQuestionView | null;
  currentQuestionIndex: number;
  error: string | null;
  lastFeedback: SubmitAnswerResponse | null;
  createExam: (config: ExamConfig) => Promise<string | null>;
  startExam: (examId: string) => Promise<boolean>;
  loadExamSession: (examId: string) => Promise<boolean>;
  loadQuestion: (index: number) => Promise<boolean>;
  submitAnswer: (selectedOptionIds: string[]) => Promise<SubmitAnswerResponse | null>;
  completeExam: () => Promise<ExamResultResponse | null>;
  resetExam: () => void;
}

export const useExam = (initialExamId?: string): UseExamReturn => {
  const [status, setStatus] = useState<ExamStatusLifecycle>('idle');
  const [examState, setExamState] = useState<ExamStateResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ExamQuestionView | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<SubmitAnswerResponse | null>(null);

  const activeExamIdRef = useRef<string | null>(initialExamId || null);

  const loadQuestion = useCallback(async (index: number): Promise<boolean> => {
    const examId = activeExamIdRef.current;
    if (!examId) return false;

    setStatus('loading');
    setError(null);
    try {
      const res = await api.getExamQuestion(examId, index);
      if (res.success && res.data) {
        setCurrentQuestion(res.data);
        setCurrentQuestionIndex(index);
        setStatus('in_progress');
        return true;
      } else {
        setError(res.error || 'Failed to load question');
        setStatus('error');
        return false;
      }
    } catch (e: any) {
      setError(e.message || 'An error occurred while loading question');
      setStatus('error');
      return false;
    }
  }, []);

  const startExam = useCallback(async (examId: string): Promise<boolean> => {
    activeExamIdRef.current = examId;
    setStatus('loading');
    setError(null);

    try {
      const res = await api.startExam(examId);
      if (res.success && res.data) {
        setExamState(res.data);
        const questionIdx = res.data.currentQuestionIndex || 0;
        setCurrentQuestionIndex(questionIdx);
        // Load the question
        const qRes = await api.getExamQuestion(examId, questionIdx);
        if (qRes.success && qRes.data) {
          setCurrentQuestion(qRes.data);
          setStatus('in_progress');
          return true;
        } else {
          setError(qRes.error || 'Failed to load first question');
          setStatus('error');
          return false;
        }
      } else {
        setError(res.error || 'Failed to start exam');
        setStatus('error');
        return false;
      }
    } catch (e: any) {
      setError(e.message || 'Error starting exam');
      setStatus('error');
      return false;
    }
  }, []);

  const loadExamSession = useCallback(async (examId: string): Promise<boolean> => {
    activeExamIdRef.current = examId;
    setStatus('loading');
    setError(null);

    try {
      const res = await api.getExamState(examId);
      if (res.success && res.data) {
        setExamState(res.data);
        if (res.data.status === 'completed' || res.data.status === 'expired') {
          setStatus('completed');
          return true;
        }

        const idx = res.data.currentQuestionIndex || 0;
        setCurrentQuestionIndex(idx);
        const qRes = await api.getExamQuestion(examId, idx);
        if (qRes.success && qRes.data) {
          setCurrentQuestion(qRes.data);
          setStatus('in_progress');
          return true;
        } else {
          setError(qRes.error || 'Failed to recover active question');
          setStatus('error');
          return false;
        }
      } else {
        // Exam might not have started yet; attempt startExam
        return await startExam(examId);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to recover exam session');
      setStatus('error');
      return false;
    }
  }, [startExam]);

  const createExam = useCallback(async (config: ExamConfig): Promise<string | null> => {
    setStatus('loading');
    setError(null);
    try {
      const res = await api.createExam(config);
      if (res.success && res.data) {
        activeExamIdRef.current = res.data.examId;
        return res.data.examId;
      } else {
        setError(res.error || 'Failed to create exam');
        setStatus('error');
        return null;
      }
    } catch (e: any) {
      setError(e.message || 'Failed to create exam configuration');
      setStatus('error');
      return null;
    }
  }, []);

  const submitAnswer = useCallback(async (selectedOptionIds: string[]): Promise<SubmitAnswerResponse | null> => {
    const examId = activeExamIdRef.current;
    if (!examId || !currentQuestion) return null;

    setError(null);
    try {
      const res = await api.submitExamAnswer(examId, {
        examQuestionId: currentQuestion.examQuestionId,
        selectedOptionIds,
      });

      if (res.success && res.data) {
        setLastFeedback(res.data);
        // Update exam state progress counter
        setExamState((prev) => prev ? {
          ...prev,
          answeredCount: prev.answeredCount + 1,
          currentQuestionIndex: res.data!.nextQuestionIndex,
        } : null);

        return res.data;
      } else {
        setError(res.error || 'Failed to submit answer');
        return null;
      }
    } catch (e: any) {
      setError(e.message || 'Error submitting answer');
      return null;
    }
  }, [currentQuestion]);

  const completeExam = useCallback(async (): Promise<ExamResultResponse | null> => {
    const examId = activeExamIdRef.current;
    if (!examId) return null;

    setStatus('loading');
    setError(null);
    try {
      const res = await api.completeExam(examId);
      if (res.success && res.data) {
        setStatus('completed');
        return res.data;
      } else {
        setError(res.error || 'Failed to finalize exam');
        setStatus('error');
        return null;
      }
    } catch (e: any) {
      setError(e.message || 'Failed to complete exam');
      setStatus('error');
      return null;
    }
  }, []);

  const resetExam = useCallback(() => {
    activeExamIdRef.current = null;
    setExamState(null);
    setCurrentQuestion(null);
    setCurrentQuestionIndex(0);
    setStatus('idle');
    setError(null);
    setLastFeedback(null);
  }, []);

  return {
    status,
    examState,
    currentQuestion,
    currentQuestionIndex,
    error,
    lastFeedback,
    createExam,
    startExam,
    loadExamSession,
    loadQuestion,
    submitAnswer,
    completeExam,
    resetExam,
  };
};

export default useExam;
