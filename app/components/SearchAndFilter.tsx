'use client';

import React from 'react';

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: {
    state: string;
    carrier: string;
    deniedItem: string;
  };
  updateFilters: (filters: Partial<{
    state: string;
    carrier: string;
    deniedItem: string;
  }>) => void;
  states: string[];
  carriers: string[];
  deniedItems: string[];
}

export function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  filters,
  updateFilters,
  states,
  carriers,
  deniedItems,
}: SearchAndFilterProps) {
  return (
    <div className="mt-6 space-y-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search rebuttals..."
        className="w-full p-2 border rounded"
      />

      <div className="grid grid-cols-3 gap-4">
        <select
          value={filters.state}
          onChange={(e) => updateFilters({ state: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <select
          value={filters.carrier}
          onChange={(e) => updateFilters({ carrier: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All Carriers</option>
          {carriers.map((carrier) => (
            <option key={carrier} value={carrier}>
              {carrier}
            </option>
          ))}
        </select>

        <select
          value={filters.deniedItem}
          onChange={(e) => updateFilters({ deniedItem: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All Items</option>
          {deniedItems.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
} 