export const site = {
  name: "EmberX Defense",
  namePrimary: "EmberX",
  nameSecondary: "Defense",
  url: "https://emberxdefense.com",
  description:
    "EmberX Defense builds exterior wildfire defense systems for mountain homes in Reno, Lake Tahoe, Truckee, Carson City, and Northern Nevada. EmberX Shield soaks the full perimeter with water; EmberX Guardian adds directional zone defense and bio-safe retardant. Solar powered, grid independent, SMS controlled.",
  shortDescription:
    "Intelligent exterior wildfire defense for mountain homes in Reno, Lake Tahoe, Truckee, and Carson City.",
  tagline: "Your home fights back when you can't.",
  heroSubhead:
    "Embers arrive before flames. Once you evacuate, your home is on its own. EmberX soaks your perimeter with water — or targets the fire's approach with directional zones and yard-safe retardant. Solar powered, grid independent, one SMS away.",
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
    "EmberX Shield",
    "EmberX Guardian",
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

export const products = {
  shield: {
    id: "shield",
    name: "EmberX Shield",
    shortName: "Shield",
    tier: "Base",
    tagline: "Soak the whole perimeter.",
    summary:
      "Pure water defense. One command deploys all four perimeter zones at once — city water first, on-site reservoir when supply fails.",
  },
  guardian: {
    id: "guardian",
    name: "EmberX Guardian",
    shortName: "Guardian",
    tier: "Advanced",
    tagline: "Defend in the direction of the fire.",
    summary:
      "Directional zone defense with bio-safe retardant. Point the system at the fire and it concentrates water and retardant on the windward and flanking zones, while the standby zone cycles on for 1 minute every 10 minutes.",
  },
} as const;

export type ProductTier = keyof typeof products;

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
      "No. The control system runs on solar panels with battery backup and takes commands over SMS. The system is designed to operate independently when utility power and water are disrupted.",
  },
  {
    question: "What's the difference between EmberX Shield and EmberX Guardian?",
    answer:
      "EmberX Shield is the base system: pure water defense that deploys all four perimeter zones at once on a single SMS command. EmberX Guardian adds directional zone defense — it concentrates flow on the windward and flanking zones facing the fire — plus bio-safe retardant injected into the water stream. Guardian's standby zone still cycles on for 1 minute every 10 minutes by default; you can adjust that interval or run all four zones simultaneously. Both share the same dual water supply, solar power, and SMS control.",
  },
] as const;

export const hardwareSpecs = [
  {
    title: "Perimeter Zone Sprinklers",
    detail:
      "Four perimeter zones (N, E, S, W), each controlled by its own solenoid. Shield deploys all four zones at once for full-perimeter soaking. Guardian concentrates on the windward and flanking zones while the standby zone cycles on for 1 minute every 10 minutes — adjust the timing or run all four at once.",
    stat: "4 zones",
  },
  {
    title: "Dual Water Supply",
    detail:
      "City main water runs first. When municipal supply is lost, the system switches to an on-site reservoir (5,000–15,000 gal) with a dedicated pump pressurizing zone lines. Standard on both products.",
    stat: "City → Reservoir",
  },
  {
    title: "Bio-Safe Retardant",
    detail:
      "Guardian only. A biodegradable, yard-safe fire retardant injects into the water stream at the mixing manifold — pre-wetting structure and defensible space without harming landscaping.",
    stat: "Guardian",
  },
  {
    title: "Solar Control System + SMS",
    detail:
      "A solar-powered control system with battery backup takes your commands over SMS — deploy, set the fire direction, check status — and manages the pump and solenoid valves. No grid dependency.",
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
