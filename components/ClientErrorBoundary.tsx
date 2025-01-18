'use client';

import React from 'react';
import { ErrorBoundaryWrapper } from './ErrorBoundaryWrapper';

export function ClientErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryWrapper
      onError={(error, errorInfo) => {
        console.error('Error caught:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundaryWrapper>
  );
} 