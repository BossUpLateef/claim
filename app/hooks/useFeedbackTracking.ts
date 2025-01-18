import { useLocalStorage } from '../utils/useLocalStorage';
import { getCurrentTimestamp } from '../utils/date';
import type { Feedback } from '../types/feedback';

export const useFeedbackTracking = () => {
  const [feedbacks, setFeedbacks] = useLocalStorage<Feedback[]>('feedbacks', []);

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'timestamp'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: crypto.randomUUID(),
      timestamp: getCurrentTimestamp()
    };

    setFeedbacks(prev => [...prev, newFeedback]);
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  return { 
    feedbacks: feedbacks.sort((a, b) => b.timestamp - a.timestamp), 
    addFeedback, 
    deleteFeedback 
  };
}; 