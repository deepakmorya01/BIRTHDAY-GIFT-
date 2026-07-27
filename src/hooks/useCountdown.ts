import { useEffect, useState, useCallback, useRef } from 'react';

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
  isPast: boolean;
}

export function useCountdown(targetDate: string): CountdownState & { reset: () => void } {
  const targetMs = new Date(targetDate).getTime();

  const compute = useCallback((): CountdownState => {
    const now = Date.now();
    const diff = targetMs - now;
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true, isPast: true };
    }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      isComplete: false,
      isPast: false,
    };
  }, [targetMs]);

  const [state, setState] = useState<CountdownState>(compute);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setState(compute());
    intervalRef.current = setInterval(() => setState(compute()), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [compute]);

  const reset = useCallback(() => setState(compute()), [compute]);
  return { ...state, reset };
}
