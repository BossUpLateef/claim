import { useMemo } from 'react';

interface ManufacturerSpec {
  name: string;
  specs: {
    [key: string]: string | number;
  };
  documents: string[];
}

export interface ManufacturerSpecs {
  [key: string]: {
    specs: {
      [key: string]: string | number;
    };
    documents: string[];
  };
}

export function useManufacturerSpecs(manufacturerSpecs: ManufacturerSpecs) {
  return useMemo(() => {
    return Object.entries(manufacturerSpecs).map(([name, { specs, documents }]) => ({
      name,
      specs,
      documents,
      searchableText: `${name} ${Object.values(specs).join(' ')} ${documents.join(' ')}`
    }));
  }, [manufacturerSpecs]);
} 