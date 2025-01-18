'use client';

import { useMemo, useRef, useEffect } from 'react';

export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
  options: { maxAge?: number; label?: string } = {}
) {
  const { maxAge = 5000, label = 'memo' } = options;
  const value = useMemo(factory, deps);
  const timestamp = useRef(Date.now());
  const cached = useRef(value);

  useEffect(() => {
    const now = Date.now();
    if (now - timestamp.current > maxAge) {
      cached.current = value;
      timestamp.current = now;
      if (process.env.NODE_ENV === 'development') {
        console.log(`${label} cache updated after ${maxAge}ms`);
      }
    }
  }, [value, maxAge, label]);

  return cached.current;
} 