// AI side panel — always-on, context-aware. Uses window.claude.complete.

const { useState: useStateAI, useEffect: useEffectAI, useRef: useRefAI } = React;

// context prompts per stage
const STAGE_CONTEXT = {
  "home":        "The learner is on the concept map picking a paper.",
  "hook":        "The learner just saw a motivating hook about why attention matters.",
  "intuition":   "The learner is exploring an intuition-pump animation showing Q·K as a lookup.",
  "playground":  "The learner is playing with the attention weights demo — dragging heads, clicking tokens.",
  "socratic":    "The learner is being asked an open Socratic question.",
  "assemble":    "The learner is assembling a transformer block by dragging components into place.",
  "mastery":     "The learner is answering mastery multiple-choice questions.",
};

function AIPanel({ open, onClose, stageId, difficulty, conceptName }) {
  const [messages, setMessages] = useStateAI([]);
  const [input, setInput] = useStateAI("");
  const [busy, setBusy] = useStateAI(false);
  const endRef = useRefAI(null);
  const seededStages = useRefAI(new Set());

  // seed message when stage changes
  useEffectAI(() => {
    if (!stageId) return;
    if (seededStages.current.has(stageId)) return;
    seededStages.current.add(stageId);
    const hint = seedFor(stageId, conceptName);
    if (hint) setMessages(prev => [...prev, { role:"assistant", content: hint, seed:true }]);
  }, [stageId]);

  useEffectAI(() => { endRef.current?.scrollTo?.({ top: 99999, behavior:"smooth" }); }, [messages]);

  async function ask(txt) {
    const text = (txt ?? input).trim();
    if (!text || busy) return;
    setInput("");
    setMessages(m => [...m, { role:"user", content: text }]);
    setBusy(true);
    try {
      const sys = `You are a Socratic AI tutor inside a learning app about Ilya Sutskever's reading list. Current concept: ${conceptName}. Learner difficulty: ${difficulty}. Context: ${STAGE_CONTEXT[stageId] || ""} Keep replies SHORT (≤4 sentences), conversational, and ask ONE follow-up question. Never dump the full answer — lead the learner.`;
      const reply = await window.claude.complete({
        messages: [
          { role:"user", content: sys + "\n\nLearner says: " + text }
        ]
      });
      setMessages(m => [...m, { role:"assistant", content: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role:"assistant", content:"(offline) That's a great question — try rephrasing." }]);
    } finally { setBusy(false); }
  }

  const quick = quickPromptsFor(stageId);

  return (
    <P.Drawer open={open} onClose={onClose} side="right" width={400}>
      <div style={{padding:"18px 20px", borderBottom:"1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{width:8, height:8, borderRadius:"50%", background:"var(--teal)", boxShadow:"0 0 12px var(--teal)"}} className="pulse-soft" />
          <div>
            <div style={{fontSize:13, fontWeight:600}}>Socratic Tutor</div>
            <div style={{fontSize:11, color:"var(--ink-dim)"}}>watching · {stageId || "home"}</div>
          </div>
        </div>
        <button onClick={onClose} style={{background:"none", border:"none", color:"var(--ink-dim)", cursor:"pointer"}}><P.IconX/></button>
      </div>

      <div ref={endRef} style={{flex:1, overflowY:"auto", padding:"16px 18px", display:"flex", flexDirection:"column", gap:12}}>
        {messages.length === 0 && (
          <div style={{color:"var(--ink-dim)", fontSize:13, lineHeight:1.6}}>
            <span className="serif" style={{fontSize:22, color:"var(--ink)", display:"block", marginBottom:10}}>
              Ask me why, not what.
            </span>
            I'll pose questions back. Don't look for answers — generate them.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role==="user" ? "flex-end" : "flex-start",
            maxWidth:"88%",
            padding:"10px 13px", borderRadius:12, fontSize:13, lineHeight:1.55,
            background: m.role==="user" ? "color-mix(in oklch, var(--amber) 18%, transparent)" : "var(--bg)",
            border:"1px solid " + (m.role==="user" ? "color-mix(in oklch, var(--amber) 40%, transparent)" : "var(--line)"),
            color:"var(--ink)"
          }} className="anim-slide-up">
            {m.seed && <div style={{fontSize:10, color:"var(--ink-dim)", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.1em"}}>observing</div>}
            {m.content}
          </div>
        ))}
        {busy && <div style={{alignSelf:"flex-start", color:"var(--ink-dim)", fontSize:12}}>thinking…</div>}
      </div>

      {quick.length > 0 && (
        <div style={{padding:"8px 18px", borderTop:"1px solid var(--line)", display:"flex", flexWrap:"wrap", gap:6}}>
          {quick.map((q,i) => (
            <button key={i} onClick={() => ask(q)} style={{
              fontSize:11, padding:"5px 9px", borderRadius:999,
              background:"transparent", border:"1px solid var(--line-2)",
              color:"var(--ink-dim)", cursor:"pointer"
            }}>{q}</button>
          ))}
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); ask(); }} style={{padding:"14px 16px", borderTop:"1px solid var(--line)"}}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question…"
          style={{
            width:"100%", padding:"10px 12px", background:"var(--bg)",
            border:"1px solid var(--line-2)", borderRadius:9, color:"var(--ink)",
            fontSize:13, fontFamily:"inherit"
          }}
        />
      </form>
    </P.Drawer>
  );
}

function seedFor(stageId, conceptName) {
  switch (stageId) {
    case "hook": return `Before we dive in: what do you already know about ${conceptName}? One sentence is fine.`;
    case "intuition": return "Notice how the query reaches out to every key at once. If you had to explain this metaphor to a friend, what object would you use?";
    case "playground": return "Try clicking different query words. Can you find one where Head 2 tells a different story than Head 1?";
    case "socratic": return "Don't answer yet — think for 15 seconds first.";
    case "assemble": return "Pieces don't all fit anywhere. What must come before the attention block, and what after?";
    case "mastery": return "No hints this round. I'll explain any wrong answer.";
    default: return null;
  }
}

function quickPromptsFor(stageId) {
  switch (stageId) {
    case "playground": return ["Why is softmax here?", "What's 'multi-head' actually mean?"];
    case "intuition":  return ["Why Q, K, V separately?", "Analogy for this?"];
    case "socratic":   return ["Give me a hint", "What am I missing?"];
    case "mastery":    return ["Explain the last one", "Am I ready for the next paper?"];
    default: return ["Quiz me", "Explain simply"];
  }
}

window.AIPanel = AIPanel;
