interface DenialReason {
  rebuttal: string;
  evidence: string[];
}

interface CommonDenials {
  [key: string]: DenialReason;
}

interface DeniedItem {
  name: string;
  commonDenials: CommonDenials;
}

export const commonItems: { [key: string]: DeniedItem } = {
  starter_strip: {
    name: "Starter Strip",
    commonDenials: {
      improper_installation: {
        rebuttal: "The starter strip was installed according to manufacturer specifications and industry best practices. The installation meets all local building codes and manufacturer requirements.",
        evidence: [
          "Manufacturer installation guidelines",
          "Photos of proper installation",
          "Building code compliance documentation",
          "Industry standard references"
        ]
      },
      not_necessary: {
        rebuttal: "Starter strips are a critical component for proper roof system installation, providing essential wind uplift protection and proper first course alignment.",
        evidence: [
          "Manufacturer requirements for warranty coverage",
          "NRCA guidelines on starter strip importance",
          "Wind uplift resistance specifications",
          "Installation best practices documentation"
        ]
      }
    }
  },
  ice_and_water: {
    name: "Ice and Water Shield",
    commonDenials: {
      excessive_coverage: {
        rebuttal: "The ice and water shield coverage is in accordance with local building codes and manufacturer requirements for proper protection against ice dams and water infiltration.",
        evidence: [
          "Local building code requirements",
          "Climate zone specifications",
          "Manufacturer installation guidelines",
          "Historical weather data supporting coverage needs"
        ]
      },
      not_required: {
        rebuttal: "Ice and water shield is required by both local building codes and manufacturer specifications for proper protection in this climate zone.",
        evidence: [
          "Local building code sections requiring ice and water shield",
          "Climate zone requirements",
          "Manufacturer warranty requirements",
          "Historical ice dam occurrence data"
        ]
      }
    }
  },
  underlayment: {
    name: "Synthetic Underlayment",
    commonDenials: {
      traditional_sufficient: {
        rebuttal: "Synthetic underlayment provides superior protection and longevity compared to traditional felt, meeting modern building standards and manufacturer requirements.",
        evidence: [
          "Performance comparison data",
          "Manufacturer specifications",
          "Industry studies on synthetic vs. traditional underlayment",
          "Warranty requirements"
        ]
      },
      cost_difference: {
        rebuttal: "The cost difference is justified by superior performance, longer lifespan, and better protection of the roof system, ultimately providing better value.",
        evidence: [
          "Cost-benefit analysis",
          "Longevity studies",
          "Performance specifications",
          "Warranty requirements documentation"
        ]
      }
    }
  },
  ridge_vent: {
    name: "Ridge Ventilation",
    commonDenials: {
      existing_sufficient: {
        rebuttal: "The existing ventilation does not meet current building codes or manufacturer requirements for proper attic ventilation.",
        evidence: [
          "Ventilation calculations",
          "Building code requirements",
          "Manufacturer specifications",
          "Energy efficiency studies"
        ]
      },
      not_required: {
        rebuttal: "Proper ridge ventilation is essential for roof system longevity and is required by both building codes and manufacturer specifications.",
        evidence: [
          "Building code ventilation requirements",
          "Manufacturer installation guidelines",
          "Energy efficiency calculations",
          "Industry standard practices"
        ]
      }
    }
  }
}; 