import { useState, useCallback } from 'react';

export interface RebuttalState {
  selectedState: string;
  carrier: string;
  deniedItem: string;
  carrierReason: string;
  selectedManufacturer?: string;
  showTechnicalSpecs?: boolean;
}

export function useFormValidation(state: RebuttalState) {
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validate = useCallback(() => {
    const newErrors: {[key: string]: string} = {};

    if (!state.selectedState) {
      newErrors.selectedState = "State is required";
    }

    if (!state.deniedItem) {
      newErrors.deniedItem = "Denied item must be selected";
    }

    if (shouldShowManufacturer(state.deniedItem) && !state.selectedManufacturer) {
      newErrors.selectedManufacturer = "Manufacturer must be selected for this item";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [state]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validate, clearErrors };
}

// Helper function to determine if manufacturer selection is required
function shouldShowManufacturer(deniedItem: string): boolean {
  const manufacturerRequiredItems = [
    'starter_strip',
    'ice_and_water',
    'underlayment',
    'ridge_vent'
  ];
  return manufacturerRequiredItems.includes(deniedItem);
} 