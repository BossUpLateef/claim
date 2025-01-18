'use client';

import React from 'react';
import { Menu, X, Filter, Search, BarChart2 } from 'lucide-react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';

interface MobileNavProps {
  onShowFilters: () => void;
  onShowSearch: () => void;
  onShowStats: () => void;
}

export function MobileNav({ onShowFilters, onShowSearch, onShowStats }: MobileNavProps) {
  const { showMobileMenu, setShowMobileMenu } = useMobileOptimization();

  return (
    <>
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="mobile-fab lg:hidden fixed bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"
        aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
      >
        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>

      {showMobileMenu && (
        <div className="fixed bottom-20 right-4 flex flex-col gap-2 lg:hidden">
          <button
            onClick={onShowFilters}
            className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg"
            aria-label="Show filters"
          >
            <Filter size={24} />
          </button>
          <button
            onClick={onShowSearch}
            className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg"
            aria-label="Show search"
          >
            <Search size={24} />
          </button>
          <button
            onClick={onShowStats}
            className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg"
            aria-label="Show statistics"
          >
            <BarChart2 size={24} />
          </button>
        </div>
      )}
    </>
  );
} 