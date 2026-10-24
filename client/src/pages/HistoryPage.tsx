import React, { useEffect, useState, useMemo } from 'react';
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [history, setHistory] = useState<ExamHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedModeFilter, setSelectedModeFilter] = useState<string>('all');

  useEffect(() => {
    setLoading(true);
    api.getExamHistory()
      .then((res) => {
        if (res.success && res.data) {
          setHistory(res.data);
        } else {
          setError(res.error || 'Failed to load exam history');
        }
      })
      .catch((e: any) => {
        setError(e.message || 'Error fetching exam history');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredHistory = useMemo(() => {
    if (selectedModeFilter === 'all') return history;
    return history.filter((h) => h.mode === selectedModeFilter);
  }, [history, selectedModeFilter]);

  // Data for the score trend chart (in chronological order)
  const chartData = useMemo(() => {
    return [...filteredHistory]
      .reverse()
      .map((item, idx) => ({
        attempt: `Exam #${idx + 1}`,
        date: new Date(item.date).toLocaleDateString(),
        score: Math.round(item.percentage),
        questions: item.questionCount,
        mode: item.mode,
      }));
  }, [filteredHistory]);

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
          <div className="text-cyan-400 font-semibold text-base">{data.score}% Accuracy</div>
          <div className="text-slate-400 capitalize">Mode: {data.mode} ({data.questions} Qs)</div>
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

        <button
          type="button"
          onClick={() => navigate('/config')}
          className="btn-primary text-xs"
        >
          <PlayIcon size={16} />
          <span>{t('nav.config')}</span>
        </button>
      </div>

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
                <ReferenceLine y={82.5} stroke="#06b6d4" strokeDasharray="4 4" label={{ value: 'Passing (82.5%)', fill: '#06b6d4', fontSize: 10, position: 'insideTopLeft' }} />
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
            Past Exam Sessions ({filteredHistory.length})
          </span>

          {/* Mode Filter */}
          <select
            value={selectedModeFilter}
            onChange={(e) => setSelectedModeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">All Simulation Modes</option>
            <option value="full_simulation">Full Simulation</option>
            <option value="topic_practice">Topic Practice</option>
            <option value="subnetting_practice">Subnetting Drill</option>
            <option value="incorrect_review">Mistake Review</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-700/80">
              <tr>
                <th className="py-3.5 px-4 font-semibold">{t('history.table.date')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('history.table.mode')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('history.table.questions')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('history.table.score')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('history.table.result')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('history.table.time')}</th>
                <th className="py-3.5 px-4 font-semibold text-right">{t('history.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="inline-block animate-spin mr-2">⏳</div>
                    <span>{t('common.loading')}</span>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm">{t('history.empty')}</p>
                    <button
                      type="button"
                      onClick={() => navigate('/config')}
                      className="btn-primary mx-auto mt-4 text-xs"
                    >
                      <span>Start Your First Simulation</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const isPassed = item.percentage >= 82.5;
                  return (
                    <tr key={item.examId} className="hover:bg-slate-700/20 transition-colors">
                      <td className="py-3.5 px-4 text-slate-200 font-medium">
                        {new Date(item.date).toLocaleDateString()}
                        <span className="block text-[10px] text-slate-500">
                          {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize text-slate-300 font-medium">
                          {item.mode.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {item.questionCount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-sm font-mono text-white">
                          {Math.round(item.percentage)}%
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {item.correctCount}/{item.questionCount} correct
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
                          {isPassed ? 'PASS' : 'FAIL'}
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
