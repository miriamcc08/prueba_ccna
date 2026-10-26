import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExamResultResponse } from '@shared/types';
import { useTranslation } from '../i18n/useTranslation';
import api from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import TopicChart from '../components/TopicChart';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  AwardIcon,
  BookOpenIcon,
  RefreshIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  HomeIcon,
} from '../components/Icons';

export const ResultsPage: React.FC = () => {
  const { id: examId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const l = (es: string, en: string) => language === 'es' ? es : en;

  const [results, setResults] = useState<ExamResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) return;

    setLoading(true);
    api.getExamResults(examId)
      .then((res) => {
        if (res.success && res.data) {
          setResults(res.data);
        } else {
          setError(res.error || 'Failed to load exam results');
        }
      })
      .catch((e: any) => {
        setError(e.message || 'Error fetching exam results');
      })
      .finally(() => setLoading(false));
  }, [examId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-300 font-medium text-sm animate-pulse">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="max-w-md mx-auto my-12 card text-center space-y-4 border-red-500/50">
        <AlertTriangleIcon size={36} className="text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Results Error</h2>
        <p className="text-red-300 text-sm">{error || 'Results not found.'}</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-secondary mx-auto mt-4"
        >
          {t('results.actions.home')}
        </button>
      </div>
    );
  }

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Status Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border text-center relative overflow-hidden backdrop-blur-md shadow-2xl ${
        results.passed
          ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500/40'
          : 'bg-gradient-to-b from-red-950/60 to-slate-900 border-red-500/40'
      }`}>
        <div className="max-w-2xl mx-auto space-y-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest ${
            results.passed
              ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/50'
              : 'bg-red-900/80 text-red-300 border border-red-500/50'
          }`}>
            {results.passed ? <CheckCircleIcon size={16} /> : <XCircleIcon size={16} />}
            <span>{results.passed ? t('results.passed') : t('results.failed')}</span>
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('results.title')}
          </h1>

          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            {t('results.simulatorDisclaimer')}
          </p>
        </div>
      </div>

      {/* Top Grid: Gauge + Statistics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Gauge Card */}
        <div className="card flex flex-col items-center justify-center p-8 bg-slate-800/90 text-center">
          <ScoreGauge
            score={results.score}
            percentage={results.percentage}
            passed={results.passed}
            passingPercentage={results.passingPercentage}
            size={220}
          />
          <div className="mt-4 text-xs text-slate-400 font-medium">
            {t('results.passingScore')}
          </div>
        </div>

        {/* 2x2 Metric Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="card border-slate-700/60 bg-slate-800/70 p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400">{t('results.summary.correct')}</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-2">
              {results.correctCount}
            </div>
            <span className="text-xs text-slate-500 mt-1">
              of {results.totalQuestions} questions
            </span>
          </div>

          <div className="card border-slate-700/60 bg-slate-800/70 p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400">{t('results.summary.incorrect')}</span>
            <div className="text-3xl font-extrabold text-red-400 font-mono mt-2">
              {results.incorrectCount}
            </div>
            <span className="text-xs text-slate-500 mt-1">
              mistakes recorded
            </span>
          </div>

          <div className="card border-slate-700/60 bg-slate-800/70 p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400">{t('results.summary.unanswered')}</span>
            <div className="text-3xl font-extrabold text-slate-400 font-mono mt-2">
              {results.unansweredCount}
            </div>
            <span className="text-xs text-slate-500 mt-1">
              timed out or skipped
            </span>
          </div>

          <div className="card border-slate-700/60 bg-slate-800/70 p-5 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-400">{t('results.summary.totalTime')}</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-2">
              {formatSeconds(results.totalTimeSeconds)}
            </div>
            <span className="text-xs text-slate-500 mt-1">
              exam duration
            </span>
          </div>

          <div className="card border-slate-700/60 bg-slate-800/70 p-5 flex flex-col justify-between col-span-2 sm:col-span-2">
            <span className="text-xs font-semibold text-slate-400">{t('results.summary.avgTime')}</span>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono mt-2">
              {results.averageTimePerQuestion}s
            </div>
            <span className="text-xs text-slate-500 mt-1">
              recommended target: &le; 72s per question
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-2">
        <button
          type="button"
          onClick={() => navigate(`/review/${examId}`)}
          className="btn-primary px-6 py-3 text-sm font-bold shadow-lg"
        >
          <BookOpenIcon size={18} />
          <span>{t('results.actions.review')}</span>
        </button>

        <button
          type="button"
          onClick={() => navigate(`/config?mode=${results.mode}`)}
          className="btn-secondary px-5 py-3 text-sm font-semibold"
        >
          <RefreshIcon size={18} />
          <span>{t('results.actions.retry')}</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/config')}
          className="btn-secondary px-5 py-3 text-sm font-semibold"
        >
          <span>{t('results.actions.new')}</span>
          <ArrowRightIcon size={16} />
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-secondary px-5 py-3 text-sm font-semibold"
        >
          <span>{t('results.actions.home')}</span>
        </button>
      </div>

      {/* Domain Breakdown Chart */}
      {results.topicBreakdown && results.topicBreakdown.length > 0 && (
        <section className="card">
          <h2 className="text-lg font-bold text-white mb-2">
            {t('results.domains')}
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            {t('results.simulatorDisclaimer')}
          </p>
          <TopicChart data={results.topicBreakdown} />
        </section>
      )}

      {results.difficultyBreakdown?.length > 0 && <section className="card">
        <h2 className="text-lg font-bold text-white mb-3">{l('Rendimiento por dificultad', 'Performance by difficulty')}</h2>
        <p className="text-xs text-slate-400 mb-4">{l('Sin acierto incluye respuestas incorrectas y preguntas no respondidas.', 'Not correct includes incorrect answers and unanswered questions.')}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left" aria-label={l('Rendimiento por dificultad', 'Performance by difficulty')}>
            <thead><tr>{[l('Dificultad', 'Difficulty'), l('Preguntas', 'Questions'), l('Aciertos', 'Correct'), l('Sin acierto', 'Not correct'), l('Porcentaje', 'Percentage')].map(label => <th key={label} scope="col" className="p-2">{label}</th>)}</tr></thead>
            <tbody>{results.difficultyBreakdown.map(item => <tr key={item.difficulty} className="border-t border-slate-700">
              <th scope="row" className="p-2">{({ basic: l('Básica', 'Basic'), intermediate: l('Intermedia', 'Intermediate'), advanced: l('Avanzada', 'Advanced'), mixed: l('Mixta', 'Mixed') })[item.difficulty]}</th>
              <td className="p-2">{item.total}</td><td className="p-2">{item.correct}</td><td className="p-2">{item.total - item.correct}</td><td className="p-2">{item.percentage}%</td>
            </tr>)}</tbody>
          </table>
        </div>
      </section>}

      {/* Recommendations & Adaptive Advice */}
      {results.recommendations && results.recommendations.length > 0 && (
        <section className="card space-y-4">
          <h2 className="text-lg font-bold text-white">
            {t('results.recommendations')}
          </h2>

          <div className="space-y-3">
            {results.recommendations.map((rec, idx) => {
              const isHigh = rec.priority === 'high';
              const isMedium = rec.priority === 'medium';
              const badgeClass = isHigh
                ? 'bg-red-950 text-red-400 border-red-500/40'
                : isMedium
                ? 'bg-amber-950 text-amber-400 border-amber-500/40'
                : 'bg-emerald-950 text-emerald-400 border-emerald-500/40';

              const message = language === 'es' && rec.messageEs ? rec.messageEs : rec.message;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/70 flex items-start gap-4"
                >
                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase border flex-shrink-0 mt-0.5 ${badgeClass}`}>
                    {rec.priority}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{rec.areaName}</div>
                    <div className="text-xs text-slate-300 mt-1 leading-relaxed">{message}</div>
                    {rec.suggestedTopics && rec.suggestedTopics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {rec.suggestedTopics.map((topic, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[11px] font-medium border border-slate-700"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResultsPage;
