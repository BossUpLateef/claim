interface CommonDenial {
  rebuttal: string;
  evidence: string[];
  carrierSpecific?: Record<string, string>;
}

interface StateVariation {
  requirements: string;
  specs: string;
}

interface PlywoodSpecs {
  minimumThickness: string;
  grade: string;
  type: string;
  spacing: string;
}

interface OsbSpecs {
  minimumThickness: string;
  grade: string;
  exposure: string;
  spacing: string;
}

interface FastenerRequirements {
  nailSize: string;
  spacing: string;
  penetration: string;
  type: string;
}

interface LoadRequirements {
  liveLoad: string;
  totalLoad: string;
  deflection: string;
}

interface AdditionalSpecs {
  clipSupports: string;
  blockingRequirements: string;
  ventilationGaps: string;
}

interface DeckTechnicalRequirements {
  plywoodSpecs: PlywoodSpecs;
  osbSpecs: OsbSpecs;
  fastenerRequirements: FastenerRequirements;
  loadRequirements: LoadRequirements;
  additionalSpecs: AdditionalSpecs;
}

interface TechnicalRequirements {
  netFreeArea: string;
  balancing: string;
  placement: string;
  minimumClearance: string;
  baffle_requirements: string;
  windResistance: string;
}

interface ItemConfig {
  name: string;
  codes: Record<string, string>;
  stateVariations?: Record<string, StateVariation | string>;
  commonDenials: Record<string, CommonDenial>;
  technicalRequirements?: DeckTechnicalRequirements | TechnicalRequirements;
}

interface InstallationSpecs {
  exposure: string;
  overlap: string;
  nailing: string;
  nailLocation: string;
  sealant: string;
}

interface MaterialRequirements {
  type: string;
  compatibility: string;
  profile: string;
  windRating: string;
}

interface VentilationIntegration {
  clearance: string;
  netFreeArea: string;
  baffle: string;
  positioning: string;
}

interface WeatherProtection {
  sealant: string;
  overlap: string;
  drainage: string;
  iceProtection: string;
}

interface RidgeTechnicalRequirements {
  installationSpecs: InstallationSpecs;
  materialRequirements: MaterialRequirements;
  ventilationIntegration: VentilationIntegration;
  weatherProtection: WeatherProtection;
}

interface StarterOverhang {
  eaves: string;
  rakes: string;
  tolerance: string;
}

interface StarterFastening {
  pattern: string;
  location: string;
  quantity: string;
}

interface StarterPlacement {
  alignment: string;
  orientation: string;
  joints: string;
}

interface StarterInstallationSpecs {
  overhang: StarterOverhang;
  fastening: StarterFastening;
  placement: StarterPlacement;
}

interface StarterMaterialRequirements {
  type: string;
  compatibility: string;
  windRating: string;
  sealant: string;
}

interface StarterIntegrationRequirements {
  dripEdge: string;
  iceWater: string;
  firstCourse: string;
  corners: string;
}

interface StarterTechnicalRequirements {
  installationSpecs: StarterInstallationSpecs;
  materialRequirements: StarterMaterialRequirements;
  integrationRequirements: StarterIntegrationRequirements;
}

interface DripMaterialSpecs {
  minimumThickness: string;
  metalType: string;
  corrosionResistance: string;
  finishRequirements: string;
}

interface DripDimensions {
  verticalLeg: string;
  horizontalFlange: string;
  hemmedEdge: string;
  overlap: string;
}

interface DripEdgeLocation {
  placement: string;
  fastening: string;
  overlap: string;
}

interface DripCorners {
  treatment: string;
  waterflow: string;
  integration: string;
}

interface DripInstallation {
  eaves: DripEdgeLocation;
  rakes: DripEdgeLocation;
  corners: DripCorners;
}

interface DripFasteners {
  type: string;
  length: string;
  placement: string;
  pattern: string;
}

interface DripIntegration {
  withUnderlayment: string;
  withIceBarrier: string;
  withGutters: string;
  withFirstCourse: string;
}

interface DripTechnicalRequirements {
  materialSpecs: DripMaterialSpecs;
  dimensions: DripDimensions;
  installation: DripInstallation;
  fasteners: DripFasteners;
  integration: DripIntegration;
}

export const commonItems: Record<string, ItemConfig> = {
  "drip_edge": {
    name: "Drip Edge",
    codes: {
      "2015": "R905.2.8.5",
      "2018": "R905.2.8.5",
      "2021": "R905.2.8.5"
    },
    commonDenials: {
      "Not Required": {
        rebuttal: "IRC {code} explicitly requires drip edge at eaves and rakes...",
        evidence: [
          "Code section printout",
          "Manufacturer installation requirements",
          // ...
        ],
        carrierSpecific: {
          "State Farm": "Emphasize fascia protection requirements",
          "Allstate": "Document water damage prevention",
          "Liberty Mutual": "Focus on system integrity"
        }
      }
    }
  },
  "valley_metal": {
    name: "Valley Metal",
    codes: {
      "2015": "R905.2.8.2",
      "2018": "R905.2.8.2",
      "2021": "R905.2.8.2"
    },
    commonDenials: {
      "Woven Valley Is Sufficient": {
        rebuttal: "IRC {code} and manufacturer specifications require metal valley...",
        evidence: [
          "Manufacturer installation requirements",
          "Annual rainfall data",
          "Valley water flow calculations",
          "Industry best practices",
          "SMACNA guidelines"
        ],
        carrierSpecific: {
          "State Farm": "Focus on water volume management",
          "Allstate": "Document historical valley leak patterns",
          "Liberty Mutual": "Provide watershed calculations",
          "USAA": "Emphasize warranty requirements"
        }
      },
      "California Valley Is Acceptable": {
        rebuttal: "California valley method does not meet manufacturer specifications...",
        evidence: [
          "Manufacturer installation guidelines",
          "Industry standards documentation",
          "Water flow analysis reports",
          "Local jurisdiction requirements"
        ],
        carrierSpecific: {
          "State Farm": "Focus on manufacturer requirements",
          "Allstate": "Document proper valley construction methods",
          "Travelers": "Emphasize warranty compliance"
        }
      }
    }
  }
};

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export const CARRIERS = [
  'State Farm',
  'Allstate',
  'Liberty Mutual',
  'USAA',
  'Travelers'
];

export const DENIED_ITEMS = [
  { label: "Ice and Water Shield", value: "ice_and_water" },
  { label: "Drip Edge", value: "drip_edge" },
  { label: "Underlayment", value: "underlayment" },
  { label: "Gutter Apron", value: "gutter_apron" },
  { label: "Ridge Vent", value: "ridge_vent" },
  { label: "Pipe Flashing", value: "pipe_flashing" },
  { label: "Skylight Flashing", value: "skylight_flashing" },
  { label: "Deck Replacement", value: "deck_replacement" },
  { label: "Starter Strip", value: "starter_strip" },
  { label: "Valley Metal", value: "valley_treatment" },
  { label: "Step Flashing", value: "step_flashing" },
  { label: "Chimney Flashing", value: "chimney_flashing" },
  { label: "Wall Flashing", value: "wall_flashing" },
  { label: "Ventilation System", value: "ventilation_system" },
  { label: "Ridge Components", value: "ridge_components" }
]; 