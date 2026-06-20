export function Schematic() {
  // Matches CSS vars — update here if globals.css changes
  const ink    = "#e8e2d4";
  const muted  = "#7a7060";
  const line   = "#4a4236";
  const bg     = "#27211a";  // --paper
  const surf   = "#302920";  // --paper-2
  const surf2  = "#3a3228";  // --paper-3
  const ember  = "#c94b1f";

  // Three zone states — used consistently in both panels
  const zoneActive  = { fill: ember, fillOp: 0.1,  stroke: ember, sw: 2,   textFill: ember,  dash: "" }
  const zoneAssist  = { fill: "none", fillOp: 1,   stroke: ink,   sw: 1.2, textFill: ink,    dash: "5 3" }
  const zoneStandby = { fill: "none", fillOp: 1,   stroke: muted, sw: 1,   textFill: muted,  dash: "4 4" }

  return (
    <figure>
      <div className="plate-scroll">
        <svg
          viewBox="0 0 900 420"
          className="w-full min-w-[680px]"
          role="img"
          aria-label="System schematic: fire approaches from the west, four zones activate in priority, retardant mixes with reservoir water through pump and controller to zone solenoids"
        >
          <defs>
            <marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill={ink} />
            </marker>
            <marker id="arrE" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill={ember} />
            </marker>
            <marker id="arrEf" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
              <path d="M0,0 L0,6 L7,3 z" fill={ember} opacity="0.5" />
            </marker>
          </defs>

          {/* ── Full background ── */}
          <rect width="900" height="420" fill={bg} />

          {/* ── Panel divider ── */}
          <line x1="460" y1="16" x2="460" y2="404" stroke={line} strokeWidth="1" />

          {/* ── Panel headers ── */}
          <text x="20" y="26" fill={ember} fontSize="7.5" fontFamily="monospace" fontWeight="600" letterSpacing="1.5">ZONE PLAN — TOP VIEW</text>
          <text x="478" y="26" fill={ember} fontSize="7.5" fontFamily="monospace" fontWeight="600" letterSpacing="1.5">SUPPLY + CONTROL</text>

          {/* ════════════════════════════════════════════ */}
          {/*  LEFT PANEL                                  */}
          {/* ════════════════════════════════════════════ */}

          {/*
            Layout (all x,y absolute):
            House: x=168 y=152 w=120 h=110 → center (228, 207)
            N zone: x=168 y=90  w=120 h=62
            S zone: x=168 y=262 w=120 h=62
            W zone: x=106 y=148 w=62  h=118
            E zone: x=288 y=148 w=62  h=118
            Zone labels sit in the margin OUTSIDE each rect.
          */}

          {/* ── NORTH zone — assist (dashed, ink) ── */}
          <rect x="168" y="90" width="120" height="62"
            fill={zoneAssist.fill} stroke={zoneAssist.stroke}
            strokeWidth={zoneAssist.sw} strokeDasharray={zoneAssist.dash} />
          {/* label inside N zone (wide enough) */}
          <text x="228" y="116" textAnchor="middle" fill={zoneAssist.textFill}
            fontSize="11" fontFamily="monospace" fontWeight="700">N</text>
          <text x="228" y="129" textAnchor="middle" fill={muted}
            fontSize="6.5" fontFamily="monospace" letterSpacing="0.5">ASSIST</text>
          {/* sprinklers on north wall (y=152), spray upward */}
          {[192, 228, 264].map(cx => (
            <g key={`n${cx}`}>
              <circle cx={cx} cy={152} r="3" fill={ink} opacity="0.7" />
              <line x1={cx} y1={149} x2={cx - 5} y2={133} stroke={ink} strokeWidth="0.9" opacity="0.4" />
              <line x1={cx} y1={148} x2={cx}      y2={131} stroke={ink} strokeWidth="0.9" opacity="0.4" />
              <line x1={cx} y1={149} x2={cx + 5} y2={133} stroke={ink} strokeWidth="0.9" opacity="0.4" />
            </g>
          ))}

          {/* ── SOUTH zone — assist ── */}
          <rect x="168" y="262" width="120" height="62"
            fill={zoneAssist.fill} stroke={zoneAssist.stroke}
            strokeWidth={zoneAssist.sw} strokeDasharray={zoneAssist.dash} />
          <text x="228" y="287" textAnchor="middle" fill={zoneAssist.textFill}
            fontSize="11" fontFamily="monospace" fontWeight="700">S</text>
          <text x="228" y="300" textAnchor="middle" fill={muted}
            fontSize="6.5" fontFamily="monospace" letterSpacing="0.5">ASSIST</text>
          {/* sprinklers on south wall (y=262), spray downward */}
          {[192, 228, 264].map(cx => (
            <g key={`s${cx}`}>
              <circle cx={cx} cy={262} r="3" fill={ink} opacity="0.7" />
              <line x1={cx} y1={265} x2={cx - 5} y2={281} stroke={ink} strokeWidth="0.9" opacity="0.4" />
              <line x1={cx} y1={265} x2={cx}      y2={283} stroke={ink} strokeWidth="0.9" opacity="0.4" />
              <line x1={cx} y1={265} x2={cx + 5} y2={281} stroke={ink} strokeWidth="0.9" opacity="0.4" />
            </g>
          ))}

          {/* ── WEST zone — ACTIVE (solid ember) ── */}
          <rect x="106" y="148" width="62" height="118"
            fill={ember} fillOpacity={zoneActive.fillOp}
            stroke={zoneActive.stroke} strokeWidth={zoneActive.sw} />
          {/* label to the LEFT of W zone, in the margin */}
          <text x="70" y="204" textAnchor="middle" fill={ember}
            fontSize="11" fontFamily="monospace" fontWeight="700">W</text>
          <text x="70" y="217" textAnchor="middle" fill={ember}
            fontSize="6.5" fontFamily="monospace" letterSpacing="0.5">ACTIVE</text>
          {/* sprinklers on west house wall (x=168), fan LEFT into W zone */}
          {[172, 198, 224, 250].map(cy => (
            <g key={`w${cy}`}>
              <circle cx={168} cy={cy} r="3.5" fill={ember} />
              <line x1={165} y1={cy - 3} x2={143} y2={cy - 10} stroke={ember} strokeWidth="1.1" opacity="0.7" />
              <line x1={164} y1={cy}     x2={140} y2={cy}      stroke={ember} strokeWidth="1.1" opacity="0.7" />
              <line x1={165} y1={cy + 3} x2={143} y2={cy + 10} stroke={ember} strokeWidth="1.1" opacity="0.7" />
            </g>
          ))}

          {/* ── EAST zone — standby ── */}
          <rect x="288" y="148" width="62" height="118"
            fill={zoneStandby.fill} stroke={zoneStandby.stroke}
            strokeWidth={zoneStandby.sw} strokeDasharray={zoneStandby.dash} />
          {/* label to the RIGHT of E zone, in the margin */}
          <text x="382" y="204" textAnchor="middle" fill={muted}
            fontSize="11" fontFamily="monospace" fontWeight="700">E</text>
          <text x="382" y="217" textAnchor="middle" fill={muted}
            fontSize="6.5" fontFamily="monospace" letterSpacing="0.5">STANDBY</text>
          {/* standby sprinklers — hollow, no spray */}
          {[185, 215, 245].map(cy => (
            <circle key={`e${cy}`} cx={288} cy={cy} r="3"
              fill="none" stroke={muted} strokeWidth="1" opacity="0.5" />
          ))}

          {/* ── House ── */}
          <rect x="168" y="152" width="120" height="110" fill={surf2} stroke={ink} strokeWidth="1.5" />
          {/* roof */}
          <polygon points="163,152 228,116 293,152" fill="none" stroke={ink} strokeWidth="1.2" opacity="0.6" />
          <text x="228" y="210" textAnchor="middle" fill={muted}
            fontSize="8.5" fontFamily="monospace" letterSpacing="1">HOME</text>

          {/* ── Fire front arrows ── */}
          {/* labels far enough left of W zone (x=106) to not crowd it */}
          <text x="20" y="193" fill={ember} fontSize="7" fontFamily="monospace" fontWeight="600" letterSpacing="1">FIRE</text>
          <text x="20" y="205" fill={ember} fontSize="7" fontFamily="monospace" fontWeight="600" letterSpacing="1">FRONT</text>
          {/* main arrow — ends just at W zone left edge */}
          <line x1="50" y1="207" x2="96" y2="207" stroke={ember} strokeWidth="2.5" markerEnd="url(#arrE)" />
          {/* flanking arrows */}
          <line x1="52" y1="184" x2="85" y2="184" stroke={ember} strokeWidth="1.5" opacity="0.45" markerEnd="url(#arrEf)" />
          <line x1="52" y1="230" x2="85" y2="230" stroke={ember} strokeWidth="1.5" opacity="0.45" markerEnd="url(#arrEf)" />

          {/* ── Compass ── top-right of left panel, clear of all zones */}
          <g transform="translate(420, 68)">
            <line x1="0" y1="16" x2="0" y2="0" stroke={ink} strokeWidth="1" />
            <polygon points="0,-5 -3.5,5 3.5,5" fill={ink} />
            <text x="0" y="28" textAnchor="middle" fill={muted} fontSize="7.5" fontFamily="monospace">N</text>
          </g>

          {/* ── Legend ── bottom-left, below S zone (ends y=324) */}
          <g transform="translate(20, 345)">
            <rect x="0" y="0" width="148" height="60" fill={surf} stroke={line} strokeWidth="0.75" rx="1" />
            <text x="8" y="13" fill={muted} fontSize="6.5" fontFamily="monospace" letterSpacing="1">LEGEND</text>
            <rect x="8" y="19" width="9" height="9" fill={ember} fillOpacity="0.1" stroke={ember} strokeWidth="1.5" />
            <text x="22" y="27" fill={ink} fontSize="7" fontFamily="monospace">Active — windward</text>
            <rect x="8" y="32" width="9" height="9" fill="none" stroke={ink} strokeWidth="1.2" strokeDasharray="3 2" />
            <text x="22" y="40" fill={ink} fontSize="7" fontFamily="monospace">Assist — flanking</text>
            <rect x="8" y="45" width="9" height="9" fill="none" stroke={muted} strokeWidth="1" strokeDasharray="3 3" />
            <text x="22" y="53" fill={muted} fontSize="7" fontFamily="monospace">Standby — leeward</text>
          </g>

          {/* ════════════════════════════════════════════ */}
          {/*  RIGHT PANEL                                 */}
          {/* ════════════════════════════════════════════ */}
          {/*
            All boxes centered at x=670 (mid of 460–900 = 680, shifted left slightly
            to give breathing room on the right side).
            Box widths: source boxes 100px each, others 190px.
            Vertical sequence with uniform 22px gaps between boxes.
            Solenoids below a horizontal rail, evenly spaced.
          */}

          {/* ── Source boxes ── */}
          {/* Reservoir (left) */}
          <rect x="480" y="44" width="100" height="44" fill={surf2} stroke={line} strokeWidth="1.2" />
          <text x="530" y="63" textAnchor="middle" fill={ink}   fontSize="9" fontFamily="monospace" fontWeight="600">RESERVOIR</text>
          <text x="530" y="76" textAnchor="middle" fill={muted} fontSize="6.5" fontFamily="monospace">stored water</text>

          {/* Retardant (right) — ember border = active ingredient */}
          <rect x="610" y="44" width="120" height="44" fill={surf2} stroke={ember} strokeWidth="1.5" />
          <text x="670" y="63" textAnchor="middle" fill={ember} fontSize="9" fontFamily="monospace" fontWeight="600">RETARDANT</text>
          <text x="670" y="76" textAnchor="middle" fill={muted} fontSize="6.5" fontFamily="monospace">biodegradable</text>

          {/* Y-junction — both sources converge to mixing manifold */}
          <line x1="530" y1="88" x2="530" y2="112" stroke={ink} strokeWidth="1.2" />
          <line x1="530" y1="112" x2="575" y2="112" stroke={ink} strokeWidth="1.2" />
          <line x1="670" y1="88" x2="670" y2="112" stroke={ink} strokeWidth="1.2" />
          <line x1="670" y1="112" x2="576" y2="112" stroke={ink} strokeWidth="1.2" />
          <line x1="575" y1="112" x2="575" y2="124" stroke={ink} strokeWidth="1.2" markerEnd="url(#arr)" />

          {/* ── Mixing manifold ── */}
          <rect x="480" y="126" width="190" height="44" fill={surf2} stroke={line} strokeWidth="1.2" />
          <text x="575" y="145" textAnchor="middle" fill={ink}   fontSize="9" fontFamily="monospace" fontWeight="600">MIXING MANIFOLD</text>
          <text x="575" y="158" textAnchor="middle" fill={muted} fontSize="6.5" fontFamily="monospace">retardant + water blended</text>
          <line x1="575" y1="170" x2="575" y2="190" stroke={ink} strokeWidth="1.2" markerEnd="url(#arr)" />

          {/* ── Pump ── */}
          <rect x="500" y="192" width="150" height="44" fill={surf2} stroke={line} strokeWidth="1.2" />
          <text x="575" y="211" textAnchor="middle" fill={ink}   fontSize="9" fontFamily="monospace" fontWeight="600">PUMP</text>
          <text x="575" y="224" textAnchor="middle" fill={muted} fontSize="6.5" fontFamily="monospace">pressurizes zone lines</text>
          <line x1="575" y1="236" x2="575" y2="256" stroke={ink} strokeWidth="1.2" markerEnd="url(#arr)" />

          {/* ── Controller — ember border = the intelligent core ── */}
          <rect x="480" y="258" width="190" height="50" fill={surf2} stroke={ember} strokeWidth="2" />
          <text x="575" y="279" textAnchor="middle" fill={ember} fontSize="9" fontFamily="monospace" fontWeight="600">CONTROLLER</text>
          <text x="575" y="292" textAnchor="middle" fill={muted} fontSize="6.5" fontFamily="monospace">reads wind · skews to fire front</text>
          <text x="575" y="303" textAnchor="middle" fill={muted} fontSize="6.5" fontFamily="monospace">activates zone solenoids</text>

          {/* Arrow to solenoid rail */}
          <line x1="575" y1="308" x2="575" y2="330" stroke={ink} strokeWidth="1.2" markerEnd="url(#arr)" />

          {/* ── Solenoid horizontal rail ── */}
          <line x1="480" y1="334" x2="670" y2="334" stroke={line} strokeWidth="1" />

          {/* ── Zone solenoids — N, E, S, W ── */}
          {/* Box width 44px, gap 5px, 4 boxes total = 191px, start x=480 */}
          {(["N", "E", "S", "W"] as const).map((z, i) => {
            const bx = 480 + i * 49;
            const isActive = z === "W";
            return (
              <g key={z}>
                {/* drop from rail to box */}
                <line x1={bx + 22} y1={334} x2={bx + 22} y2={340} stroke={line} strokeWidth="1" />
                <rect
                  x={bx} y={340} width={44} height={44}
                  fill={isActive ? ember : surf2}
                  fillOpacity={isActive ? 0.12 : 1}
                  stroke={isActive ? ember : line}
                  strokeWidth={isActive ? 2 : 1}
                />
                <text x={bx + 22} y={358} textAnchor="middle"
                  fill={isActive ? ember : ink}
                  fontSize="11" fontFamily="monospace" fontWeight="700">
                  {z}
                </text>
                <text x={bx + 22} y={372} textAnchor="middle"
                  fill={muted} fontSize="6" fontFamily="monospace">
                  {isActive ? "OPEN" : "READY"}
                </text>
              </g>
            );
          })}

          {/* Solenoid label — to the RIGHT of boxes, clear of everything */}
          <text x="684" y="364" fill={muted} fontSize="6.5" fontFamily="monospace" letterSpacing="0.5">→ zone</text>
          <text x="684" y="374" fill={muted} fontSize="6.5" fontFamily="monospace" letterSpacing="0.5">sprinklers</text>
        </svg>
      </div>

      <figcaption className="mt-2 text-[0.6875rem] uppercase tracking-[0.15em] text-ink-muted">
        Fig. 01 — Directional zone defense and supply schematic (concept)
      </figcaption>
    </figure>
  );
}
