'use client';

import React from 'react';

interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ value: string; label: string; }>;
}

export const AccessibleSelect = ({ 
  label, 
  id, 
  error, 
  options,
  ...props 
}: AccessibleSelectProps) => (
  <div className="form-control w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={id}
      aria-label={label}
      aria-invalid={!!error}
      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
        error ? 'border-red-500' : ''
      }`}
      {...props}
    >
      <option value="">Select {label}</option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
    {error && (
      <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
        {error}
      </p>
    )}
  </div>
); 