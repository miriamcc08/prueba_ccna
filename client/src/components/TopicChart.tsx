import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from 'recharts';
import { TopicResultItem, EXAM_AREA_LABELS } from '@shared/types';
import { useTranslation } from '../i18n/useTranslation';

interface TopicChartProps {
  data: TopicResultItem[];
  className?: string;
}

export const TopicChart: React.FC<TopicChartProps> = ({ data, className = '' }) => {
  const { language, t } = useTranslation();

  // Prepare data with localized area names if matching ExamArea
  const chartData = data.map((item) => {
    let displayName = item.topicName;
    if (item.examArea && EXAM_AREA_LABELS[item.examArea]) {
      displayName = EXAM_AREA_LABELS[item.examArea][language] || item.topicName;
    }

    return {
      name: displayName,
      percentage: Math.round(item.percentage),
      correct: item.correct,
      total: item.total,
    };
  });

  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return '#10b981'; // Green (emerald-500)
    if (percentage >= 60) return '#f59e0b'; // Yellow (amber-500)
    return '#ef4444'; // Red (red-500)
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-bold text-white text-sm">{dataPoint.name}</div>
          <div className="text-cyan-400 font-semibold text-base">{dataPoint.percentage}% Accuracy</div>
          <div className="text-slate-400">
            {dataPoint.correct} / {dataPoint.total} questions correct
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800 ${className}`}>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              unit="%"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={82.5} stroke="#06b6d4" strokeDasharray="3 3" label={{ value: t('results.passingScore'), fill: '#06b6d4', fontSize: 10, position: 'top' }} />
            <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={18}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
          <span>&ge; 80% (Mastered)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
          <span>60% - 79% (Review)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-500 inline-block" />
          <span>&lt; 60% (Needs Work)</span>
        </div>
      </div>
    </div>
  );
};

export default TopicChart;
