'use client';

import { useState } from 'react';

interface RebuttalFormState {
  selectedState: string;
  carrier: string;
  deniedItem: string;
  carrierReason: string;
  selectedManufacturer: string;
  showTechnicalSpecs: boolean;
  searchTerm?: string;
  filters?: {
    state: string;
    carrier: string;
    deniedItem: string;
  };
}

export function useRebuttalForm() {
  const [state, setState] = useState<RebuttalFormState>({
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
    }
  });

  const updateState = (updates: Partial<RebuttalFormState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return { state, updateState };
} 