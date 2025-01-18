import type { RebuttalState } from '../types/rebuttal';
import { commonItems } from '../data/commonItems';

export interface GeneratedRebuttal {
  rebuttalText: string;
  evidence: string[];
  date: Date;
  successful?: boolean;
}

export function generateRebuttal(state: RebuttalState): GeneratedRebuttal {
  const { selectedState, carrier, deniedItem, carrierReason } = state;
  
  // Validate required fields
  if (!selectedState || !deniedItem || !carrierReason) {
    throw new Error('Missing required fields');
  }

  // Get the denial item data
  const denialItem = commonItems[deniedItem];
  if (!denialItem) {
    throw new Error('Invalid denied item selected');
  }

  // Get the specific denial reason
  const denial = denialItem.commonDenials[carrierReason];
  if (!denial) {
    throw new Error('Invalid carrier reason selected');
  }

  // Format carrier name
  const carrierName = carrier || 'The insurance carrier';

  // Generate the rebuttal text
  const rebuttalText = `In response to ${carrierName}'s denial of ${denialItem.name} in ${selectedState}, 
    we respectfully disagree with the stated reason: "${carrierReason.replace(/_/g, ' ')}". 
    ${denial.rebuttal}`;

  return {
    rebuttalText: rebuttalText.trim(),
    evidence: denial.evidence,
    date: new Date(),
    successful: false // Initially set as pending
  };
} 