'use client';

import React from 'react';
import { useRebuttal } from '../context/RebuttalContext';
import { AccessibleSelect } from './AccessibleSelect';

interface FilterOption {
  value: string;
  label: string;
}

export function AdvancedFilters() {
  const { state, dispatch } = useRebuttal();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const uniqueStates = [...new Set(state.successfulRebuttals.map(r => r.state))];
  const uniqueCarriers = [...new Set(state.successfulRebuttals.map(r => r.carrier))];
  const uniqueDeniedItems = [...new Set(state.successfulRebuttals.map(r => r.deniedItem))];

  const handleFilterChange = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'filters',
      value: { ...state.filters, [field]: value }
    });
  };

  const clearFilters = () => {
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'filters',
      value: { state: '', carrier: '', deniedItem: '' }
    });
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center text-blue-600 hover:text-blue-800"
      >
        {isExpanded ? 'Hide' : 'Show'} Advanced Filters
      </button>

      {isExpanded && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <AccessibleSelect
            label="Filter by State"
            id="state-filter"
            value={state.filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            options={uniqueStates.map(state => ({ value: state, label: state }))}
          />

          <AccessibleSelect
            label="Filter by Carrier"
            id="carrier-filter"
            value={state.filters.carrier}
            onChange={(e) => handleFilterChange('carrier', e.target.value)}
            options={uniqueCarriers.map(carrier => ({ value: carrier, label: carrier }))}
          />

          <AccessibleSelect
            label="Filter by Denied Item"
            id="denied-item-filter"
            value={state.filters.deniedItem}
            onChange={(e) => handleFilterChange('deniedItem', e.target.value)}
            options={uniqueDeniedItems.map(item => ({ value: item, label: item }))}
          />

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
} 