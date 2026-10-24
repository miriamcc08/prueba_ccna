import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseTimerProps {
  expiresAt?: string | null;
  onExpire?: () => void;
  warningThresholdSeconds?: number; // Defaults to 300 (5 minutes)
}

export interface UseTimerReturn {
  minutes: number;
  seconds: number;
  hours: number;
  timeRemaining: number; // total seconds remaining
  isWarning: boolean; // < 5 minutes
  isCritical: boolean; // < 1 minute
  isExpired: boolean;
  formatted: string;
}

export const useTimer = ({
  expiresAt,
  onExpire,
  warningThresholdSeconds = 300,
}: UseTimerProps): UseTimerReturn => {
  const calculateRemaining = useCallback((): number => {
    if (!expiresAt) return 0;
    const target = new Date(expiresAt).getTime();
    if (isNaN(target)) return 0;
    const now = Date.now();
    return Math.max(0, Math.floor((target - now) / 1000));
  }, [expiresAt]);

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateRemaining);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const hasExpiredRef = useRef(false);

  useEffect(() => {
    // Reset expiration state when expiresAt changes
    hasExpiredRef.current = false;
    setTimeRemaining(calculateRemaining());
  }, [expiresAt, calculateRemaining]);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const remaining = calculateRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          if (onExpireRef.current) {
            onExpireRef.current();
          }
        }
      }
    };

    // Run tick immediately
    tick();

    // Use interval for clean 1-second countdown
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt, calculateRemaining]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;
  const isExpired = timeRemaining <= 0;
  const isWarning = timeRemaining > 0 && timeRemaining <= warningThresholdSeconds;
  const isCritical = timeRemaining > 0 && timeRemaining <= 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;

  return {
    hours,
    minutes,
    seconds,
    timeRemaining,
    isWarning,
    isCritical,
    isExpired,
    formatted,
  };
};

export default useTimer;
