import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReviewQuestionItem } from '@shared/types';
import { useTranslation } from '../i18n/useTranslation';
import api from '../services/api';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BookOpenIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ArrowLeftIcon,
  ShieldIcon,
  AlertTriangleIcon,
} from '../components/Icons';

type FilterType = 'all' | 'incorrect' | 'correct' | 'unanswered';

export const ReviewPage: React.FC = () => {
  const { id: examId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [reviews, setReviews] = useState<ReviewQuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canRestart, setCanRestart] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [restartError, setRestartError] = useState('');

  useEffect(() => {
    let active = true;
    setCanRestart(false); setRestartError('');
    if (examId) api.getExamState(examId).then(result => {
      if (active && result.success && result.data) setCanRestart(result.data.config.studyMode && !result.data.config.strictMode && result.data.status === 'completed');
    });
    return () => { active = false; };
  }, [examId]);

  const [filter, setFilter] = useState<FilterType>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(true);

  useEffect(() => {
    if (!examId) return;

    setLoading(true);
    api.getExamReview(examId)
      .then((res) => {
        if (res.success && res.data) {
          setReviews(res.data);
        } else {
          setError(res.error || 'Failed to load exam review');
        }
      })
      .catch((e: any) => {
        setError(e.message || 'Error fetching review data');
      })
      .finally(() => setLoading(false));
  }, [examId]);

  const filteredQuestions = useMemo(() => {
    switch (filter) {
      case 'incorrect':
        return reviews.filter((q) => !q.isCorrect && q.selectedOptionIds.length > 0);
      case 'correct':
        return reviews.filter((q) => q.isCorrect);
      case 'unanswered':
        return reviews.filter((q) => !q.selectedOptionIds || q.selectedOptionIds.length === 0);
      default:
        return reviews;
    }
  }, [reviews, filter]);

  const currentQuestion: ReviewQuestionItem | undefined = filteredQuestions[currentIndex];

  const incorrectCount = reviews.filter((q) => !q.isCorrect && q.selectedOptionIds.length > 0).length;
  const correctCount = reviews.filter((q) => q.isCorrect).length;
  const unansweredCount = reviews.filter((q) => !q.selectedOptionIds || q.selectedOptionIds.length === 0).length;

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentIndex(0);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-300 font-medium text-sm animate-pulse">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 card text-center space-y-4 border-red-500/50">
        <AlertTriangleIcon size={36} className="text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Review Unavailable</h2>
        <p className="text-red-300 text-sm">{error || 'No review questions found.'}</p>
        <button
          type="button"
          onClick={() => navigate(`/results/${examId}`)}
          className="btn-secondary mx-auto mt-4"
        >
          {t('common.back')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {reviews.some(q => q.historicalContentPreserved === false) && <p role="status" className="card text-amber-200">{t('review.legacyContentWarning')}</p>}
      {restartError && <p role="alert" className="text-red-300">{restartError}</p>}
      {canRestart && currentQuestion && currentQuestion.selectedOptionIds.length > 0 && <div className="card space-y-2">
        <p className="text-sm text-slate-400">{t('study.restartHelp')}</p>
        <button type="button" className="btn-secondary" disabled={restarting} onClick={async () => {
          if (!examId) return;
          setRestarting(true); setRestartError('');
          try {
            const result = await api.restartStudyExercise(examId, currentQuestion.examQuestionId);
            if (result.success && result.data) navigate(`/exam/${result.data.examId}`);
            else setRestartError(result.error || t('study.restartError'));
          } finally { setRestarting(false); }
        }}>{t(restarting ? 'study.restarting' : 'study.restart')}</button>
      </div>}
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate(`/results/${examId}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-2 transition-colors"
          >
            <ArrowLeftIcon size={14} />
            <span>Back to Results</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('review.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('review.subtitle')}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('review.filters.all', { count: reviews.length })}
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange('incorrect')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'incorrect'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('review.filters.incorrect', { count: incorrectCount })}
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange('correct')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'correct'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('review.filters.correct', { count: correctCount })}
          </button>

          <button
            type="button"
            onClick={() => handleFilterChange('unanswered')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'unanswered'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('review.filters.unanswered', { count: unansweredCount })}
          </button>
        </div>
      </div>

      {/* Grid: Question Navigation Sidebar + Active Question Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Jump Numbers Sidebar */}
        <div className="card bg-slate-800/80 p-4 max-h-[70vh] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Questions ({filteredQuestions.length})
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {filteredQuestions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              let statusBorder = 'border-slate-700 bg-slate-900 text-slate-400';

              if (q.isCorrect) {
                statusBorder = isCurrent
                  ? 'border-emerald-400 bg-emerald-950 text-emerald-200 ring-2 ring-emerald-400'
                  : 'border-emerald-600/50 bg-emerald-950/40 text-emerald-300';
              } else if (q.selectedOptionIds && q.selectedOptionIds.length > 0) {
                statusBorder = isCurrent
                  ? 'border-red-400 bg-red-950 text-red-200 ring-2 ring-red-400'
                  : 'border-red-600/50 bg-red-950/40 text-red-300';
              } else {
                statusBorder = isCurrent
                  ? 'border-amber-400 bg-amber-950 text-amber-200 ring-2 ring-amber-400'
                  : 'border-amber-600/50 bg-amber-950/40 text-amber-300';
              }

              return (
                <button
                  key={q.examQuestionId || idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${statusBorder}`}
                >
                  {q.questionNumber}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Review Question Display */}
        <div className="lg:col-span-3 space-y-6">
          {currentQuestion ? (
            <div className="card bg-slate-800/90 border-slate-700/80 p-6 sm:p-8 shadow-2xl">
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-700/60">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-slate-900 border border-slate-700 text-cyan-400">
                    Question {currentQuestion.questionNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase ${
                      currentQuestion.isCorrect
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : currentQuestion.selectedOptionIds.length > 0
                        ? 'bg-red-950 text-red-400 border border-red-500/30'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {currentQuestion.isCorrect
                      ? 'Correct'
                      : currentQuestion.selectedOptionIds.length > 0
                      ? 'Incorrect'
                      : 'Unanswered'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldIcon size={14} className="text-teal-400" />
                    <span>{currentQuestion.topicName}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <ClockIcon size={14} className="text-cyan-400" />
                    <span>{currentQuestion.timeSpentSeconds || 0}s</span>
                  </span>
                </div>
              </div>

              {/* Statement */}
              <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed mb-6 whitespace-pre-wrap">
                {currentQuestion.statement}
              </div>

              {/* Options Breakdown */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((opt) => {
                  const isUserSelection = opt.isSelected;
                  const isCorrectAnswer = opt.isCorrect;

                  let borderClass = 'border-slate-700/70 bg-slate-900/50 text-slate-300';
                  let icon = null;

                  if (isCorrectAnswer) {
                    borderClass =
                      'border-emerald-500 bg-emerald-950/40 text-emerald-100 shadow-sm shadow-emerald-500/10 ring-1 ring-emerald-500/50';
                    icon = <CheckCircleIcon size={20} className="text-emerald-400 flex-shrink-0" />;
                  } else if (isUserSelection && !isCorrectAnswer) {
                    borderClass =
                      'border-red-500 bg-red-950/40 text-red-100 shadow-sm shadow-red-500/10 ring-1 ring-red-500/50';
                    icon = <XCircleIcon size={20} className="text-red-400 flex-shrink-0" />;
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${borderClass}`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span className="font-bold text-slate-300 w-5 text-sm">{opt.label}.</span>
                        <div className="text-sm leading-snug">
                          <div>{opt.text}</div>
                          {opt.explanation && (
                            <div className="text-xs text-slate-400 mt-1 italic">
                              {opt.explanation}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isUserSelection && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300">
                            Your Choice
                          </span>
                        )}
                        {isCorrectAnswer && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300">
                            Correct
                          </span>
                        )}
                        {icon}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rationale & Technical Explanation */}
              <div className="mt-6 border-t border-slate-700/60 pt-5">
                <button
                  type="button"
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center justify-between w-full text-left font-bold text-sm text-cyan-400 hover:text-cyan-300"
                >
                  <span className="flex items-center gap-2">
                    <BookOpenIcon size={18} />
                    <span>{t('review.explanation')}</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    {showExplanation ? 'Hide' : 'Show'}
                  </span>
                </button>

                {showExplanation && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-300 leading-relaxed space-y-3">
                    {currentQuestion.correctAnswerExplanation && (
                      <div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                          Why this is the correct answer:
                        </span>
                        <p>{currentQuestion.correctAnswerExplanation}</p>
                      </div>
                    )}

                    {currentQuestion.explanation && (
                      <div className="pt-2 border-t border-slate-800">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          General Cisco Concept &amp; RFC Reference:
                        </span>
                        <p>{currentQuestion.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="mt-8 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                  className="btn-secondary text-xs disabled:opacity-40"
                >
                  <ChevronLeftIcon size={16} />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-slate-400 font-semibold">
                  {currentIndex + 1} of {filteredQuestions.length}
                </div>

                <button
                  type="button"
                  disabled={currentIndex === filteredQuestions.length - 1}
                  onClick={() => setCurrentIndex((idx) => Math.min(filteredQuestions.length - 1, idx + 1))}
                  className="btn-secondary text-xs disabled:opacity-40"
                >
                  <span>Next</span>
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12 text-slate-400">
              No questions match the current filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
