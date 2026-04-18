// Generic stages that render from a lesson object (from LESSON_LIB).
// Used for every concept. The Attention lesson still uses the richer
// bespoke stages in lesson-stages.jsx.

const { useState: useStateLG, useMemo: useMemoLG, useEffect: useEffectLG } = React;

// ─── HOOK ────────────────────────────────────────────────────────────────────
function GenericHook({ data }) {
  const [flip, setFlip] = useStateLG(false);
  useEffectLG(() => {
    const t = setInterval(() => setFlip(f => !f), 3800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{maxWidth:760, margin:"40px auto 0"}}>
      <div className="chip" style={{marginBottom:18}}>Hook</div>
      <h2 className="serif" style={{fontSize:52, margin:"0 0 18px", fontWeight:400, lineHeight:1.05, letterSpacing:"-0.01em"}}>
        {data.headline}<br/><span style={{color:"var(--amber)"}}>{data.subhead2}</span>
      </h2>
      <p style={{fontSize:15, color:"var(--ink-dim)", lineHeight:1.7, marginBottom:40, maxWidth:640}}>
        {data.subtext}
      </p>
      <div style={{padding:"32px 28px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:24}}>
          {[
            { label: data.beforeLabel || "Before", sub: data.beforeSub || "", color:"var(--rose)", on:!flip },
            { label: data.afterLabel  || "After",  sub: data.afterSub  || "", color:"var(--teal)", on:flip  },
          ].map((b,i) => (
            <div key={i} style={{
              padding:"20px 18px", borderRadius:10,
              background: b.on ? `color-mix(in oklch, ${b.color} 12%, var(--bg))` : "var(--bg)",
              border:"1px solid " + (b.on ? b.color : "var(--line-2)"),
              transition:"all 500ms ease"
            }}>
              <div className="mono" style={{fontSize:10, color:"var(--ink-dim)", letterSpacing:"0.12em", textTransform:"uppercase"}}>{b.label}</div>
              <div style={{fontSize:15, color: b.on ? "var(--ink)" : "var(--ink-dim)", marginTop:8, lineHeight:1.5}}>{b.sub}</div>
            </div>
          ))}
        </div>
        {data.tokens && data.tokens.length > 0 && (
          <div style={{display:"flex", flexWrap:"wrap", gap:6, marginTop:22, justifyContent:"center"}}>
            {data.tokens.map((t,i) => (
              <span key={i} className="serif" style={{
                padding:"6px 10px", fontSize:16,
                background: data.highlight?.includes(i) ? "color-mix(in oklch, var(--amber) 20%, transparent)" : "transparent",
                border:"1px solid " + (data.highlight?.includes(i) ? "color-mix(in oklch, var(--amber) 50%, transparent)" : "var(--line-2)"),
                borderRadius:6
              }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INTUITION ───────────────────────────────────────────────────────────────
function GenericIntuition({ data }) {
  return (
    <div style={{maxWidth:820, margin:"40px auto 0"}}>
      <div className="chip" style={{marginBottom:18}}>Intuition</div>
      <h2 className="serif" style={{fontSize:42, margin:"0 0 16px", fontWeight:400, letterSpacing:"-0.01em"}}>
        {data.title}
      </h2>
      <p style={{fontSize:15, color:"var(--ink-dim)", lineHeight:1.75, maxWidth:640, marginBottom:32}}>
        {data.intro}
      </p>
      <div style={{display:"grid", gridTemplateColumns:`repeat(${Math.min(data.cards.length,3)},1fr)`, gap:12}}>
        {data.cards.map((c,i) => (
          <div key={i} style={{padding:"22px 20px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:12}}>
            <div style={{display:"flex", alignItems:"center", gap:14}}>
              <div style={{
                width:36, height:36, borderRadius:8,
                background:`color-mix(in oklch, ${c.color} 22%, transparent)`,
                border:`1px solid ${c.color}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:c.color, fontFamily:"Instrument Serif, serif", fontSize:22, fontWeight:600
              }}>{c.letter}</div>
              <div>
                <div style={{fontSize:14, fontWeight:600}}>{c.title}</div>
                <div style={{fontSize:11, color:"var(--ink-dim)"}}>{c.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PLAYGROUND ──────────────────────────────────────────────────────────────
function GenericPlayground({ data, concept }) {
  return (
    <div style={{maxWidth:820, margin:"40px auto 0"}}>
      <div className="chip" style={{marginBottom:18}}>Playground</div>
      <h2 className="serif" style={{fontSize:42, margin:"0 0 14px", fontWeight:400, letterSpacing:"-0.01em"}}>
        Play with the idea.
      </h2>
      <p style={{fontSize:14, color:"var(--ink-dim)", lineHeight:1.7, maxWidth:620, marginBottom:28}}>
        {data.caption}
      </p>
      <PlaygroundKind kind={data.kind} concept={concept} data={data}/>
    </div>
  );
}

function PlaygroundKind({ kind, concept, data }) {
  switch (kind) {
    case "gates": return <GatesDemo/>;
    case "powerlaw": return <PowerLawDemo/>;
    case "depth": return <DepthDemo/>;
    case "dilation": return <DilationDemo/>;
    case "filters": return <FiltersDemo/>;
    case "complexity": return <ComplexityDemo/>;
    case "compress": return <CompressDemo/>;
    case "coffee": return <CoffeeDemo/>;
    case "pairs": return <PairsDemo/>;
    case "graph": return <GraphDemo/>;
    case "memory": return <MemoryDemo/>;
    case "pipeline": return <PipelineDemo/>;
    case "weights": case "weights-align": return <WeightsDemo concept={concept}/>;
    case "tokens-stream": return <TokensStreamDemo/>;
    case "code-toggle": return <CodeToggleDemo/>;
    default: return <SliderDemo/>;
  }
}

// Helper wrapper
function Card({ children, style }) {
  return (
    <div style={{padding:"28px 26px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14, ...style}}>
      {children}
    </div>
  );
}

// ── LSTM gates
function GatesDemo() {
  const [f,setF] = useStateLG(0.8), [i,setI] = useStateLG(0.6), [o,setO] = useStateLG(0.7);
  const [C,setC] = useStateLG(0.5);
  const [step,setStep] = useStateLG(0);
  function tick() {
    const cand = Math.sin(step*0.7)*0.5 + 0.5;
    setC(c => Math.max(0, Math.min(1, f*c + i*cand)));
    setStep(s => s+1);
  }
  const h = o * Math.tanh(C);
  return (
    <Card>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:24}}>
        {[[f,setF,"forget","var(--rose)"],[i,setI,"input","var(--teal)"],[o,setO,"output","var(--iris)"]].map(([v,s,l,c],idx) => (
          <div key={idx}>
            <div style={{fontSize:11, color:"var(--ink-dim)", marginBottom:8}}>{l} gate = {v.toFixed(2)}</div>
            <input type="range" min={0} max={1} step={0.01} value={v} onChange={e=>s(parseFloat(e.target.value))} style={{width:"100%", accentColor:c}}/>
            <div style={{height:6, background:"var(--line-2)", borderRadius:3, marginTop:8, overflow:"hidden"}}>
              <div style={{height:"100%", width:(v*100)+"%", background:c}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex", gap:14, alignItems:"center", justifyContent:"space-between", padding:"16px 18px", background:"var(--bg)", border:"1px dashed var(--line-2)", borderRadius:10}}>
        <div style={{flex:1}}>
          <div style={{fontSize:11, color:"var(--ink-dim)", marginBottom:6}}>Cell state C</div>
          <div style={{height:14, background:"var(--line-2)", borderRadius:7, overflow:"hidden"}}>
            <div style={{height:"100%", width:(C*100)+"%", background:"linear-gradient(90deg, var(--teal), var(--amber))", transition:"width 300ms ease"}}/>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:11, color:"var(--ink-dim)", marginBottom:6}}>Output h = o · tanh(C) = {h.toFixed(2)}</div>
          <div style={{height:14, background:"var(--line-2)", borderRadius:7, overflow:"hidden"}}>
            <div style={{height:"100%", width:(h*100)+"%", background:"var(--iris)", transition:"width 300ms ease"}}/>
          </div>
        </div>
        <button onClick={tick} style={{padding:"10px 16px", background:"var(--amber)", color:"#1a1306", border:"none", borderRadius:8, fontWeight:600, cursor:"pointer"}}>step t+1</button>
      </div>
    </Card>
  );
}

// ── Power law: loss vs compute
function PowerLawDemo() {
  const [N,setN] = useStateLG(8);
  const loss = Math.pow(1/N, 0.4) * 3;
  const xs = Array.from({length:20}, (_,i) => 1 + i*0.5);
  const pts = xs.map(n => ({ x:n, y: Math.pow(1/n, 0.4) * 3 }));
  return (
    <Card>
      <svg viewBox="0 0 400 220" style={{width:"100%", height:220}}>
        <line x1="40" y1="20" x2="40" y2="190" stroke="var(--line-2)"/>
        <line x1="40" y1="190" x2="380" y2="190" stroke="var(--line-2)"/>
        <text x="20" y="100" fontSize="10" fill="var(--ink-dim)" transform="rotate(-90 20 100)">log L</text>
        <text x="200" y="210" fontSize="10" fill="var(--ink-dim)">log N (params)</text>
        {pts.map((p,i) => {
          const cx = 40 + (Math.log(p.x) / Math.log(11)) * 340;
          const cy = 190 - (1 - Math.log(p.y+0.01)/Math.log(3.1)) * 160;
          return <circle key={i} cx={cx} cy={cy} r="3" fill="var(--amber)" opacity={0.7}/>;
        })}
        <path d={pts.map((p,i) => {
          const cx = 40 + (Math.log(p.x) / Math.log(11)) * 340;
          const cy = 190 - (1 - Math.log(p.y+0.01)/Math.log(3.1)) * 160;
          return `${i===0?'M':'L'}${cx},${cy}`;
        }).join(" ")} stroke="var(--amber)" fill="none" strokeWidth="1.5" opacity="0.5"/>
        {/* pointer */}
        <circle cx={40 + (Math.log(N) / Math.log(11)) * 340} cy={190 - (1 - Math.log(loss+0.01)/Math.log(3.1)) * 160} r="6" fill="var(--teal)"/>
      </svg>
      <div style={{marginTop:14}}>
        <div style={{fontSize:12, color:"var(--ink-dim)", marginBottom:6}}>Parameters N = {N}M → loss = {loss.toFixed(2)}</div>
        <input type="range" min={1} max={10} step={0.1} value={N} onChange={e=>setN(parseFloat(e.target.value))} style={{width:"100%"}}/>
      </div>
    </Card>
  );
}

// ── Depth demo (ResNet)
function DepthDemo() {
  const [depth, setDepth] = useStateLG(20);
  const [residual, setResidual] = useStateLG(true);
  // plain nets get worse past ~20 without residual; with residual, they don't
  const trainErr = residual ? Math.max(3, 18 - depth*0.18) : Math.max(4, 8 + Math.max(0, depth-18)*0.6);
  return (
    <Card>
      <div style={{display:"flex", gap:12, marginBottom:16}}>
        <button onClick={()=>setResidual(true)} style={toggleStyle(residual)}>With residual</button>
        <button onClick={()=>setResidual(false)} style={toggleStyle(!residual)}>Plain net</button>
      </div>
      <div style={{padding:"20px", background:"var(--bg)", border:"1px dashed var(--line-2)", borderRadius:10}}>
        <div style={{fontSize:11, color:"var(--ink-dim)", marginBottom:8}}>Depth = {depth} layers · Training error ≈ {trainErr.toFixed(1)}%</div>
        <input type="range" min={6} max={110} value={depth} onChange={e=>setDepth(parseInt(e.target.value))} style={{width:"100%"}}/>
        <div style={{marginTop:18, height:80, display:"flex", alignItems:"end", gap:2}}>
          {Array.from({length:depth}).map((_,i) => (
            <div key={i} style={{
              flex:1, height: residual ? "100%" : Math.max(14, 100 - Math.max(0, depth-18)*2) + "%",
              background: residual ? `color-mix(in oklch, var(--teal) ${30 + (i/depth)*60}%, var(--bg-2))` : `color-mix(in oklch, var(--rose) ${30 + Math.max(0,depth-18)*2}%, var(--bg-2))`,
              borderRadius:1, transition:"all 300ms ease"
            }}/>
          ))}
        </div>
        <div style={{marginTop:12, fontSize:12, color: residual ? "var(--teal)" : "var(--rose)"}}>
          {residual ? "Training error keeps dropping with depth." : "Past ~20 layers, training error rises — optimization failure."}
        </div>
      </div>
    </Card>
  );
}
function toggleStyle(active){
  return {
    padding:"8px 14px", fontSize:12, borderRadius:8, cursor:"pointer",
    background: active ? "var(--amber)" : "var(--bg)",
    color: active ? "#1a1306" : "var(--ink)",
    border:"1px solid " + (active ? "var(--amber)" : "var(--line-2)"),
    fontWeight: active ? 600 : 400
  };
}

// ── Dilation
function DilationDemo() {
  const [rate, setRate] = useStateLG(2);
  const size = 11; const center = 5;
  return (
    <Card>
      <div style={{display:"grid", gridTemplateColumns:`repeat(${size}, 1fr)`, gap:3, maxWidth:420, margin:"0 auto"}}>
        {Array.from({length:size*size}).map((_,i) => {
          const r = Math.floor(i/size), c = i%size;
          const dr = r - center, dc = c - center;
          const isTap = Math.abs(dr) === rate || dr === 0 ? (Math.abs(dc) === rate || dc === 0) && (Math.abs(dr)<=rate && Math.abs(dc)<=rate) : false;
          const tap = (Math.abs(dr) === 0 || Math.abs(dr) === rate) && (Math.abs(dc) === 0 || Math.abs(dc) === rate);
          return <div key={i} style={{
            aspectRatio:"1", borderRadius:3,
            background: tap ? "var(--iris)" : "var(--bg)",
            border:"1px solid " + (tap ? "var(--iris)" : "var(--line-2)"),
            transition:"all 200ms ease"
          }}/>;
        })}
      </div>
      <div style={{marginTop:18, textAlign:"center"}}>
        <div style={{fontSize:12, color:"var(--ink-dim)", marginBottom:8}}>Dilation rate = {rate} · Receptive field grows like 2^r</div>
        <input type="range" min={1} max={4} value={rate} onChange={e=>setRate(parseInt(e.target.value))} style={{width:260}}/>
      </div>
    </Card>
  );
}

// ── Filters (learned hierarchy vibe)
function FiltersDemo() {
  const [layer, setLayer] = useStateLG(0);
  const layers = ["Layer 1: edges", "Layer 2: textures", "Layer 3: parts", "Layer 4: objects"];
  const patterns = [
    (i) => `linear-gradient(${i*45}deg, var(--bg) 40%, var(--amber) 60%)`,
    (i) => `repeating-linear-gradient(${i*30}deg, var(--bg) 0 4px, var(--teal) 4px 8px)`,
    (i) => `radial-gradient(circle at ${30+i*5}% ${30+i*5}%, var(--iris), var(--bg))`,
    (i) => `conic-gradient(from ${i*40}deg, var(--rose), var(--amber), var(--teal))`,
  ];
  return (
    <Card>
      <div style={{display:"flex", gap:8, marginBottom:16, flexWrap:"wrap"}}>
        {layers.map((l,i) => (
          <button key={i} onClick={()=>setLayer(i)} style={toggleStyle(layer===i)}>{l}</button>
        ))}
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(8, 1fr)", gap:8}}>
        {Array.from({length:16}).map((_,i) => (
          <div key={i} style={{aspectRatio:"1", borderRadius:8, background: patterns[layer](i), border:"1px solid var(--line-2)"}}/>
        ))}
      </div>
      <div style={{marginTop:16, fontSize:12, color:"var(--ink-dim)", textAlign:"center"}}>
        Early filters learn low-level structure. Deep filters fire for whole concepts.
      </div>
    </Card>
  );
}

// ── Complexity tradeoff (MDL-ish)
function ComplexityDemo() {
  const [lam, setLam] = useStateLG(0.5);
  const fit = 1 - Math.min(1, lam * 1.4);
  const cpx = lam;
  const total = (1-fit) + cpx*0.6;
  return (
    <Card>
      <div style={{fontSize:12, color:"var(--ink-dim)", marginBottom:8}}>Complexity penalty λ = {lam.toFixed(2)}</div>
      <input type="range" min={0} max={1} step={0.01} value={lam} onChange={e=>setLam(parseFloat(e.target.value))} style={{width:"100%"}}/>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginTop:18}}>
        {[
          { l:"Data fit (bits)", v: 1-fit, c:"var(--rose)" },
          { l:"Model bits", v: cpx, c:"var(--teal)" },
          { l:"Total", v: total, c:"var(--amber)" },
        ].map((b,i) => (
          <div key={i} style={{padding:14, background:"var(--bg)", border:"1px solid var(--line-2)", borderRadius:10}}>
            <div style={{fontSize:11, color:"var(--ink-dim)"}}>{b.l}</div>
            <div style={{height:8, background:"var(--line-2)", borderRadius:4, marginTop:8, overflow:"hidden"}}>
              <div style={{height:"100%", width:Math.min(100,b.v*70)+"%", background:b.c, transition:"width 200ms ease"}}/>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Compression (Kolmogorov)
function CompressDemo() {
  const strings = [
    { s:"ababababababababababab", note:"period-2 repeat"},
    { s:"abcdefghijklmnopqrstuv", note:"alphabet sequence"},
    { s:"x9k2fa03ql1v8zm4re7bqp", note:"random-looking"},
  ];
  const [pick, setPick] = useStateLG(0);
  const s = strings[pick];
  const kEst = Math.max(4, s.s.length - new Set(s.s).size * 2);
  return (
    <Card>
      <div style={{display:"flex", gap:8, marginBottom:16, flexWrap:"wrap"}}>
        {strings.map((x,i) => <button key={i} onClick={()=>setPick(i)} style={toggleStyle(pick===i)}>{x.note}</button>)}
      </div>
      <div className="mono" style={{fontSize:14, letterSpacing:"0.1em", padding:"14px 18px", background:"var(--bg)", borderRadius:10, border:"1px solid var(--line-2)"}}>
        {s.s}
      </div>
      <div style={{marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
        <StatBar label="Raw length" value={s.s.length} max={24} color="var(--rose)"/>
        <StatBar label="Estimated K(x)" value={kEst} max={24} color="var(--teal)"/>
      </div>
      <div style={{marginTop:10, fontSize:12, color:"var(--ink-dim)"}}>
        Compressible ⇒ pattern. Incompressible ⇒ random.
      </div>
    </Card>
  );
}
function StatBar({ label, value, max, color }) {
  return (
    <div style={{padding:14, background:"var(--bg)", border:"1px solid var(--line-2)", borderRadius:10}}>
      <div style={{display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--ink-dim)"}}>
        <span>{label}</span><span className="mono">{value}</span>
      </div>
      <div style={{height:8, background:"var(--line-2)", borderRadius:4, marginTop:8, overflow:"hidden"}}>
        <div style={{height:"100%", width:(value/max*100)+"%", background:color}}/>
      </div>
    </div>
  );
}

// ── Coffee automaton
function CoffeeDemo() {
  const [t, setT] = useStateLG(0.3);
  const entropy = Math.min(1, t*1.2);
  const complexity = 4*t*(1-t);
  return (
    <Card>
      <div style={{display:"grid", gridTemplateColumns:"repeat(32, 1fr)", gap:1, marginBottom:16}}>
        {Array.from({length:32*12}).map((_,i) => {
          const c = i%32, r = Math.floor(i/32);
          const px = c/32;
          // mix two phases
          const hue = Math.abs(Math.sin(px*10 + t*40 + r)) > (1-t) ? "var(--rose)" : "var(--teal)";
          return <div key={i} style={{aspectRatio:"1", background:hue, opacity: t < 0.05 ? (c<16?1:0.3) : 1}}/>;
        })}
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
        <StatBar label="Entropy S(t)" value={entropy*100|0} max={100} color="var(--rose)"/>
        <StatBar label="Complexity C(t)" value={complexity*100|0} max={100} color="var(--amber)"/>
      </div>
      <div style={{marginTop:14}}>
        <div style={{fontSize:11, color:"var(--ink-dim)", marginBottom:6}}>Time t = {t.toFixed(2)}</div>
        <input type="range" min={0} max={1} step={0.01} value={t} onChange={e=>setT(parseFloat(e.target.value))} style={{width:"100%"}}/>
      </div>
    </Card>
  );
}

// ── Pairs (relation nets)
function PairsDemo() {
  const objs = ["red cube","blue sphere","green cyl","yellow cube","red sphere"];
  const colors = ["var(--rose)","var(--sky)","var(--teal)","var(--amber)","var(--rose)"];
  const [a,setA] = useStateLG(0), [b,setB] = useStateLG(2);
  return (
    <Card>
      <div style={{display:"flex", gap:10, flexWrap:"wrap", marginBottom:18}}>
        {objs.map((o,i) => (
          <button key={i} onClick={() => { if (i===a) setB(i); else if (i===b) setA(i); else setB(i); setA(a); }}
            style={{padding:"8px 12px", borderRadius:8, cursor:"pointer",
              background: (i===a||i===b) ? `color-mix(in oklch, ${colors[i]} 22%, transparent)` : "var(--bg)",
              border:"1px solid " + ((i===a||i===b) ? colors[i] : "var(--line-2)"),
              color:"var(--ink)", fontSize:13}}>{o}</button>
        ))}
      </div>
      <div style={{padding:"18px 20px", background:"var(--bg)", borderRadius:10, border:"1px dashed var(--line-2)", textAlign:"center"}}>
        <div style={{fontSize:11, color:"var(--ink-dim)", marginBottom:8}}>Shared MLP g_θ applied to this pair:</div>
        <div style={{fontSize:18, fontFamily:"Instrument Serif, serif"}}>
          g( <span style={{color:colors[a]}}>{objs[a]}</span>, <span style={{color:colors[b]}}>{objs[b]}</span> )
        </div>
        <div style={{fontSize:11, color:"var(--ink-dim)", marginTop:8}}>One MLP, applied to all (<em>n choose 2</em>) pairs, then summed.</div>
      </div>
    </Card>
  );
}

// ── Graph (message passing)
function GraphDemo() {
  const nodes = [{x:50,y:30},{x:120,y:60},{x:200,y:40},{x:80,y:140},{x:170,y:160},{x:250,y:110}];
  const edges = [[0,1],[1,2],[1,3],[3,4],[2,5],[4,5],[1,5]];
  const [step, setStep] = useStateLG(0);
  useEffectLG(() => {
    const t = setInterval(() => setStep(s => (s+1) % 4), 1100);
    return () => clearInterval(t);
  }, []);
  return (
    <Card>
      <svg viewBox="0 0 300 200" style={{width:"100%", height:220}}>
        {edges.map((e,i) => (
          <line key={i} x1={nodes[e[0]].x} y1={nodes[e[0]].y} x2={nodes[e[1]].x} y2={nodes[e[1]].y}
            stroke={step%2===0 ? "var(--teal)" : "var(--line-2)"} strokeWidth={step%2===0?1.5:1} strokeOpacity={step%2===0?0.6:0.4}/>
        ))}
        {nodes.map((n,i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={12 + (step*1.5)} fill={`color-mix(in oklch, var(--iris) ${20+step*10}%, transparent)`} opacity="0.4"/>
            <circle cx={n.x} cy={n.y} r="10" fill="var(--iris)"/>
          </g>
        ))}
      </svg>
      <div style={{textAlign:"center", fontSize:12, color:"var(--ink-dim)", marginTop:10}}>
        Step {step+1}: {["send messages","aggregate","update state","repeat"][step]}
      </div>
    </Card>
  );
}

// ── Memory (NTM)
function MemoryDemo() {
  const [addr, setAddr] = useStateLG(3);
  const mem = [0.2, 0.8, 0.3, 0.9, 0.1, 0.6, 0.4, 0.7];
  const weights = mem.map((_,i) => Math.exp(-Math.abs(i-addr)/1.2));
  const s = weights.reduce((a,b)=>a+b,0);
  const w = weights.map(x=>x/s);
  const r = mem.reduce((a,m,i) => a + m*w[i], 0);
  return (
    <Card>
      <div style={{display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:4, marginBottom:10}}>
        {mem.map((m,i) => (
          <div key={i} style={{aspectRatio:"1", borderRadius:6,
            background:`color-mix(in oklch, var(--iris) ${Math.round(w[i]*120)}%, var(--bg))`,
            border:"1px solid " + (i===addr ? "var(--amber)" : "var(--line-2)"),
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:11, color:"var(--ink)", fontFamily:"JetBrains Mono, monospace",
            transition:"all 200ms ease"}}>
            {m.toFixed(1)}
          </div>
        ))}
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(8,1fr)", gap:4, marginBottom:16}}>
        {w.map((ww,i) => (
          <div key={i} style={{height:Math.max(2,ww*40), background:"var(--amber)", borderRadius:2}}/>
        ))}
      </div>
      <div style={{fontSize:11, color:"var(--ink-dim)", marginBottom:8}}>Focus address = {addr} · Read r = {r.toFixed(3)}</div>
      <input type="range" min={0} max={7} value={addr} onChange={e=>setAddr(parseInt(e.target.value))} style={{width:"100%"}}/>
    </Card>
  );
}

// ── Pipeline (GPipe)
function PipelineDemo() {
  const [step, setStep] = useStateLG(0);
  useEffectLG(() => {
    const t = setInterval(() => setStep(s => (s+1) % 8), 600);
    return () => clearInterval(t);
  }, []);
  const N = 4, M = 6;
  return (
    <Card>
      <div style={{display:"grid", gridTemplateRows:`repeat(${N}, 1fr)`, gap:4}}>
        {Array.from({length:N}).map((_,g) => (
          <div key={g} style={{display:"grid", gridTemplateColumns:`auto repeat(${M+N}, 1fr)`, gap:3, alignItems:"center"}}>
            <div className="mono" style={{fontSize:10, color:"var(--ink-dim)", width:40}}>GPU {g+1}</div>
            {Array.from({length:M+N}).map((_,t) => {
              const mb = t - g;
              const active = mb >= 0 && mb < M && step >= t;
              return <div key={t} style={{
                aspectRatio:"1.6", borderRadius:3,
                background: active ? `color-mix(in oklch, var(--iris) ${40 + mb*10}%, transparent)` : "var(--bg)",
                border:"1px solid " + (active ? "var(--iris)" : "var(--line-2)"),
                transition:"all 200ms ease",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:9, color:"var(--ink)"
              }}>{active ? "μ"+(mb+1) : ""}</div>;
            })}
          </div>
        ))}
      </div>
      <div style={{fontSize:11, color:"var(--ink-dim)", marginTop:14, textAlign:"center"}}>
        After N-1 warm-up steps, all GPUs are busy on different micro-batches.
      </div>
    </Card>
  );
}

// ── Weights (generic alignment)
function WeightsDemo({ concept }) {
  const source = ["I","love","cats"];
  const target = ["J'","adore","les","chats"];
  const align = [
    [0.8, 0.1, 0.1],
    [0.05, 0.85, 0.1],
    [0.1, 0.1, 0.1],
    [0.05, 0.05, 0.9]
  ];
  const [t, setT] = useStateLG(1);
  return (
    <Card>
      <div style={{display:"grid", gridTemplateColumns:`100px repeat(${source.length}, 1fr)`, gap:6, alignItems:"center"}}>
        <div/>
        {source.map((s,i) => <div key={i} className="serif" style={{textAlign:"center", fontSize:14, color:"var(--ink-dim)"}}>{s}</div>)}
        {target.map((tw,r) => (
          <>
            <div key={"l"+r} className="serif" style={{fontSize:14, color:"var(--ink-dim)"}}>{tw}</div>
            {source.map((_,c) => {
              const w = Math.pow(align[r][c], 1/t);
              return <div key={r+"-"+c} style={{
                aspectRatio:"1", borderRadius:4,
                background:`color-mix(in oklch, var(--iris) ${Math.round(w*120)}%, var(--bg))`,
                border:"1px solid var(--line-2)",
                transition:"all 200ms ease"
              }}/>;
            })}
          </>
        ))}
      </div>
      <div style={{marginTop:16}}>
        <div style={{fontSize:11, color:"var(--ink-dim)"}}>Softmax temperature τ = {t.toFixed(2)}</div>
        <input type="range" min={0.3} max={3} step={0.05} value={t} onChange={e=>setT(parseFloat(e.target.value))} style={{width:"100%"}}/>
      </div>
    </Card>
  );
}

// ── Tokens stream (RNN)
function TokensStreamDemo() {
  const { LESSON_LIB } = window;
  const sent = "to be or not to be that is".split(" ");
  const [t, setT] = useStateLG(3);
  return (
    <Card>
      <div style={{display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center", marginBottom:20}}>
        {sent.map((w,i) => (
          <button key={i} onClick={() => setT(i)} className="serif" style={{
            padding:"8px 12px", fontSize:18, borderRadius:8, cursor:"pointer",
            background: i===t ? "var(--amber)" : i<t ? "color-mix(in oklch, var(--teal) 15%, var(--bg))" : "var(--bg)",
            color: i===t ? "#1a1306" : "var(--ink)",
            border:"1px solid " + (i===t ? "var(--amber)" : i<t ? "var(--teal)" : "var(--line-2)"),
            fontWeight: i===t ? 600 : 400, transition:"all 180ms ease"
          }}>{w}</button>
        ))}
      </div>
      <div style={{padding:"14px 18px", background:"var(--bg)", border:"1px dashed var(--line-2)", borderRadius:10}}>
        <div style={{fontSize:11, color:"var(--ink-dim)", marginBottom:8}}>Hidden state h at step {t+1}</div>
        <div style={{display:"flex", gap:3}}>
          {Array.from({length:32}).map((_,i) => (
            <div key={i} style={{flex:1, height:24, borderRadius:2,
              background: `color-mix(in oklch, var(--teal) ${Math.round(Math.abs(Math.sin(i*0.3 + t*0.7))*120)}%, var(--bg-2))`,
              transition:"all 220ms ease"
            }}/>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ── Code toggle (annotated)
function CodeToggleDemo() {
  const [show, setShow] = useStateLG("paper");
  return (
    <Card>
      <div style={{display:"flex", gap:8, marginBottom:16}}>
        <button onClick={()=>setShow("paper")} style={toggleStyle(show==="paper")}>Paper</button>
        <button onClick={()=>setShow("code")} style={toggleStyle(show==="code")}>Code</button>
      </div>
      {show === "paper" ? (
        <div className="serif" style={{fontSize:17, lineHeight:1.7, color:"var(--ink)", padding:"6px 0"}}>
          "We call our particular attention Scaled Dot-Product Attention. We compute the dot products of the query with all keys, divide each by √dₖ, and apply a softmax function to obtain the weights on the values."
        </div>
      ) : (
        <pre className="mono" style={{fontSize:12, color:"var(--ink)", background:"var(--bg)", padding:"16px 18px", borderRadius:10, border:"1px solid var(--line-2)", overflow:"auto", lineHeight:1.7, margin:0}}>
{`def attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = Q @ K.transpose(-2,-1) / math.sqrt(d_k)
    if mask is not None:
        scores = scores.masked_fill(mask==0, -1e9)
    p_attn = scores.softmax(dim=-1)
    return p_attn @ V, p_attn`}
        </pre>
      )}
    </Card>
  );
}

// ── Slider fallback
function SliderDemo() {
  const [v, setV] = useStateLG(0.5);
  return (
    <Card>
      <div style={{fontSize:12, color:"var(--ink-dim)", marginBottom:10}}>Parameter = {v.toFixed(2)}</div>
      <input type="range" min={0} max={1} step={0.01} value={v} onChange={e=>setV(parseFloat(e.target.value))} style={{width:"100%"}}/>
      <div style={{marginTop:20, height:16, background:"var(--line-2)", borderRadius:8, overflow:"hidden"}}>
        <div style={{height:"100%", width:(v*100)+"%", background:"linear-gradient(90deg, var(--teal), var(--amber))", transition:"width 200ms ease"}}/>
      </div>
      <div style={{marginTop:14, fontSize:12, color:"var(--ink-dim)", fontStyle:"italic"}}>
        This concept's custom playground isn't built yet — but you can feel the knob.
      </div>
    </Card>
  );
}

// ─── SOCRATIC (generic) ──────────────────────────────────────────────────────
function GenericSocratic({ data, onOpenAI }) {
  const [idx, setIdx] = useStateLG(0);
  const [txt, setTxt] = useStateLG("");
  const [revealed, setRevealed] = useStateLG(false);
  const [hintOn, setHintOn] = useStateLG(false);
  if (!data || data.length === 0) return <div style={{color:"var(--ink-dim)", padding:40, textAlign:"center"}}>(no Socratic questions authored)</div>;
  const q = data[idx];
  return (
    <div style={{maxWidth:760, margin:"40px auto 0"}}>
      <div className="chip" style={{marginBottom:18}}>Socratic</div>
      <div style={{padding:"32px 30px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14}}>
        <div className="mono" style={{fontSize:10, color:"var(--ink-dim)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14}}>
          Prompt {idx+1} of {data.length}
        </div>
        <div className="serif" style={{fontSize:26, lineHeight:1.3, marginBottom:22}}>{q.q}</div>
        <textarea value={txt} onChange={e=>setTxt(e.target.value)} disabled={revealed}
          placeholder="Think it through in your own words."
          style={{width:"100%", minHeight:110, padding:"14px 16px", background:"var(--bg)",
            border:"1px solid var(--line-2)", borderRadius:10, color:"var(--ink)",
            fontSize:14, fontFamily:"inherit", lineHeight:1.6, resize:"vertical"}}/>
        <div style={{display:"flex", gap:10, marginTop:14, flexWrap:"wrap"}}>
          <button onClick={()=>setHintOn(h=>!h)} style={btnGhost2()}>{hintOn ? "hide hint" : "nudge"}</button>
          <button onClick={onOpenAI} style={btnGhost2()}><P.IconBrain size={12}/> ask tutor</button>
          <div style={{flex:1}}/>
          {!revealed
            ? <P.PrimaryBtn onClick={()=>setRevealed(true)}>compare <P.IconArrowRight/></P.PrimaryBtn>
            : <P.PrimaryBtn onClick={()=>{ setIdx(i=>(i+1)%data.length); setTxt(""); setRevealed(false); setHintOn(false); }}>next <P.IconArrowRight/></P.PrimaryBtn>}
        </div>
        {hintOn && <div className="anim-slide-up" style={{marginTop:14, padding:"12px 16px", background:"color-mix(in oklch, var(--sky) 8%, transparent)", border:"1px solid color-mix(in oklch, var(--sky) 30%, transparent)", borderRadius:10, fontSize:13, lineHeight:1.6}}>
          <span className="mono" style={{fontSize:10, color:"var(--sky)", textTransform:"uppercase"}}>Hint</span>
          <div style={{marginTop:4}}>{q.hint}</div>
        </div>}
        {revealed && <div className="anim-slide-up" style={{marginTop:16, padding:"18px 20px", background:"color-mix(in oklch, var(--teal) 6%, transparent)", border:"1px solid color-mix(in oklch, var(--teal) 35%, transparent)", borderRadius:10, fontSize:14, lineHeight:1.7}}>
          <div className="mono" style={{fontSize:10, color:"var(--teal)", textTransform:"uppercase", marginBottom:8}}>Expert answer</div>
          {q.expected}
        </div>}
      </div>
    </div>
  );
}
function btnGhost2(){ return {
  display:"inline-flex", alignItems:"center", gap:6, padding:"8px 12px",
  background:"transparent", border:"1px solid var(--line-2)", color:"var(--ink-dim)",
  borderRadius:8, fontSize:12, cursor:"pointer"
};}

// ─── ASSEMBLE (generic) ──────────────────────────────────────────────────────
function GenericAssemble({ data }) {
  const { slots, pool } = data;
  const [placed, setPlaced] = useStateLG({});
  const [dragging, setDragging] = useStateLG(null);
  const correct = slots.filter(s => placed[s.id] === s.want).length;
  const done = correct === slots.length;
  return (
    <div style={{maxWidth:960, margin:"32px auto 0"}}>
      <div className="chip" style={{marginBottom:18}}>Assemble</div>
      <h2 className="serif" style={{fontSize:40, margin:"0 0 18px", fontWeight:400, letterSpacing:"-0.01em"}}>Build it in order.</h2>
      <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:28}}>
        <div style={{padding:"24px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14}}>
          <div className="mono" style={{fontSize:10, color:"var(--ink-dim)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:14, textAlign:"center"}}>↓ flow</div>
          <div style={{display:"flex", flexDirection:"column", gap:10}}>
            {slots.map((s,i) => {
              const piece = placed[s.id];
              const ok = piece === s.want;
              return (
                <div key={s.id} onDragOver={e=>e.preventDefault()} onDrop={()=>{ if (dragging){ setPlaced(p=>({...p,[s.id]:dragging})); setDragging(null); }}}
                  style={{
                    padding:"16px 20px", borderRadius:10,
                    background: piece ? (ok ? "color-mix(in oklch, var(--teal) 10%, var(--bg))" : "color-mix(in oklch, var(--rose) 12%, var(--bg))") : "var(--bg)",
                    border:"1px dashed " + (piece ? (ok ? "color-mix(in oklch, var(--teal) 50%, transparent)" : "color-mix(in oklch, var(--rose) 50%, transparent)") : "var(--line-2)"),
                    display:"flex", alignItems:"center", justifyContent:"space-between", gap:14, transition:"all 200ms ease"
                  }}>
                  <span className="mono" style={{fontSize:11, color:"var(--ink-dim)", width:28}}>L{i+1}</span>
                  {piece
                    ? <span style={{flex:1, fontSize:13, color: ok ? "var(--ink)" : "var(--rose)"}}>{pool.find(p=>p.id===piece)?.label}</span>
                    : <span style={{flex:1, fontSize:12, color:"var(--ink-faint)", fontStyle:"italic"}}>drop: {s.label.toLowerCase()}</span>}
                  {ok && <P.IconCheck size={14}/>}
                  {piece && !ok && <button onClick={()=>setPlaced(p=>{ const n={...p}; delete n[s.id]; return n; })} style={{background:"none", border:"none", color:"var(--rose)", cursor:"pointer"}}><P.IconX size={12}/></button>}
                </div>
              );
            })}
          </div>
          {done && <div className="anim-slide-up" style={{marginTop:18, padding:"12px 16px", background:"color-mix(in oklch, var(--teal) 12%, transparent)", border:"1px solid var(--teal)", borderRadius:10, fontSize:13}}>
            <P.IconCheck size={12}/> Assembled. You've mapped the algorithm.
          </div>}
        </div>
        <div>
          <div className="mono" style={{fontSize:10, color:"var(--ink-dim)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:12}}>Components</div>
          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            {pool.map(p => (
              <div key={p.id} draggable onDragStart={()=>setDragging(p.id)}
                style={{
                  padding:"11px 13px", background:"var(--bg-2)",
                  border:"1px solid " + (dragging===p.id ? p.color : "var(--line-2)"),
                  borderLeft:"3px solid " + p.color,
                  borderRadius:10, cursor:"grab", fontSize:13,
                  opacity: dragging===p.id ? 0.5 : 1
                }}>
                {p.label}
                {p.decoy && <span style={{fontSize:10, color:"var(--ink-faint)", marginLeft:6}}>(decoy)</span>}
                {p.multi && <span style={{fontSize:10, color:"var(--ink-faint)", marginLeft:6}}>(×2)</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MASTERY (generic) ───────────────────────────────────────────────────────
function GenericMastery({ data }) {
  const [idx, setIdx] = useStateLG(0);
  const [picked, setPicked] = useStateLG(null);
  const [score, setScore] = useStateLG(0);
  const [done, setDone] = useStateLG(false);
  if (!data || data.length === 0) return <div style={{color:"var(--ink-dim)", padding:40, textAlign:"center"}}>(no mastery items yet)</div>;
  const q = data[idx];
  function choose(i){ if (picked !== null) return; setPicked(i); if (q.options[i].ok) setScore(s=>s+1); }
  function next(){ if (idx === data.length-1) setDone(true); else { setIdx(i=>i+1); setPicked(null); } }
  if (done) {
    const pct = Math.round(score/data.length*100);
    return (
      <div style={{maxWidth:720, margin:"60px auto 0", textAlign:"center"}}>
        <div className="chip" style={{marginBottom:18}}>Mastery</div>
        <h2 className="serif" style={{fontSize:72, margin:"0 0 16px", fontWeight:400, color:"var(--amber)"}}>{pct}%</h2>
        <p style={{fontSize:15, color:"var(--ink-dim)", maxWidth:500, margin:"0 auto 32px", lineHeight:1.7}}>
          {pct>=80 ? "Locked in. Streak continues." : pct>=50 ? "Solid. Revisit in 3 days." : "Worth another pass."}
        </p>
        <P.PrimaryBtn onClick={()=>{ setDone(false); setIdx(0); setPicked(null); setScore(0); }}>retry <P.IconArrowRight/></P.PrimaryBtn>
      </div>
    );
  }
  return (
    <div style={{maxWidth:760, margin:"40px auto 0"}}>
      <div className="chip" style={{marginBottom:18}}>Mastery {idx+1} of {data.length}</div>
      <div style={{padding:"30px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14}}>
        <div className="serif" style={{fontSize:24, lineHeight:1.35, marginBottom:22}}>{q.prompt}</div>
        <div style={{display:"flex", flexDirection:"column", gap:10}}>
          {q.options.map((o,i) => {
            const isPick = picked===i, rev = picked!==null;
            const right = rev && o.ok, wrong = rev && isPick && !o.ok;
            return (
              <button key={i} onClick={()=>choose(i)} disabled={rev} style={{
                textAlign:"left", padding:"14px 16px", borderRadius:10, cursor: rev?"default":"pointer",
                background: right ? "color-mix(in oklch, var(--teal) 10%, transparent)" : wrong ? "color-mix(in oklch, var(--rose) 10%, transparent)" : isPick ? "color-mix(in oklch, var(--amber) 10%, transparent)" : "var(--bg)",
                border:"1px solid " + (right ? "var(--teal)" : wrong ? "var(--rose)" : "var(--line-2)"),
                color:"var(--ink)"
              }}>
                <div style={{display:"flex", alignItems:"flex-start", gap:12}}>
                  <div style={{width:16, height:16, borderRadius:"50%", flexShrink:0, marginTop:2, display:"flex", alignItems:"center", justifyContent:"center",
                    background: right?"var(--teal)":wrong?"var(--rose)":"transparent",
                    border:"1px solid " + (right?"var(--teal)":wrong?"var(--rose)":"var(--line-2)")}}>
                    {right && <P.IconCheck size={10}/>}
                    {wrong && <P.IconX size={10}/>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14}}>{o.t}</div>
                    {rev && (isPick || o.ok) && <div style={{fontSize:12, color: o.ok?"var(--teal)":"var(--rose)", marginTop:6, lineHeight:1.5}}>{o.why}</div>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {picked !== null && <div style={{marginTop:18, display:"flex", justifyContent:"flex-end"}}>
          <P.PrimaryBtn onClick={next}>{idx===data.length-1?"see score":"next"} <P.IconArrowRight/></P.PrimaryBtn>
        </div>}
      </div>
    </div>
  );
}

window.GENERIC_STAGES = { GenericHook, GenericIntuition, GenericPlayground, GenericSocratic, GenericAssemble, GenericMastery };
