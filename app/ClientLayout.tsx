'use client';

import { RebuttalProvider } from '../context/RebuttalContext';
import { ErrorBoundaryWrapper } from '../components/ErrorBoundaryWrapper';

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundaryWrapper
      onError={(error, errorInfo) => {
        console.error('Error caught by root layout:', error, errorInfo);
      }}
    >
      <RebuttalProvider>
        {children}
      </RebuttalProvider>
    </ErrorBoundaryWrapper>
  );
} 