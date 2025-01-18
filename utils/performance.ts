'use client';

export const measurePerformance = (label: string) => {
  if (process.env.NODE_ENV === 'development') {
    performance.mark(`${label}-start`);
    return () => {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      const measurements = performance.getEntriesByName(label);
      console.log(`${label} took ${measurements[0].duration.toFixed(2)}ms`);
    };
  }
  return () => {};
};

export const usePerformanceTracking = () => {
  const trackRender = (componentName: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered`);
    }
  };

  const trackEffect = (effectName: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Effect ${effectName} ran`);
    }
  };

  return { trackRender, trackEffect };
}; 