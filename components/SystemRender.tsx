export function SystemRender() {
  return (
    <div
      className="relative aspect-[4/3] rounded-lg border border-surface-border bg-surface overflow-hidden scada-glow"
      role="img"
      aria-label="Concept rendering of exterior roof sprinkler wildfire defense system on a Sierra Nevada mountain home"
    >
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a2838" />
            <stop offset="100%" stopColor="#0f1419" />
          </linearGradient>
          <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a3a4a" />
            <stop offset="100%" stopColor="#141b22" />
          </linearGradient>
        </defs>

        <rect width="400" height="300" fill="url(#skyGrad)" />

        {/* Mountains */}
        <polygon points="0,200 80,120 160,180 240,100 320,160 400,140 400,300 0,300" fill="url(#mountainGrad)" opacity="0.8" />
        <polygon points="0,220 120,160 200,200 300,150 400,180 400,300 0,300" fill="#1e2a35" opacity="0.6" />

        {/* House structure */}
        <rect x="120" y="160" width="160" height="90" fill="#1e2a35" stroke="#2a3a4a" strokeWidth="1" />
        <polygon points="120,160 200,110 280,160" fill="#2a3a4a" stroke="#3d4f5f" strokeWidth="1" />

        {/* Roofline sprinkler zones */}
        <line x1="130" y1="155" x2="270" y2="155" stroke="#3d8b8b" strokeWidth="2" strokeDasharray="4 3" opacity="0.8" />
        <circle cx="150" cy="155" r="3" fill="#3d8b8b" />
        <circle cx="200" cy="155" r="3" fill="#3d8b8b" />
        <circle cx="250" cy="155" r="3" fill="#3d8b8b" />

        {/* Eave zones */}
        <line x1="120" y1="175" x2="120" y2="250" stroke="#c45c2a" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
        <line x1="280" y1="175" x2="280" y2="250" stroke="#c45c2a" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />

        {/* Perimeter zone */}
        <rect x="100" y="250" width="200" height="20" fill="none" stroke="#3d8b8b" strokeWidth="1" strokeDasharray="6 4" opacity="0.5" />
        <circle cx="130" cy="260" r="2" fill="#3d8b8b" opacity="0.7" />
        <circle cx="200" cy="260" r="2" fill="#3d8b8b" opacity="0.7" />
        <circle cx="270" cy="260" r="2" fill="#3d8b8b" opacity="0.7" />

        {/* Water spray effect */}
        <path d="M150,155 Q145,175 140,195" fill="none" stroke="#3d8b8b" strokeWidth="0.5" opacity="0.4" />
        <path d="M200,155 Q200,180 200,200" fill="none" stroke="#3d8b8b" strokeWidth="0.5" opacity="0.4" />
        <path d="M250,155 Q255,175 260,195" fill="none" stroke="#3d8b8b" strokeWidth="0.5" opacity="0.4" />

        {/* Zone labels */}
        <text x="200" y="100" textAnchor="middle" fill="#8a9bb0" fontSize="8" fontFamily="monospace">ROOFLINE Z1</text>
        <text x="95" y="210" textAnchor="middle" fill="#8a9bb0" fontSize="7" fontFamily="monospace" transform="rotate(-90, 95, 210)">EAVE Z2</text>
        <text x="200" y="275" textAnchor="middle" fill="#8a9bb0" fontSize="7" fontFamily="monospace">PERIMETER Z3</text>

        {/* Controller box */}
        <rect x="300" y="200" width="50" height="35" rx="2" fill="#141b22" stroke="#3d8b8b" strokeWidth="1" />
        <text x="325" y="215" textAnchor="middle" fill="#3d8b8b" fontSize="6" fontFamily="monospace">CTRL</text>
        <circle cx="310" cy="225" r="2" fill="#3d8b8b" />
        <line x1="300" y1="217" x2="280" y2="200" stroke="#3d8b8b" strokeWidth="0.5" opacity="0.5" />

        {/* Legend */}
        <rect x="10" y="10" width="90" height="55" rx="2" fill="#141b22" stroke="#1e2a35" strokeWidth="0.5" opacity="0.9" />
        <line x1="18" y1="22" x2="30" y2="22" stroke="#3d8b8b" strokeWidth="2" />
        <text x="35" y="25" fill="#8a9bb0" fontSize="7" fontFamily="monospace">Roofline</text>
        <line x1="18" y1="35" x2="30" y2="35" stroke="#c45c2a" strokeWidth="1.5" />
        <text x="35" y="38" fill="#8a9bb0" fontSize="7" fontFamily="monospace">Eave</text>
        <line x1="18" y1="48" x2="30" y2="48" stroke="#3d8b8b" strokeWidth="1" strokeDasharray="3 2" />
        <text x="35" y="51" fill="#8a9bb0" fontSize="7" fontFamily="monospace">Perimeter</text>
      </svg>

      <div className="absolute bottom-3 right-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted/60 bg-background/60 px-2 py-1 rounded">
          Concept Render
        </span>
      </div>
    </div>
  );
}
