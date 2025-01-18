'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackProps {
  context: {
    state: string;
    deniedItem: string;
    carrierReason: string;
  };
}

export function FeedbackComponent({ context }: FeedbackProps) {
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', {
      type: feedbackType,
      text: feedbackText,
      context
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mt-4 p-4 bg-green-50 rounded">
        <p className="text-green-700">Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded">
      <h3 className="font-bold mb-2">Was this rebuttal helpful?</h3>
      
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setFeedbackType('positive')}
          className={`flex items-center px-4 py-2 rounded ${
            feedbackType === 'positive'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <ThumbsUp className="mr-2" size={18} />
          Yes
        </button>
        
        <button
          onClick={() => setFeedbackType('negative')}
          className={`flex items-center px-4 py-2 rounded ${
            feedbackType === 'negative'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <ThumbsDown className="mr-2" size={18} />
          No
        </button>
      </div>

      {feedbackType && (
        <>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Additional comments (optional)"
            className="w-full p-2 border rounded mb-4"
            rows={3}
          />
          
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Feedback
          </button>
        </>
      )}
    </div>
  );
} 