import StudyTopicPractice from '../components/StudyTopicPractice';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamSounds } from '../hooks/useExamSounds';
import { useExam } from '../hooks/useExam';
import { useTranslation } from '../i18n/useTranslation';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
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
  const { t, language } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteError, setFavoriteError] = useState('');
  useEffect(() => {
    if (isAuthenticated) api.getFavorites().then(res => { if (res.success && res.data) setFavorites(res.data); });
  }, [isAuthenticated]);

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
    resetExam,
  } = useExam(examId);

  const sounds = useExamSounds(examState?.config.soundEnabled ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [restartError, setRestartError] = useState('');
  const [restarting, setRestarting] = useState(false);
  const [showTopicPractice, setShowTopicPractice] = useState(false);
  useEffect(() => { setShowTopicPractice(false); }, [examId]);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showTimeWarningModal, setShowTimeWarningModal] = useState(false);
  const hasWarnedTimeRef = useRef(false);

  // Initial load or session recovery
  useEffect(() => {
    if (examId) {
      loadExamSession(examId);
    }
  }, [examId, loadExamSession]);

  useEffect(() => {
    if (status === 'completed' && examId) navigate(`/results/${examId}`, { replace: true });
  }, [status, examId, navigate]);

  // Handle timer expiration
  const handleTimeExpire = useCallback(async () => {
    if (status === 'completed') return;
    const result = await completeExam();
    if (result && examId) navigate(`/results/${examId}`);
  }, [status, completeExam, examId, navigate]);

  // Check throughout the countdown, including after returning to the tab.
  useEffect(() => {
    hasWarnedTimeRef.current = false;
    if (!examState?.expiresAt) return;
    const checkWarning = () => {
      const remainingSecs = Math.ceil((new Date(examState.expiresAt!).getTime() - Date.now()) / 1000);
      if (!hasWarnedTimeRef.current && remainingSecs > 0 && remainingSecs <= 300) {
        hasWarnedTimeRef.current = true;
        setShowTimeWarningModal(true);
        sounds.play(880);
      }
    };
    checkWarning();
    const interval = window.setInterval(checkWarning, 1000);
    document.addEventListener('visibilitychange', checkWarning);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', checkWarning);
    };
  }, [examId, examState?.expiresAt, sounds.play]);

  // Poll only once the saved deadline has elapsed. The server decides whether to advance.
  useEffect(() => {
    if (!examId || !examState?.questionExpiresAt || status === 'completed') return;
    let disposed = false, inFlight = false;
    const deadline = new Date(examState.questionExpiresAt).getTime();
    const reconcile = async () => {
      if (disposed || inFlight || isSubmitting || restarting || Date.now() < deadline) return;
      inFlight = true;
      try { await loadExamSession(examId); } finally { inFlight = false; }
    };
    const interval = window.setInterval(() => { void reconcile(); }, 1000);
    document.addEventListener('visibilitychange', reconcile);
    return () => { disposed = true; window.clearInterval(interval); document.removeEventListener('visibilitychange', reconcile); };
  }, [examId, examState?.questionExpiresAt, status === 'completed', isSubmitting, restarting, loadExamSession]);

  const handleConfirmAnswer = async (selectedOptionIds: string[]) => {
    if (!examId || isSubmitting) return false;

    sounds.prepare();
    setIsSubmitting(true);
    try {
      const res = await submitAnswer(selectedOptionIds);
      if (!res) {
        setIsSubmitting(false);
        return false;
      }

      const isStudyMode = examState?.config?.studyMode;
      sounds.play(isStudyMode ? res.isCorrect ? 660 : 220 : 440);
      const totalQuestions = examState?.totalQuestions || currentQuestion?.totalQuestions || 0;

      // In strict mode or normal simulation mode, automatically transition to next
      if (!isStudyMode) {
        if (res.nextQuestionIndex >= totalQuestions) {
          // All questions answered, finalize exam
          const result = await completeExam();
          if (result) navigate(`/results/${examId}`);
        } else {
          // Load next question
          await loadQuestion(res.nextQuestionIndex);
        }
      }
      // In study mode, feedback remains on screen until user clicks "Next Question"
      return true;
    } catch (e) {
      console.error('Error submitting answer', e);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudyNextQuestion = async () => {
    if (!examState && !currentQuestion) return;
    const nextIdx = currentQuestionIndex + 1;
    const totalQuestions = examState?.totalQuestions || currentQuestion?.totalQuestions || 0;

    if (nextIdx >= totalQuestions) {
      const result = await completeExam();
      if (result && examId) navigate(`/results/${examId}`);
    } else {
      await loadQuestion(nextIdx);
    }
  };

  const handleFinishExamEarly = async () => {
    setShowFinishModal(false);
    setIsSubmitting(true);
    try {
      const result = await completeExam();
      if (result && examId) navigate(`/results/${examId}`);
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
                {t('study.simulatorTitle')}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>{t('study.mode')}: {t(`config.mode.${examState?.config?.mode || 'custom'}`)}</span>
                <span>•</span>
                <span className={isStrictMode ? 'text-amber-400' : 'text-teal-400'}>
                  {t(isStrictMode ? 'study.strictMode' : 'study.studyMode')}
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
              disabled={isSubmitting || status === 'loading'}
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

      {examState?.questionExpiresAt && <div className="card flex flex-wrap gap-3 items-center" role="group" aria-label={t('study.questionTimer')}>
        <span>{t('study.questionTimer')}</span><Timer key={examState.questionExpiresAt} expiresAt={examState.questionExpiresAt} />
        <p className="text-sm text-slate-400">{t('study.questionTimerHelp')}</p>
      </div>}
      {error && <p role="alert" className="text-red-300">{error}</p>}
      {restartError && <p role="alert" className="text-red-300">{restartError}</p>}

      {isStudyMode && lastFeedback?.confirmed && <p className="text-sm text-slate-400">{t('study.restartHelp')}</p>}
      {isStudyMode && <div className="flex flex-wrap gap-3 items-center">
        <button type="button" className="btn-secondary" disabled={restarting || isSubmitting || status === 'loading'} onClick={() => setShowTopicPractice(value => !value)}>{language === 'es' ? 'Cambiar de tema' : 'Change topic'}</button>
        <button className="btn-secondary" disabled={currentQuestionIndex === 0 || isSubmitting || status === 'loading'} onClick={() => loadQuestion(currentQuestionIndex - 1)}>{t('study.previous')}</button>
        {examState?.config.untimed && <span>{t('study.untimed')}</span>}
        {lastFeedback?.confirmed && <button type="button" className="btn-secondary" disabled={restarting || isSubmitting || status === 'loading'} onClick={async () => {
          if (!examId || !currentQuestion) return;
          setRestarting(true); setRestartError('');
          try {
            const result = await api.restartStudyExercise(examId, currentQuestion.examQuestionId);
            if (result.success && result.data) { resetExam(); navigate(`/exam/${result.data.examId}`); }
            else setRestartError(result.error || t('study.restartError'));
          } finally { setRestarting(false); }
        }}>{t(restarting ? 'study.restarting' : 'study.restart')}</button>}
        {examState?.config.practiceSourceExamId && <button type="button" className="btn-secondary" disabled={restarting || isSubmitting} onClick={() => { const sourceId = examState.config.practiceSourceExamId!; resetExam(); navigate(`/exam/${sourceId}`); }}>{t('study.returnToSource')}</button>}

        {isAuthenticated && currentQuestion && <button className="btn-secondary" onClick={async () => {
          const id = currentQuestion.id;
          const favorite = !favorites.includes(id);
          const res = await api.setFavorite(id, favorite);
          if (res.success) { setFavorites(prev => favorite ? [...prev, id] : prev.filter(q => q !== id)); setFavoriteError(''); }
          else setFavoriteError(res.error || t('study.favoriteError'));
        }}>{t(favorites.includes(currentQuestion.id) ? 'study.removeFavorite' : 'study.saveFavorite')}</button>}
        {favoriteError && <p role="alert">{favoriteError}</p>}
      </div>}
      {isStudyMode && showTopicPractice && examId && examState && <StudyTopicPractice examId={examId} config={examState.config} onCreated={id => { resetExam(); navigate(`/exam/${id}`); }} />}
      {/* Question Card Component */}
      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          onConfirm={handleConfirmAnswer}
          mode={isStudyMode ? 'study' : 'strict'}
          isSubmitting={isSubmitting}
          studyFeedback={lastFeedback}
          showExplanations={examState?.config.showExplanations ?? true}
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
