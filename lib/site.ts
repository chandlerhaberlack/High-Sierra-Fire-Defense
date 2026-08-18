export const site = {
  name: "EmberX Defense",
  namePrimary: "EmberX",
  nameSecondary: "Defense",
  url: "https://emberxdefense.com",
  description:
    "EmberX Defense builds an autonomous wildfire defense system for mountain homes in Reno, Lake Tahoe, Truckee, Carson City, and Northern Nevada. Three layers of fire detection — perimeter thermal nodes, an ambient air sensor, and paired 180° thermal cameras — feed an on-site central computer that tracks evacuation orders via GPS and WatchDuty, arms itself as danger rises, and deploys bio-safe fire retardant through perimeter sprinklers. Independent power, SMS text alerts, full manual control from your phone.",
  shortDescription:
    "Autonomous wildfire detection and retardant deployment for mountain homes in Reno, Lake Tahoe, Truckee, and Carson City.",
  tagline: "Your home fights back when you can't.",
  heroClaim: "The most advanced wildfire detection ever built for a home.",
  heroSubhead:
    "Embers arrive before flames. Once you evacuate, your home is on its own. EmberX watches with three layers of fire detection, arms itself as evacuation orders escalate, and coats your perimeter in bio-safe retardant the moment fire reaches your property — on its own power, with every alert sent straight to your phone.",
  region: {
    label: "Reno, Tahoe & Northern Nevada",
    caption: "Reno · Lake Tahoe · Truckee · Carson City",
    places: ["Reno", "Lake Tahoe", "Truckee", "Carson City"] as const,
  },
  title:
    "EmberX Defense | Autonomous Wildfire Defense for Reno, Lake Tahoe & Truckee",
  titleShort: "EmberX Defense | Autonomous Wildfire Defense",
  keywords: [
    "EmberX Defense",
    "autonomous wildfire defense system",
    "wildfire defense system Reno",
    "wildfire defense Lake Tahoe",
    "wildfire defense Truckee",
    "wildfire defense Carson City",
    "wildfire detection system home",
    "thermal fire detection home",
    "home fire retardant sprinkler system",
    "exterior wildfire sprinkler system",
    "wildfire mitigation system Reno",
    "smart wildfire defense system",
    "wildfire retardant home defense",
    "WatchDuty home integration",
    "off-grid wildfire protection",
    "grid independent fire protection",
    "Northern Nevada wildfire protection",
  ],
} as const;

/**
 * The single flagship system: three detection layers feeding an on-site brain
 * that deploys retardant through four perimeter sprinkler zones.
 */
export const system = {
  name: "EmberX Defense System",
  shortName: "EmberX",
  tagline: "It detects. It arms. It deploys.",
  summary:
    "Eight perimeter thermal nodes, an ambient air sensor, and two thermal cameras — each sweeping its own 180° — feed an on-site central computer. The computer tracks your exact evacuation status via GPS and WatchDuty, steps through three readiness levels as danger rises, and deploys bio-safe retardant through four perimeter sprinkler zones — automatically, or on your command.",
} as const;

/**
 * Readiness levels. The number of detection layers that must agree before
 * the system deploys drops as conditions worsen: 3-of-3 → 2-of-3 → 1-of-3.
 */
export const readinessLevels = [
  {
    level: 1,
    name: "Standby",
    vote: "3 of 3",
    votesRequired: 3,
    conditions: "Normal conditions",
    detail:
      "Blue skies. All three detection layers must agree before the system deploys — a near-zero chance of a false alarm. Thermal cameras stay powered down.",
  },
  {
    level: 2,
    name: "Armed",
    vote: "2 of 3",
    votesRequired: 2,
    conditions: "Red flag warning · evacuation Ready or Set",
    detail:
      "A red flag warning or a Ready/Set evacuation notice puts the system on alert. Thermal cameras power on and any two detection layers can trigger deployment.",
  },
  {
    level: 3,
    name: "Critical",
    vote: "1 of 3",
    votesRequired: 1,
    conditions: "GO NOW evacuation order",
    detail:
      "Your zone is under a GO NOW order. Fire is expected. A single detection — one melted wire, one heat signature — deploys retardant immediately, no countdown.",
  },
] as const;

export type ReadinessLevel = (typeof readinessLevels)[number]["level"];

