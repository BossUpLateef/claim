'use client';

import { useState, useCallback } from 'react';
import { apiHandler, ApiError } from '../utils/apiHandler';
import { useRebuttal } from '../context/RebuttalContext';

export function useApi<T>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useRebuttal();

  const handleRequest = useCallback(async (
    requestFn: () => Promise<{ data: T | null; error: string | null; status: number }>,
    successMessage?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await requestFn();

      if (response.error) {
        setError(response.error);
        dispatch({
          type: 'SET_ERROR',
          error: response.error
        });
        return null;
      }

      if (successMessage) {
        dispatch({
          type: 'UPDATE_FIELD',
          field: 'announcement',
          value: { message: successMessage, assertive: true }
        });
      }

      return response.data;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : 'An unexpected error occurred';
      
      setError(errorMessage);
      dispatch({
        type: 'SET_ERROR',
        error: errorMessage
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  return {
    isLoading,
    error,
    handleRequest
  };
} 