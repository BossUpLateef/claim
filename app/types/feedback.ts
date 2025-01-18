export interface Feedback {
  id: string;
  type: 'positive' | 'negative';
  text: string;
  timestamp: number;
  context: {
    state: string;
    deniedItem: string;
    carrierReason: string;
  };
} 