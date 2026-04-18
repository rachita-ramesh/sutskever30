// Concept Map / Home — constellation of 30 papers, clustered, with mastery rings.

const { useState: useStateCM, useMemo: useMemoCM } = React;

function ConceptMap({ mastery, onPick, onOpenAI }) {
  const [hover, setHover] = useStateCM(null);
  const [filter, setFilter] = useStateCM("all");

  const { CLUSTERS, CONCEPTS } = window.DATA;
  const clusters = Object.keys(CLUSTERS);

  // edges from prereqs
  const edges = useMemoCM(() => {
    const out = [];
    const byId = Object.fromEntries(CONCEPTS.map(c => [c.id, c]));
    CONCEPTS.forEach(c => {
      (c.prereqs || []).forEach(pid => {
        const p = byId[pid];
        if (p) out.push({ from: p, to: c });
      });
    });
    return out;
  }, []);

  const filtered = filter === "all" ? CONCEPTS : CONCEPTS.filter(c => c.cluster === filter);

  const totalMastery = CONCEPTS.reduce((s, c) => s + (mastery[c.id]?.progress || 0), 0) / CONCEPTS.length;

  return (
    <div style={{minHeight:"100vh", background:"var(--bg)", position:"relative"}}>
      <P.TopBar
        left={
          <>
            <div style={{display:"flex", alignItems:"center", gap:10}}>
              <div style={{
                width:26, height:26, borderRadius:6, background:"var(--amber)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#1a1306", fontWeight:700, fontFamily:"Instrument Serif, serif"
              }}>S</div>
              <div style={{fontSize:13, fontWeight:600}}>Sutskever30</div>
              <span className="chip">v2 · interactive</span>
            </div>
          </>
        }
        center={null}
        right={
          <>
            <P.GhostBtn onClick={onOpenAI} title="Tutor"><P.IconBrain/> Tutor</P.GhostBtn>
          </>
        }
      />

      {/* Hero */}
      <div style={{maxWidth:1280, margin:"0 auto", padding:"48px 40px 20px"}}>
        <div style={{display:"grid", gridTemplateColumns:"1.4fr 1fr", gap:48, alignItems:"end"}}>
          <div>
            <div className="chip" style={{marginBottom:18}}><P.IconSpark size={11}/> Ilya's Reading List</div>
            <h1 style={{fontSize:"clamp(44px, 6vw, 84px)", margin:0, fontWeight:500, letterSpacing:"-0.02em", lineHeight:0.98}}>
              Learn the <span className="serif" style={{color:"var(--amber)"}}>90%</span><br/>
              that matters.
            </h1>
            <p style={{fontSize:16, color:"var(--ink-dim)", maxWidth:520, marginTop:20, lineHeight:1.6}}>
              Thirty papers, one constellation. Each is a short interactive lesson — not a reading.
              Play with the math, argue with a Socratic tutor, earn mastery.
            </p>
          </div>
          <div>
            <div style={{display:"flex", flexDirection:"column", gap:10, padding:20, border:"1px solid var(--line)", borderRadius:14, background:"var(--bg-2)"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span style={{fontSize:12, color:"var(--ink-dim)", textTransform:"uppercase", letterSpacing:"0.1em"}}>Your journey</span>
                <span className="mono" style={{fontSize:11, color:"var(--ink-dim)"}}>{Math.round(totalMastery*100)}%</span>
              </div>
              <MasteryMeter value={totalMastery} />
              <div style={{display:"flex", justifyContent:"space-between", fontSize:12, color:"var(--ink-dim)"}}>
                <span>{Object.values(mastery).filter(m => m.progress >= 0.8).length} mastered</span>
                <span>{CONCEPTS.length - Object.keys(mastery).length} untouched</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cluster filter */}
      <div style={{maxWidth:1280, margin:"0 auto", padding:"36px 40px 10px", display:"flex", gap:8, alignItems:"center", flexWrap:"wrap"}}>
        <span style={{fontSize:12, color:"var(--ink-dim)", textTransform:"uppercase", letterSpacing:"0.12em", marginRight:6}}>Clusters</span>
        <FilterPill active={filter==="all"} onClick={() => setFilter("all")} color="var(--ink)">All 28</FilterPill>
        {clusters.map(c => (
          <FilterPill key={c} active={filter===c} onClick={() => setFilter(c)} color={CLUSTERS[c].color}>
            {CLUSTERS[c].label}
          </FilterPill>
        ))}
      </div>

      {/* Map */}
      <div style={{maxWidth:1280, margin:"0 auto", padding:"20px 40px 80px"}}>
        <div style={{
          position:"relative", width:"100%", aspectRatio:"16/9", minHeight:540,
          border:"1px solid var(--line)", borderRadius:18, overflow:"hidden",
          background:"radial-gradient(ellipse at 50% 40%, color-mix(in oklch, var(--iris) 8%, transparent) 0%, transparent 60%), var(--bg-2)"
        }} className="dotgrid">

          {/* edges */}
          <svg style={{position:"absolute", inset:0, width:"100%", height:"100%"}} preserveAspectRatio="none" viewBox="0 0 100 100">
            {edges.map((e, i) => {
              const active = hover && (hover.id === e.from.id || hover.id === e.to.id);
              return (
                <line key={i}
                  x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y}
                  stroke={active ? "var(--amber)" : "var(--line-2)"}
                  strokeWidth={active ? 0.25 : 0.12}
                  strokeDasharray={active ? "0" : "0.8 0.8"}
                  vectorEffect="non-scaling-stroke"
                  style={{transition:"all 220ms ease"}}
                />
              );
            })}
          </svg>

          {/* cluster labels */}
          {clusters.map(cn => {
            const pts = CONCEPTS.filter(c => c.cluster === cn);
            const cx = pts.reduce((s,p) => s + p.x, 0) / pts.length;
            const cy = pts.reduce((s,p) => s + p.y, 0) / pts.length;
            return (
              <div key={cn} style={{
                position:"absolute", left: cx+"%", top:(cy-9)+"%", transform:"translate(-50%,-50%)",
                fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase",
                color: CLUSTERS[cn].color, opacity: filter==="all" || filter===cn ? 0.8 : 0.15,
                transition:"opacity 180ms ease", pointerEvents:"none", fontFamily:"JetBrains Mono, monospace"
              }}>
                ◦ {CLUSTERS[cn].label}
              </div>
            );
          })}

          {/* nodes */}
          {CONCEPTS.map(c => {
            const m = mastery[c.id];
            const prog = m?.progress || 0;
            const dim = filter !== "all" && filter !== c.cluster;
            const isHover = hover?.id === c.id;
            const color = CLUSTERS[c.cluster].color;
            return (
              <button
                key={c.id}
                onMouseEnter={() => setHover(c)}
                onMouseLeave={() => setHover(null)}
                onClick={() => onPick(c)}
                style={{
                  position:"absolute", left: c.x+"%", top: c.y+"%",
                  transform:"translate(-50%,-50%)",
                  background:"transparent", border:"none", cursor:"pointer",
                  opacity: dim ? 0.18 : 1,
                  transition:"all 220ms cubic-bezier(.2,.8,.2,1)",
                  zIndex: isHover ? 10 : 1,
                }}
              >
                <NodeVisual size={c.star ? 34 : 22 + c.diff*3} color={color} progress={prog} hover={isHover} star={c.star}/>
                <div style={{
                  position:"absolute", top:"calc(100% + 6px)", left:"50%", transform:"translateX(-50%)",
                  whiteSpace:"nowrap", fontSize: isHover ? 12 : 11,
                  color: isHover ? "var(--ink)" : "var(--ink-dim)",
                  fontWeight: isHover ? 600 : 400,
                  pointerEvents:"none",
                  transition:"all 180ms ease"
                }}>
                  {c.name}
                </div>
              </button>
            );
          })}

          {/* hover card */}
          {hover && (
            <div className="anim-fade-in" style={{
              position:"absolute", right:20, bottom:20, width:320,
              padding:18, background:"var(--bg)", border:"1px solid var(--line-2)", borderRadius:12,
              boxShadow:"0 20px 60px -20px rgba(0,0,0,0.5)"
            }}>
              <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:10}}>
                <P.Dot color={CLUSTERS[hover.cluster].color} size={8}/>
                <span className="mono" style={{fontSize:11, color:"var(--ink-dim)"}}>{hover.cluster.toUpperCase()} · {hover.year}</span>
                <P.DiffDots n={hover.diff}/>
              </div>
              <div style={{fontSize:17, fontWeight:600, marginBottom:4}}>{hover.name}</div>
              <div style={{fontSize:12, color:"var(--ink-dim)", marginBottom:14}}>{hover.auth}</div>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <span style={{fontSize:11, color:"var(--ink-dim)"}}>
                  {mastery[hover.id]
                    ? `Mastery ${Math.round(mastery[hover.id].progress*100)}% · seen ${mastery[hover.id].lastSeen} ago`
                    : "Untouched"}
                </span>
                <span style={{fontSize:11, color:"var(--amber)"}}>open <P.IconArrowRight size={10}/></span>
              </div>
            </div>
          )}

          {/* legend */}
          <div style={{position:"absolute", left:20, bottom:20, fontSize:10, color:"var(--ink-faint)", display:"flex", gap:14, fontFamily:"JetBrains Mono, monospace"}}>
            <span>◦ size = difficulty</span>
            <span>◦ ring = mastery</span>
            <span>— — prereq</span>
          </div>
        </div>

        {/* Shortlist */}
        <div style={{marginTop:36, display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16}}>
          {filtered.slice(0, 6).map(c => (
            <button key={c.id} onClick={() => onPick(c)} style={{
              textAlign:"left", padding:16, background:"var(--bg-2)", border:"1px solid var(--line)",
              borderRadius:12, cursor:"pointer", color:"var(--ink)"
            }}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
                <span className="mono" style={{fontSize:10, color:CLUSTERS[c.cluster].color, textTransform:"uppercase", letterSpacing:"0.1em"}}>
                  {c.cluster}
                </span>
                <P.DiffDots n={c.diff}/>
              </div>
              <div style={{fontSize:15, fontWeight:600, marginBottom:4}}>{c.name}</div>
              <div style={{fontSize:11, color:"var(--ink-dim)"}}>{c.auth} · {c.year}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NodeVisual({ size, color, progress, hover, star }) {
  const r = size / 2;
  const circ = 2 * Math.PI * (r - 2);
  return (
    <div style={{position:"relative", width:size, height:size}}>
      <svg width={size} height={size} style={{position:"absolute", inset:0}}>
        {/* track */}
        <circle cx={r} cy={r} r={r-2} fill="none" stroke="var(--line-2)" strokeWidth="1.5"/>
        {/* progress */}
        <circle cx={r} cy={r} r={r-2} fill="none" stroke={color}
          strokeWidth={hover ? 2.5 : 2}
          strokeDasharray={`${progress*circ} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${r} ${r})`}
          style={{transition:"stroke-width 200ms ease, stroke-dasharray 400ms ease"}}
        />
        {/* core */}
        <circle cx={r} cy={r} r={r-7} fill={color} opacity={hover ? 0.6 : 0.25}/>
        {star && <text x={r} y={r+4} textAnchor="middle" fontSize="11" fill="var(--bg)" fontWeight="700">★</text>}
      </svg>
      {hover && (
        <div style={{
          position:"absolute", inset:-8, borderRadius:"50%",
          boxShadow:`0 0 0 1px ${color}, 0 0 24px ${color}`,
          opacity:0.4, pointerEvents:"none"
        }}/>
      )}
    </div>
  );
}

function FilterPill({ children, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      display:"inline-flex", alignItems:"center", gap:6, padding:"5px 11px", borderRadius:999,
      background: active ? "color-mix(in oklch, "+color+" 16%, transparent)" : "transparent",
      border:"1px solid " + (active ? color : "var(--line-2)"),
      color: active ? color : "var(--ink-dim)",
      fontSize:12, cursor:"pointer", transition:"all 180ms ease"
    }}>
      <span style={{width:6, height:6, borderRadius:"50%", background:color}}/>
      {children}
    </button>
  );
}

function MasteryMeter({ value }) {
  return (
    <div style={{display:"flex", gap:3, height:18, alignItems:"center"}}>
      {Array.from({length:30}).map((_,i) => {
        const lit = i < Math.round(value*30);
        return (
          <div key={i} style={{
            flex:1, height: lit ? 14 : 6, borderRadius:2,
            background: lit ? "var(--amber)" : "var(--line-2)",
            transition:"all 300ms ease",
            transitionDelay: `${i*12}ms`
          }}/>
        );
      })}
    </div>
  );
}

window.ConceptMap = ConceptMap;
