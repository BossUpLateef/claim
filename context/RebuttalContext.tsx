'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface RebuttalState {
  selectedState: string;
  carrier: string;
  deniedItem: string;
  carrierReason: string;
  selectedManufacturer: string;
  showTechnicalSpecs: boolean;
  searchTerm: string;
  filters: {
    state: string;
    carrier: string;
    deniedItem: string;
  };
  successfulRebuttals: any[];
  isLoading: boolean;
  error: string | null;
}

type RebuttalAction =
  | { type: 'UPDATE_FIELD'; field: keyof RebuttalState; value: any }
  | { type: 'ADD_REBUTTAL'; rebuttal: any }
  | { type: 'SET_LOADING'; value: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET_FORM' };

const initialState: RebuttalState = {
  selectedState: '',
  carrier: '',
  deniedItem: '',
  carrierReason: '',
  selectedManufacturer: '',
  showTechnicalSpecs: false,
  searchTerm: '',
  filters: {
    state: '',
    carrier: '',
    deniedItem: ''
  },
  successfulRebuttals: [],
  isLoading: false,
  error: null
};

const RebuttalContext = createContext<{
  state: RebuttalState;
  dispatch: React.Dispatch<RebuttalAction>;
} | null>(null);

function rebuttalReducer(state: RebuttalState, action: RebuttalAction): RebuttalState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value
      };
    case 'ADD_REBUTTAL':
      return {
        ...state,
        successfulRebuttals: [...state.successfulRebuttals, action.rebuttal]
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.value
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.error
      };
    case 'RESET_FORM':
      return {
        ...initialState,
        successfulRebuttals: state.successfulRebuttals // Preserve rebuttals when resetting form
      };
    default:
      return state;
  }
}

export function RebuttalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(rebuttalReducer, initialState);

  return (
    <RebuttalContext.Provider value={{ state, dispatch }}>
      {children}
    </RebuttalContext.Provider>
  );
}

export function useRebuttal() {
  const context = useContext(RebuttalContext);
  if (!context) {
    throw new Error('useRebuttal must be used within a RebuttalProvider');
  }
  return context;
} 