"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { SmsMessage } from "./data";

interface Props {
  messages: SmsMessage[];
  /** Explore mode: quick SMS commands the user can "send". */
  onCommand?: (cmd: "DEPLOY" | "STATUS") => void;
  deployed: boolean;
}

/** Mock phone: the SMS thread between the brain and the homeowner. */
export function SmsThread({ messages, onCommand, deployed }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div className="plate flex h-full min-h-[260px] flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-ink-muted">
          Your Phone · SMS Text
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-water">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-water" aria-hidden />
          EmberX
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-3" style={{ maxHeight: 240 }} aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={`${i}-${m.text.slice(0, 16)}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 text-[0.75rem] leading-relaxed ${
                  m.from === "you"
                    ? "border border-water/40 bg-water-dim text-ink"
                    : "border border-line bg-paper-3 text-ink-muted"
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {messages.length === 0 && (
          <p className="pt-8 text-center text-xs text-ink-muted opacity-70">No messages yet.</p>
        )}
      </div>

      {onCommand ? (
        <div className="flex gap-2 border-t border-line p-3">
          <button
            type="button"
            onClick={() => onCommand("STATUS")}
            className="flex-1 border border-line bg-paper-3 px-2 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-ink-muted transition-colors hover:border-water hover:text-water"
          >
            Text “STATUS”
          </button>
          <button
            type="button"
            onClick={() => onCommand("DEPLOY")}
            disabled={deployed}
            className={`flex-1 border px-2 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-wider transition-colors ${
              deployed
                ? "cursor-default border-pulse/40 bg-pulse/10 text-pulse"
                : "border-ember/50 bg-ember/10 text-ember hover:bg-ember/20"
            }`}
          >
            {deployed ? "✓ Deployed" : "Text “DEPLOY”"}
          </button>
        </div>
      ) : (
        <div className="border-t border-line p-3">
          <p className="text-center font-mono text-[0.62rem] uppercase tracking-wider text-ink-muted opacity-70">
            Alerts arrive as the scenario unfolds
          </p>
        </div>
      )}
    </div>
  );
}
