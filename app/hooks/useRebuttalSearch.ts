'use client';

import { useState, useMemo } from 'react';

export function useRebuttalSearch(rebuttals: any[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    carrier: '',
    deniedItem: '',
  });

  const filteredRebuttals = useMemo(() => {
    return rebuttals.filter((rebuttal) => {
      const matchesSearch = searchTerm
        ? Object.values(rebuttal).some(
            (value) =>
              typeof value === 'string' &&
              value.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      const matchesState = filters.state
        ? rebuttal.state === filters.state
        : true;
      const matchesCarrier = filters.carrier
        ? rebuttal.carrier === filters.carrier
        : true;
      const matchesDeniedItem = filters.deniedItem
        ? rebuttal.deniedItem === filters.deniedItem
        : true;

      return matchesSearch && matchesState && matchesCarrier && matchesDeniedItem;
    });
  }, [rebuttals, searchTerm, filters]);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    filteredRebuttals,
    searchTerm,
    setSearchTerm,
    filters,
    updateFilters,
  };
} 