'use client';

import { useEffect } from 'react';
import { useRebuttal } from '../context/RebuttalContext';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts() {
  const { dispatch } = useRebuttal();

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'n',
      ctrlKey: true,
      action: () => dispatch({ type: 'RESET_FORM' }),
      description: 'New Rebuttal'
    },
    {
      key: 's',
      ctrlKey: true,
      action: () => dispatch({ type: 'UPDATE_FIELD', field: 'showSearch', value: true }),
      description: 'Focus Search'
    },
    {
      key: 'f',
      ctrlKey: true,
      action: () => dispatch({ type: 'UPDATE_FIELD', field: 'showFilters', value: true }),
      description: 'Show Filters'
    },
    {
      key: 'Escape',
      action: () => dispatch({ type: 'UPDATE_FIELD', field: 'showFilters', value: false }),
      description: 'Close Modal/Filters'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(s => 
        s.key === event.key &&
        !!s.ctrlKey === event.ctrlKey &&
        !!s.altKey === event.altKey &&
        !!s.shiftKey === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return shortcuts;
} 