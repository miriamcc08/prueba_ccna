import React from 'react';

interface ProgressBarProps {
  current: number; // 1-based index
  total: number;
  answeredCount?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  answeredCount,
  className = '',
}) => {
  const safeTotal = Math.max(1, total);
  const effectiveAnswered = answeredCount !== undefined ? answeredCount : Math.max(0, current - 1);
  const answeredPercentage = Math.min(100, Math.max(0, (effectiveAnswered / safeTotal) * 100));
  const currentPercentage = Math.min(100 - answeredPercentage, Math.max(0, (1 / safeTotal) * 100));

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold">{effectiveAnswered}</span>
          <span>of</span>
          <span className="text-slate-200">{safeTotal}</span>
          <span>answered</span>
        </div>
        <div className="text-slate-400 font-mono">
          {Math.round((effectiveAnswered / safeTotal) * 100)}%
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700/60 p-[1px]">
        {/* Answered segment */}
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-300"
          style={{ width: `${answeredPercentage}%` }}
        />
        {/* Active question indicator */}
        <div
          className="h-full bg-amber-400 opacity-90 rounded-full transition-all duration-300 ml-0.5"
          style={{ width: `${currentPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
