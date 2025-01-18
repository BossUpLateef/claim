'use client';

import { useCallback } from 'react';
import { useRebuttal } from '../context/RebuttalContext';
import { validateForm } from '../utils/validation';
import { trackRebuttalGeneration } from '../utils/analytics';

export function useRebuttalActions() {
  const { state, dispatch } = useRebuttal();

  const updateField = useCallback((field: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  }, [dispatch]);

  const generateRebuttal = useCallback(async () => {
    const errors = validateForm(state);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERROR', error: 'Please fill in all required fields' });
      return null;
    }

    dispatch({ type: 'SET_LOADING', value: true });
    try {
      // Your existing rebuttal generation logic here
      const rebuttalData = {
        // ... generate rebuttal data
      };

      trackRebuttalGeneration(rebuttalData);
      dispatch({ type: 'ADD_REBUTTAL', rebuttal: rebuttalData });
      return rebuttalData;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', error: 'Failed to generate rebuttal' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', value: false });
    }
  }, [state, dispatch]);

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, [dispatch]);

  return {
    updateField,
    generateRebuttal,
    resetForm,
    isLoading: state.isLoading,
    error: state.error
  };
} 