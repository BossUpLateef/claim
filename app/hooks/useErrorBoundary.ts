import { useState, useCallback } from 'react';

export interface ErrorState {
  error: Error | null;
  componentStack?: string;
  eventId?: string;
  context?: Record<string, unknown>;
}

export function useErrorBoundary() {
  const [errorState, setErrorState] = useState<ErrorState>({ error: null });

  const handleError = useCallback((error: Error, componentStack?: string, context?: Record<string, unknown>) => {
    console.error('Unhandled error:', error);
    
    // Generate unique error ID for tracking
    const eventId = generateErrorId();
    
    // Log to error tracking service
    logErrorToService(error, {
      eventId,
      componentStack,
      context,
      timestamp: new Date().toISOString()
    });

    setErrorState({
      error,
      componentStack,
      eventId,
      context
    });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({ error: null });
  }, []);

  const addErrorContext = useCallback((context: Record<string, unknown>) => {
    setErrorState(current => ({
      ...current,
      context: { ...current.context, ...context }
    }));
  }, []);

  return {
    errorState,
    handleError,
    clearError,
    addErrorContext
  };
}

// Helper functions
function generateErrorId(): string {
  return `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function logErrorToService(error: Error, metadata: Record<string, unknown>) {
  // TODO: Implement actual error logging service
  // This is a placeholder for actual error logging implementation
  console.group('Error Logging');
  console.error('Error:', error);
  console.info('Metadata:', metadata);
  console.groupEnd();
} 