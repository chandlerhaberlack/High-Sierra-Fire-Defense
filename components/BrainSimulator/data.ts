import type { ReadinessLevel } from "@/lib/site";

/* ── Components of the system ── */

export type SensorId = "nodes" | "air" | "cameras";

export type ComponentId =
  | SensorId
  | "brain"
  | "sms"
  | "watchduty"
  | "tank"
  | "pump"
  | "zones"
  | "power"
  | "phone";

export interface ComponentInfo {
  id: ComponentId;
  name: string;
  kind: "Detection" | "Central Computer" | "Deployment" | "Communication" | "Power";
  what: string;
  does: string;
  feeds: string;
  connects: ComponentId[];
}

export const COMPONENTS: Record<ComponentId, ComponentInfo> = {
  nodes: {
    id: "nodes",
    name: "Perimeter Thermal Nodes",
    kind: "Detection",
    what: "Eight small temperature sensors dotted around the property line, each with a melt-wire circuit.",
    does: "Watches for fire-level heat right at your boundary. If the wire melts, the circuit breaks — a fail-safe alarm that can't be faked by a software glitch.",
    feeds: "Reports to the central computer as one of the three detection votes.",
    connects: ["brain"],
  },
  air: {
    id: "air",
    name: "Ambient Air Sensor",
    kind: "Detection",
    what: "An air-temperature sensor on the perimeter and the house.",
    does: "Watches how fast the air is heating up — a wall of hot air sweeping across the property, not a warm afternoon.",
    feeds: "Reports to the central computer as one of the three detection votes.",
    connects: ["brain"],
  },
  cameras: {
    id: "cameras",
    name: "Thermal Cameras",
    kind: "Detection",
    what: "Two thermal cameras on opposite corners of the property — each sweeps its own 180°, so together they cover every approach. They see heat, not detail.",
    does: "Asleep in normal conditions. They power on automatically at Level 2 — a red flag warning or evacuation notice — and scan their half of the horizon for heat signatures.",
    feeds: "Reports to the central computer as one of the three detection votes. You can tap in and watch the live feed anytime they're on.",
    connects: ["brain", "power"],
  },
  brain: {
    id: "brain",
    name: "Central Computer",
    kind: "Central Computer",
    what: "A small, dedicated computer (a Raspberry Pi) in a weatherproof box — it runs the entire system.",
    does: "Reads every sensor and counts the votes: 3 of 3 must agree in normal conditions, 2 of 3 when armed, just 1 of 3 when critical. It also heartbeats each sensor and texts you if one goes quiet.",
    feeds: "Fires the pump when the vote passes, and reports everything to your phone by SMS text.",
    connects: ["nodes", "air", "cameras", "sms", "watchduty", "pump", "power"],
  },
  sms: {
    id: "sms",
    name: "SMS Text",
    kind: "Communication",
    what: "A cellular text-message modem mounted directly on the central computer.",
    does: "Sends you an SMS text for every alert and status change, and accepts your text commands — DEPLOY, STOP, LEVEL — over the cell network. It works even when your home internet is down.",
    feeds: "The two-way text link between the central computer and your phone.",
    connects: ["brain", "phone"],
  },
  watchduty: {
    id: "watchduty",
    name: "GPS + WatchDuty",
    kind: "Communication",
    what: "An on-board GPS fix plus a live feed from WatchDuty and National Weather Service alerts.",
    does: "Knows exactly which evacuation zone your home sits in — Ready, Set, or GO NOW — and whether a red flag warning is active.",
    feeds: "Sets the central computer's readiness level automatically. If the internet drops, you set the level yourself from the app.",
    connects: ["brain"],
  },
  tank: {
    id: "tank",
    name: "Retardant Reservoir",
    kind: "Deployment",
    what: "A dedicated on-site tank of biodegradable, yard-safe fire retardant.",
    does: "Holds everything the system needs to coat your home — no dependence on municipal water, which is often the first thing to fail in a fire.",
    feeds: "Feeds the pump. Refilled by our local service partner after a deployment.",
    connects: ["pump"],
  },
  pump: {
    id: "pump",
    name: "Pump",
    kind: "Deployment",
    what: "A dedicated pump plumbed between the reservoir and the sprinkler lines.",
    does: "Spins up on the central computer's deploy signal and pressurizes all four zone lines within seconds.",
    feeds: "Pushes retardant out to the perimeter sprinkler zones.",
    connects: ["brain", "tank", "zones", "power"],
  },
  zones: {
    id: "zones",
    name: "Sprinkler Zones",
    kind: "Deployment",
    what: "Four sprinkler zones — north, east, south, west — covering the roofline, eaves, and defensible space.",
    does: "The same proven perimeter sprinkler layout, now delivering retardant instead of water.",
    feeds: "Coats every side of the home when the system deploys.",
    connects: ["pump"],
  },
  power: {
    id: "power",
    name: "Independent Power",
    kind: "Power",
    what: "Grid power when available, with solar panels and a battery bank always standing by.",
    does: "Switches over automatically the moment the grid fails — the system drops into low-power mode and keeps watching. It never needs the grid.",
    feeds: "Runs the central computer, the cameras, and the pump.",
    connects: ["brain", "cameras", "pump"],
  },
  phone: {
    id: "phone",
    name: "Your Phone",
    kind: "Communication",
    what: "The whole system reports to your pocket — SMS text alerts plus a phone and web app.",
    does: "Shows you every sensor, the readiness level, and the camera feeds. Alerts arrive by SMS text the moment anything changes.",
    feeds: "You can set the readiness level manually, stop a countdown, or bypass everything and deploy right now.",
    connects: ["sms"],
  },
};

