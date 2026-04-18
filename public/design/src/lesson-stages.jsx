// Six stages for the Attention lesson — each a different interaction.

const { useState: useStateLS, useEffect: useEffectLS, useMemo: useMemoLS, useRef: useRefLS } = React;

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 1 · HOOK — "Why attention, really?"
// ─────────────────────────────────────────────────────────────────────────────
function HookStage() {
  const [step, setStep] = useStateLS(0);
  const beats = [
    { k:"before", label:"RNN", sub:"Word by word. Bottleneck.", speed:120 },
    { k:"after",  label:"Transformer", sub:"All at once. Everything looks at everything.", speed:30 },
  ];
  useEffectLS(() => {
    const t = setTimeout(() => setStep(s => (s+1) % 2), 3800);
    return () => clearTimeout(t);
  }, [step]);
  const cur = beats[step];
  const sentence = "The animal didn't cross the street because it was too tired".split(" ");

  return (
    <div style={{maxWidth:760, margin:"40px auto 0"}}>
      <div className="chip" style={{marginBottom:20}}><P.IconSpark size={11}/> Hook</div>
      <h2 className="serif" style={{fontSize:56, margin:"0 0 24px", fontWeight:400, letterSpacing:"-0.01em", lineHeight:1.05}}>
        The sentence reads you<br/><span style={{color:"var(--amber)"}}>as much as you read it.</span>
      </h2>
      <p style={{fontSize:16, color:"var(--ink-dim)", lineHeight:1.7, marginBottom:48}}>
        For 30 years, sequence models processed language like a tape: one token after another.
        Attention broke the tape. Watch what changes.
      </p>

      <div style={{
        padding:"40px 32px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14,
        position:"relative", overflow:"hidden"
      }}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28}}>
          <div>
            <div className="mono" style={{fontSize:10, color:"var(--ink-dim)", letterSpacing:"0.14em", textTransform:"uppercase"}}>Architecture</div>
            <div style={{fontSize:26, fontWeight:600, marginTop:4, color:cur.k==="before"?"var(--rose)":"var(--teal)"}}>{cur.label}</div>
            <div style={{fontSize:13, color:"var(--ink-dim)", marginTop:4}}>{cur.sub}</div>
          </div>
          <div style={{display:"flex", gap:6}}>
            {beats.map((b,i) => (
              <button key={i} onClick={() => setStep(i)} style={{
                width: step===i ? 24 : 8, height:4, borderRadius:2, border:"none",
                background: step===i ? "var(--amber)" : "var(--line-2)",
                cursor:"pointer", transition:"all 240ms ease"
              }}/>
            ))}
          </div>
        </div>

        <div style={{display:"flex", flexWrap:"wrap", gap:10, fontSize:17, fontFamily:"Instrument Serif, serif"}}>
          {sentence.map((w, i) => (
            <TokenPulse key={step+"-"+i} word={w} delay={i*cur.speed} mode={cur.k} highlight={cur.k==="after" && (i===1||i===7)}/>
          ))}
        </div>

        {cur.k === "after" && (
          <svg style={{position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none"}} className="anim-fade-in">
            <defs>
              <linearGradient id="attnline" x1="0" x2="1">
                <stop offset="0" stopColor="var(--amber)" stopOpacity="0.0"/>
                <stop offset="0.5" stopColor="var(--amber)" stopOpacity="0.6"/>
                <stop offset="1" stopColor="var(--amber)" stopOpacity="0.0"/>
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      <div style={{marginTop:36, fontSize:14, color:"var(--ink-dim)", lineHeight:1.7, fontStyle:"italic"}}>
        You're going to understand what just happened — not by reading about it, but by building it.
      </div>
    </div>
  );
}

function TokenPulse({ word, delay, mode, highlight }) {
  return (
    <span style={{
      padding:"8px 14px",
      background: highlight ? "color-mix(in oklch, var(--amber) 20%, transparent)" : "var(--bg)",
      border: "1px solid " + (highlight ? "color-mix(in oklch, var(--amber) 50%, transparent)" : "var(--line-2)"),
      borderRadius:10, fontSize:20, animationDelay: delay+"ms",
      animation: mode==="before" ? "slide-up 500ms ease both" : "fade-in 800ms ease both"
    }} className={mode==="before" ? "anim-slide-up" : "anim-fade-in"}>
      {word}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 2 · INTUITION — Q·K as "every query reaches every key"
// ─────────────────────────────────────────────────────────────────────────────
function IntuitionStage() {
  const [q, setQ] = useStateLS(7); // "it"
  const sent = window.DATA.ATTN_SENT;

  // animated pulse from q to others
  return (
    <div style={{maxWidth:820, margin:"40px auto 0"}}>
      <div className="chip" style={{marginBottom:18}}>Intuition</div>
      <h2 className="serif" style={{fontSize:44, margin:"0 0 16px", fontWeight:400, letterSpacing:"-0.01em"}}>
        Query. Key. Value.
      </h2>
      <p style={{fontSize:15, color:"var(--ink-dim)", lineHeight:1.7, maxWidth:640, marginBottom:40}}>
        Each token asks a <span style={{color:"var(--amber)"}}>question</span> (query), carries an <span style={{color:"var(--sky)"}}>address</span> (key), and holds some <span style={{color:"var(--teal)"}}>payload</span> (value).
        Pick a query word — watch it reach out.
      </p>

      {/* Q/K/V cards */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:36}}>
        <QkvCard color="var(--amber)" letter="Q" title="Query" sub="what am I looking for?"/>
        <QkvCard color="var(--sky)"   letter="K" title="Key"   sub="what do I advertise?"/>
        <QkvCard color="var(--teal)"  letter="V" title="Value" sub="what do I carry?"/>
      </div>

      <div style={{
        padding:"36px 28px", background:"var(--bg-2)", border:"1px solid var(--line)",
        borderRadius:14, position:"relative", overflow:"hidden", minHeight:260
      }}>
        <div style={{display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", position:"relative", zIndex:2}}>
          {sent.map((w, i) => {
            const isQ = i === q;
            return (
              <button key={i} onClick={() => setQ(i)}
                data-ti={i}
                style={{
                  padding:"10px 14px", borderRadius:10, cursor:"pointer",
                  background: isQ ? "var(--amber)" : "var(--bg)",
                  border:"1px solid " + (isQ ? "var(--amber)" : "var(--line-2)"),
                  color: isQ ? "#1a1306" : "var(--ink)",
                  fontFamily:"Instrument Serif, serif", fontSize:20,
                  fontWeight: isQ ? 600 : 400,
                  transition:"all 200ms ease",
                  position:"relative"
                }}>
                {w}
                {isQ && <div style={{position:"absolute", top:-22, left:"50%", transform:"translateX(-50%)", fontSize:10, color:"var(--amber)", letterSpacing:"0.1em"}}>QUERY</div>}
              </button>
            );
          })}
        </div>

        <div style={{marginTop:36, padding:"14px 20px", background:"var(--bg)", border:"1px dashed var(--line-2)", borderRadius:10, fontSize:13, color:"var(--ink-dim)", lineHeight:1.7}}>
          <span style={{color:"var(--amber)"}}>"{sent[q]}"</span> is asking every other word:
          {" "}<span className="mono" style={{color:"var(--ink)"}}>how much do you match my question?</span>
          {" "}Softmax over those scores gives a distribution — a <em>soft lookup</em>.
        </div>
      </div>
    </div>
  );
}

function QkvCard({ color, letter, title, sub }) {
  return (
    <div style={{padding:"22px 20px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:12, textAlign:"left"}}>
      <div style={{display:"flex", alignItems:"center", gap:14, marginBottom:8}}>
        <div style={{
          width:36, height:36, borderRadius:8,
          background:"color-mix(in oklch, "+color+" 22%, transparent)",
          border:"1px solid "+color,
          display:"flex", alignItems:"center", justifyContent:"center",
          color, fontFamily:"Instrument Serif, serif", fontSize:22, fontWeight:600
        }}>{letter}</div>
        <div>
          <div style={{fontSize:14, fontWeight:600}}>{title}</div>
          <div style={{fontSize:11, color:"var(--ink-dim)"}}>{sub}</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 3 · PLAYGROUND — multi-head attention toy
// ─────────────────────────────────────────────────────────────────────────────
function PlaygroundStage() {
  const { ATTN_SENT, HEADS, attnWeights } = window.DATA;
  const [headId, setHeadId] = useStateLS("coreference");
  const [q, setQ] = useStateLS(7);
  const [temp, setTemp] = useStateLS(1.0);
  const weights = useMemoLS(() => withTemp(attnWeights(headId, q, ATTN_SENT.length), temp), [headId, q, temp]);
  const headKeys = Object.keys(HEADS);

  return (
    <div style={{maxWidth:900, margin:"32px auto 0"}}>
      <div className="chip" style={{marginBottom:18}}>Playground</div>
      <h2 className="serif" style={{fontSize:44, margin:"0 0 12px", fontWeight:400, letterSpacing:"-0.01em"}}>
        Play with attention.
      </h2>
      <p style={{fontSize:15, color:"var(--ink-dim)", lineHeight:1.7, maxWidth:620, marginBottom:30}}>
        Change the <strong style={{color:"var(--ink)"}}>head</strong>, pick a <strong style={{color:"var(--amber)"}}>query token</strong>, slide the <strong style={{color:"var(--ink)"}}>softmax temperature</strong>. The arcs below are real weights, normalized to sum to 1.
      </p>

      {/* head tabs */}
      <div style={{display:"flex", gap:8, marginBottom:24, flexWrap:"wrap"}}>
        {headKeys.map(h => {
          const active = h === headId;
          return (
            <button key={h} onClick={() => setHeadId(h)} style={{
              padding:"10px 16px", borderRadius:10, cursor:"pointer",
              background: active ? "color-mix(in oklch, "+HEADS[h].hue+" 16%, transparent)" : "var(--bg-2)",
              border:"1px solid " + (active ? HEADS[h].hue : "var(--line-2)"),
              color: active ? HEADS[h].hue : "var(--ink)",
              fontSize:12, fontWeight:active?600:400
            }}>
              <div>{HEADS[h].name}</div>
              <div style={{fontSize:10, color:"var(--ink-dim)", marginTop:2}}>{HEADS[h].hint}</div>
            </button>
          );
        })}
      </div>

      {/* the visualization */}
      <div style={{padding:"40px 28px 28px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14, position:"relative"}}>
        <AttentionArcs sent={ATTN_SENT} q={q} onQ={setQ} weights={weights} color={HEADS[headId].hue}/>

        {/* weights bar */}
        <div style={{marginTop:32, display:"grid", gridTemplateColumns:`repeat(${ATTN_SENT.length}, 1fr)`, gap:4, alignItems:"end"}}>
          {weights.map((w, i) => (
            <div key={i} style={{display:"flex", flexDirection:"column", alignItems:"center", gap:4}}>
              <div style={{
                width:"100%", height: Math.max(2, w * 80),
                background: HEADS[headId].hue, borderRadius:2, opacity: 0.35 + w*0.65,
                transition:"all 240ms ease"
              }}/>
              <div className="mono" style={{fontSize:9, color:"var(--ink-faint)"}}>{(w*100).toFixed(0)}</div>
            </div>
          ))}
        </div>

        {/* controls */}
        <div style={{marginTop:28, display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:20, alignItems:"center", paddingTop:20, borderTop:"1px solid var(--line)"}}>
          <div>
            <div style={{fontSize:11, color:"var(--ink-dim)", marginBottom:8}}>Softmax temperature τ = {temp.toFixed(2)}</div>
            <input type="range" min={0.2} max={3} step={0.05} value={temp} onChange={e => setTemp(parseFloat(e.target.value))} style={{width:"100%"}}/>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:9, color:"var(--ink-faint)", marginTop:4}}>
              <span>sharp</span><span>uniform</span>
            </div>
          </div>
          <div style={{fontSize:11, color:"var(--ink-dim)", textAlign:"center", padding:"0 12px"}}>
            query =<br/><span className="serif" style={{fontSize:20, color:"var(--amber)"}}>{ATTN_SENT[q]}</span>
          </div>
          <div style={{fontSize:12, color:"var(--ink-dim)", lineHeight:1.6}}>
            <span style={{color:HEADS[headId].hue}}>●</span> {HEADS[headId].name.split("·")[1]} pays attention to <em style={{color:"var(--ink)"}}>{argmaxWord(weights, ATTN_SENT)}</em>.
          </div>
        </div>
      </div>

      <div style={{marginTop:20, fontSize:12, color:"var(--ink-dim)", fontStyle:"italic"}}>
        Try Head 2 + query "it". Notice where the weight goes.
      </div>
    </div>
  );
}

function withTemp(w, t) {
  // treat inputs as probs, convert to logits, re-scale, re-softmax
  const logits = w.map(x => Math.log(Math.max(1e-9, x)));
  const scaled = logits.map(l => l / t);
  const m = Math.max(...scaled);
  const ex = scaled.map(l => Math.exp(l - m));
  const s = ex.reduce((a,b) => a+b, 0);
  return ex.map(e => e/s);
}
function argmaxWord(w, sent) {
  let bi = 0; for (let i=1;i<w.length;i++) if (w[i]>w[bi]) bi = i;
  return sent[bi];
}

function AttentionArcs({ sent, q, onQ, weights, color }) {
  const ref = useRefLS(null);
  const [boxes, setBoxes] = useStateLS([]);
  useEffectLS(() => {
    if (!ref.current) return;
    const children = Array.from(ref.current.querySelectorAll("[data-tok]"));
    const parent = ref.current.getBoundingClientRect();
    setBoxes(children.map(c => {
      const r = c.getBoundingClientRect();
      return { x: r.left - parent.left + r.width/2, y: r.top - parent.top + r.height/2, w: r.width };
    }));
  }, [q, sent]);

  return (
    <div ref={ref} style={{position:"relative", minHeight:140}}>
      {/* tokens row */}
      <div style={{display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", position:"relative", zIndex:2, paddingTop:50}}>
        {sent.map((w, i) => {
          const isQ = i === q;
          const weight = weights[i];
          return (
            <button data-tok key={i} onClick={() => onQ(i)} style={{
              padding:"10px 13px", borderRadius:9, cursor:"pointer",
              background: isQ ? "var(--amber)" : `color-mix(in oklch, ${color} ${Math.round(weight*120)}%, var(--bg))`,
              border:"1px solid " + (isQ ? "var(--amber)" : `color-mix(in oklch, ${color} ${Math.round(40 + weight*120)}%, var(--line-2))`),
              color: isQ ? "#1a1306" : "var(--ink)",
              fontFamily:"Instrument Serif, serif", fontSize:20, fontWeight: isQ?600:400,
              transition:"all 220ms ease"
            }}>
              {w}
            </button>
          );
        })}
      </div>

      {/* arcs */}
      <svg style={{position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none"}}>
        {boxes.length > 0 && boxes.map((b, i) => {
          if (i === q) return null;
          const qb = boxes[q]; if (!qb) return null;
          const w = weights[i];
          const mid = { x: (qb.x + b.x)/2, y: Math.min(qb.y, b.y) - 30 - w*30 };
          const d = `M${qb.x},${qb.y} Q${mid.x},${mid.y} ${b.x},${b.y}`;
          return (
            <path key={i} d={d} fill="none" stroke={color} strokeWidth={0.5 + w*4} strokeOpacity={0.15 + w*0.85} strokeLinecap="round"/>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 4 · SOCRATIC — open-ended prompts
// ─────────────────────────────────────────────────────────────────────────────
function SocraticStage({ onOpenAI }) {
  const { SOCRATIC } = window.DATA;
  const [idx, setIdx] = useStateLS(0);
  const [txt, setTxt] = useStateLS("");
  const [revealed, setRevealed] = useStateLS(false);
  const [hintOn, setHintOn] = useStateLS(false);
  const q = SOCRATIC[idx];

  return (
    <div style={{maxWidth:760, margin:"40px auto 0"}}>
      <div className="chip" style={{marginBottom:18}}>Socratic</div>
      <h2 className="serif" style={{fontSize:44, margin:"0 0 24px", fontWeight:400, letterSpacing:"-0.01em", lineHeight:1.1}}>
        Think, then type.
      </h2>

      <div style={{padding:"36px 32px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14}}>
        <div className="mono" style={{fontSize:10, color:"var(--ink-dim)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:16}}>
          Prompt {idx+1} of {SOCRATIC.length}
        </div>
        <div className="serif" style={{fontSize:28, lineHeight:1.3, marginBottom:24}}>{q.q}</div>

        <textarea
          value={txt} onChange={e => setTxt(e.target.value)} disabled={revealed}
          placeholder="Think it through in your own words. No grading. This is rehearsal."
          style={{
            width:"100%", minHeight:120, padding:"14px 16px",
            background:"var(--bg)", border:"1px solid var(--line-2)", borderRadius:10,
            color:"var(--ink)", fontSize:14, fontFamily:"inherit", lineHeight:1.6, resize:"vertical"
          }}
        />

        <div style={{display:"flex", gap:10, marginTop:14, flexWrap:"wrap"}}>
          <button onClick={() => setHintOn(h => !h)} style={btnGhost()}>
            {hintOn ? "hide hint" : "nudge"}
          </button>
          <button onClick={onOpenAI} style={btnGhost()}>
            <P.IconBrain size={12}/> ask the tutor
          </button>
          <div style={{flex:1}}/>
          {!revealed ? (
            <P.PrimaryBtn onClick={() => setRevealed(true)}>compare with expert <P.IconArrowRight/></P.PrimaryBtn>
          ) : (
            <P.PrimaryBtn onClick={() => { setIdx(i => (i+1) % SOCRATIC.length); setTxt(""); setRevealed(false); setHintOn(false); }}>
              next prompt <P.IconArrowRight/>
            </P.PrimaryBtn>
          )}
        </div>

        {hintOn && (
          <div className="anim-slide-up" style={{marginTop:14, padding:"12px 16px", background:"color-mix(in oklch, var(--sky) 8%, transparent)", border:"1px solid color-mix(in oklch, var(--sky) 30%, transparent)", borderRadius:10, fontSize:13, color:"var(--ink)", lineHeight:1.6}}>
            <span className="mono" style={{fontSize:10, color:"var(--sky)", textTransform:"uppercase", letterSpacing:"0.12em"}}>Hint</span>
            <div style={{marginTop:4}}>{q.hint}</div>
          </div>
        )}

        {revealed && (
          <div className="anim-slide-up" style={{marginTop:18, padding:"20px 22px", background:"color-mix(in oklch, var(--teal) 6%, transparent)", border:"1px solid color-mix(in oklch, var(--teal) 35%, transparent)", borderRadius:10, color:"var(--ink)", lineHeight:1.7, fontSize:14}}>
            <div className="mono" style={{fontSize:10, color:"var(--teal)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:8}}>Expert answer</div>
            {q.expected}
          </div>
        )}
      </div>
    </div>
  );
}

function btnGhost() {
  return {
    display:"inline-flex", alignItems:"center", gap:6,
    padding:"8px 12px", background:"transparent", border:"1px solid var(--line-2)",
    color:"var(--ink-dim)", borderRadius:8, fontSize:12, cursor:"pointer"
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 5 · ASSEMBLE — drag blocks into a transformer
// ─────────────────────────────────────────────────────────────────────────────
function AssembleStage() {
  const slots = [
    { id:"embed",  label:"Token + Positional Embedding", want:"embed" },
    { id:"mha",    label:"Multi-Head Attention",          want:"mha"   },
    { id:"addnorm1", label:"Add & Norm",                   want:"addnorm" },
    { id:"ffn",    label:"Feed-Forward",                   want:"ffn"   },
    { id:"addnorm2", label:"Add & Norm",                   want:"addnorm" },
  ];
  const pool = [
    { id:"mha",     label:"Multi-Head Attention",  color:"var(--iris)" },
    { id:"ffn",     label:"Feed-Forward",          color:"var(--teal)" },
    { id:"addnorm", label:"Add & Norm",            color:"var(--sky)", multi:true  },
    { id:"embed",   label:"Embedding + PosEnc",    color:"var(--amber)"},
    { id:"softmax", label:"Output Softmax",        color:"var(--rose)", decoy:true },
  ];
  const [placed, setPlaced] = useStateLS({}); // slotId -> pieceId
  const [dragging, setDragging] = useStateLS(null);

  function drop(slotId) {
    if (!dragging) return;
    setPlaced(p => ({ ...p, [slotId]: dragging }));
    setDragging(null);
  }

  const correctCount = slots.filter(s => placed[s.id] === s.want).length;
  const done = correctCount === slots.length;

  return (
    <div style={{maxWidth:960, margin:"32px auto 0"}}>
      <div className="chip" style={{marginBottom:18}}>Assemble</div>
      <h2 className="serif" style={{fontSize:44, margin:"0 0 12px", fontWeight:400, letterSpacing:"-0.01em"}}>
        Build an encoder block.
      </h2>
      <p style={{fontSize:15, color:"var(--ink-dim)", lineHeight:1.7, maxWidth:620, marginBottom:28}}>
        Drag each piece into a slot. Order matters — residuals wrap attention and FFN independently.
      </p>

      <div style={{display:"grid", gridTemplateColumns:"1fr 280px", gap:32}}>
        {/* stack */}
        <div style={{padding:"28px 24px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14}}>
          <div className="mono" style={{fontSize:10, color:"var(--ink-dim)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:18, textAlign:"center"}}>
            input ↓
          </div>
          <div style={{display:"flex", flexDirection:"column", gap:10}}>
            {slots.map((s, i) => {
              const piece = placed[s.id];
              const correct = piece === s.want;
              return (
                <div key={s.id}
                  onDragOver={e => { e.preventDefault(); }}
                  onDrop={() => drop(s.id)}
                  style={{
                    padding:"18px 22px", borderRadius:10,
                    background: piece
                      ? (correct ? "color-mix(in oklch, var(--teal) 10%, var(--bg))" : "color-mix(in oklch, var(--rose) 14%, var(--bg))")
                      : "var(--bg)",
                    border:"1px dashed " + (piece
                      ? (correct ? "color-mix(in oklch, var(--teal) 50%, transparent)" : "color-mix(in oklch, var(--rose) 50%, transparent)")
                      : "var(--line-2)"),
                    display:"flex", alignItems:"center", justifyContent:"space-between", gap:14,
                    transition:"all 220ms ease"
                  }}>
                  <span style={{fontSize:11, color:"var(--ink-dim)", fontFamily:"JetBrains Mono, monospace", width:28}}>L{i+1}</span>
                  {piece ? (
                    <span style={{flex:1, fontSize:14, color: correct ? "var(--ink)" : "var(--rose)"}}>
                      {pool.find(p => p.id === piece)?.label}
                    </span>
                  ) : (
                    <span style={{flex:1, fontSize:13, color:"var(--ink-faint)", fontStyle:"italic"}}>drop: {s.label.toLowerCase()}</span>
                  )}
                  {correct && <P.IconCheck size={14}/>}
                  {piece && !correct && <button onClick={() => setPlaced(p => { const n = {...p}; delete n[s.id]; return n; })} style={{background:"none", border:"none", color:"var(--rose)", cursor:"pointer"}}><P.IconX size={12}/></button>}
                </div>
              );
            })}
          </div>
          <div className="mono" style={{fontSize:10, color:"var(--ink-dim)", letterSpacing:"0.14em", textTransform:"uppercase", marginTop:18, textAlign:"center"}}>
            ↓ output
          </div>
          {done && (
            <div className="anim-slide-up" style={{
              marginTop:20, padding:"14px 18px", background:"color-mix(in oklch, var(--teal) 12%, transparent)",
              border:"1px solid var(--teal)", borderRadius:10, fontSize:13, color:"var(--ink)"
            }}>
              <P.IconCheck size={12}/> That's one encoder block. Stack N=6 of these and you have the encoder.
            </div>
          )}
        </div>

        {/* pool */}
        <div>
          <div className="mono" style={{fontSize:10, color:"var(--ink-dim)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:12}}>Components</div>
          <div style={{display:"flex", flexDirection:"column", gap:8}}>
            {pool.map(p => (
              <div key={p.id}
                draggable
                onDragStart={() => setDragging(p.id)}
                style={{
                  padding:"12px 14px", background:"var(--bg-2)",
                  border:"1px solid " + (dragging===p.id ? p.color : "var(--line-2)"),
                  borderRadius:10, cursor:"grab", fontSize:13,
                  borderLeft:"3px solid " + p.color,
                  opacity: dragging===p.id ? 0.5 : 1, transition:"opacity 160ms ease"
                }}>
                {p.label}
                {p.decoy && <span style={{fontSize:10, color:"var(--ink-faint)", marginLeft:6}}>(not in encoder)</span>}
                {p.multi && <span style={{fontSize:10, color:"var(--ink-faint)", marginLeft:6}}>(used twice)</span>}
              </div>
            ))}
          </div>
          <div style={{marginTop:20, fontSize:11, color:"var(--ink-faint)", lineHeight:1.6, fontStyle:"italic"}}>
            One piece is a decoy. Two slots take the same piece — that's intentional.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 6 · MASTERY — multiple choice, reinforcement feedback
// ─────────────────────────────────────────────────────────────────────────────
function MasteryStage() {
  const { MASTERY_QS } = window.DATA;
  const [idx, setIdx] = useStateLS(0);
  const [picked, setPicked] = useStateLS(null);
  const [score, setScore] = useStateLS(0);
  const [done, setDone] = useStateLS(false);

  const q = MASTERY_QS[idx];
  function choose(i) {
    if (picked !== null) return;
    setPicked(i);
    if (q.options[i].ok) setScore(s => s+1);
  }
  function next() {
    if (idx === MASTERY_QS.length - 1) setDone(true);
    else { setIdx(i => i+1); setPicked(null); }
  }

  if (done) {
    const pct = Math.round(score/MASTERY_QS.length * 100);
    return (
      <div style={{maxWidth:720, margin:"60px auto 0", textAlign:"center"}}>
        <div className="chip" style={{marginBottom:18}}>Mastery</div>
        <h2 className="serif" style={{fontSize:72, margin:"0 0 16px", fontWeight:400, color:"var(--amber)"}}>{pct}%</h2>
        <p style={{fontSize:15, color:"var(--ink-dim)", maxWidth:500, margin:"0 auto 32px", lineHeight:1.7}}>
          {pct >= 80 ? "Transformer — locked in. Your streak continues." :
           pct >= 50 ? "Solid start. Revisit in 3 days and the ring will close." :
           "Worth another pass. The Playground helps most."}
        </p>
        <P.PrimaryBtn onClick={() => { setDone(false); setIdx(0); setPicked(null); setScore(0); }}>
          retry <P.IconArrowRight/>
        </P.PrimaryBtn>
      </div>
    );
  }

  return (
    <div style={{maxWidth:760, margin:"40px auto 0"}}>
      <div className="chip" style={{marginBottom:18}}>Mastery {idx+1} of {MASTERY_QS.length}</div>
      <div style={{padding:"32px 30px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14}}>
        <div className="serif" style={{fontSize:26, lineHeight:1.35, marginBottom:22}}>{q.prompt}</div>
        <div style={{display:"flex", flexDirection:"column", gap:10}}>
          {q.options.map((o, i) => {
            const isPick = picked === i;
            const reveal = picked !== null;
            const right = reveal && o.ok;
            const wrong = reveal && isPick && !o.ok;
            return (
              <button key={i} onClick={() => choose(i)} disabled={reveal} style={{
                textAlign:"left", padding:"16px 18px", borderRadius:10, cursor: reveal ? "default" : "pointer",
                background: right ? "color-mix(in oklch, var(--teal) 10%, transparent)"
                          : wrong ? "color-mix(in oklch, var(--rose) 10%, transparent)"
                          : isPick ? "color-mix(in oklch, var(--amber) 10%, transparent)"
                          : "var(--bg)",
                border:"1px solid " + (right ? "var(--teal)" : wrong ? "var(--rose)" : "var(--line-2)"),
                color:"var(--ink)"
              }}>
                <div style={{display:"flex", alignItems:"flex-start", gap:12}}>
                  <div style={{
                    width:18, height:18, borderRadius:"50%", border:"1px solid var(--line-2)",
                    flexShrink:0, marginTop:2, display:"flex", alignItems:"center", justifyContent:"center",
                    background: right ? "var(--teal)" : wrong ? "var(--rose)" : "transparent",
                    borderColor: right ? "var(--teal)" : wrong ? "var(--rose)" : "var(--line-2)"
                  }}>
                    {right && <P.IconCheck size={10}/>}
                    {wrong && <P.IconX size={10}/>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14}}>{o.t}</div>
                    {reveal && isPick && <div style={{fontSize:12, color: o.ok ? "var(--teal)" : "var(--rose)", marginTop:8, lineHeight:1.5}}>{o.why}</div>}
                    {reveal && !isPick && o.ok && <div style={{fontSize:12, color:"var(--teal)", marginTop:8, lineHeight:1.5}}>{o.why}</div>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div style={{marginTop:20, display:"flex", justifyContent:"flex-end"}}>
            <P.PrimaryBtn onClick={next}>{idx===MASTERY_QS.length-1 ? "see score" : "next"} <P.IconArrowRight/></P.PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  );
}

window.LESSON_STAGES = { HookStage, IntuitionStage, PlaygroundStage, SocraticStage, AssembleStage, MasteryStage };
