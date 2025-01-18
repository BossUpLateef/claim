import { useMemo } from 'react';

export interface SearchableItem {
  [key: string]: any;
}

export function useAdvancedSearch<T extends SearchableItem>(
  data: T[],
  searchTerms: string[],
  searchFields?: (keyof T)[]
) {
  return useMemo(() => {
    if (searchTerms.length === 0) return data;

    return data.filter(item => 
      searchTerms.some(term => {
        const normalizedTerm = term.toLowerCase().trim();
        if (!normalizedTerm) return true;

        if (searchFields) {
          // Search only specified fields
          return searchFields.some(field => 
            String(item[field])
              .toLowerCase()
              .includes(normalizedTerm)
          );
        }

        // Search all fields if no specific fields provided
        return Object.values(item).some(value => 
          String(value)
            .toLowerCase()
            .includes(normalizedTerm)
        );
      })
    );
  }, [data, searchTerms, searchFields]);
} 