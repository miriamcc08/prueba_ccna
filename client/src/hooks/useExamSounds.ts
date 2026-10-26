import { useCallback, useEffect, useRef } from 'react';

/** Optional, short feedback tones; visual feedback never depends on audio. */
export function useExamSounds(enabled: boolean) {
  const context = useRef<AudioContext | null>(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  useEffect(() => () => {
    const current = context.current;
    if (current && current.state !== 'closed') void current.close().catch(() => {});
    context.current = null;
  }, []);
  const prepare = useCallback(() => {
    if (!enabledRef.current || !window.AudioContext) return;
    try {
      context.current ||= new AudioContext();
      if (context.current.state === 'suspended') void context.current.resume().catch(() => {});
    } catch { /* An unavailable audio device must not block the exam. */ }
  }, []);
  const play = useCallback((frequency = 440) => {
    const current = context.current;
    if (!enabledRef.current || !current || current.state === 'closed') return;
    const emit = () => {
      if (!enabledRef.current || current.state !== 'running') return;
      try {
        const oscillator = current.createOscillator(), gain = current.createGain();
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.06, current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, current.currentTime + 0.14);
        oscillator.connect(gain); gain.connect(current.destination);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        oscillator.start(); oscillator.stop(current.currentTime + 0.15);
      } catch { /* Keep the visual confirmation available when sound is blocked. */ }
    };
    if (current.state === 'suspended') void current.resume().then(emit).catch(() => {});
    else emit();
  }, []);
  return { prepare, play };
}
