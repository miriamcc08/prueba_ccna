import React from 'react';

interface ScoreGaugeProps {
  score?: number;
  percentage: number;
  passed: boolean;
  passingPercentage?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  percentage,
  passed,
  passingPercentage = 82.5,
  size = 200,
  strokeWidth = 14,
  className = '',
}) => {
  const roundedPercentage = Math.round(percentage * 10) / 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference;

  const strokeColor = passed ? '#10b981' : '#ef4444'; // emerald-500 : red-500
  const glowColor = passed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}
      >
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b" // slate-800
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Passing threshold indicator tick */}
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Label Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-mono">
          {roundedPercentage}%
        </span>
        {score !== undefined && (
          <span className="text-xs font-semibold text-slate-400 mt-1">
            {score} / 1000 pts
          </span>
        )}
        <span
          className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-2 ${
            passed
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
              : 'bg-red-950 text-red-400 border border-red-500/40'
          }`}
        >
          {passed ? 'PASS' : 'FAIL'}
        </span>
      </div>
    </div>
  );
};

export default ScoreGauge;
