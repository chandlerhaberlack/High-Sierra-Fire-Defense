"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { readinessLevels, type ReadinessLevel } from "@/lib/site";
import {
  EVAC_LABEL, EVAC_TO_LEVEL, SCENARIO, SENSOR_LABEL,
  type ComponentId, type EvacStatus, type SensorId, type SimSnapshot, type SmsMessage,
} from "./data";
import { LEVEL_COLOR, EVAC_COLOR } from "./palette";
import { PropertyView } from "./PropertyView";
import { SignalFlow } from "./SignalFlow";
import { WatchDutyMap } from "./WatchDutyMap";
import { SensorBank } from "./SensorBank";
import { Explainer } from "./Explainer";
import { SmsThread } from "./SmsThread";
import { ThermalCamera } from "./ThermalCamera";

type Mode = "simulate" | "explore";

const HEARTBEAT: SmsMessage = {
  from: "system",
  text: "EmberX daily check ✓ 10 sensors healthy · reservoir 100% · battery 100%. Level 1 — Standby.",
};

const STEP_MS = 6500;

const levelInfo = (l: ReadinessLevel) => readinessLevels[l - 1];

export function BrainSimulator() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  /* The root is far taller than the viewport, so trigger on any visibility. */
  const inView = useInView(rootRef, { amount: "some", margin: "0px 0px -15% 0px" });

  const [mode, setMode] = useState<Mode>("simulate");
  const [selected, setSelected] = useState<ComponentId | null>(null);

  /* ── Explore-mode state ── */
  const [level, setLevel] = useState<ReadinessLevel>(1);
  const [evac, setEvac] = useState<EvacStatus>("none");
  const [tripped, setTripped] = useState<ReadonlySet<SensorId>>(new Set());
  const [manualDeployed, setManualDeployed] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [messages, setMessages] = useState<SmsMessage[]>([HEARTBEAT]);

  /* ── Simulate-mode state ── */
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  const step = SCENARIO[stepIdx];
  const atEnd = stepIdx === SCENARIO.length - 1;

  /* Auto-advance the scenario — only while it's actually on screen. */
  useEffect(() => {
    if (mode !== "simulate" || !playing || reduced || atEnd || !inView) return;
    const id = setTimeout(() => setStepIdx((i) => i + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [mode, playing, stepIdx, atEnd, reduced, inView]);

  const exploreDeployed = manualDeployed || tripped.size >= levelInfo(level).votesRequired;

  const snap: SimSnapshot = useMemo(() => {
    if (mode === "simulate") {
      return {
        level: step.level,
        evac: step.evac,
        redFlag: step.redFlag,
        gridPower: step.gridPower,
        fireProgress: step.fireProgress,
        tripped: new Set(step.tripped),
        deployed: step.deployed,
        camerasOn: step.level >= 2,
        votesRequired: levelInfo(step.level).votesRequired,
      };
    }
    return {
      level,
      evac,
      redFlag: evac !== "none" || level >= 2,
      gridPower: !lowPower,
      fireProgress: tripped.size === 0 ? 0 : 0.25 + tripped.size * 0.2,
      tripped,
      deployed: exploreDeployed,
      camerasOn: level >= 2,
      votesRequired: levelInfo(level).votesRequired,
    };
  }, [mode, step, level, evac, lowPower, tripped, exploreDeployed]);

  const shownMessages = useMemo(() => {
    if (mode === "simulate") return SCENARIO.slice(0, stepIdx + 1).flatMap((s) => s.sms);
    return messages;
  }, [mode, stepIdx, messages]);

  /* ── Explore-mode actions ── */

  function appendDeployNotice(msgs: SmsMessage[], lvl: ReadinessLevel, count: number) {
    if (lvl < 3) {
      msgs.push({
        from: "system",
        text: `${count} of ${levelInfo(lvl).votesRequired} detections confirmed at Level ${lvl}. Deploying in 60s — reply STOP to cancel.`,
      });
    }
    msgs.push({
      from: "system",
      text: "🚒 DEPLOYING — pump running, retardant flowing to all 4 zones. Reservoir 74%.",
    });
  }

  function selectEvac(next: EvacStatus) {
    if (mode !== "explore" || next === evac) return;
    const lvl = EVAC_TO_LEVEL[next];
    const info = levelInfo(lvl);
    const texts: Record<EvacStatus, string> = {
      none: "WatchDuty: all evacuation orders lifted. Level 1 — Standby. Cameras: sleeping. Deploys on 3 of 3 detections.",
      ready: "WatchDuty: your zone is now READY. Level 2 — Armed. Cameras: ON. Deploys on 2 of 3 detections.",
      set: "WatchDuty: your zone is now SET. Level 2 — Armed. Cameras: ON. Deploys on 2 of 3 detections.",
      go: "🚨 WatchDuty: your zone is GO NOW — evacuate immediately. Level 3 — Critical: any single detection deploys instantly.",
    };
    const msgs: SmsMessage[] = [{ from: "system", text: texts[next] }];
    const wasDeployed = manualDeployed || tripped.size >= levelInfo(level).votesRequired;
    if (!wasDeployed && tripped.size >= info.votesRequired) {
      appendDeployNotice(msgs, lvl, tripped.size);
    }
    setEvac(next);
    setLevel(lvl);
    setMessages((m) => [...m, ...msgs]);
  }

  function changeLevel(next: ReadinessLevel) {
    if (mode !== "explore" || next === level) return;
    const info = levelInfo(next);
    const msgs: SmsMessage[] = [
      { from: "you", text: `LEVEL ${next}` },
      {
        from: "system",
        text: `Manual override — readiness set to Level ${next} (${info.name}). ${
          next >= 2 ? "Thermal cameras: ON. " : "Thermal cameras: sleeping. "
        }Deploys on ${info.vote} detections.`,
      },
    ];
    const wasDeployed = manualDeployed || tripped.size >= levelInfo(level).votesRequired;
    if (!wasDeployed && !manualDeployed && tripped.size >= info.votesRequired) {
      appendDeployNotice(msgs, next, tripped.size);
    }
    setLevel(next);
    setMessages((m) => [...m, ...msgs]);
  }

  function tripSensor(id: SensorId) {
    if (mode !== "explore" || tripped.has(id)) return;
    if (id === "cameras" && level < 2) return; // cameras can't vote while asleep
    const next = new Set(tripped);
    next.add(id);
    const msgs: SmsMessage[] = [
      {
        from: "system",
        text: `⚠ ${SENSOR_LABEL[id]}: fire signature detected. ${next.size} of ${levelInfo(level).votesRequired} votes at Level ${level}.`,
      },
    ];
    if (!exploreDeployed && next.size >= levelInfo(level).votesRequired) {
      appendDeployNotice(msgs, level, next.size);
    }
    setTripped(next);
    setMessages((m) => [...m, ...msgs]);
  }

  function command(cmd: "DEPLOY" | "STATUS") {
    if (cmd === "STATUS") {
      setMessages((m) => [
        ...m,
        { from: "you", text: "STATUS" },
        {
          from: "system",
          text: `Level ${level} — ${levelInfo(level).name} · evac: ${EVAC_LABEL[evac]} · ${tripped.size}/3 sensors detecting · reservoir ${
            exploreDeployed ? "74" : "100"
          }% · ${lowPower ? "solar + battery (low power)" : "grid power"} · ${
            exploreDeployed ? "DEPLOYED" : "holding"
          }.`,
        },
      ]);
      return;
    }
    if (exploreDeployed) return;
    setManualDeployed(true);
    setMessages((m) => [
      ...m,
      { from: "you", text: "DEPLOY" },
      {
        from: "system",
        text: "Manual bypass accepted — no sensor vote needed. 🚒 DEPLOYING: pump running, retardant flowing to all 4 zones.",
      },
    ]);
  }

  function resetExplore() {
    setLevel(1);
    setEvac("none");
    setTripped(new Set());
    setManualDeployed(false);
    setLowPower(false);
    setMessages([HEARTBEAT]);
  }

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setSelected(null);
    if (next === "simulate") {
      setStepIdx(0);
      setPlaying(!reduced);
    }
  }

  const li = levelInfo(snap.level);
  const exploreDirty = tripped.size > 0 || manualDeployed || level > 1 || evac !== "none";

  return (
    <div ref={rootRef}>
      {/* ── Mode tabs ── */}
      <div className="mb-4 inline-flex border border-line bg-paper-2 p-1" role="group" aria-label="Diagram mode">
        {(["simulate", "explore"] as const).map((m) => {
          const active = mode === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              aria-pressed={active}
              className="relative px-4 py-2.5 transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="brain-mode-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 border border-ember/60 bg-ember-dim"
                  aria-hidden
                />
              )}
              <span className={`relative font-mono text-xs font-semibold uppercase tracking-wider ${active ? "text-ember" : "text-ink-muted"}`}>
                {m === "simulate" ? "▶ Simulate a fire" : "Explore the system"}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Contextual controls ── */}
      <div className="mb-4 min-h-[52px]">
        <AnimatePresence mode="wait" initial={false}>
          {mode === "explore" ? (
            <motion.div
              key="explore-controls"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-wrap items-center gap-3"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Manual level override
                <span className="ml-1 normal-case tracking-normal opacity-70">(WatchDuty on the map sets it automatically)</span>
              </span>
              <div className="flex gap-1.5" role="group" aria-label="Set readiness level manually">
                {readinessLevels.map((rl) => {
                  const active = level === rl.level;
                  const c = LEVEL_COLOR[rl.level];
                  return (
                    <button
                      key={rl.level}
                      type="button"
                      onClick={() => changeLevel(rl.level)}
                      aria-pressed={active}
                      className={`border px-3 py-2 font-mono text-xs font-bold transition-all ${
                        active ? "" : "border-line bg-paper-2 text-ink-muted hover:border-ink-muted hover:text-ink"
                      }`}
                      style={active ? { borderColor: c, color: c, backgroundColor: `${c}26`, boxShadow: `0 0 16px ${c}40` } : undefined}
                    >
                      {rl.level} · {rl.name}
                    </button>
                  );
                })}
              </div>
              {exploreDirty && (
                <button
                  type="button"
                  onClick={resetExplore}
                  className="border border-line bg-paper-2 px-3 py-2 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  ↺ Reset
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="simulate-controls"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex flex-wrap items-center gap-1.5"
            >
              {SCENARIO.map((s, i) => {
                const active = i === stepIdx;
                const c = LEVEL_COLOR[s.level];
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => { setStepIdx(i); setPlaying(false); }}
                    aria-pressed={active}
                    aria-label={`Step ${i + 1}: ${s.title}`}
                    className={`border px-2.5 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-wider transition-all ${
                      active
                        ? ""
                        : i < stepIdx
                          ? "border-line bg-paper-2 text-ink opacity-70"
                          : "border-line bg-paper-2 text-ink-muted hover:text-ink"
                    }`}
                    style={active ? { borderColor: c, color: c, backgroundColor: `${c}26` } : undefined}
                  >
                    {i + 1}. {s.short}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  if (atEnd) { setStepIdx(0); setPlaying(true); }
                  else setPlaying((p) => !p);
                }}
                className="border border-ember/50 bg-ember/10 px-3 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-ember transition-colors hover:bg-ember/20"
              >
                {atEnd ? "↺ Replay" : playing ? "❚❚ Pause" : "▶ Play"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Scenario narration ── */}
      <AnimatePresence mode="wait" initial={false}>
        {mode === "simulate" && (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="plate mb-4 border-l-2 px-4 py-3"
            style={{ borderLeftColor: LEVEL_COLOR[step.level] }}
          >
            <p className="font-display text-base font-semibold text-ink">
              {step.title}
            </p>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ink-muted">{step.narration}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Status strip ── */}
      <div className="plate mb-4 grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-5 sm:divide-y-0">
        <Status label="Readiness" value={`L${snap.level} · ${li.name}`} color={LEVEL_COLOR[snap.level]} />
        <Status label="WatchDuty" value={EVAC_LABEL[snap.evac]} color={EVAC_COLOR[snap.evac]} />
        <Status label="To Deploy" value={li.vote} />
        <Status label="Power" value={snap.gridPower ? "Grid" : "Solar·Batt"} warn={!snap.gridPower} />
        <Status label="Zones" value={snap.deployed ? "DEPLOYED" : "Ready"} warn={snap.deployed} />
      </div>

      {/* ── Diagrams ── */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <PropertyView snap={snap} selected={selected} onSelect={setSelected} />
        <div className="flex flex-col gap-4">
          <WatchDutyMap
            snap={snap}
            onSelectEvac={mode === "explore" ? selectEvac : undefined}
          />
          <SignalFlow
            snap={snap}
            smsCount={shownMessages.filter((m) => m.from === "system").length}
            manualLevel={mode === "explore"}
            selected={selected}
            onSelect={setSelected}
          />
        </div>
      </div>

      {/* ── Detection layers + explainer ── */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SensorBank
          snap={snap}
          selected={selected}
          onSelect={setSelected}
          onTrip={mode === "explore" ? tripSensor : undefined}
        />
        <Explainer
          selected={selected}
          onSelect={setSelected}
          onTrip={mode === "explore" ? tripSensor : undefined}
          tripped={snap.tripped}
          camerasOn={snap.camerasOn}
        />
      </div>

      {/* ── Phone + camera ── */}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <SmsThread
          messages={shownMessages}
          onCommand={mode === "explore" ? command : undefined}
          deployed={snap.deployed}
        />
        <ThermalCamera
          on={snap.camerasOn}
          lowPower={!snap.gridPower}
          fireIntensity={snap.tripped.has("cameras") ? Math.max(0.7, snap.fireProgress) : mode === "simulate" ? snap.fireProgress * 0.25 : 0}
          onToggleLowPower={mode === "explore" ? () => setLowPower((p) => !p) : undefined}
        />
      </div>

      <p className="mt-3 text-[0.6875rem] uppercase tracking-[0.15em] text-ink-muted">
        {mode === "explore"
          ? "Fig. 01 — Interactive system diagram (concept). Tap any component to learn what it does; trip sensors in the detection bank to watch the voting logic."
          : "Fig. 01 — Fire-approach simulation (concept). WatchDuty evacuation status arms the system step by step — accelerated here."}
      </p>
    </div>
  );
}

function Status({ label, value, warn, color }: { label: string; value: string; warn?: boolean; color?: string }) {
  return (
    <div className="px-3 py-2.5 text-center">
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-ink-muted">{label}</p>
      <p
        className={`mt-0.5 font-mono text-sm font-bold tabular-nums ${warn ? "text-ember-glow" : "text-ink"}`}
        style={color ? { color } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
