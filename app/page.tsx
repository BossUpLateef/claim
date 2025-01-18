"use client";

import React, { useState, useEffect } from 'react';
import { useMobileOptimization } from '../hooks/useMobileOptimization';
import { MobileNav } from '../components/MobileNav';
import { ErrorBoundaryWrapper } from '../components/ErrorBoundaryWrapper';
import { useRebuttal } from '../context/RebuttalContext';
import { useOptimizedMemo } from '../hooks/useOptimizedMemo';
import { measurePerformance, usePerformanceTracking } from '../utils/performance';
import '../styles/mobile.css';
import { ClientErrorBoundary } from '../components/ClientErrorBoundary';

export default function RebuttalPage() {
  const { isMobile, showMobileMenu } = useMobileOptimization();
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const { trackRender, trackEffect } = usePerformanceTracking();

  // Track component render
  trackRender('RebuttalPage');

  return (
    <ClientErrorBoundary>
      <ErrorBoundaryWrapper
        onError={(error, errorInfo) => {
          console.error('Error caught:', error, errorInfo);
        }}
      >
        <div className="min-h-screen bg-gray-50">
          <div className={`container mx-auto transition-all ${isMobile ? 'pb-20' : ''}`}>
            {/* Existing components with conditional classes */}
            <div className={`form-grid ${isMobile ? 'space-y-4' : 'grid grid-cols-2 gap-4'}`}>
              {/* Your existing form components */}
            </div>

            <div className={`search-filters ${showFilters ? 'active' : ''}`}>
              {/* Your AdvancedFilters component */}
            </div>

            <div className={`chart-container ${isMobile ? 'touch-scroll' : ''}`}>
              {/* Your DataVisualization component */}
            </div>

            {isMobile && (
              <MobileNav
                onShowFilters={() => setShowFilters(!showFilters)}
                onShowSearch={() => setShowSearch(!showSearch)}
                onShowStats={() => setShowStats(!showStats)}
              />
            )}
          </div>
        </div>
      </ErrorBoundaryWrapper>
    </ClientErrorBoundary>
  );
}
