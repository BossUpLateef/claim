'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { exportFormats, downloadFile } from '../utils/exportUtils';

interface ExportButtonProps {
  data: any[];
  filename?: string;
}

export function ExportButton({ data, filename = 'rebuttals' }: ExportButtonProps) {
  const [showFormats, setShowFormats] = useState(false);

  const handleExport = (format: string) => {
    const content = exportFormats[format].transform(data);
    downloadFile(content, `${filename}-${new Date().toISOString().split('T')[0]}`, format);
    setShowFormats(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFormats(!showFormats)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        <Download className="mr-2" size={18} />
        Export
      </button>
      
      {showFormats && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            {Object.keys(exportFormats).map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Export as {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 