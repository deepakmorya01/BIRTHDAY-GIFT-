import { useState, useCallback, useRef, useEffect, createContext, useContext } from 'react';

export interface DevModeState {
  active: boolean;
  birthdaySimulated: boolean;
}

export interface DevModeContext extends DevModeState {
  activate: () => void;
  deactivate: () => void;
  enableBirthdaySim: () => void;
  disableBirthdaySim: () => void;
  registerTap: () => void;
}

const DevModeReactContext = createContext<DevModeContext | null>(null);

export function useDevModeProvider(): DevModeContext {
  const [active, setActive] = useState(false);
  const [birthdaySimulated, setBirthdaySimulated] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const registerTap = useCallback(() => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 800);
    if (tapCountRef.current >= 7) {
      tapCountRef.current = 0;
      setActive(true);
    }
  }, []);

  const activate = useCallback(() => setActive(true), []);
  const deactivate = useCallback(() => {
    setActive(false);
    setBirthdaySimulated(false);
  }, []);
  const enableBirthdaySim = useCallback(() => setBirthdaySimulated(true), []);
  const disableBirthdaySim = useCallback(() => setBirthdaySimulated(false), []);

  useEffect(() => {
    return () => { if (tapTimerRef.current) clearTimeout(tapTimerRef.current); };
  }, []);

  return { active, birthdaySimulated, activate, deactivate, enableBirthdaySim, disableBirthdaySim, registerTap };
}

export function useDevMode(): DevModeContext | null {
  return useContext(DevModeReactContext);
}

export { DevModeReactContext };
