// Mastery / review dashboard — spaced repetition feel.

const { useState: useStateR } = React;

function Review({ mastery, onBack, onPick, onOpenAI }) {
  const { CONCEPTS, CLUSTERS } = window.DATA;
  const touched = CONCEPTS.filter(c => mastery[c.id]);
  const dueSoon = touched.filter(c => (mastery[c.id].progress || 0) < 0.8).sort((a,b) => (mastery[a.id].progress||0) - (mastery[b.id].progress||0));
  const mastered = touched.filter(c => (mastery[c.id].progress || 0) >= 0.8);

  const streakDays = 7;
  return (
    <div style={{minHeight:"100vh", background:"var(--bg)"}}>
      <P.TopBar
        left={<P.GhostBtn onClick={onBack}><P.IconArrowLeft/> Back</P.GhostBtn>}
        center={<div style={{fontSize:13, color:"var(--ink-dim)"}}>Review & Mastery</div>}
        right={<P.GhostBtn onClick={onOpenAI}><P.IconBrain/> Tutor</P.GhostBtn>}
      />
      <div style={{maxWidth:1200, margin:"0 auto", padding:"56px 40px 100px"}}>
        {/* headline */}
        <div style={{display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:20, marginBottom:48}}>
          <div style={{padding:"28px 32px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14, position:"relative", overflow:"hidden"}}>
            <div className="chip" style={{marginBottom:14}}>Streak</div>
            <div style={{fontSize:72, fontFamily:"Instrument Serif, serif", lineHeight:1, letterSpacing:"-0.02em"}}>
              {streakDays}<span style={{fontSize:28, color:"var(--ink-dim)"}}> days</span>
            </div>
            <div style={{display:"flex", gap:4, marginTop:16}}>
              {Array.from({length:14}).map((_,i) => (
                <div key={i} style={{
                  width:16, height:22, borderRadius:3,
                  background: i < streakDays ? "var(--amber)" : "var(--line-2)",
                  opacity: i < streakDays ? (0.4 + 0.6*(i/streakDays)) : 1
                }}/>
              ))}
            </div>
          </div>
          <Stat label="Papers touched" value={touched.length} total={CONCEPTS.length}/>
          <Stat label="Mastered" value={mastered.length} total={CONCEPTS.length} color="var(--teal)"/>
        </div>

        {/* Due soon */}
        <Section title="Fading — revisit soon" subtitle="Spaced repetition suggests these next. Click for a 90-second refresher.">
          <div style={{display:"grid", gridTemplateColumns:"1fr", gap:10}}>
            {dueSoon.map(c => {
              const m = mastery[c.id];
              return (
                <button key={c.id} onClick={() => onPick(c)} style={{
                  display:"grid", gridTemplateColumns:"16px 1fr 200px 80px 100px", alignItems:"center", gap:16,
                  padding:"14px 18px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:10,
                  cursor:"pointer", color:"var(--ink)", textAlign:"left"
                }}>
                  <P.Dot color={CLUSTERS[c.cluster].color} size={10}/>
                  <div>
                    <div style={{fontSize:14, fontWeight:600}}>{c.name}</div>
                    <div style={{fontSize:11, color:"var(--ink-dim)"}}>{c.cluster} · {c.auth}</div>
                  </div>
                  <FadeBar value={m.progress} />
                  <span className="mono" style={{fontSize:11, color:"var(--ink-dim)"}}>last · {m.lastSeen}</span>
                  <span style={{fontSize:11, color:"var(--amber)", textAlign:"right"}}>refresh <P.IconArrowRight size={10}/></span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Mastered */}
        <Section title="Mastered" subtitle="These stayed sharp. Your explanations matched ours in the last review.">
          {mastered.length === 0 ? (
            <div style={{padding:"40px 20px", textAlign:"center", color:"var(--ink-dim)", border:"1px dashed var(--line-2)", borderRadius:10, fontSize:13}}>
              Nothing yet. Finish a lesson to fill this shelf.
            </div>
          ) : (
            <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
              {mastered.map(c => (
                <div key={c.id} className="chip on">
                  <P.IconCheck size={10}/> {c.name}
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Today's deck */}
        <Section title="Today's recall deck" subtitle="5 flashcards, 90 seconds. Generated from weakest concepts.">
          <FlashcardDeck />
        </Section>
      </div>
    </div>
  );
}

function Stat({ label, value, total, color="var(--amber)" }) {
  return (
    <div style={{padding:"28px 28px", background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14}}>
      <div className="chip" style={{marginBottom:14}}>{label}</div>
      <div style={{fontSize:56, fontFamily:"Instrument Serif, serif", lineHeight:1, color, letterSpacing:"-0.02em"}}>
        {value}<span style={{fontSize:22, color:"var(--ink-dim)"}}>/{total}</span>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div style={{marginBottom:48}}>
      <div style={{display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:18, paddingBottom:14, borderBottom:"1px solid var(--line)"}}>
        <div>
          <h2 style={{fontSize:20, margin:"0 0 4px", fontWeight:500}}>{title}</h2>
          <div style={{fontSize:12, color:"var(--ink-dim)"}}>{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function FadeBar({ value }) {
  return (
    <div style={{height:6, background:"var(--line-2)", borderRadius:3, position:"relative", overflow:"hidden"}}>
      <div style={{
        position:"absolute", left:0, top:0, bottom:0, width:(value*100)+"%",
        background:"linear-gradient(90deg, var(--rose), var(--amber))",
        borderRadius:3
      }}/>
    </div>
  );
}

function FlashcardDeck() {
  const cards = [
    { q:"What does √dₖ scaling fix?", a:"Softmax saturation for large dimensions." },
    { q:"RNN vs Transformer: what's the parallelism win?", a:"Self-attention lets every position see every other in one shot." },
    { q:"Why multi-head, not one big head?", a:"Different heads learn different relations (syntax, coreference, content)." },
    { q:"Query vs Key vs Value: one-line each.", a:"Q asks. K advertises. V is the payload." },
    { q:"Softmax τ → 0?", a:"Distribution collapses to one-hot argmax." },
  ];
  const [idx, setIdx] = useStateR(0);
  const [flip, setFlip] = useStateR(false);
  const c = cards[idx];

  function next() { setFlip(false); setIdx(i => (i+1) % cards.length); }

  return (
    <div style={{display:"flex", gap:20, alignItems:"stretch"}}>
      <button onClick={() => setFlip(f => !f)} style={{
        flex:1, minHeight:220, padding:"36px 40px", border:"1px solid var(--line)", borderRadius:14,
        background: flip ? "color-mix(in oklch, var(--teal) 10%, var(--bg-2))" : "var(--bg-2)",
        cursor:"pointer", color:"var(--ink)", textAlign:"left", position:"relative",
        transition:"background 280ms ease"
      }}>
        <div className="mono" style={{fontSize:10, color:"var(--ink-dim)", letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:20}}>
          Card {idx+1} / {cards.length} · {flip ? "Answer" : "Prompt"}
        </div>
        <div className="serif" style={{fontSize:32, lineHeight:1.25}}>
          {flip ? c.a : c.q}
        </div>
        <div style={{position:"absolute", bottom:16, right:20, fontSize:11, color:"var(--ink-dim)"}}>
          click to {flip ? "close" : "reveal"}
        </div>
      </button>
      <div style={{display:"flex", flexDirection:"column", gap:10, width:180}}>
        <button onClick={next} style={{
          padding:"14px", background:"var(--teal)", color:"#07241f", border:"none", borderRadius:10,
          fontWeight:600, fontSize:13, cursor:"pointer"
        }}>I knew it</button>
        <button onClick={next} style={{
          padding:"14px", background:"var(--bg-2)", color:"var(--ink)", border:"1px solid var(--line-2)", borderRadius:10,
          fontSize:13, cursor:"pointer"
        }}>Sort of</button>
        <button onClick={next} style={{
          padding:"14px", background:"var(--bg-2)", color:"var(--rose)", border:"1px solid color-mix(in oklch, var(--rose) 40%, transparent)", borderRadius:10,
          fontSize:13, cursor:"pointer"
        }}>Missed it</button>
      </div>
    </div>
  );
}

window.Review = Review;