export const SENSOR_IDS: SensorId[] = ["nodes", "air", "cameras"];

export const SENSOR_LABEL: Record<SensorId, string> = {
  nodes: "Perimeter nodes",
  air: "Air sensor",
  cameras: "Thermal cameras",
};

/** Compact metadata for the sensor bank cards. */
export const SENSOR_META: Record<SensorId, { name: string; sub: string }> = {
  nodes: { name: "Perimeter Nodes", sub: "8× melt-wire · property line" },
  air: { name: "Air Sensor", sub: "rate-of-rise temperature" },
  cameras: { name: "Thermal Cameras", sub: "2 cameras · 180° each" },
};

/* ── Fire-approach scenario ── */

export type EvacStatus = "none" | "ready" | "set" | "go";

export const EVAC_LABEL: Record<EvacStatus, string> = {
  none: "No orders",
  ready: "READY",
  set: "SET",
  go: "GO NOW",
};

/** WatchDuty evacuation status drives the system's readiness level. */
export const EVAC_TO_LEVEL: Record<EvacStatus, ReadinessLevel> = {
  none: 1,
  ready: 2,
  set: 2,
  go: 3,
};

export interface SmsMessage {
  from: "system" | "you";
  text: string;
}

/** A single frame of system state, derived from either the scenario or explore-mode controls. */
export interface SimSnapshot {
  level: ReadinessLevel;
  evac: EvacStatus;
  redFlag: boolean;
  gridPower: boolean;
  fireProgress: number;
  tripped: ReadonlySet<SensorId>;
  deployed: boolean;
  camerasOn: boolean;
  votesRequired: number;
}

export interface ScenarioStep {
  id: string;
  short: string;
  title: string;
  narration: string;
  level: ReadinessLevel;
  evac: EvacStatus;
  redFlag: boolean;
  gridPower: boolean;
  /** 0 = no fire, 1 = fire at the property line (drives the WatchDuty map + glow) */
  fireProgress: number;
  tripped: SensorId[];
  deployed: boolean;
  sms: SmsMessage[];
}

