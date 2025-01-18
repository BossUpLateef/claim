'use client';

import { useState } from 'react';
import { Card } from './Card';

export function RebuttalGenerator() {
  const [state, setState] = useState({
    selectedState: '',
    carrier: '',
    deniedItem: '',
    carrierReason: '',
    selectedManufacturer: '',
    showTechnicalSpecs: false
  });

  const updateState = (updates: Partial<typeof state>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const validate = () => {
    // Add validation logic here
    if (!state.selectedState || !state.deniedItem || !state.carrierReason) {
      return false;
    }
    return true;
  };

  return (
    <Card title="Roofing Code Rebuttal Generator" className="w-full max-w-4xl mx-auto mt-8">
      <div className="space-y-4">
        {/* State Selection */}
        <div className="form-group">
          <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="state-select"
            name="state"
            value={state.selectedState}
            onChange={(e) => updateState({ selectedState: e.target.value })}
            className="w-full p-2 border rounded focus:border-blue-500"
          >
            <option value="">Select State</option>
            {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'].map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* Carrier Selection */}
        <div className="form-group">
          <label htmlFor="carrier-select" className="block text-sm font-medium text-gray-700 mb-1">
            Insurance Carrier
          </label>
          <select
            id="carrier-select"
            name="carrier"
            value={state.carrier}
            onChange={(e) => updateState({ carrier: e.target.value })}
            className="w-full p-2 border rounded focus:border-blue-500"
          >
            <option value="">Select Carrier</option>
            {/* Add carrier options */}
          </select>
        </div>

        {/* Denied Item Selection */}
        <div className="form-group">
          <label htmlFor="denied-item-select" className="block text-sm font-medium text-gray-700 mb-1">
            Denied Item
          </label>
          <select
            id="denied-item-select"
            name="deniedItem"
            value={state.deniedItem}
            onChange={(e) => updateState({ deniedItem: e.target.value })}
            className="w-full p-2 border rounded focus:border-blue-500"
          >
            <option value="">Select Denied Item</option>
            {/* Add denied item options */}
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => validate()}
          disabled={!state.selectedState || !state.deniedItem || !state.carrierReason}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Rebuttal
        </button>
      </div>
    </Card>
  );
} 