export const faqItems = [
  {
    question: "How does the system decide when to deploy?",
    answer:
      "Three independent detection layers — perimeter thermal nodes, an ambient air sensor, and thermal cameras — vote. Under normal conditions (Level 1), all three must agree before retardant deploys. When a red flag warning or evacuation notice raises the system to Level 2, any two are enough. Under a GO NOW order (Level 3), a single detection deploys immediately. Escalating danger lowers the bar; calm conditions keep it high.",
  },
  {
    question: "What sets the readiness level?",
    answer:
      "The central computer knows its own GPS position and monitors WatchDuty and National Weather Service red flag warnings over the internet, so it knows exactly which evacuation status your property is under at all times. It steps between levels automatically. If the internet connection drops, you can set the level yourself from the phone app — and you can always override the level manually.",
  },
  {
    question: "What happens if the internet, cell service, or power fails?",
    answer:
      "Each failure degrades gracefully. No internet: automatic level-setting pauses, but SMS alerts still flow over the cellular network and you set the level from your phone. No cell service: you lose remote alerts, but the sensors, the brain, and the pump are all local — detection and deployment keep working. No grid power: the system was never dependent on it. Solar panels and a battery bank run everything in low-power mode.",
  },
  {
    question: "Can I fire the system myself?",
    answer:
      "Yes. You can bypass every sensor and deploy manually from your phone at any time — one command over SMS or the app. You'll get a confirmation the moment retardant starts flowing.",
  },
  {
    question: "What about false alarms?",
    answer:
      "The voting logic is the first defense: under normal conditions a single faulty reading can't trigger anything, because all three layers must agree. At Levels 1 and 2 the system also texts you before deploying, with a short window to reply STOP. Only at Level 3 — an active GO NOW evacuation — does it fire without waiting. The central computer heartbeats every sensor around the clock and texts you if one goes quiet, and runs a weekly self-test.",
  },
  {
    question: "Is the retardant safe for my property?",
    answer:
      "The system deploys a biodegradable, yard-safe fire retardant from an on-site reservoir — the same class of product used to pre-treat structures ahead of fire fronts. It rinses off hardscape and won't kill landscaping. After a deployment, the reservoir is refilled through our local service partner.",
  },
  {
    question: "Does it work in winter?",
    answer:
      "It's designed for the Sierra. The retardant reservoir and supply lines are freeze-protected, and the low-power electronics run year-round on the solar and battery bank — readiness doesn't take a season off.",
  },
  {
    question: "Is this an interior fire sprinkler system?",
    answer:
      "No. EmberX Defense is an exterior wildfire mitigation system that detects approaching fire and coats the roofline, eaves, and defensible space in retardant. It is not an interior fire suppression sprinkler system.",
  },
  {
    question: "Does this system guarantee my home will survive a wildfire?",
    answer:
      "No. This system is designed to reduce ember ignition risk and support defensible-space efforts. It does not guarantee structure survival and is not a replacement for evacuation planning, home hardening, or guidance from fire professionals. Some insurers offer discounts for monitored mitigation systems — ask yours.",
  },
  {
    question: "What areas does EmberX Defense serve?",
    answer:
      "The system is being developed for homeowners in Reno, Lake Tahoe, Truckee, Carson City, and nearby Northern Nevada and Sierra Nevada communities.",
  },
] as const;

export const hardwareSpecs = [
  {
    title: "Perimeter Thermal Nodes",
    detail:
      "Eight temperature nodes dot the property line. Each carries a melt-wire that physically severs in fire-level heat — a broken circuit is an unmistakable, fail-safe alarm that needs no software to be believed.",
    stat: "8 nodes",
  },
  {
    title: "Ambient Air Sensor",
    detail:
      "Mounted on the perimeter and the house, it watches the rate of temperature rise — not just the number. A wall of hot air moving across the property reads very differently from a warm afternoon.",
    stat: "Rate-of-rise",
  },
  {
    title: "Dual Thermal Cameras",
    detail:
      "Two thermal cameras on opposite corners, each sweeping its own 180° — together they cover every approach to the property. They sleep through normal conditions and power on automatically at Level 2 — a red flag warning or evacuation notice. Thermal only: they see heat, not detail.",
    stat: "2× 180°",
  },
  {
    title: "Central Computer",
    detail:
      "A Raspberry Pi central computer reads every sensor, runs the 3-of-3 / 2-of-3 / 1-of-3 voting logic, and fires the pump. An SMS text modem reaches you over cellular; on-board GPS plus a WatchDuty feed tell it exactly which evacuation zone your home sits in.",
    stat: "Pi + SMS + GPS",
  },
  {
    title: "Retardant Reservoir + Pump",
    detail:
      "A dedicated on-site reservoir of bio-safe, yard-friendly retardant feeds a pump that pressurizes four perimeter sprinkler zones — north, east, south, west. No dependence on municipal supply, which is often the first thing to fail.",
    stat: "4 zones",
  },
  {
    title: "Independent Power",
    detail:
      "Grid power when it's there, solar panels and a battery bank when it isn't. The switchover is automatic: the system drops into low-power mode and keeps watching. It never depends on the grid to defend your home.",
    stat: "Grid → Solar",
  },
] as const;

export const regionCards = [
  {
    place: "Reno",
    state: "Nevada",
    copy: "Foothill and canyon homes along the eastern Sierra face increasing wildfire exposure. EmberX keeps watching and deploys retardant automatically when evacuation leaves your property undefended.",
  },
  {
    place: "Lake Tahoe",
    state: "California / Nevada",
    copy: "Dense forest, steep terrain, and unreliable municipal supply during fires make Tahoe Basin properties especially vulnerable to ember storms. An on-site retardant reservoir means the system never waits on a hydrant.",
  },
  {
    place: "Truckee",
    state: "California",
    copy: "Mountain communities at elevation with long fire seasons and fast-moving evacuation orders. The central computer tracks your zone's status on WatchDuty and arms itself before you've finished packing.",
  },
  {
    place: "Carson City",
    state: "Nevada",
    copy: "Capital region homes at the wildland-urban interface benefit from grid-independent defense that detects, decides, and deploys on its own power — even after utilities are cut.",
  },
] as const;
