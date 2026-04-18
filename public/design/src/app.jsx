// App shell — orchestrates screens, tweaks, AI panel, and persistence.

const { useState: useStateApp, useEffect: useEffectApp } = React;

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "density": "normal",
  "aiTone": "peer",
  "difficulty": "intermediate",
  "layout": "split"
}/*EDITMODE-END*/;

function App() {
  const [screen, setScreen] = useStateApp(() => localStorage.getItem("s30_screen") || "home");
  const [concept, setConcept] = useStateApp(() => {
    const id = localStorage.getItem("s30_concept");
    return id ? window.DATA.CONCEPTS.find(c => c.id === id) || null : null;
  });
  const [stageId, setStageId] = useStateApp(() => localStorage.getItem("s30_stage") || "hook");
  const [aiOpen, setAiOpen] = useStateApp(true);
  const [mastery] = useStateApp(window.DATA.DEFAULT_MASTERY);
  const [tweaks, setTweaks] = useStateApp(DEFAULTS);
  const [tweaksOpen, setTweaksOpen] = useStateApp(false);
  const [editModeActive, setEditModeActive] = useStateApp(false);

  useEffectApp(() => { localStorage.setItem("s30_screen", screen); }, [screen]);
  useEffectApp(() => { if (concept) localStorage.setItem("s30_concept", concept.id); }, [concept]);
  useEffectApp(() => { localStorage.setItem("s30_stage", stageId); }, [stageId]);

  // edit-mode protocol
  useEffectApp(() => {
    const handler = (e) => {
      if (e.data?.type === "__activate_edit_mode") { setEditModeActive(true); setTweaksOpen(true); }
      if (e.data?.type === "__deactivate_edit_mode") { setEditModeActive(false); setTweaksOpen(false); }
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  function updateTweak(k, v) {
    setTweaks(t => ({ ...t, [k]: v }));
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  }

  function pickConcept(c) {
    setConcept(c);
    setStageId("hook");
    setScreen(window.LESSON_LIB[c.id] ? "lesson" : "lesson-stub");
  }

  const stageForAI = screen === "home" ? "home"
    : screen === "review" ? "review"
    : screen === "reader" ? "reader"
    : stageId;

  return (
    <div style={{minHeight:"100vh"}} data-theme={tweaks.theme} data-density={tweaks.density}>
      {/* Apply theme tweaks via inline style override */}
      <ThemeTweaks tweaks={tweaks}/>

      {screen === "home" && (
        <ConceptMap
          mastery={mastery}
          onPick={pickConcept}
          onOpenAI={() => setAiOpen(true)}
        />
      )}

      {screen === "lesson" && concept && (
        <Lesson
          concept={concept}
          onBack={() => setScreen("home")}
          onOpenReader={() => setScreen("reader")}
          onOpenReview={() => setScreen("review")}
          onOpenAI={() => setAiOpen(true)}
          stageId={stageId}
          onStageChange={setStageId}
        />
      )}

      {screen === "lesson-stub" && concept && (
        <LessonStub concept={concept} onBack={() => setScreen("home")}/>
      )}

      {screen === "reader" && (
        <PaperReader onBack={() => setScreen("lesson")} onOpenAI={() => setAiOpen(true)}/>
      )}

      {screen === "review" && (
        <Review
          mastery={mastery}
          onBack={() => setScreen("home")}
          onPick={pickConcept}
          onOpenAI={() => setAiOpen(true)}
        />
      )}

      <AIPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        stageId={stageForAI}
        difficulty={tweaks.difficulty}
        conceptName={concept?.name || "the reading list"}
      />

      {/* floating AI button when closed */}
      {!aiOpen && (
        <button onClick={() => setAiOpen(true)} style={{
          position:"fixed", right:24, bottom:24, zIndex:40,
          width:52, height:52, borderRadius:"50%", background:"var(--amber)",
          border:"none", color:"#1a1306", cursor:"pointer",
          boxShadow:"0 10px 40px -10px color-mix(in oklch, var(--amber) 80%, transparent)",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <div className="pulse-soft"><P.IconBrain size={20}/></div>
        </button>
      )}

      {/* Tweaks panel */}
      {tweaksOpen && (
        <TweaksPanel tweaks={tweaks} setTweak={updateTweak} onClose={() => setTweaksOpen(false)}/>
      )}
    </div>
  );
}

function ThemeTweaks({ tweaks }) {
  const css = (() => {
    if (tweaks.theme === "paper") {
      return `:root {
        --bg: #f3efe6; --bg-2: #ebe5d7; --ink: #1e1b15; --ink-dim: #6b6657; --ink-faint: #b2ac9e;
        --line: #d8d1bf; --line-2: #c4bca7;
      }`;
    }
    if (tweaks.theme === "editorial") {
      return `:root {
        --bg: #ffffff; --bg-2: #f5f4f0; --ink: #0a0a0a; --ink-dim: #6b6b6b; --ink-faint: #b8b8b8;
        --line: #e5e4df; --line-2: #cdccc5;
      }`;
    }
    // bright/playful
    if (tweaks.theme === "bright") {
      return `:root {
        --bg: #fffaf0; --bg-2: #fff3dc; --ink: #1a1a1a; --ink-dim: #5e5547; --ink-faint: #a89e8c;
        --line: #e9dcc2; --line-2: #d4c3a3;
        --amber: oklch(0.72 0.2 65);
      }`;
    }
    return "";
  })();
  const density = tweaks.density === "dense" ? "body { font-size: 13px; }"
    : tweaks.density === "airy" ? "body { font-size: 16px; } h2 { line-height: 1.2 !important; }"
    : "";
  return <style>{css}{density}</style>;
}

function TweaksPanel({ tweaks, setTweak, onClose }) {
  const row = (label, k, opts) => (
    <div style={{padding:"14px 0", borderBottom:"1px solid var(--line)"}}>
      <div style={{fontSize:11, color:"var(--ink-dim)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:10}}>{label}</div>
      <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
        {opts.map(o => (
          <button key={o.v} onClick={() => setTweak(k, o.v)} style={{
            padding:"7px 12px", borderRadius:8, cursor:"pointer", fontSize:12,
            background: tweaks[k] === o.v ? "var(--amber)" : "var(--bg)",
            color: tweaks[k] === o.v ? "#1a1306" : "var(--ink)",
            border:"1px solid " + (tweaks[k] === o.v ? "var(--amber)" : "var(--line-2)"),
            fontWeight: tweaks[k] === o.v ? 600 : 400
          }}>{o.l}</button>
        ))}
      </div>
    </div>
  );
  return (
    <aside style={{
      position:"fixed", right:20, top:80, width:320, zIndex:70,
      background:"var(--bg-2)", border:"1px solid var(--line)", borderRadius:14,
      padding:"22px 22px 10px", boxShadow:"0 30px 80px -20px rgba(0,0,0,0.5)"
    }} className="anim-slide-up">
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14}}>
        <div style={{fontSize:14, fontWeight:600}}>Tweaks</div>
        <button onClick={onClose} style={{background:"none", border:"none", color:"var(--ink-dim)", cursor:"pointer"}}><P.IconX/></button>
      </div>
      {row("Theme", "theme", [
        { v:"dark", l:"Dark" }, { v:"bright", l:"Bright" },
        { v:"paper", l:"Paper" }, { v:"editorial", l:"Editorial" }
      ])}
      {row("Density", "density", [
        { v:"dense", l:"Dense" }, { v:"normal", l:"Normal" }, { v:"airy", l:"Airy" }
      ])}
      {row("AI tone", "aiTone", [
        { v:"professor", l:"Professor" }, { v:"peer", l:"Peer" }, { v:"coach", l:"Coach" }
      ])}
      {row("Difficulty", "difficulty", [
        { v:"beginner", l:"Beginner" }, { v:"intermediate", l:"Intermediate" }, { v:"advanced", l:"Advanced" }
      ])}
      {row("Layout", "layout", [
        { v:"single", l:"Single" }, { v:"split", l:"Split w/ AI" }
      ])}
    </aside>
  );
}

function LessonStub({ concept, onBack }) {
  return (
    <div style={{minHeight:"100vh", background:"var(--bg)"}}>
      <P.TopBar
        left={<P.GhostBtn onClick={onBack}><P.IconArrowLeft/> Map</P.GhostBtn>}
        center={<div style={{fontSize:13, color:"var(--ink-dim)"}}>{concept.name}</div>}
        right={<span style={{fontSize:11, color:"var(--ink-dim)"}}>interactive lesson coming</span>}
      />
      <div style={{maxWidth:680, margin:"80px auto 0", padding:"0 40px", textAlign:"center"}}>
        <div className="chip" style={{marginBottom:20}}>Preview</div>
        <h2 className="serif" style={{fontSize:54, margin:"0 0 18px", fontWeight:400, letterSpacing:"-0.01em"}}>
          {concept.name}
        </h2>
        <p style={{fontSize:15, color:"var(--ink-dim)", lineHeight:1.8, marginBottom:32}}>
          Every paper in the list gets the full six-stage treatment — hook, intuition, playground, Socratic, assemble, mastery.
          Only <span style={{color:"var(--amber)"}}>Attention Is All You Need</span> is built out in this prototype.
          Head back and try that one.
        </p>
        <P.PrimaryBtn onClick={onBack}>back to map <P.IconArrowRight/></P.PrimaryBtn>
      </div>
    </div>
  );
}

window.App = App;

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
