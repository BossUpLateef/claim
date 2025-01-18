export interface GeneratedRebuttal {
  rebuttalText: string;
  evidence: string[];
  date: Date;
  successful?: boolean;
}

export interface RebuttalState {
  selectedState: string;
  carrier: string;
  deniedItem: string;
  carrierReason: string;
  selectedManufacturer?: string;
  showTechnicalSpecs?: boolean;
} 