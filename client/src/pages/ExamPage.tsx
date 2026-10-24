import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExam } from '../hooks/useExam';
import { useTranslation } from '../i18n/useTranslation';
import Timer from '../components/Timer';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import {
  AlertTriangleIcon,
  ShieldIcon,
  ClockIcon,
  CheckCircleIcon,
  XIcon,
} from '../components/Icons';

export const ExamPage: React.FC = () => {
  const { id: examId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    status,
    examState,
    currentQuestion,
    currentQuestionIndex,
    error,
    lastFeedback,
    loadExamSession,
    loadQuestion,
    submitAnswer,
    completeExam,
  } = useExam(examId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showTimeWarningModal, setShowTimeWarningModal] = useState(false);
  const hasWarnedTimeRef = useRef(false);

  // Initial load or session recovery
  useEffect(() => {
    if (examId) {
      loadExamSession(examId);
    }
  }, [examId, loadExamSession]);

  // Handle timer expiration
  const handleTimeExpire = useCallback(async () => {
    if (status === 'completed') return;
    try {
      await completeExam();
      if (examId) {
        navigate(`/results/${examId}`);
      }
    } catch {
      if (examId) {
        navigate(`/results/${examId}`);
      }
    }
  }, [status, completeExam, examId, navigate]);

  // Check 5-minute time remaining warning
  useEffect(() => {
    if (examState?.expiresAt && !hasWarnedTimeRef.current) {
      const remainingSecs = Math.floor((new Date(examState.expiresAt).getTime() - Date.now()) / 1000);
      if (remainingSecs > 0 && remainingSecs <= 300) {
        hasWarnedTimeRef.current = true;
        setShowTimeWarningModal(true);
      }
    }
  }, [examState?.expiresAt]);

  const handleConfirmAnswer = async (selectedOptionIds: string[]) => {
    if (!examId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await submitAnswer(selectedOptionIds);
      if (!res) {
        setIsSubmitting(false);
        return;
      }

      const isStudyMode = examState?.config?.studyMode;
      const totalQuestions = examState?.totalQuestions || currentQuestion?.totalQuestions || 0;

      // In strict mode or normal simulation mode, automatically transition to next
      if (!isStudyMode) {
        if (res.nextQuestionIndex >= totalQuestions) {
          // All questions answered, finalize exam
          const result = await completeExam();
          navigate(`/results/${examId}`);
        } else {
          // Load next question
          await loadQuestion(res.nextQuestionIndex);
        }
      }
      // In study mode, feedback remains on screen until user clicks "Next Question"
    } catch (e) {
      console.error('Error submitting answer', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudyNextQuestion = async () => {
    if (!examState && !currentQuestion) return;
    const nextIdx = currentQuestionIndex + 1;
    const totalQuestions = examState?.totalQuestions || currentQuestion?.totalQuestions || 0;

    if (nextIdx >= totalQuestions) {
      await completeExam();
      if (examId) {
        navigate(`/results/${examId}`);
      }
    } else {
      await loadQuestion(nextIdx);
    }
  };

  const handleFinishExamEarly = async () => {
    setShowFinishModal(false);
    setIsSubmitting(true);
    try {
      await completeExam();
      if (examId) {
        navigate(`/results/${examId}`);
      }
    } catch {
      if (examId) {
        navigate(`/results/${examId}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' && !currentQuestion) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-300 font-medium text-sm animate-pulse">
          {t('common.loading')}
        </p>
      </div>
    );
  }

  if (error && !currentQuestion) {
    return (
      <div className="max-w-xl mx-auto my-12 card border-red-500/50 bg-red-950/40 text-center space-y-4">
        <AlertTriangleIcon size={36} className="text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Simulation Error</h2>
        <p className="text-red-200 text-sm">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/config')}
          className="btn-secondary mx-auto mt-4"
        >
          {t('common.back')}
        </button>
      </div>
    );
  }

  const isStrictMode = examState?.config?.strictMode ?? true;
  const isStudyMode = examState?.config?.studyMode ?? false;
  const total = examState?.totalQuestions || currentQuestion?.totalQuestions || 1;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Exam Header with Timer & Progress */}
      <div className="card bg-slate-800/95 border-slate-700/80 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
              <ShieldIcon size={20} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                CCNA 200-301 Official Simulation
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Mode: {examState?.config?.mode || 'Simulation'}</span>
                <span>•</span>
                <span className={isStrictMode ? 'text-amber-400' : 'text-teal-400'}>
                  {isStrictMode ? 'Strict Mode' : 'Study Mode'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Visual Timer */}
            {examState?.expiresAt && (
              <Timer
                expiresAt={examState.expiresAt}
                onExpire={handleTimeExpire}
              />
            )}

            {/* Finish Exam Button */}
            <button
              type="button"
              onClick={() => setShowFinishModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-red-900/60 text-slate-300 hover:text-red-200 border border-slate-600 hover:border-red-500/50 transition-colors"
            >
              {t('exam.finishExam')}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-slate-700/60">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={total}
            answeredCount={examState?.answeredCount}
          />
        </div>
      </div>

      {/* Question Card Component */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          onConfirm={handleConfirmAnswer}
          mode={isStudyMode ? 'study' : 'strict'}
          isSubmitting={isSubmitting}
          studyFeedback={lastFeedback}
          onNext={handleStudyNextQuestion}
          hasNext={currentQuestionIndex + 1 < total}
        />
      )}

      {/* Early Finish Confirmation Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-md w-full border-slate-700 bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangleIcon size={20} className="text-amber-400" />
                <span>{t('exam.confirmFinishModal.title')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XIcon size={18} />
              </button>
            </div>

            <p className="py-4 text-sm text-slate-300 leading-relaxed">
              {t('exam.confirmFinishModal.message')}
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="btn-secondary text-xs"
              >
                {t('exam.confirmFinishModal.cancel')}
              </button>
              <button
                type="button"
                onClick={handleFinishExamEarly}
                className="btn-danger text-xs"
              >
                {t('exam.confirmFinishModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Time Warning Modal (< 5 min) */}
      {showTimeWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="card max-w-md w-full border-amber-500/50 bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <ClockIcon size={22} className="text-amber-400" />
              <h3 className="text-lg font-bold text-amber-300">
                {t('exam.warningTimeModal.title')}
              </h3>
            </div>

            <p className="py-4 text-sm text-slate-300 leading-relaxed">
              {t('exam.warningTimeModal.message')}
            </p>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowTimeWarningModal(false)}
                className="btn-primary text-xs"
              >
                {t('exam.warningTimeModal.understood')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
