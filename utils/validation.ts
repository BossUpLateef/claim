import { RebuttalFormState } from '../types';

export const validateForm = (state: RebuttalFormState) => {
  const errors: Partial<Record<keyof RebuttalFormState, string>> = {};
  
  if (!state.selectedState) {
    errors.selectedState = 'State is required';
  }
  if (!state.carrier) {
    errors.carrier = 'Carrier is required';
  }
  if (!state.deniedItem) {
    errors.deniedItem = 'Denied item is required';
  }
  if (!state.carrierReason) {
    errors.carrierReason = 'Carrier reason is required';
  }
  
  return errors;
}; 