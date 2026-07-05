export const site = {
  name: "EmberX Defense",
  namePrimary: "EmberX",
  nameSecondary: "Defense",
  url: "https://emberxdefense.com",
  description:
    "EmberX Defense is an intelligent exterior wildfire defense system for mountain homes in Reno, Lake Tahoe, Truckee, Carson City, and Northern Nevada. Directional zone sprinklers, bio-safe retardant, and grid-independent solar power.",
  shortDescription:
    "Intelligent exterior wildfire defense for mountain homes in Reno, Lake Tahoe, Truckee, and Carson City.",
  tagline: "Your home fights back when you can't.",
  heroSubhead:
    "Embers arrive before flames. Once you evacuate, your home is on its own. EmberX deploys directional water and yard-safe retardant across your perimeter — powered by solar, independent of the grid.",
  region: {
    label: "Reno, Tahoe & Northern Nevada",
    caption: "Reno · Lake Tahoe · Truckee · Carson City",
    places: ["Reno", "Lake Tahoe", "Truckee", "Carson City"] as const,
  },
  title:
    "EmberX Defense | Wildfire Defense System for Reno, Lake Tahoe & Truckee",
  titleShort: "EmberX Defense | Exterior Wildfire Defense",
  keywords: [
    "EmberX Defense",
    "wildfire defense system Reno",
    "wildfire defense Lake Tahoe",
    "wildfire defense Truckee",
    "wildfire defense Carson City",
    "home wildfire sprinkler system Nevada",
    "exterior wildfire sprinkler system",
    "wildfire mitigation system Reno",
    "defensible space water system Tahoe",
    "smart wildfire defense system",
    "roof sprinkler wildfire system",
    "wildfire retardant home defense",
    "solar powered wildfire defense",
    "grid independent fire protection",
    "Northern Nevada wildfire protection",
  ],
} as const;

export const faqItems = [
  {
    question: "Is this an interior fire sprinkler system?",
    answer:
      "No. EmberX Defense is an exterior wildfire mitigation system designed for roofline, eave, and perimeter pre-wetting with directional zone control. It is not an interior fire suppression sprinkler system.",
  },
  {
    question: "Does this system guarantee my home will survive a wildfire?",
    answer:
      "No. This system is designed to help reduce ember ignition risk and support defensible-space efforts. It does not guarantee structure survival and is not a replacement for evacuation planning, home hardening, or guidance from fire professionals.",
  },
  {
    question: "What areas does EmberX Defense serve?",
    answer:
      "The system is being developed for homeowners in Reno, Lake Tahoe, Truckee, Carson City, and nearby Northern Nevada and Sierra Nevada communities.",
  },
  {
    question: "How does the water supply work during a fire?",
    answer:
      "The system uses city water as long as municipal supply is available, then automatically switches to an on-site backup reservoir (typically 5,000–15,000 gallons) pumped through zone solenoids. A biodegradable, yard-safe retardant mixes into the water stream before deployment.",
  },
  {
    question: "Does it need grid power?",
    answer:
      "No. The controller runs on a Raspberry Pi powered by solar panels with battery backup. The system is designed to operate independently when utility power and water are disrupted.",
  },
] as const;

export const hardwareSpecs = [
  {
    title: "Directional Zone Sprinklers",
    detail:
      "Four perimeter zones (N, E, S, W), each controlled by its own solenoid. The controller activates windward and flanking zones against the fire front — three of four zones deploy while the leeward side stays on standby.",
    stat: "4 zones",
  },
  {
    title: "Dual Water Supply",
    detail:
      "City main water runs first. When municipal supply is lost, the system switches to an on-site reservoir (5,000–15,000 gal) with a dedicated pump pressurizing zone lines.",
    stat: "City → Reservoir",
  },
  {
    title: "Bio-Safe Retardant",
    detail:
      "A biodegradable, yard-safe fire retardant injects into the water stream at the mixing manifold — pre-wetting structure and defensible space without harming landscaping.",
    stat: "Mixed at manifold",
  },
  {
    title: "Solar + Controller",
    detail:
      "Raspberry Pi controller takes the fire approach direction you set, routes flow to windward and flanking zones, and manages solenoid valves. Solar panels with battery backup — no grid dependency.",
    stat: "Off-grid ready",
  },
] as const;

export const regionCards = [
  {
    place: "Reno",
    state: "Nevada",
    copy: "Foothill and canyon homes along the eastern Sierra face increasing wildfire exposure. EmberX provides automated exterior defense when evacuation leaves your property undefended.",
  },
  {
    place: "Lake Tahoe",
    state: "California / Nevada",
    copy: "Dense forest, steep terrain, and limited water access make Tahoe Basin properties especially vulnerable to ember storms. Directional zone deployment targets the windward approach.",
  },
  {
    place: "Truckee",
    state: "California",
    copy: "Mountain communities at elevation with long fire seasons and variable wind patterns. Set the approach direction and the system activates the correct zones.",
  },
  {
    place: "Carson City",
    state: "Nevada",
    copy: "Capital region homes at the wildland-urban interface benefit from grid-independent, solar-powered defense that switches to on-site water when city supply fails.",
  },
] as const;
