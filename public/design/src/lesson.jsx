// Lesson shell — stage nav, progress, orchestrates stages.

const { useState: useStateL } = React;

function Lesson({ concept, onBack, onOpenReader, onOpenReview, onOpenAI, stageId, onStageChange }) {
  const { LESSON } = window.DATA;
  const stages = LESSON.stages;
  const idx = Math.max(0, stages.findIndex(s => s.id === stageId));
  const stage = stages[idx] || stages[0];

  const isCustom = concept.id === "transformer";
  const libLesson = window.LESSON_LIB[concept.id];
  const S = window.LESSON_STAGES;
  const G = window.GENERIC_STAGES;

  let StageEl = null;
  if (isCustom) {
    // rich bespoke stages (original Attention lesson)
    if (stage.kind === "hook")       StageEl = <S.HookStage/>;
    else if (stage.kind === "intuition")  StageEl = <S.IntuitionStage/>;
    else if (stage.kind === "playground") StageEl = <S.PlaygroundStage/>;
    else if (stage.kind === "socratic")   StageEl = <S.SocraticStage onOpenAI={onOpenAI}/>;
    else if (stage.kind === "assemble")   StageEl = <S.AssembleStage/>;
    else if (stage.kind === "mastery")    StageEl = <S.MasteryStage/>;
  } else if (libLesson) {
    if (stage.kind === "hook")       StageEl = <G.GenericHook data={libLesson.hook}/>;
    else if (stage.kind === "intuition")  StageEl = <G.GenericIntuition data={libLesson.intuition}/>;
    else if (stage.kind === "playground") StageEl = <G.GenericPlayground data={libLesson.playground} concept={concept}/>;
    else if (stage.kind === "socratic")   StageEl = <G.GenericSocratic data={libLesson.socratic} onOpenAI={onOpenAI}/>;
    else if (stage.kind === "assemble")   StageEl = <G.GenericAssemble data={libLesson.assemble}/>;
    else if (stage.kind === "mastery")    StageEl = <G.GenericMastery data={libLesson.mastery}/>;
  } else {
    StageEl = <div style={{padding:60, textAlign:"center", color:"var(--ink-dim)"}}>This concept isn't in the library yet.</div>;
  }

  const lessonMeta = isCustom ? { subtitle: LESSON.subtitle, duration: LESSON.duration } :
    libLesson ? { subtitle: libLesson.subtitle, duration: libLesson.duration } :
    { subtitle: concept.category, duration: "~10 min" };

  const go = (d) => {
    const n = Math.min(stages.length-1, Math.max(0, idx + d));
    onStageChange(stages[n].id);
  };

  return (
    <div style={{minHeight:"100vh", background:"var(--bg)", display:"flex", flexDirection:"column"}}>
      <P.TopBar
        left={
          <P.GhostBtn onClick={onBack}><P.IconArrowLeft/> Map</P.GhostBtn>
        }
        center={
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:14, fontWeight:600}}>{concept.name}</div>
            <div style={{fontSize:11, color:"var(--ink-dim)"}}>{lessonMeta.subtitle} · {lessonMeta.duration}</div>
          </div>
        }
        right={
          <>
            <P.GhostBtn onClick={onOpenReader}><P.IconPaper/> Paper</P.GhostBtn>
            <P.GhostBtn onClick={onOpenReview}><P.IconGraph/> Review</P.GhostBtn>
            <P.GhostBtn onClick={onOpenAI} active><P.IconBrain/> Tutor</P.GhostBtn>
          </>
        }
      />

      {/* Stage rail */}
      <div style={{borderBottom:"1px solid var(--line)", background:"color-mix(in oklch, var(--bg) 94%, transparent)"}}>
        <div style={{maxWidth:1000, margin:"0 auto", padding:"18px 40px 0", display:"flex", alignItems:"center", gap:6}}>
          {stages.map((s, i) => {
            const active = i === idx;
            const done = i < idx;
            return (
              <button key={s.id} onClick={() => onStageChange(s.id)} style={{
                flex:1, background:"none", border:"none", cursor:"pointer", padding:"6px 0 14px",
                color: active ? "var(--ink)" : done ? "var(--ink-dim)" : "var(--ink-faint)",
                textAlign:"left", borderBottom:"2px solid " + (active ? "var(--amber)" : done ? "var(--ink-faint)" : "var(--line-2)"),
                transition:"all 220ms ease"
              }}>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                  <span className="mono" style={{fontSize:10, color: active ? "var(--amber)" : "var(--ink-faint)", letterSpacing:"0.1em"}}>
                    {String(i+1).padStart(2,"0")}
                  </span>
                  <span style={{fontSize:13, fontWeight: active ? 600 : 400}}>{s.label}</span>
                  {done && <P.IconCheck size={10}/>}
                </div>
                <div style={{fontSize:10, color:"var(--ink-faint)", marginTop:2}}>~{s.minutes} min</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div key={stage.id} className="anim-fade-in" style={{flex:1, overflowY:"auto"}}>
        <div style={{padding:"0 40px 80px"}}>
          {StageEl}
        </div>
      </div>

      {/* Footer */}
      <div style={{borderTop:"1px solid var(--line)", background:"color-mix(in oklch, var(--bg) 94%, transparent)", backdropFilter:"blur(8px)"}}>
        <div style={{maxWidth:1000, margin:"0 auto", padding:"14px 40px", display:"flex", alignItems:"center", gap:16}}>
          <div style={{flex:1, display:"flex", gap:3, height:4}}>
            {stages.map((_, i) => (
              <div key={i} style={{
                flex:1, borderRadius:2,
                background: i <= idx ? "var(--amber)" : "var(--line-2)",
                opacity: i === idx ? 1 : i < idx ? 0.55 : 1,
                transition:"all 240ms ease"
              }}/>
            ))}
          </div>
          <P.GhostBtn onClick={() => go(-1)}><P.IconArrowLeft/> Back</P.GhostBtn>
          {idx === stages.length - 1 ? (
            <P.PrimaryBtn onClick={onOpenReview}>finish & review <P.IconArrowRight/></P.PrimaryBtn>
          ) : (
            <P.PrimaryBtn onClick={() => go(1)}>next <P.IconArrowRight/></P.PrimaryBtn>
          )}
        </div>
      </div>
    </div>
  );
}

window.Lesson = Lesson;
