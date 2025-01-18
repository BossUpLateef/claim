'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

export function ErrorButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      <RefreshCw size={18} className="mr-2" />
      Refresh Page
    </button>
  );
} 