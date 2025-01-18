'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  rebuttals: any[];
}

export function ExportButton({ rebuttals }: ExportButtonProps) {
  const handleExport = () => {
    const content = JSON.stringify(rebuttals, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rebuttals-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      <Download className="mr-2" size={18} />
      Export All Rebuttals
    </button>
  );
} 