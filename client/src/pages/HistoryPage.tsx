import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { ExamHistoryItem, ExamMode } from '@shared/types';
import { useTranslation } from '../i18n/useTranslation';
import api from '../services/api';
import {
  BarChartIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon,
  PlayIcon,
  AlertTriangleIcon,
} from '../components/Icons';

export const HistoryPage: React.FC = () => {
  const { t, language } = useTranslation();
  const l = (es: string, en: string) => language === 'es' ? es : en;
  const navigate = useNavigate();
  const locale = language === 'es' ? 'es-PE' : 'en-US';
  const modes: ExamMode[] = ['full_simulation', 'topic_practice', 'custom', 'incorrect_review', 'subnetting_practice', 'command_practice', 'troubleshooting_practice'];

  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedModeFilter, setSelectedModeFilter] = useState<string>('all');

  const loadHistory = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const response = await api.getExamHistory();
      if (response.success && response.data) setHistory(response.data);
      else setError(language === 'es' ? 'No se pudo cargar el historial.' : 'Unable to load history.');
    } catch {
      setError(language === 'es' ? 'No se pudo cargar el historial.' : 'Unable to load history.');
    } finally { setLoading(false); }
  }, [language]);
  useEffect(() => { void loadHistory(); }, [loadHistory]);

  const filteredHistory = useMemo(() => {
    if (selectedModeFilter === 'all') return history;
    return history.filter((h) => h.mode === selectedModeFilter);
  }, [history, selectedModeFilter]);

  // Data for the score trend chart (in chronological order)
  const chartData = useMemo(() => {
    return [...filteredHistory]
      .reverse()
      .map((item, idx) => ({
        attempt: `${l('Intento', 'Attempt')} #${idx + 1}`,
        date: new Date(item.date).toLocaleDateString(locale),
        score: item.percentage,
        questions: item.questionCount,
        mode: t(`config.mode.${item.mode}`),
      }));
  }, [filteredHistory, language]);

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-bold text-white text-sm">{data.attempt} • {data.date}</div>
          <div className="text-cyan-400 font-semibold text-base">{data.score.toLocaleString(locale, { maximumFractionDigits: 1 })}% {l('de aciertos', 'accuracy')}</div>
          <div className="text-slate-400 capitalize">{l('Modo', 'Mode')}: {data.mode} ({data.questions} {l('preguntas', 'questions')})</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChartIcon className="text-cyan-400" size={28} />
            <span>{t('history.title')}</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {t('history.subtitle')}
          </p>
        </div>

        <button type="button" className="btn-secondary text-xs" disabled={loading || clearing || history.length === 0} onClick={async () => {
          if (!window.confirm(l('¿Borrar todos tus intentos e historial? Esta acción no se puede deshacer.', 'Delete all your attempts and history? This cannot be undone.'))) return;
          setClearing(true); setError(null);
          try {
            const response = await api.clearExamHistory();
            if (response.success) setHistory([]);
            else setError(response.error || l('No se pudo borrar el historial.', 'Unable to clear history.'));
          } finally { setClearing(false); }
        }}>{clearing ? l('Borrando…', 'Deleting…') : l('Borrar mi historial', 'Delete my history')}</button>
        <button
          type="button"
          onClick={() => navigate('/config')}
          className="btn-primary text-xs"
        >
          <PlayIcon size={16} />
          <span>{t('nav.config')}</span>
        </button>
      </div>

      {error && <div role="alert" className="card border-red-500/50 text-red-200 space-y-2">
        <p>{error}</p><button type="button" className="btn-secondary" disabled={loading || clearing} onClick={() => { void loadHistory(); }}>{l('Reintentar', 'Retry')}</button>
      </div>}
      {/* Score Trend Line Chart (if > 1 exam) */}
      {chartData.length > 0 && (
        <div className="card bg-slate-800/90 border-slate-700/80 p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChartIcon size={18} className="text-teal-400" />
            <span>{t('history.scoreTrend')}</span>
          </h2>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} unit="%" />
                <Tooltip content={<CustomChartTooltip />} />
                <ReferenceLine y={82.5} stroke="#06b6d4" strokeDasharray="4 4" label={{ value: t('results.passingScore'), fill: '#06b6d4', fontSize: 10, position: 'insideTopLeft' }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2dd4bf"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#06b6d4' }}
                  activeDot={{ r: 7, fill: '#22d3ee' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filter and Past Exams Table */}
      <div className="card p-0 overflow-hidden bg-slate-800/90 border-slate-700/80 shadow-xl">
        <div className="p-4 border-b border-slate-700/80 bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {l('Intentos anteriores', 'Past attempts')} ({filteredHistory.length})
          </span>

          {/* Mode Filter */}
          <select
            aria-label={l('Filtrar historial por modalidad', 'Filter history by mode')}
            value={selectedModeFilter}
            onChange={(e) => setSelectedModeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">{l('Todas las modalidades', 'All modes')}</option>
            {modes.map(mode => <option key={mode} value={mode}>{t(`config.mode.${mode}`)}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table aria-label={l('Historial de intentos', 'Attempt history')} className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
              <tr>
                <th scope="col" className="py-3.5 px-4 font-semibold">{t('history.table.date')}</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">{t('history.table.mode')}</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">{l('Versión del temario', 'Exam blueprint version')}</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">{t('history.table.questions')}</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">{t('history.table.score')}</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">{t('history.table.result')}</th>
                <th scope="col" className="py-3.5 px-4 font-semibold">{t('history.table.time')}</th>
                <th scope="col" className="py-3.5 px-4 font-semibold text-right">{t('history.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin mr-2">⏳</div>
                    <span>{t('common.loading')}</span>
                  </td>
                </tr>
              ) : error && history.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400">{l('El historial no está disponible. Usa Reintentar para volver a cargarlo.', 'History is unavailable. Use Retry to load it again.')}</td></tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="text-sm">{history.length > 0 ? l('No hay intentos para esta modalidad.', 'No attempts match this mode.') : t('history.empty')}</p>
                    <button
                      type="button"
                      onClick={() => navigate('/config')}
                      className="btn-primary mx-auto mt-4 text-xs"
                    >
                      <span>{l('Configurar una práctica', 'Configure practice')}</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const isPassed = item.percentage >= 82.5;
                  return (
                    <tr key={item.examId} className="hover:bg-slate-700/20 transition-colors">
                      <td className="py-3.5 px-4 text-slate-200 font-medium">
                        {new Date(item.date).toLocaleDateString(locale)}
                        <span className="block text-[10px] text-slate-500">
                          {new Date(item.date).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize text-slate-300 font-medium">
                          {t(`config.mode.${item.mode}`)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono">{item.examVersion || l('No registrada', 'Not recorded')}</span>
                        <span className="block text-[10px] text-slate-400">{item.language.toUpperCase()}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {item.questionCount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-sm font-mono text-white">
                          {item.percentage.toLocaleString(locale, { maximumFractionDigits: 1 })}%
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {item.correctCount}/{item.questionCount} {l('aciertos', 'correct')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            isPassed
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                              : 'bg-red-950 text-red-400 border-red-500/40'
                          }`}
                        >
                          {isPassed ? l('Objetivo alcanzado', 'Target reached') : l('Por reforzar', 'Needs practice')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {formatSeconds(item.totalTimeSeconds)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => navigate(`/results/${item.examId}`)}
                            className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold"
                          >
                            {t('history.viewResults')}
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/review/${item.examId}`)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-400 text-xs font-semibold border border-cyan-500/30"
                          >
                            {t('history.review')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
