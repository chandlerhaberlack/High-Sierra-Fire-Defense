import { Badge } from "./ui/Badge";

interface ScadaPanelProps {
  compact?: boolean;
}

export function ScadaPanel({ compact = false }: ScadaPanelProps) {
  const zones = [
    { name: "Roofline Z1", status: "Ready", pressure: "42 PSI" },
    { name: "Eave Z2", status: "Ready", pressure: "40 PSI" },
    { name: "Perimeter Z3", status: "Standby", pressure: "—" },
    { name: "Deck Z4", status: "Ready", pressure: "38 PSI" },
  ];

  return (
    <div
      className={`scada-glow bg-surface border border-surface-border rounded-lg overflow-hidden ${compact ? "" : "w-full"}`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-background/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span className="font-mono text-xs text-muted uppercase tracking-wider">
            HSFD Controller v0.1
          </span>
        </div>
        <Badge variant="teal" dot>
          Concept Dev
        </Badge>
      </div>

      <div className={`p-4 ${compact ? "space-y-3" : "space-y-4"}`}>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Water Supply" value="Tank 85%" status="ok" />
          <Metric label="Backup Power" value="Charged" status="ok" />
          <Metric label="Wind Sensor" value="12 mph NW" status="warn" />
          <Metric label="Connectivity" value="Online" status="ok" />
        </div>

        <div className="border-t border-surface-border pt-3">
          <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">
            Zone Status
          </p>
          <div className="space-y-1.5">
            {zones.map((zone) => (
              <div
                key={zone.name}
                className="flex items-center justify-between text-xs font-mono py-1 px-2 rounded bg-background/40"
              >
                <span className="text-muted">{zone.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-foreground/70">{zone.pressure}</span>
                  <span
                    className={
                      zone.status === "Ready"
                        ? "text-teal"
                        : "text-muted"
                    }
                  >
                    {zone.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {!compact && (
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              className="flex-1 py-2 text-xs font-mono uppercase tracking-wider bg-teal/20 border border-teal/40 text-teal rounded hover:bg-teal/30 transition-colors"
            >
              Pre-Wet Activate
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-surface-border text-muted rounded hover:border-muted transition-colors"
            >
              Manual
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: "ok" | "warn";
}) {
  return (
    <div className="p-2.5 rounded bg-background/40 border border-surface-border/50">
      <p className="font-mono text-[10px] text-muted uppercase tracking-wider">
        {label}
      </p>
      <p className="font-mono text-sm text-foreground mt-0.5">{value}</p>
      <span
        className={`inline-block w-1 h-1 rounded-full mt-1 ${
          status === "ok" ? "bg-teal" : "bg-ember"
        }`}
      />
    </div>
  );
}
