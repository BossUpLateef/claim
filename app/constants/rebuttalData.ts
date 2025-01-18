export const commonItems = {
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

  // ... continuing with more items ...
} 