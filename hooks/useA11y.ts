'use client';

import { useCallback } from 'react';
import { useRebuttal } from '../context/RebuttalContext';

export function useA11y() {
  const { state, dispatch } = useRebuttal();

  const announce = useCallback((message: string, assertive = false) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'announcement',
      value: { message, assertive }
    });
  }, [dispatch]);

  const handleTabbing = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
    }
  }, []);

  const handleMouseDown = useCallback(() => {
    document.body.classList.remove('user-is-tabbing');
  }, []);

  return {
    announce,
    handleTabbing,
    handleMouseDown,
    announcement: state.announcement
  };
} 