export const SCENARIO: ScenarioStep[] = [
  {
    id: "quiet",
    short: "Quiet day",
    title: "A normal day in the Sierra",
    narration:
      "Blue skies. The system sits at Level 1 — Standby. Cameras are asleep, and all three detection layers would have to agree before anything deploys.",
    level: 1,
    evac: "none",
    redFlag: false,
    gridPower: true,
    fireProgress: 0,
    tripped: [],
    deployed: false,
    sms: [
      {
        from: "system",
        text: "EmberX daily check ✓ 10 sensors healthy · reservoir 100% · battery 100%. Level 1 — Standby.",
      },
    ],
  },
  {
    id: "redflag",
    short: "Red flag",
    title: "Red flag warning issued",
    narration:
      "The National Weather Service issues a red flag warning. The central computer sees it and steps up to Level 2 — Armed. Thermal cameras power on, and now any two detections will deploy.",
    level: 2,
    evac: "none",
    redFlag: true,
    gridPower: true,
    fireProgress: 0,
    tripped: [],
    deployed: false,
    sms: [
      {
        from: "system",
        text: "⚠ NWS Red Flag Warning for your area. Stepping up to Level 2 — Armed. Thermal cameras: ON. Any 2 of 3 detections will deploy.",
      },
    ],
  },
  {
    id: "fire",
    short: "Fire nearby",
    title: "A fire starts nearby",
    narration:
      "WatchDuty reports a new fire a few miles out. The central computer's GPS puts your home in the SET evacuation zone. The system holds at Level 2, cameras sweeping.",
    level: 2,
    evac: "set",
    redFlag: true,
    gridPower: true,
    fireProgress: 0.35,
    tripped: [],
    deployed: false,
    sms: [
      {
        from: "system",
        text: "WatchDuty: new fire reported 4.2 mi NE of your home. Your evacuation zone is now SET. Holding Level 2 — Armed.",
      },
    ],
  },
  {
    id: "gonow",
    short: "GO NOW",
    title: "Evacuation order: GO NOW",
    narration:
      "Your zone flips to GO NOW. The central computer escalates to Level 3 — Critical: one detection is now enough, no countdown. The grid fails minutes later — solar and battery take over without a blink.",
    level: 3,
    evac: "go",
    redFlag: true,
    gridPower: false,
    fireProgress: 0.6,
    tripped: [],
    deployed: false,
    sms: [
      {
        from: "system",
        text: "🚨 Your zone is GO NOW — evacuate immediately. Level 3 — Critical: any single detection deploys instantly.",
      },
      {
        from: "system",
        text: "Grid power lost. Switched to solar + battery — low-power mode. All sensors online.",
      },
    ],
  },
  {
    id: "detect",
    short: "Detection",
    title: "The camera sees it first",
    narration:
      "A heat signature crests the ridge to the northeast. At Level 3, one vote is all it takes — the central computer fires the pump and retardant hits all four zones while the fire is still beyond the fence line.",
    level: 3,
    evac: "go",
    redFlag: true,
    gridPower: false,
    fireProgress: 0.85,
    tripped: ["cameras"],
    deployed: true,
    sms: [
      {
        from: "system",
        text: "🔥 Thermal camera 1: heat signature NE, closing. 1 of 1 votes met at Level 3. DEPLOYING — all 4 zones. Tap to view camera.",
      },
    ],
  },
  {
    id: "soak",
    short: "Deployed",
    title: "The home is coated",
    narration:
      "The air sensor spikes and a melt-wire severs at the property line — the fire has arrived, but the house and defensible space are already coated in retardant. Every update lands on your phone, wherever you are.",
    level: 3,
    evac: "go",
    redFlag: true,
    gridPower: false,
    fireProgress: 1,
    tripped: ["cameras", "air", "nodes"],
    deployed: true,
    sms: [
      {
        from: "system",
        text: "Air temp rising 9°F/min · perimeter node 3 melt-wire severed. Fire at property line. Retardant flowing · reservoir 74%.",
      },
      {
        from: "system",
        text: "Your home is coated. 3 of 3 layers confirmed the fire. Stay safe — I've got the house.",
      },
    ],
  },
];
