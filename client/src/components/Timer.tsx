import React from 'react';
import { useTimer } from '../hooks/useTimer';
import { ClockIcon, AlertTriangleIcon } from './Icons';

interface TimerProps {
  expiresAt?: string | null;
  onExpire?: () => void;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ expiresAt, onExpire, className = '' }) => {
  const { formatted, timeRemaining, isWarning, isCritical } = useTimer({
    expiresAt,
    onExpire,
    warningThresholdSeconds: 300, // 5 minutes
  });

  // Color logic:
  // Green when > 10 min (> 600s)
  // Yellow when < 5 min (< 300s)
  // Red when < 1 min (< 60s)
  // Neutral cyan when between 5 and 10 min
  let colorClasses = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
  let iconClass = 'text-emerald-400';

  if (timeRemaining <= 60) {
    colorClasses = 'text-red-400 bg-red-950/60 border-red-500/60 animate-pulse-fast';
    iconClass = 'text-red-400';
  } else if (timeRemaining <= 300) {
    colorClasses = 'text-amber-400 bg-amber-950/50 border-amber-500/50 animate-pulse';
    iconClass = 'text-amber-400';
  } else if (timeRemaining <= 600) {
    colorClasses = 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40';
    iconClass = 'text-cyan-400';
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-sm sm:text-base font-semibold tracking-wider shadow-sm transition-all duration-300 ${colorClasses} ${className}`}
    >
      {isCritical ? (
        <AlertTriangleIcon size={18} className={iconClass} />
      ) : (
        <ClockIcon size={18} className={iconClass} />
      )}
      <span>{formatted}</span>
    </div>
  );
};

export default Timer;
