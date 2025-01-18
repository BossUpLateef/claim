"use client";

import React, { useState, useCallback, useMemo } from "react";
import { AlertCircle, CheckCircle2, ThumbsUp, ThumbsDown, Download } from 'lucide-react';
import { useLocalStorage } from '../utils/useLocalStorage';
import { FeedbackComponent } from '../components/FeedbackComponent';
import { ClientFeedbackHistory } from '../components/ClientFeedbackHistory';
import { ExportButton } from '../components/ExportButton';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { useRebuttalSearch } from '../hooks/useRebuttalSearch';
import { useRebuttalForm } from '../hooks/useRebuttalForm';
import { CARRIERS } from '../constants/data';
import { US_STATES, DENIED_ITEMS } from '../constants/formOptions';
import { commonItems } from '../../utils/constants';
import { useRebuttal } from '../../context/RebuttalContext';

/* ----------------------------------------------------------------------------------
   1) Combined Card Component with optional title prop
-----------------------------------------------------------------------------------*/
function Card({ title, children, className }: { 
  title?: string; 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`border rounded shadow-sm p-4 bg-white ${className}`}>
      {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------------------------
   2) Interface describing what generateRebuttal() returns
-----------------------------------------------------------------------------------*/
interface RebuttalData {
  code: string;
  rebuttal: string;
  evidence: string[];
  stateSpecific: string | null;
  carrierSpecific: string | null;
}

/* ----------------------------------------------------------------------------------
   3) The main RebuttalPage component (Next.js 13 page)
-----------------------------------------------------------------------------------*/
export default function RebuttalPage() {
    const shouldShowManufacturer = (deniedItem: string): boolean => {
        const shingleRelatedItems = [
          'starter_strip',
          'ice_and_water',
          'underlayment',
          'ridge_vent',
          // Add other shingle-related items as needed
        ];
        return shingleRelatedItems.includes(deniedItem);
      };
      
  /* ---------------------------------------------------------------------------
     A) State Hooks
  ---------------------------------------------------------------------------*/
  const { state, dispatch } = useRebuttal();
  const [successfulRebuttals, setSuccessfulRebuttals] = useLocalStorage<any[]>('successfulRebuttals', []);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recentSearches', []);

  // NEW: Search term for filtering successful rebuttals
  const [searchTerm, setSearchTerm] = useState("");

  // Add new feedback state
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');

  const {
    filteredRebuttals: searchFilteredRebuttals,  // renamed from filteredRebuttals
    searchTerm: rebuttalSearchQuery,  // renamed from searchTerm
    setSearchTerm: setRebuttalSearchQuery,  // renamed from setSearchTerm
    filters,
    updateFilters
  } = useRebuttalSearch(successfulRebuttals);

  // Get unique values for filter options
  const states = [...new Set(successfulRebuttals.map(r => r.state))].sort();
  const uniqueCarriers = [...new Set(successfulRebuttals.map(r => r.carrier))].sort();
  const deniedItems = [...new Set(successfulRebuttals.map(r => r.deniedItem))].sort();

  /* ---------------------------------------------------------------------------
     B) Data Objects (All in one file!)
  ---------------------------------------------------------------------------*/

  // 1) State + IRC code adoption
  const stateData: Record<string, { IRC: string }> = {
    "Alabama": { "IRC": "2015" },
    "Alaska": { "IRC": "2018" },
    "Arizona": { "IRC": "2018" },
    "Arkansas": { "IRC": "2021" },
    "California": { "IRC": "2021" },
    "Colorado": { "IRC": "2021" },
    "Connecticut": { "IRC": "2021" },
    "Delaware": { "IRC": "2018" },
    "Florida": { "IRC": "2021" },
    "Georgia": { "IRC": "2018" },
    "Hawaii": { "IRC": "2021" },
    "Idaho": { "IRC": "2018" },
    "Illinois": { "IRC": "2018" },
    "Indiana": { "IRC": "2018" },
    "Iowa": { "IRC": "2015" },
    "Kansas": { "IRC": "2018" },
    "Kentucky": { "IRC": "2015" },
    "Louisiana": { "IRC": "2021" },
    "Maine": { "IRC": "2015" },
    "Maryland": { "IRC": "2021" },
    "Massachusetts": { "IRC": "2021" },
    "Michigan": { "IRC": "2015" },
    "Minnesota": { "IRC": "2018" },
    "Mississippi": { "IRC": "2018" },
    "Missouri": { "IRC": "2015" },
    "Montana": { "IRC": "2018" },
    "Nebraska": { "IRC": "2018" },
    "Nevada": { "IRC": "2021" },
    "New Hampshire": { "IRC": "2021" },
    "New Jersey": { "IRC": "2021" },
    "New Mexico": { "IRC": "2015" },
    "New York": { "IRC": "2021" },
    "North Carolina": { "IRC": "2018" },
    "North Dakota": { "IRC": "2018" },
    "Ohio": { "IRC": "2021" },
    "Oklahoma": { "IRC": "2018" },
    "Oregon": { "IRC": "2018" },
    "Pennsylvania": { "IRC": "2021" },
    "Rhode Island": { "IRC": "2021" },
    "South Carolina": { "IRC": "2018" },
    "South Dakota": { "IRC": "2021" },
    "Tennessee": { "IRC": "2021" },
    "Texas": { "IRC": "2018" },
    "Utah": { "IRC": "2021" },
    "Vermont": { "IRC": "2021" },
    "Virginia": { "IRC": "2018" },
    "Washington": { "IRC": "2018" },
    "West Virginia": { "IRC": "2018" },
    "Wisconsin": { "IRC": "2015" },
    "Wyoming": { "IRC": "2018" },
    "District of Columbia": { "IRC": "2018" }
  };

  // 2) Insurance Carriers
  const carriers: string[] = [
    "Allstate",
    "American Family",
    "Auto-Owners",
    "Cincinnati Insurance",
    "Farmers",
    "Liberty Mutual",
    "MetLife",
    "Nationwide",
    "Progressive",
    "Safeco",
    "State Farm",
    "Travelers",
    "USAA",
    "Other",
  ].sort();

  // 3) Manufacturer Specs
  const manufacturerSpecs = {
    "Atlas": {
      starter_requirements: "Pro-Cut® Starter Shingles required for enhanced warranty",
      ice_water_requirements: "Weather-Master® Ice & Water required for warranty",
      ventilation_requirements: "High-Performance ventilation required for warranty",
      technical_specs: {
        nail_zone: "Specified fastening area only",
        drip_edge: "1.5 inch minimum horizontal leg",
        overlap: "4 inch end lap, 6 inch in valleys",
        wind_warranty: "130 mph with enhanced installation",
      },
    },
    "CertainTeed": {
      starter_requirements: "SwiftStart® required for 5-star warranty",
      ice_water_requirements: "WinterGuard® required for enhanced warranty",
      ventilation_requirements: "Ridge Vent 7 required for max warranty",
      technical_specs: {
        nail_zone: "Specific nail line requirements",
        drip_edge: "2 inch minimum horizontal leg",
        overlap: "4 inch end lap, 6 inch valley",
        wind_warranty: "Enhanced warranty requires specific pattern",
      },
    },
    "GAF": {
      starter_requirements: "GAF StarterMatch™ or WeatherBlocker™ required for enhanced warranty",
      ice_water_requirements: "WeatherWatch® or StormGuard® required for Golden Pledge",
      ventilation_requirements: "Cobra® ridge vent required for warranty",
      technical_specs: {
        nail_zone: "Requires nailing within marked zone only",
        drip_edge: "1.5 inch minimum horizontal leg",
        overlap: "4 inch end lap, 6 inch in valleys",
        wind_warranty: "Required starter and 6 nails for max wind coverage",
      },
    },
    "IKO": {
      starter_requirements: "Leading Edge Plus™ required for warranty",
      ice_water_requirements: "GoldShield™ required for enhanced protection",
      ventilation_requirements: "Specific net free area calculations required",
      technical_specs: {
        nail_zone: "Must follow marked zones",
        drip_edge: "2 inch minimum horizontal leg",
        overlap: "4 inch end lap minimum",
        wind_warranty: "Enhanced installation for high wind areas",
      },
    },
    "Malarkey": {
      starter_requirements: "Smart Start® required for warranty",
      ice_water_requirements: "Arctic Seal® required for warranty",
      ventilation_requirements: "Specific ventilation calculations required",
      technical_specs: {
        nail_zone: "Specified nail zone only",
        drip_edge: "1.5 inch minimum horizontal leg",
        overlap: "4 inch end lap, 6 inch valley",
        wind_warranty: "Special high-wind application required",
      },
    },
    "Owens Corning": {
      starter_requirements: "WeatherLock® Starter required for Platinum warranty",
      ice_water_requirements: "WeatherLock® required for ice dam protection",
      ventilation_requirements: "VentSure® required for system warranty",
      technical_specs: {
        nail_zone: "SureNail® Technology zone required",
        drip_edge: "2 inch minimum horizontal leg",
        overlap: "4 inch end lap, 6 inch valley",
        wind_warranty: "Enhanced nailing pattern for high wind",
      },
    },
    "PABCO": {
      starter_requirements: "PABCO® Universal Starter required",
      ice_water_requirements: "Universal Ice & Water Shield required",
      ventilation_requirements: "Minimum ventilation calculations required",
      technical_specs: {
        nail_zone: "Follow specified nailing pattern",
        drip_edge: "1.5 inch minimum horizontal leg",
        overlap: "4 inch end lap minimum",
        wind_warranty: "Special application for high wind",
      },
    },
    "Tamko": {
      starter_requirements: "Heritage® Starter required for warranty",
      ice_water_requirements: "TW Metal & Tile Underlayment® required",
      ventilation_requirements: "Proper ventilation required for warranty",
      technical_specs: {
        nail_zone: "Must follow nail zone guides",
        drip_edge: "2 inch minimum horizontal leg",
        overlap: "4 inch end lap, 6 inch valley",
        wind_warranty: "Enhanced warranty requires 6 nail pattern",
      },
    },
  };

  // 4) General Technical Specs (for the "Show Technical Specs" toggle)
  const technicalSpecs = {
    deck_requirements: {
      minimum_thickness: {
        plywood: "15/32 inch minimum for 16 inch rafter spacing",
        osb: "7/16 inch minimum for 16 inch rafter spacing",
      },
      fastener_pullout: "Minimum 40 pounds per fastener",
      deflection_limits: "L/240 live load deflection maximum",
    },
    fastener_specs: {
      nails: {
        length: "Minimum 12-gauge, 1.25 inch for standard deck",
        head_size: "3/8 inch minimum head diameter",
        shank: "Ring shank required for high wind areas",
      },
      staples: "Not approved for warranty coverage",
    },
    flashing_requirements: {
      minimum_thickness: "0.019 inch (26 gauge) galvanized steel or equivalent",
      step_flashing: "Minimum 4 inch vertical leg, 4 inch coverage",
      valley_metal: "24 inch wide minimum, W valley configuration",
    },
  };

  // 5) Common Items (Denials, Code References, etc.)
  const commonItems = {
    "ice_and_water": {
      name: "Ice and Water Shield",
      codes: {
        "2015": "R905.1.2",
        "2018": "R905.1.2",
        "2021": "R905.1.2",
      },
      stateVariations: {
        "Minnesota": "Required 24 inches plus valleys",
        "Michigan": "Required full eaves plus 6 feet",
        "Wisconsin": "Required 24 inches plus specific valley requirements",
        "Maine": "Required 36 inches from edge plus all valleys",
        "New Hampshire": "Required full eaves plus 6 feet in valleys",
        "Vermont": "Required minimum 36 inches at eaves",
        "New York": "Required 24 inches plus additional valley protection",
      },
      commonDenials: {
        "not_required": {
          rebuttal:
            "IRC {code} requires ice barrier in areas prone to ice formation. Our documentation shows this property is in an ice-dam prone region based on historical weather data.",
          evidence: [
            "Weather data showing freezing temperatures",
            "Photos of existing ice dam damage",
            "Local building department confirmation",
            "Historical weather patterns for region",
            "Previous insurance claims in area",
          ],
          carrierSpecific: {
            "State Farm": "Include historical claim data for ice dam damages",
            "Allstate": "Provide satellite imagery of snow accumulation patterns",
            "Liberty Mutual": "Document previous ice dam claims in neighborhood",
            "Farmers": "Include local weather station data for freeze cycles",
          },
        },
      },
    },

    "drip_edge": {
      name: "Drip Edge Installation",
      codes: {
        "2015": "R905.2.8.5",
        "2018": "R905.2.8.5",
        "2021": "R905.2.8.5"
      },
      stateVariations: {
        "Florida": {
          requirements: "Minimum 0.024-inch for enhanced hurricane protection",
          specs: "Enhanced fastening pattern required"
        },
        "Coastal Areas": {
          requirements: "Enhanced corrosion resistance required",
          specs: "Stainless steel or marine-grade aluminum"
        },
        "High Wind Zones": {
          requirements: "Additional fastening required",
          specs: "Maximum 4-inch fastener spacing"
        },
        "Heavy Snow Regions": {
          requirements: "Extended vertical leg required",
          specs: "Minimum 3-inch vertical leg"
        }
      },
      commonDenials: {
        "not_required": {
          rebuttal: "IRC {code} explicitly requires drip edge at eaves and rakes with minimum 0.019-inch corrosion-resistant material.",
          evidence: [
            "Code section printout",
            "Manufacturer installation requirements",
            "Photos of existing condition",
            "Local jurisdiction requirements"
          ],
          carrierSpecific: {
            "State Farm": "Emphasize fascia protection requirements",
            "Allstate": "Document water damage prevention",
            "Liberty Mutual": "Focus on system integrity"
          }
        },
        "reuse_existing": {
          rebuttal: "Existing drip edge cannot be properly integrated with new roofing system per IRC {code} and shows deterioration.",
          evidence: [
            "Photos of existing condition",
            "Material thickness measurements",
            "Integration specifications",
            "Current code requirements"
          ],
          carrierSpecific: {
            "State Farm": "Document material degradation",
            "Allstate": "Show integration impossibility",
            "USAA": "Emphasize proper installation"
          }
        },
        "lighter_gauge_acceptable": {
          rebuttal: "IRC {code} requires minimum 0.019-inch thickness. Lighter gauge material does not meet code requirements or provide adequate protection.",
          evidence: [
            "Material specifications",
            "Code requirements",
            "Manufacturer guidelines",
            "Industry standards"
          ],
          carrierSpecific: {
            "State Farm": "Focus on material strength",
            "Allstate": "Document code compliance",
            "Travelers": "Emphasize durability requirements"
          }
        },
        "alternative_material": {
          rebuttal: "IRC {code} requires corrosion-resistant metal drip edge. Alternative materials do not meet code requirements or provide required protection.",
          evidence: [
            "Material specifications",
            "Code requirements",
            "Corrosion resistance data",
            "Performance requirements"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper materials",
            "Allstate": "Document material requirements",
            "Liberty Mutual": "Emphasize code compliance"
          }
        },
        "gutter_apron_only": {
          rebuttal: "IRC {code} requires drip edge at both eaves and rakes. Gutter apron alone does not meet code requirements for complete edge protection.",
          evidence: [
            "Code specifications",
            "Installation requirements",
            "System integration details",
            "Water management documentation"
          ],
          carrierSpecific: {
            "State Farm": "Focus on complete protection",
            "Allstate": "Document full requirements",
            "USAA": "Emphasize proper coverage"
          }
        }
      },
      technicalRequirements: {
        materialSpecs: {
          minimumThickness: "0.019-inch (26 gauge)",
          metalType: "Galvanized steel or aluminum",
          corrosionResistance: "G90 coating minimum",
          finishRequirements: "Compatible with environment"
        },
        dimensions: {
          verticalLeg: "1.5 inch minimum",
          horizontalFlange: "2 inch minimum",
          hemmedEdge: "1/4 inch minimum",
          overlap: "3 inch minimum at joints"
        },
        installation: {
          eaves: {
            placement: "Under underlayment",
            fastening: "12 inches on center maximum",
            overlap: "3 inches minimum at joints"
          },
          rakes: {
            placement: "Over underlayment",
            fastening: "4 inches on center in high wind",
            overlap: "3 inches minimum at joints"
          },
          corners: {
            treatment: "Pre-formed or field formed",
            waterflow: "Must direct water away",
            integration: "Proper overlap required"
          }
        },
        fasteners: {
          type: "Corrosion-resistant roofing nails",
          length: "Long enough to penetrate sheathing",
          placement: "According to wind zone requirements",
          pattern: "Per manufacturer specifications"
        },
        integration: {
          withUnderlayment: "Specific sequence required",
          withIceBarrier: "Proper overlap required",
          withGutters: "Proper positioning essential",
          withFirstCourse: "Specific placement required"
        }
      }
    },

    "underlayment": {
      name: "Synthetic Underlayment",
      codes: {
        "2015": "R905.1.1",
        "2018": "R905.1.1",
        "2021": "R905.1.1",
      },
      stateVariations: {
        "Florida": "Enhanced underlayment required in HVHZ",
        "Texas": "Specific wind rating requirements",
        "California": "Class A fire rating required",
      },
      commonDenials: {
        "felt_paper_sufficient": {
          rebuttal:
            "Manufacturer installation instructions require synthetic underlayment for warranty coverage. IRC {code} requires following manufacturer specifications.",
          evidence: [
            "Manufacturer installation instructions",
            "Warranty requirements documentation",
            "ASTM standard comparisons",
          ],
          carrierSpecific: {
            "State Farm": "Emphasize enhanced protection and warranty requirements",
            "Allstate": "Focus on long-term cost savings and reduced callback risk",
          },
        },
        "reuse_existing": {
          rebuttal: "IRC {code} requires proper integration of new underlayment with roof system. Existing underlayment cannot provide required protection or proper integration.",
          evidence: [
            "Manufacturer installation requirements",
            "Photos of existing underlayment condition",
            "System warranty requirements",
            "Integration specifications"
          ],
          carrierSpecific: {
            "State Farm": "Focus on system integration requirements",
            "Allstate": "Document deterioration of existing materials",
            "Liberty Mutual": "Emphasize warranty requirements"
          }
        },
        "partial_replacement": {
          rebuttal: "IRC {code} requires complete underlayment system. Partial replacement compromises system integrity and violates manufacturer requirements.",
          evidence: [
            "Manufacturer specifications",
            "System warranty documentation",
            "Installation requirements",
            "Technical bulletins"
          ],
          carrierSpecific: {
            "State Farm": "Highlight system integrity requirements",
            "Allstate": "Document potential failure points",
            "USAA": "Focus on warranty compliance"
          }
        },
        "lower_grade_acceptable": {
          rebuttal: "IRC {code} requires underlayment meeting manufacturer specifications. Lower grade materials do not meet warranty or code requirements.",
          evidence: [
            "Manufacturer material specifications",
            "Warranty requirements",
            "ASTM standards documentation",
            "Product performance data"
          ],
          carrierSpecific: {
            "State Farm": "Emphasize material performance requirements",
            "Allstate": "Document warranty specifications",
            "Liberty Mutual": "Include product testing data"
          }
        }
      },
    },

    "gutter_apron": {
      name: "Gutter Apron/Flashing",
      codes: {
        "2015": "R903.2.1",
        "2018": "R903.2.1",
        "2021": "R903.2.1",
      },
      stateVariations: {
        "Florida": "Enhanced fastening patterns required",
        "Coastal Regions": "Corrosion-resistant materials required",
      },
      commonDenials: {
        "not_required": {
          rebuttal:
            "IRC {code} requires proper drainage at roof edges. Gutter apron is essential for directing water into gutters and protecting fascia.",
          evidence: [
            "Photos of existing water damage",
            "Manufacturer installation guidelines",
            "Local best practices documentation",
            "Industry standard details",
          ],
          carrierSpecific: {
            "State Farm": "Focus on preventing fascia rot and internal water damage",
            "Allstate": "Document existing water staining and damage patterns",
          },
        },
      },
    },

    "ridge_vent": {
      name: "Ridge Ventilation",
      codes: {
        "2015": "R806.2",
        "2018": "R806.2",
        "2021": "R806.2",
      },
      stateVariations: {
        "Florida": "Must meet wind resistance requirements",
        "Minnesota": "Snow blocking features required",
      },
      commonDenials: {
        "existing_sufficient": {
          rebuttal:
            "IRC {code} requires minimum ventilation ratio. Current configuration with old ridge vent does not meet requirements.",
          evidence: [
            "Ventilation calculations",
            "Manufacturer specifications",
            "Energy audit results",
            "Attic temperature readings",
          ],
          carrierSpecific: {
            "State Farm": "Emphasize energy efficiency and moisture control",
            "Allstate": "Document potential for mold and deck deterioration",
          },
        },
      },
    },

    "pipe_flashing": {
      name: "Pipe Boot/Flashing Replacement",
      codes: {
        "2015": "R903.2",
        "2018": "R903.2",
        "2021": "R903.2",
      },
      stateVariations: {
        "Coastal Areas": "Must be corrosion-resistant",
        "Mountain Regions": "Must accommodate snow loads",
      },
      commonDenials: {
        "reuse_existing": {
          rebuttal:
            "IRC {code} requires proper weatherproofing at all roof penetrations. Existing pipe boots are deteriorated and cannot ensure watertight seal.",
          evidence: [
            "Photos of deteriorated boots",
            "Age of existing components",
            "Manufacturer lifespan data",
            "Documentation of leaks",
          ],
          carrierSpecific: {
            "State Farm": "Focus on preventing interior water damage",
            "Allstate": "Document potential for hidden damage",
          },
        },
      },
    },

    "skylight_flashing": {
      name: "Skylight Flashing Kit",
      codes: {
        "2015": "R308.6.8",
        "2018": "R308.6.8",
        "2021": "R308.6.8",
      },
      stateVariations: {
        "High Snow Load Areas": "Enhanced kit required",
        "Coastal Regions": "Must meet wind resistance requirements",
      },
      commonDenials: {
        "reuse_existing": {
          rebuttal:
            "IRC {code} requires proper flashing integration with roof covering. Manufacturer requires new flashing kit with roof replacement.",
          evidence: [
            "Manufacturer installation requirements",
            "Existing flashing condition photos",
            "Warranty requirements",
            "Installation specifications",
          ],
          carrierSpecific: {
            "State Farm": "Emphasize warranty requirements",
            "Allstate": "Document potential leak points",
          },
        },
      },
    },

    "deck_replacement": {
      name: "Roof Deck Replacement",
      codes: {
        "2015": "R803.1",
        "2018": "R803.1",
        "2021": "R803.1"
      },
      stateVariations: {
        "Florida": {
          requirements: "Enhanced nailing patterns and spacing",
          specs: "High wind zone attachment requirements"
        },
        "Coastal Regions": {
          requirements: "Higher grade materials required",
          specs: "Corrosion-resistant fasteners required"
        },
        "Heavy Snow Areas": {
          requirements: "Enhanced load capacity required",
          specs: "Additional support and thickness requirements"
        },
        "High Humidity Regions": {
          requirements: "Enhanced moisture resistance",
          specs: "Specific grade requirements"
        }
      },
      commonDenials: {
        "spot_repair": {
          rebuttal: "IRC {code} requires proper substrate for roof covering. Spot repairs cannot ensure deck integrity or proper fastener holding capacity.",
          evidence: [
            "Core samples showing deterioration",
            "Moisture meter readings across deck",
            "Deflection measurements",
            "Pull-through tests",
            "Photos of widespread deterioration",
            "Fastener withdrawal tests"
          ],
          carrierSpecific: {
            "State Farm": "Focus on structural integrity requirements",
            "Allstate": "Document safety concerns",
            "Liberty Mutual": "Emphasize load capacity needs"
          }
        },
        "overlay_acceptable": {
          rebuttal: "IRC {code} requires sound substrate. Overlaying deteriorated deck violates code requirements and compromises structural integrity.",
          evidence: [
            "Engineer assessment report",
            "Load calculations",
            "Building department requirements",
            "Manufacturer specifications",
            "Structural analysis",
            "Deck thickness measurements"
          ],
          carrierSpecific: {
            "State Farm": "Focus on long-term structural impacts",
            "Allstate": "Document code violations",
            "USAA": "Emphasize safety requirements"
          }
        },
        "partial_replacement": {
          rebuttal: "IRC {code} requires uniform substrate strength. Partial replacement creates inconsistent deck integrity and fastener holding capacity.",
          evidence: [
            "Deck continuity requirements",
            "Fastener pattern specifications",
            "Load distribution analysis",
            "System integrity documentation"
          ],
          carrierSpecific: {
            "State Farm": "Focus on consistent performance",
            "Allstate": "Document system integrity",
            "Liberty Mutual": "Emphasize uniform support"
          }
        },
        "skip_sheathing_acceptable": {
          rebuttal: "IRC {code} requires solid sheathing for asphalt shingles. Skip sheathing does not meet code requirements or manufacturer specifications.",
          evidence: [
            "Code requirements for solid decking",
            "Manufacturer installation requirements",
            "Industry standards",
            "Warranty specifications"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper substrate requirements",
            "Allstate": "Document manufacturer specifications",
            "Travelers": "Emphasize code compliance"
          }
        },
        "thinner_material_acceptable": {
          rebuttal: "IRC {code} requires minimum thickness based on rafter spacing. Thinner material does not meet load requirements or code specifications.",
          evidence: [
            "Span tables",
            "Load calculations",
            "Material specifications",
            "Deflection requirements"
          ],
          carrierSpecific: {
            "State Farm": "Focus on load capacity",
            "Allstate": "Document thickness requirements",
            "USAA": "Emphasize structural needs"
          }
        },
        "repair_over_existing": {
          rebuttal: "IRC {code} requires removal of compromised decking. Adding new material over damaged deck violates code and compromises integrity.",
          evidence: [
            "Current deck condition assessment",
            "Structural requirements",
            "Load calculations",
            "Building code specifications"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper replacement methods",
            "Allstate": "Document structural requirements",
            "Liberty Mutual": "Emphasize proper installation"
          }
        }
      },
      technicalRequirements: {
        plywoodSpecs: {
          minimumThickness: "15/32 inch for 16-inch rafter spacing",
          grade: "Exposure 1 or better",
          type: "CDX or better",
          spacing: "1/8 inch gap required between sheets"
        },
        osbSpecs: {
          minimumThickness: "7/16 inch for 16-inch rafter spacing",
          grade: "Rated sheathing",
          exposure: "Exposure 1 minimum",
          spacing: "1/8 inch gap required between sheets"
        },
        fastenerRequirements: {
          nailSize: "8d common minimum",
          spacing: "6 inches on edges, 12 inches field",
          penetration: "Minimum 3/4 inch into framing",
          type: "Hot-dipped galvanized or better"
        },
        loadRequirements: {
          liveLoad: "20 psf minimum",
          totalLoad: "40 psf minimum",
          deflection: "L/240 maximum"
        },
        additionalSpecs: {
          clipSupports: "Required for unsupported edges over 24 inches",
          blockingRequirements: "Required at all unsupported edges",
          ventilationGaps: "Required at eaves and ridges"
        }
      }
    },

    "starter_strip": {
      name: "Manufacturer Starter Strip Installation",
      codes: {
        "2015": "R905.2.6",
        "2018": "R905.2.6",
        "2021": "R905.2.6"
      },
      stateVariations: {
        "High Wind Zones": {
          requirements: "Enhanced starter attachment required",
          specs: "Six nails per starter strip minimum"
        },
        "Coastal Areas": {
          requirements: "Special fastening patterns required",
          specs: "Corrosion-resistant fasteners mandatory"
        },
        "Hurricane Regions": {
          requirements: "Miami-Dade approved installation required",
          specs: "Enhanced attachment methods mandatory"
        },
        "Mountain Regions": {
          requirements: "Enhanced ice dam protection integration",
          specs: "Special drip edge integration required"
        }
      },
      commonDenials: {
        "cut_shingles_sufficient": {
          rebuttal: "IRC {code} requires manufacturer-approved starter strips. Cut shingles do not meet wind warranty requirements or manufacturer specifications.",
          evidence: [
            "Manufacturer installation guide",
            "Wind warranty requirements",
            "Wind uplift resistance data",
            "Product specifications",
            "System warranty documentation"
          ],
          carrierSpecific: {
            "State Farm": "Focus on warranty compliance",
            "Allstate": "Document wind resistance requirements",
            "Liberty Mutual": "Provide wind uplift calculations",
            "USAA": "Emphasize manufacturer certification"
          }
        },
        "roll_roofing_starter": {
          rebuttal: "Roll roofing as starter violates IRC {code} and manufacturer requirements, compromising wind resistance and system warranty.",
          evidence: [
            "Manufacturer warranty requirements",
            "Wind resistance testing data",
            "Installation specifications",
            "System certification requirements"
          ],
          carrierSpecific: {
            "State Farm": "Document warranty requirements",
            "Allstate": "Show proper material specifications",
            "Liberty Mutual": "Focus on system integrity"
          }
        },
        "improper_overhang": {
          rebuttal: "IRC {code} requires specific starter strip overhang. Improper overhang compromises drip edge integration and system performance.",
          evidence: [
            "Manufacturer overhang specifications",
            "Installation guidelines",
            "Water management details",
            "System integration requirements"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper drainage",
            "Allstate": "Document installation requirements",
            "Travelers": "Emphasize system performance"
          }
        },
        "alternative_brand_acceptable": {
          rebuttal: "IRC {code} requires matching manufacturer components. Alternative brands compromise system warranty and performance specifications.",
          evidence: [
            "Warranty requirements",
            "System compatibility documentation",
            "Manufacturer specifications",
            "Installation guidelines"
          ],
          carrierSpecific: {
            "State Farm": "Focus on system compatibility",
            "Allstate": "Document warranty requirements",
            "USAA": "Emphasize proper materials"
          }
        },
        "reverse_application": {
          rebuttal: "IRC {code} requires proper starter strip orientation. Reverse application compromises wind resistance and system integrity.",
          evidence: [
            "Installation specifications",
            "Wind resistance requirements",
            "Manufacturer guidelines",
            "System performance data"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper installation",
            "Allstate": "Document wind requirements",
            "Liberty Mutual": "Emphasize performance specs"
          }
        }
      },
      technicalRequirements: {
        installationSpecs: {
          overhang: {
            eaves: "1/4 to 3/8 inch beyond drip edge",
            rakes: "1/4 to 3/4 inch beyond drip edge",
            tolerance: "1/8 inch maximum variation"
          },
          fastening: {
            pattern: "4 to 6 inches on center",
            location: "1 to 2 inches up from eave edge",
            quantity: "Minimum per high wind requirements"
          },
          placement: {
            alignment: "Must align with drip edge",
            orientation: "Seal strip toward eave edge",
            joints: "Butt joints required, no gaps"
          }
        },
        materialRequirements: {
          type: "Factory manufactured only",
          compatibility: "Must match primary shingle system",
          windRating: "Must meet local requirements",
          sealant: "Factory applied adhesive strip"
        },
        integrationRequirements: {
          dripEdge: "Must properly integrate",
          iceWater: "Must properly overlap",
          firstCourse: "Must align properly",
          corners: "Special treatment required"
        }
      }
    },

    "valley_treatment": {
      name: "Valley Installation Method",
      codes: {
        "2015": "R905.2.8.2",
        "2018": "R905.2.8.2",
        "2021": "R905.2.8.2"
      },
      stateVariations: {
        "Northeast": "Enhanced ice protection required in valleys",
        "Florida": "Hurricane zone specifications require enhanced fastening",
        "Mountain Regions": "Additional snow load considerations required",
        "Coastal Areas": "Corrosion resistant materials required",
        "High Rain Regions": "Additional underlayment and width requirements",
        "Desert Regions": "Enhanced thermal movement specifications"
      },
      commonDenials: {
        "woven_valley_sufficient": {
          rebuttal: "IRC {code} and manufacturer specifications require metal valley for proper water handling capacity and system longevity. Woven valleys do not meet warranty requirements.",
          evidence: [
            "Manufacturer installation requirements",
            "Annual rainfall data",
            "Valley water flow calculations",
            "Industry best practices",
            "SMACNA guidelines",
            "Photos of existing valley wear patterns"
          ],
          carrierSpecific: {
            "State Farm": "Focus on water volume management",
            "Allstate": "Document historical valley leak patterns",
            "Liberty Mutual": "Provide watershed calculations",
            "USAA": "Emphasize warranty requirements"
          }
        },
        "california_valley_acceptable": {
          rebuttal: "California valley method does not meet manufacturer specifications or IRC {code} requirements for proper water management and system longevity.",
          evidence: [
            "Manufacturer installation guidelines",
            "Industry standards documentation",
            "Water flow analysis reports",
            "Local jurisdiction requirements",
            "System warranty specifications"
          ],
          carrierSpecific: {
            "State Farm": "Focus on manufacturer requirements",
            "Allstate": "Document proper valley construction methods",
            "Travelers": "Emphasize warranty compliance"
          }
        },
        "existing_valley_metal_reuse": {
          rebuttal: "IRC {code} requires proper integration of valley metal with new roofing system. Existing valley metal cannot be properly integrated and may be compromised.",
          evidence: [
            "Photos of existing valley condition",
            "Metal gauge measurements",
            "Corrosion documentation",
            "Integration specifications",
            "System warranty requirements"
          ],
          carrierSpecific: {
            "State Farm": "Document material degradation",
            "Allstate": "Show integration impossibility",
            "Liberty Mutual": "Focus on system integrity"
          }
        },
        "narrow_valley_acceptable": {
          rebuttal: "IRC {code} and manufacturer specifications require minimum 24-inch valley metal width for proper water handling. Narrow valleys violate code and warranty requirements.",
          evidence: [
            "Valley width specifications",
            "Water flow calculations",
            "Manufacturer requirements",
            "Industry standards",
            "Local weather data"
          ],
          carrierSpecific: {
            "State Farm": "Emphasize proper width requirements",
            "Allstate": "Document water handling needs",
            "USAA": "Focus on code compliance"
          }
        },
        "improper_underlayment_acceptable": {
          rebuttal: "IRC {code} requires specific valley underlayment for proper moisture protection. Current specification does not meet code or manufacturer requirements.",
          evidence: [
            "Valley underlayment specifications",
            "Manufacturer installation requirements",
            "System warranty documentation",
            "Industry best practices",
            "Technical bulletins"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper water protection",
            "Allstate": "Document system requirements",
            "Liberty Mutual": "Emphasize warranty compliance"
          }
        },
        "alternative_valley_protection": {
          rebuttal: "Alternative valley protection methods do not meet IRC {code} requirements or manufacturer specifications for proper water management and system longevity.",
          evidence: [
            "Code requirements documentation",
            "Manufacturer specifications",
            "Industry standards",
            "Testing results",
            "System warranty requirements"
          ],
          carrierSpecific: {
            "State Farm": "Focus on approved methods",
            "Allstate": "Document proper specifications",
            "USAA": "Emphasize code compliance"
          }
        },
        "closed_cut_valley_sufficient": {
          rebuttal: "Open metal valley required per IRC {code} and manufacturer specifications for enhanced warranty coverage and proper water management in this application.",
          evidence: [
            "Manufacturer installation requirements",
            "Watershed calculations",
            "Local weather patterns",
            "Industry standards",
            "Warranty documentation"
          ],
          carrierSpecific: {
            "State Farm": "Focus on water management",
            "Allstate": "Document performance requirements",
            "Liberty Mutual": "Emphasize warranty specifications"
          }
        }
      }
    },

    "step_flashing": {
      name: "Step Flashing Method",
      codes: {
        "2015": "R905.2.8.3",
        "2018": "R905.2.8.3",
        "2021": "R905.2.8.3",
      },
      stateVariations: {
        "Coastal": "Enhanced corrosion resistance",
        "Mountain": "Snow/ice considerations",
        "High Wind": "Additional fastening required",
        "Hurricane Prone": "Special attachment methods",
        "Desert": "Heat resistance requirements",
      },
      commonDenials: {
        "continuous_flashing_acceptable": {
          rebuttal:
            "IRC {code} requires step flashing for proper water management. Continuous flashing does not allow proper drainage.",
          evidence: [
            "Code specifications",
            "SMACNA guidelines",
            "Manufacturer requirements",
            "Industry standards",
            "Water management diagrams",
            "Historical leak documentation",
          ],
          carrierSpecific: {
            "State Farm": "Emphasize water management",
            "Allstate": "Document proper installation methods",
            "Liberty Mutual": "Include industry standards",
            "Travelers": "Provide technical specifications",
          },
        },
        "reuse_existing_step": {
          rebuttal:
            "Existing step flashing cannot be properly integrated with new roofing material and may be compromised.",
          evidence: [
            "Material deterioration photos",
            "Integration requirements",
            "System warranty specifications",
            "Installation standards",
          ],
        },
        "caulk_alternative": {
          rebuttal:
            "Caulk or sealant is not an approved alternative to proper step flashing per IRC {code}.",
          evidence: [
            "Code requirements",
            "Manufacturer specifications",
            "Industry standards",
            "Testing results",
          ],
        },
      },
    },

    "chimney_flashing": {
      name: "Chimney Flashing",
      codes: {
        "2015": "R905.2.8.3",
        "2018": "R905.2.8.3",
        "2021": "R905.2.8.3"
      },
      stateVariations: {
        "Coastal Areas": "Enhanced corrosion resistance required",
        "High Snow Load Areas": "Additional height requirements",
        "Hurricane Zones": "Enhanced attachment methods required",
        "Mountain Regions": "Snow/ice protection specifications",
        "Desert Regions": "High-temperature rated sealants required"
      },
      commonDenials: {
        "reuse_existing": {
          rebuttal: "IRC {code} requires proper integration of new flashing with roof system. Existing flashing cannot ensure watertight seal and violates manufacturer requirements.",
          evidence: [
            "Photos of existing flashing condition",
            "Age of current flashing",
            "Manufacturer specifications",
            "Industry standards",
            "Integration requirements"
          ],
          carrierSpecific: {
            "State Farm": "Document system integration requirements",
            "Allstate": "Show existing deterioration",
            "Liberty Mutual": "Focus on leak prevention"
          }
        },
        "partial_replacement": {
          rebuttal: "IRC {code} requires complete chimney flashing system replacement for proper integration. Partial replacement compromises system integrity.",
          evidence: [
            "SMACNA guidelines",
            "Manufacturer installation specs",
            "System warranty requirements",
            "Integration details"
          ],
          carrierSpecific: {
            "State Farm": "Emphasize system integrity",
            "Allstate": "Document warranty requirements",
            "USAA": "Focus on proper installation"
          }
        },
        "repair_sufficient": {
          rebuttal: "IRC {code} requires proper base and counter flashing installation. Repairs to existing flashing violate code and manufacturer requirements.",
          evidence: [
            "Code specifications",
            "Manufacturer guidelines",
            "Industry standards",
            "Current condition photos"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper installation",
            "Allstate": "Document code requirements",
            "Liberty Mutual": "Emphasize system longevity"
          }
        }
      }
    },

    "wall_flashing": {
      name: "Wall/Step Flashing",
      codes: {
        "2015": "R905.2.8.4",
        "2018": "R905.2.8.4",
        "2021": "R905.2.8.4"
      },
      stateVariations: {
        "Coastal Regions": "Corrosion-resistant materials required",
        "High Wind Zones": "Enhanced attachment methods",
        "Heavy Rain Areas": "Additional overlap required"
      },
      commonDenials: {
        "continuous_flashing_acceptable": {
          rebuttal: "IRC {code} explicitly requires step flashing at wall intersections. Continuous flashing does not meet code requirements for proper water management.",
          evidence: [
            "Code specifications",
            "Manufacturer requirements",
            "Installation diagrams",
            "Water management details"
          ],
          carrierSpecific: {
            "State Farm": "Focus on water management",
            "Allstate": "Document proper installation",
            "Liberty Mutual": "Emphasize code compliance"
          }
        },
        "existing_step_reuse": {
          rebuttal: "IRC {code} requires new step flashing properly integrated with new roofing materials. Existing step flashing cannot be properly integrated.",
          evidence: [
            "Integration specifications",
            "Manufacturer requirements",
            "Current condition photos",
            "Installation guidelines"
          ],
          carrierSpecific: {
            "State Farm": "Document integration needs",
            "Allstate": "Show material condition",
            "USAA": "Focus on proper installation"
          }
        }
      }
    },

    "pipe_flashing": {
      name: "Pipe Boot/Flashing", 
      codes: {
        "2015": "R903.2",
        "2018": "R903.2",
        "2021": "R903.2"
      },
      stateVariations: {
        "Coastal Areas": "Enhanced corrosion resistance",
        "High Temperature Regions": "Heat-resistant materials required",
        "Heavy Snow Areas": "Extended height requirements"
      },
      commonDenials: {
        "reuse_existing": {
          rebuttal: "IRC {code} requires proper weatherproofing at all penetrations. Existing pipe boots are deteriorated and cannot ensure watertight seal.",
          evidence: [
            "Photos of deterioration",
            "Age of components",
            "Manufacturer lifespan data",
            "Installation requirements"
          ],
          carrierSpecific: {
            "State Farm": "Focus on water intrusion prevention",
            "Allstate": "Document material deterioration",
            "Liberty Mutual": "Emphasize proper sealing"
          }
        },
        "repair_with_sealant": {
          rebuttal: "IRC {code} requires proper pipe flashing installation. Sealant repairs do not meet code requirements or manufacturer specifications.",
          evidence: [
            "Code requirements",
            "Manufacturer specifications",
            "Industry standards",
            "Installation guidelines"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper materials",
            "Allstate": "Document proper installation",
            "USAA": "Emphasize code compliance"
          }
        },
        "retrofit_acceptable": {
          rebuttal: "IRC {code} requires properly integrated pipe flashing. Retrofit solutions do not meet code requirements or manufacturer specifications.",
          evidence: [
            "Installation specifications",
            "Manufacturer requirements",
            "Industry standards",
            "System warranty requirements"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper integration",
            "Allstate": "Document warranty requirements",
            "Travelers": "Emphasize installation standards"
          }
        }
      }
    },

    "ventilation_system": {
      name: "Roof Ventilation System",
      codes: {
        "2015": "R806.1, R806.2",
        "2018": "R806.1, R806.2",
        "2021": "R806.1, R806.2"
      },
      stateVariations: {
        "Florida": {
          requirements: "Hurricane-rated components required",
          specs: "Miami-Dade approved vents in HVHZ"
        },
        "Minnesota": {
          requirements: "Enhanced snow screening required",
          specs: "Specific net free area calculations for cold climates"
        },
        "Desert Regions": {
          requirements: "Enhanced heat resistance specifications",
          specs: "Additional intake ventilation required"
        },
        "Coastal Areas": {
          requirements: "Corrosion-resistant materials required",
          specs: "Enhanced water intrusion protection"
        }
      },
      commonDenials: {
        "existing_sufficient": {
          rebuttal: "IRC {code} requires minimum 1/150 ventilation ratio (or 1/300 with vapor barrier). Current configuration does not meet requirements.",
          evidence: [
            "Attic space calculations",
            "Current vent measurements",
            "Net free area calculations",
            "Temperature readings",
            "Moisture readings",
            "Infrared scanning results"
          ],
          carrierSpecific: {
            "State Farm": "Document inadequate airflow measurements",
            "Allstate": "Provide energy efficiency impact data",
            "Liberty Mutual": "Include moisture-related damage potential"
          }
        },
        "power_vent_alternative": {
          rebuttal: "IRC {code} requires proper passive ventilation. Power vents alone do not meet code requirements for continuous ventilation.",
          evidence: [
            "Code requirements documentation",
            "Energy consumption data",
            "Manufacturer specifications",
            "Industry standards",
            "System failure scenarios"
          ],
          carrierSpecific: {
            "State Farm": "Focus on passive system reliability",
            "Allstate": "Document continuous operation requirements",
            "USAA": "Emphasize code compliance needs"
          }
        },
        "partial_replacement": {
          rebuttal: "IRC {code} requires balanced ventilation system. Partial replacement compromises system performance and violates manufacturer requirements.",
          evidence: [
            "System balance calculations",
            "Airflow measurements",
            "Manufacturer specifications",
            "Performance requirements"
          ],
          carrierSpecific: {
            "State Farm": "Emphasize system balance importance",
            "Allstate": "Document performance requirements",
            "Liberty Mutual": "Focus on proper functioning"
          }
        },
        "reuse_existing_ridge_vent": {
          rebuttal: "Existing ridge vent cannot be properly integrated with new roofing system per IRC {code} and manufacturer requirements.",
          evidence: [
            "Installation specifications",
            "Integration requirements",
            "Current condition photos",
            "Manufacturer guidelines"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper integration",
            "Allstate": "Document material compatibility",
            "Travelers": "Emphasize warranty requirements"
          }
        },
        "gable_vents_sufficient": {
          rebuttal: "IRC {code} requires proper intake and exhaust ventilation. Gable vents alone do not provide required air flow or meet manufacturer specifications.",
          evidence: [
            "Ventilation calculations",
            "Airflow patterns",
            "Manufacturer requirements",
            "Energy efficiency data"
          ],
          carrierSpecific: {
            "State Farm": "Document airflow requirements",
            "Allstate": "Show system inefficiencies",
            "USAA": "Focus on proper balancing"
          }
        },
        "lower_profile_acceptable": {
          rebuttal: "IRC {code} requires specific net free area. Lower profile vents do not provide required ventilation capacity.",
          evidence: [
            "Net free area calculations",
            "Manufacturer specifications",
            "Performance requirements",
            "Airflow measurements"
          ],
          carrierSpecific: {
            "State Farm": "Focus on capacity requirements",
            "Allstate": "Document performance needs",
            "Liberty Mutual": "Emphasize proper sizing"
          }
        },
        "intake_vents_optional": {
          rebuttal: "IRC {code} requires balanced intake and exhaust ventilation. System requires proper intake vents for effective operation.",
          evidence: [
            "System balance calculations",
            "Airflow measurements",
            "Manufacturer requirements",
            "Performance data"
          ],
          carrierSpecific: {
            "State Farm": "Focus on system balance",
            "Allstate": "Document proper functioning requirements",
            "USAA": "Emphasize complete system needs"
          }
        },
        "solar_fans_alternative": {
          rebuttal: "IRC {code} requires consistent ventilation performance. Solar-powered fans do not provide reliable continuous ventilation required by code.",
          evidence: [
            "Operation time calculations",
            "Performance requirements",
            "Weather pattern data",
            "System reliability documentation"
          ],
          carrierSpecific: {
            "State Farm": "Focus on continuous operation needs",
            "Allstate": "Document reliability requirements",
            "Liberty Mutual": "Emphasize consistent performance"
          }
        }
      },
      technicalRequirements: {
        netFreeArea: "1/150 of attic area (1/300 with vapor barrier)",
        balancing: "50% upper/50% lower ventilation required",
        placement: "Maximum 3 feet below ridge for exhaust",
        minimumClearance: "1 inch minimum air space required",
        baffle_requirements: "Required for insulation clearance",
        windResistance: "Must meet local wind requirements"
      }
    },

    "ridge_components": {
      name: "Ridge Components and Installation",
      codes: {
        "2015": "R905.2.8.2, R906.1",
        "2018": "R905.2.8.2, R906.1",
        "2021": "R905.2.8.2, R906.1"
      },
      stateVariations: {
        "Florida": {
          requirements: "Enhanced wind resistance rating required",
          specs: "Miami-Dade approved products in HVHZ"
        },
        "Snow Regions": {
          requirements: "Snow guard integration requirements",
          specs: "Enhanced profile for snow load"
        },
        "Coastal Areas": {
          requirements: "Corrosion-resistant fasteners required",
          specs: "Enhanced water intrusion protection"
        },
        "High Wind Zones": {
          requirements: "Additional fastening patterns",
          specs: "Six-nail minimum per cap"
        }
      },
      commonDenials: {
        "cut_shingles_acceptable": {
          rebuttal: "IRC {code} requires manufacturer-approved hip and ridge caps. Cut shingles do not meet wind resistance or warranty requirements.",
          evidence: [
            "Manufacturer installation specifications",
            "Wind warranty requirements",
            "Product testing data",
            "Installation guidelines",
            "Wind uplift calculations"
          ],
          carrierSpecific: {
            "State Farm": "Focus on warranty compliance",
            "Allstate": "Document wind resistance requirements",
            "Liberty Mutual": "Emphasize proper materials"
          }
        },
        "reuse_existing_caps": {
          rebuttal: "IRC {code} requires new ridge caps properly integrated with new shingles. Existing caps cannot ensure proper seal or meet warranty requirements.",
          evidence: [
            "Material compatibility requirements",
            "Integration specifications",
            "Warranty documentation",
            "Current condition photos"
          ],
          carrierSpecific: {
            "State Farm": "Focus on system integration",
            "Allstate": "Document material degradation",
            "USAA": "Emphasize complete system warranty"
          }
        },
        "alternative_profile_acceptable": {
          rebuttal: "IRC {code} and manufacturer specifications require matching profile ridge caps. Alternative profiles compromise system integrity and warranty.",
          evidence: [
            "Manufacturer specifications",
            "Product matching requirements",
            "System warranty documentation",
            "Installation guidelines"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper materials",
            "Allstate": "Document system requirements",
            "Travelers": "Emphasize warranty compliance"
          }
        },
        "insufficient_overlap": {
          rebuttal: "IRC {code} requires minimum 5-inch exposure and proper overlap. Reduced overlap compromises water resistance and wind performance.",
          evidence: [
            "Installation specifications",
            "Exposure requirements",
            "Wind resistance data",
            "Water intrusion testing"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper coverage",
            "Allstate": "Document installation requirements",
            "Liberty Mutual": "Emphasize performance specs"
          }
        },
        "improper_nailing": {
          rebuttal: "IRC {code} requires specific nailing pattern for ridge caps. Improper nailing compromises wind resistance and warranty coverage.",
          evidence: [
            "Nailing pattern specifications",
            "Wind warranty requirements",
            "Installation guidelines",
            "Manufacturer fastening details"
          ],
          carrierSpecific: {
            "State Farm": "Focus on proper attachment",
            "Allstate": "Document wind requirements",
            "USAA": "Emphasize warranty compliance"
          }
        },
        "non_matching_material": {
          rebuttal: "IRC {code} requires matching manufacturer ridge caps. Non-matching materials compromise system integrity and warranty coverage.",
          evidence: [
            "Material specifications",
            "Color matching requirements",
            "Warranty documentation",
            "System compatibility data"
          ],
          carrierSpecific: {
            "State Farm": "Focus on system integrity",
            "Allstate": "Document warranty requirements",
            "Liberty Mutual": "Emphasize proper materials"
          }
        }
      },
      technicalRequirements: {
        installationSpecs: {
          exposure: "5-inch minimum exposure",
          overlap: "Minimum per manufacturer specs",
          nailing: "Two nails per cap minimum",
          nailLocation: "Per manufacturer specification",
          sealant: "As required for high wind areas"
        },
        materialRequirements: {
          type: "Manufacturer-approved ridge caps",
          compatibility: "Must match primary shingle system",
          profile: "Must match roof profile",
          windRating: "Must meet local requirements"
        },
        ventilationIntegration: {
          clearance: "Minimum 1-inch air gap required",
          netFreeArea: "Must maintain specified ventilation",
          baffle: "Required where specified",
          positioning: "Cannot block required airflow"
        },
        weatherProtection: {
          sealant: "Required in high wind zones",
          overlap: "Enhanced in heavy rain areas",
          drainage: "Must maintain proper watershed",
          iceProtection: "Enhanced in snow regions"
        }
      }
    },
  };

  /* ---------------------------------------------------------------------------
     C) generateRebuttal() -> returns RebuttalData or null
  ---------------------------------------------------------------------------*/
  const generateRebuttal = useCallback(() => {
    if (!state.selectedState || !state.deniedItem || !state.carrierReason) return null;

    const itemData = commonItems[state.deniedItem as keyof typeof commonItems];
    if (!itemData) return null;

    const stateCode = stateData[state.selectedState]?.IRC;
    if (!stateCode || stateCode === "N/A") return null;

    const codeSection = itemData.codes[stateCode as keyof typeof itemData.codes];
    const denialData = itemData.commonDenials[state.carrierReason as keyof typeof itemData.commonDenials];
    if (!codeSection || !denialData) return null;

    // State or carrier-specific notes
    const stateSpecific = itemData.stateVariations?.[state.selectedState as keyof typeof itemData.stateVariations] || null;
    const carrierSpecific = denialData?.carrierSpecific?.[state.carrier as keyof typeof denialData.carrierSpecific] || null;

    return {
      code: codeSection,
      rebuttal: denialData?.rebuttal?.replace("{code}", codeSection) || "",
      evidence: denialData?.evidence ?? "",
      stateSpecific,
      carrierSpecific,
    };
  }, [state.selectedState, state.deniedItem, state.carrierReason, state.carrier]);

  /* ---------------------------------------------------------------------------
     D) Mark a rebuttal as successful
  ---------------------------------------------------------------------------*/
  const handleSuccessfulRebuttal = useCallback(() => {
    const rebuttal = generateRebuttal();
    if (!rebuttal) return;

    const newRebuttal = {
      state: state.selectedState,
      carrier: state.carrier,
      deniedItem: state.deniedItem,
      carrierReason: state.carrierReason,
      date: new Date().toISOString(),
      successful: true,
      rebuttalText: rebuttal.rebuttal,
      evidence: rebuttal.evidence,
    };

    setSuccessfulRebuttals(prev => [...prev, newRebuttal]);
  }, [generateRebuttal, state.selectedState, state.carrier, state.deniedItem, state.carrierReason, setSuccessfulRebuttals]);

  /* ---------------------------------------------------------------------------
     E) Save/Load Previous Rebuttals
  ---------------------------------------------------------------------------*/
  const saveToPreviousRebuttals = () => {
    const currentRebuttal = generateRebuttal();
    if (!currentRebuttal) return;
    
    localStorage.setItem('savedRebuttals', JSON.stringify(successfulRebuttals));
  };

  const loadPreviousRebuttals = () => {
    const saved = localStorage.getItem('savedRebuttals');
    if (saved) {
      setSuccessfulRebuttals(JSON.parse(saved));
    }
  };

  /* ---------------------------------------------------------------------------
     F) Copy to Clipboard Function
  ---------------------------------------------------------------------------*/
  const copyToClipboard = () => {
    const rebuttal = generateRebuttal();
    if (!rebuttal) return;
    
    const content = `CODE: ${rebuttal.code}\n\nREBUTTAL: ${rebuttal.rebuttal}`;
    navigator.clipboard.writeText(content);
  };

  /* ---------------------------------------------------------------------------
     G) Print Function
  ---------------------------------------------------------------------------*/
  const handlePrint = () => {
    const rebuttal = generateRebuttal();
    if (!rebuttal) return;
    
    const printContent = window.open('', '_blank');
    if (printContent) {
      printContent.document.write(`
        <html>
          <head><title>Rebuttal Documentation</title></head>
          <body>
            <h2>Code Reference: ${rebuttal.code}</h2>
            <p>${rebuttal.rebuttal}</p>
            <!-- Add more content here if desired -->
          </body>
        </html>
      `);
      printContent.print();
    }
  };

  /* ---------------------------------------------------------------------------
     H) Export Function
  ---------------------------------------------------------------------------*/
  const handleExport = () => {
    const rd = generateRebuttal();
    if (!rd) return;

    const content = `
============================================
        BOSS UP SOLUTIONS
        Estimates and Claims
============================================

Date: ${new Date().toLocaleDateString()}

GENERAL INFORMATION
State: ${state.selectedState}
Carrier: ${state.carrier || 'Not specified'}
Manufacturer: ${state.selectedManufacturer || 'Not specified'} 
Denied Item: ${state.deniedItem && commonItems[state.deniedItem] ? commonItems[state.deniedItem].name : 'Not specified'}
Denial Reason: ${state.carrierReason?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Not specified'}

CODE REFERENCE
${rd.code}

REBUTTAL
${rd.rebuttal}

SUPPORTING EVIDENCE
${rd.evidence.map((e, i) => `${i + 1}. ${e}`).join('\n')}

${rd.stateSpecific ? `\nSTATE-SPECIFIC REQUIREMENTS\n${rd.stateSpecific}` : ''}

${rd.carrierSpecific ? `\nCARRIER-SPECIFIC STRATEGY\n${rd.carrierSpecific}` : ''}

============================================
www.bossupsolutions.com
don't be a little boss...
============================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BossUp-Rebuttal-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ---------------------------------------------------------------------------
     I) Filter Rebuttals Based on Search
  ---------------------------------------------------------------------------*/
  const searchFilter = useCallback((rebuttal: any, term: string) => {
    const searchStr = `${rebuttal.state} ${rebuttal.carrier} ${rebuttal.deniedItem} ${rebuttal.rebuttalText}`.toLowerCase();
    return searchStr.includes(term.toLowerCase());
  }, []);

  const filteredRebuttals = useMemo(() => {
    return successfulRebuttals.filter(rebuttal => 
      searchFilter(rebuttal, searchTerm)
    );
  }, [successfulRebuttals, searchTerm, searchFilter]);

  /* ---------------------------------------------------------------------------
     J) Group Rebuttals by Carrier
  ---------------------------------------------------------------------------*/
  const groupedRebuttals = successfulRebuttals.reduce((acc, curr) => {
    const key = curr.carrier;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, typeof successfulRebuttals>);

  // Helper function to safely get common denials
  const getCommonDenials = () => {
    try {
      if (!state?.deniedItem) return [];

      const keyMap: Record<string, string> = {
        'valley_metal': 'valley_treatment',
        'ventilation': 'ventilation_system',
        'hip_ridge': 'ridge_components',
        'ridge_cap': 'ridge_components'
      };

      const lookupKey = keyMap[state.deniedItem] || state.deniedItem;
      const item = commonItems[lookupKey];
      
      if (!item?.commonDenials) {
        return [];
      }

      // Format the denial reasons for display
      const denials = Object.entries(item.commonDenials)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key]) => {
          // If the key already contains spaces, assume it's already formatted
          if (key.includes(' ')) {
            return { key, label: key };
          }
          
          // Otherwise, format from snake_case
          return {
            key,
            label: key
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ')
          };
        });

      console.log('Formatted denials:', denials);  // Let's see what we get
      return denials;
    } catch (error) {
      console.error('Error getting denials:', error);
      return [];
    }
  };

  /* ---------------------------------------------------------------------------
     K) Render UI
  ---------------------------------------------------------------------------*/
  return (
    <Card 
      title="Roofing Code Rebuttal Generator" 
      className="w-full max-w-4xl mx-auto mt-8"
    >
      {/* --- Form Selections --- */}
      <div className="space-y-4">
        {/* State Selection */}
        <div className="form-group">
          <label 
            htmlFor="state-select" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="state-select"
            name="state"
            value={state.selectedState || ''}
            onChange={(e) => dispatch({
              type: 'UPDATE_FIELD',
              field: 'selectedState',
              value: e.target.value
            })}
            required
            className="w-full p-2 border rounded focus:border-blue-500"
            aria-required="true"
          >
            <option value="">Select State (Required)</option>
            {US_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Carrier Selection */}
        <div className="form-group">
          <label htmlFor="carrier-select" className="block text-sm font-medium text-gray-700 mb-1">
            Insurance Carrier
          </label>
          <select
            id="carrier-select"
            name="carrier"
            value={state.carrier}
            onChange={(e) => dispatch({
              type: 'UPDATE_FIELD',
              field: 'carrier',
              value: e.target.value
            })}
            className="w-full p-2 border rounded focus:border-blue-500"
          >
            <option value="">Select Carrier</option>
            {CARRIERS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Denied Item Selection */}
        <div className="form-group">
          <label htmlFor="denied-item-select" className="block text-sm font-medium text-gray-700 mb-1">
            Denied Item
          </label>
          <select
            id="denied-item-select"
            name="deniedItem"
            value={state.deniedItem}
            onChange={(e) => dispatch({
              type: 'UPDATE_FIELD',
              field: 'deniedItem',
              value: e.target.value
            })}
            className="w-full p-2 border rounded focus:border-blue-500"
          >
            <option value="">Select Denied Item</option>
            {DENIED_ITEMS.map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Carrier's Reason */}
        {state.deniedItem && (
          <div className="form-group">
            <label 
              htmlFor="carrier-reason-select" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Carrier's Reason
            </label>
            <select
              id="carrier-reason-select"
              name="carrierReason"
              value={state.carrierReason}
              onChange={(e) => dispatch({
                type: 'UPDATE_FIELD',
                field: 'carrierReason',
                value: e.target.value
              })}
              className="w-full p-2 border rounded focus:border-blue-500"
            >
              <option value="">Select Reason</option>
              {getCommonDenials().map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Shingle Manufacturer (Optional) */}
        {state.deniedItem && shouldShowManufacturer(state.deniedItem) && (
          <div>
            <label className="block mb-2 font-semibold">Shingle Manufacturer (Optional)</label>
            <select
              value={state.selectedManufacturer}
              onChange={(e) => dispatch({
                type: 'UPDATE_FIELD',
                field: 'selectedManufacturer',
                value: e.target.value
              })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Manufacturer</option>
              {Object.keys(manufacturerSpecs)
                .sort()
                .map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Show Manufacturer Requirements if chosen */}
        {state.selectedManufacturer && (
          <div className="p-4 bg-blue-50 rounded mt-4">
            <h2 className="font-bold mb-2">{state.selectedManufacturer} Requirements</h2>

            <p>
              <strong>Starter Requirements:</strong>{" "}
              {manufacturerSpecs[state.selectedManufacturer as keyof typeof manufacturerSpecs]
                .starter_requirements}
            </p>
            <p>
              <strong>Ice & Water Requirements:</strong>{" "}
              {manufacturerSpecs[state.selectedManufacturer as keyof typeof manufacturerSpecs]
                .ice_water_requirements}
            </p>
            <p>
              <strong>Ventilation Requirements:</strong>{" "}
              {manufacturerSpecs[state.selectedManufacturer as keyof typeof manufacturerSpecs]
                .ventilation_requirements}
            </p>
            <div className="mt-2">
              <strong>Technical Specs:</strong>
              <ul className="list-disc ml-5 mt-1">
                <li>
                  <strong>Nail Zone:</strong>{" "}
                  {
                    manufacturerSpecs[state.selectedManufacturer as keyof typeof manufacturerSpecs]
                      .technical_specs.nail_zone
                  }
                </li>
                <li>
                  <strong>Drip Edge:</strong>{" "}
                  {
                    manufacturerSpecs[state.selectedManufacturer as keyof typeof manufacturerSpecs]
                      .technical_specs.drip_edge
                  }
                </li>
                <li>
                  <strong>Overlap:</strong>{" "}
                  {
                    manufacturerSpecs[state.selectedManufacturer as keyof typeof manufacturerSpecs]
                      .technical_specs.overlap
                  }
                </li>
                <li>
                  <strong>Wind Warranty:</strong>{" "}
                  {
                    manufacturerSpecs[state.selectedManufacturer as keyof typeof manufacturerSpecs]
                      .technical_specs.wind_warranty
                  }
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-500">Recent Searches</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchTerm(search)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear Data Button */}
        <div className="mt-8 pt-4 border-t">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all stored data? This cannot be undone.')) {
                setSuccessfulRebuttals([]);
                setRecentSearches([]);
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'selectedState',
                  value: ''
                });
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'carrier',
                  value: ''
                });
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'deniedItem',
                  value: ''
                });
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'carrierReason',
                  value: ''
                });
              }
            }}
            className="text-red-600 hover:text-red-700 text-sm"
            type="button"
          >
            Clear Stored Data
          </button>
        </div>
      </div>

      {/* --- Generate Rebuttal Section --- */}
      {(() => {
        const rd = generateRebuttal();
        if (!rd) {
          // If user has partially selected, show a message
          if (state.selectedState || state.deniedItem || state.carrierReason) {
            return (
              <div className="mt-6 p-4 bg-yellow-50 rounded">
                <p className="font-semibold">
                  {state.selectedState && stateData[state.selectedState]?.IRC === "N/A"
                    ? `This location is marked as "N/A" for IRC adoption. Please check local building codes.`
                    : `Unable to generate rebuttal. Please ensure all selections are valid.`}
                </p>
              </div>
            );
          }
          return null;
        }

        // If we do have data
        return (
          <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded">
            {/* State-specific requirement */}
            {rd.stateSpecific && (
              <div className="mb-4 p-3 bg-blue-50 rounded">
                <h3 className="font-bold flex items-center">
                  <AlertCircle className="mr-2" size={18} />
                  State-Specific Requirement
                </h3>
                <p>{rd.stateSpecific}</p>
              </div>
            )}

            {/* Code reference */}
            <div>
              <h3 className="font-bold">Code Reference</h3>
              <p>{rd.code}</p>
            </div>

            {/* Rebuttal Language */}
            <div>
              <h3 className="font-bold">Rebuttal Language</h3>
              <p>{rd.rebuttal}</p>
            </div>

            {/* Carrier-specific strategy */}
            {rd.carrierSpecific && (
              <div className="p-3 bg-green-50 rounded">
                <h3 className="font-bold flex items-center">
                  <CheckCircle2 className="mr-2" size={18} />
                  Carrier-Specific Strategy
                </h3>
                <p>{rd.carrierSpecific}</p>
              </div>
            )}

            {/* Evidence needed */}
            <div>
              <h3 className="font-bold">Supporting Evidence Needed</h3>
              <ul className="list-disc pl-5">
                {rd.evidence.map((ev, index) => (
                  <li key={index} className="mt-1">
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })()}

      {/* --- Toggle for Technical Specs --- */}
      <div className="mt-4">
        <button
          onClick={() => dispatch({
            type: 'TOGGLE_TECHNICAL_SPECS',
            field: 'showTechnicalSpecs'
          })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {state.showTechnicalSpecs ? "Hide Technical Specs" : "Show Technical Specs"}
        </button>
      </div>

      {/* --- Technical Specs Display --- */}
      {state.showTechnicalSpecs && (
        <div className="mt-4 p-4 bg-gray-100 rounded space-y-4">
          <h2 className="font-bold text-lg mb-2">General Technical Specs</h2>

          {/* Deck requirements */}
          <div>
            <h3 className="font-semibold">Deck Requirements</h3>
            <ul className="list-disc ml-5">
              <li>
                <strong>Plywood Minimum Thickness:</strong>{" "}
                {technicalSpecs.deck_requirements.minimum_thickness.plywood}
              </li>
              <li>
                <strong>OSB Minimum Thickness:</strong>{" "}
                {technicalSpecs.deck_requirements.minimum_thickness.osb}
              </li>
              <li>
                <strong>Fastener Pullout:</strong>{" "}
                {technicalSpecs.deck_requirements.fastener_pullout}
              </li>
              <li>
                <strong>Deflection Limits:</strong>{" "}
                {technicalSpecs.deck_requirements.deflection_limits}
              </li>
            </ul>
          </div>

          {/* Fastener specs */}
          <div>
            <h3 className="font-semibold">Fastener Specs</h3>
            <ul className="list-disc ml-5">
              <li>
                <strong>Nail Length:</strong> {technicalSpecs.fastener_specs.nails.length}
              </li>
              <li>
                <strong>Nail Head Size:</strong>{" "}
                {technicalSpecs.fastener_specs.nails.head_size}
              </li>
              <li>
                <strong>Nail Shank:</strong>{" "}
                {technicalSpecs.fastener_specs.nails.shank}
              </li>
              <li>
                <strong>Staples:</strong> {technicalSpecs.fastener_specs.staples}
              </li>
            </ul>
          </div>

          {/* Flashing requirements */}
          <div>
            <h3 className="font-semibold">Flashing Requirements</h3>
            <ul className="list-disc ml-5">
              <li>
                <strong>Minimum Thickness:</strong>{" "}
                {technicalSpecs.flashing_requirements.minimum_thickness}
              </li>
              <li>
                <strong>Step Flashing:</strong>{" "}
                {technicalSpecs.flashing_requirements.step_flashing}
              </li>
              <li>
                <strong>Valley Metal:</strong>{" "}
                {technicalSpecs.flashing_requirements.valley_metal}
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* --- Buttons for Mark as Successful and Export Rebuttal --- */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Download className="mr-2" size={18} />
          Export Rebuttal
        </button>
        <button
          onClick={handleSuccessfulRebuttal}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <ThumbsUp className="mr-2" size={18} />
          Mark as Successful
        </button>
      </div>

      {/* --- Success Tracking with Search --- */}
      {successfulRebuttals.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded">
          {/* --- Stats Section --- */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded">
              <h4>Total Rebuttals</h4>
              <p className="text-2xl">{successfulRebuttals.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <h4>Most Common Carrier</h4>
              <p className="text-2xl">
                {Object.entries(groupedRebuttals)
                  .sort((a, b) => b[1].length - a[1].length)[0]?.[0] || 'None'}
              </p>
            </div>
            {/* Add more stats as needed */}
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Success Tracking</h3>
            <input
              type="text"
              placeholder="Search rebuttals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border rounded"
            />
          </div>

          <div className="space-y-2">
            {filteredRebuttals.map((rebuttal, index) => (
              <div key={index} className="p-3 bg-white rounded border">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {rebuttal.state} - {rebuttal.carrier}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(rebuttal.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm mt-1">{rebuttal.rebuttalText}</p>
              </div>
            ))}
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {filteredRebuttals.length} successful rebuttal(s) recorded
          </p>
        </div>
      )}

      {/* Updated FeedbackComponent with props */}
      {generateRebuttal() && (
        <FeedbackComponent
          context={{
            state: state.selectedState,
            deniedItem: state.deniedItem,
            carrierReason: state.carrierReason
          }}
        />
      )}

      <ClientFeedbackHistory />

      {successfulRebuttals.length > 0 && (
        <div className="mt-4">
          <ExportButton rebuttals={successfulRebuttals} />
        </div>
      )}

      {successfulRebuttals.length > 0 && (
        <>
          <SearchAndFilter
            searchTerm={rebuttalSearchQuery}
            setSearchTerm={setRebuttalSearchQuery}
            filters={filters}
            updateFilters={updateFilters}
            states={states}
            carriers={uniqueCarriers}
            deniedItems={deniedItems}
          />

          <div className="mt-4">
            {searchFilteredRebuttals.map((rebuttal, index) => (  // updated reference
              <div key={index} className="p-3 bg-white rounded border">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {rebuttal.state} - {rebuttal.carrier}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(rebuttal.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm mt-1">{rebuttal.rebuttalText}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}