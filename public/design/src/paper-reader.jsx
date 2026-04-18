// Annotated paper reader — hover equations for plain-English

const { useState: useStatePR } = React;

function PaperReader({ onBack, onOpenAI }) {
  const { PAPER_EXCERPT } = window.DATA;
  const [peek, setPeek] = useStatePR(null);

  return (
    <div style={{minHeight:"100vh", background:"var(--bg)"}}>
      <P.TopBar
        left={<P.GhostBtn onClick={onBack}><P.IconArrowLeft/> Back to lesson</P.GhostBtn>}
        center={<div style={{fontSize:13, color:"var(--ink-dim)"}}>Annotated · Vaswani et al. 2017</div>}
        right={<P.GhostBtn onClick={onOpenAI}><P.IconBrain/> Ask about this</P.GhostBtn>}
      />
      <div style={{maxWidth:860, margin:"0 auto", padding:"60px 40px 120px"}}>
        <div style={{fontSize:11, color:"var(--ink-dim)", textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:14}}>
          Section 3.2 · excerpt
        </div>
        <h1 className="serif" style={{fontSize:54, margin:"0 0 8px", fontWeight:400, letterSpacing:"-0.01em"}}>
          Attention Is All You Need
        </h1>
        <div style={{fontSize:13, color:"var(--ink-dim)", marginBottom:48, lineHeight:1.6}}>
          Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin
        </div>

        <div style={{fontSize:16, lineHeight:1.85, color:"var(--ink)"}}>
          {PAPER_EXCERPT.map((block, i) => {
            if (block.kind === "h") {
              return <h3 key={i} style={{fontSize:17, fontWeight:600, margin:"36px 0 14px", color:"var(--ink)"}}>{block.text}</h3>;
            }
            if (block.kind === "p") {
              return <p key={i} style={{margin:"0 0 20px", color:"var(--ink-dim)"}}>{block.text}</p>;
            }
            if (block.kind === "eq") {
              const isPeek = peek === i;
              return (
                <div key={i} style={{margin:"28px 0"}}>
                  <button
                    onClick={() => setPeek(isPeek ? null : i)}
                    onMouseEnter={() => setPeek(i)}
                    style={{
                      width:"100%", padding:"28px 32px", background: isPeek ? "color-mix(in oklch, var(--amber) 8%, transparent)" : "var(--bg-2)",
                      border:"1px solid " + (isPeek ? "color-mix(in oklch, var(--amber) 50%, transparent)" : "var(--line)"),
                      borderRadius:12, cursor:"pointer", textAlign:"center",
                      color:"var(--ink)", fontFamily:"Instrument Serif, serif", fontSize:28, fontStyle:"italic",
                      letterSpacing:"0.01em", transition:"all 200ms ease"
                    }}
                  >
                    {block.text}
                    <div style={{fontSize:10, color:"var(--ink-dim)", marginTop:10, fontStyle:"normal", fontFamily:"JetBrains Mono, monospace", letterSpacing:"0.12em", textTransform:"uppercase"}}>
                      {isPeek ? "click to close" : "hover for plain english"}
                    </div>
                  </button>
                  {isPeek && (
                    <div className="anim-slide-up" style={{
                      marginTop:10, padding:"18px 22px", background:"var(--bg-2)",
                      border:"1px dashed color-mix(in oklch, var(--amber) 40%, transparent)", borderRadius:10,
                      fontSize:14, lineHeight:1.7, color:"var(--ink)"
                    }}>
                      <div className="mono" style={{fontSize:10, color:"var(--amber)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:8}}>Plain English</div>
                      {block.plain}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

window.PaperReader = PaperReader;
