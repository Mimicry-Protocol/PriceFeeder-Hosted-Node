import { useCallback, useEffect, useRef, useState } from 'react';

export function usePolling<T>(cb: () => Promise<T>, ms: number) {
  const [value, setValue] = useState<T | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const executor = useCallback(async () => {
    const result = await cb();
    setValue(result);
  }, [cb]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const looper = () => {
      timeoutRef.current = window.setTimeout(() => {
        executor();
        looper();
      }, ms);
    };

    executor();
    looper();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [executor, ms]);

  return value;
}
