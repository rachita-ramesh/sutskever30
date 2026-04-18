// Small reusable primitives

const { useState, useEffect, useRef, useMemo, useCallback } = React;

function Chip({ children, on, ...rest }) {
  return <span className={"chip " + (on ? "on" : "")} {...rest}>{children}</span>;
}

function Dot({ color="var(--ink-dim)", size=6 }) {
  return <span style={{display:"inline-block", width:size, height:size, borderRadius:"50%", background:color}} />;
}

function Key({ children }) {
  return <kbd style={{
    fontFamily:"JetBrains Mono, monospace", fontSize:10, padding:"1px 5px",
    border:"1px solid var(--line-2)", borderRadius:4, color:"var(--ink-dim)", background:"var(--bg-2)"
  }}>{children}</kbd>;
}

function IconArrowRight({ size=14 }) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconArrowLeft({ size=14 }) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none"><path d="M11 7H3m4-4L3 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconSpark({ size=14 }) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none"><path d="M7 1v4M7 9v4M1 7h4M9 7h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
}
function IconCheck({ size=14 }) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none"><path d="M2 7.5l3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}
function IconX({ size=14 }) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}
function IconBook({ size=14 }) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none"><path d="M2 2h5a2 2 0 012 2v8a1 1 0 00-1-1H2V2zM12 2H9a2 2 0 00-2 2v8a1 1 0 011-1h4V2z" stroke="currentColor" strokeWidth="1.2"/></svg>;
}
function IconGraph({ size=14 }) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none"><circle cx="3" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="11" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 10l2-2M8 6l2-2" stroke="currentColor" strokeWidth="1.2"/></svg>;
}
function IconPaper({ size=14 }) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none"><path d="M3 1.5h6l3 3V12a1 1 0 01-1 1H3a1 1 0 01-1-1V2.5a1 1 0 011-1z M9 1.5V4h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5 7h4M5 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
}
function IconBrain({ size=14 }) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none"><path d="M5 2.5a2 2 0 012 2v5a2 2 0 01-2 2 2 2 0 01-2-2v-5a2 2 0 012-2zM9 2.5a2 2 0 00-2 2v5a2 2 0 002 2 2 2 0 002-2v-5a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.1"/></svg>;
}
function IconSettings({ size=14 }) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.8 2.8l1.4 1.4M9.8 9.8l1.4 1.4M2.8 11.2l1.4-1.4M9.8 4.2l1.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
}

// A simple modal / drawer
function Drawer({ open, onClose, side="right", width=360, children }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position:"fixed", inset:0, background:"rgba(5,7,14,0.5)",
          opacity: open?1:0, pointerEvents: open?"auto":"none",
          transition:"opacity 240ms ease", zIndex: 50,
        }}
      />
      <aside style={{
        position:"fixed", top:0, [side]:0, bottom:0, width, maxWidth:"92vw",
        background:"var(--bg-2)", borderLeft: side==="right" ? "1px solid var(--line)" : "none",
        borderRight: side==="left" ? "1px solid var(--line)" : "none",
        transform: open ? "translateX(0)" : side==="right" ? "translateX(100%)" : "translateX(-100%)",
        transition:"transform 320ms cubic-bezier(.2,.8,.2,1)", zIndex: 60,
        display:"flex", flexDirection:"column", overflow:"hidden"
      }}>
        {children}
      </aside>
    </>
  );
}

// Header bar
function TopBar({ left, center, right }) {
  return (
    <div style={{
      position:"sticky", top:0, zIndex:30, background:"color-mix(in oklch, var(--bg) 92%, transparent)",
      backdropFilter:"blur(8px)", borderBottom:"1px solid var(--line)"
    }}>
      <div style={{display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", gap:12, padding:"14px 22px", maxWidth:1400, margin:"0 auto"}}>
        <div style={{justifySelf:"start", display:"flex", alignItems:"center", gap:8}}>{left}</div>
        <div style={{justifySelf:"center"}}>{center}</div>
        <div style={{justifySelf:"end", display:"flex", alignItems:"center", gap:8}}>{right}</div>
      </div>
    </div>
  );
}

function GhostBtn({ children, onClick, title, active }) {
  return (
    <button onClick={onClick} title={title} style={{
      display:"inline-flex", alignItems:"center", gap:6, padding:"7px 11px",
      background: active ? "color-mix(in oklch, var(--amber) 14%, transparent)" : "transparent",
      border:"1px solid " + (active ? "color-mix(in oklch, var(--amber) 55%, transparent)" : "var(--line-2)"),
      color: active ? "var(--amber)" : "var(--ink)",
      borderRadius:8, fontSize:13, cursor:"pointer", transition:"all 160ms ease"
    }}>{children}</button>
  );
}

function PrimaryBtn({ children, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display:"inline-flex", alignItems:"center", gap:8, padding:"9px 16px",
      background: disabled ? "var(--line-2)" : "var(--amber)",
      color:"#1a1306", border:"none", borderRadius:9,
      fontWeight:600, fontSize:13, cursor: disabled?"default":"pointer",
      opacity: disabled?0.5:1, transition:"all 180ms ease"
    }}>{children}</button>
  );
}

// Difficulty pill
function DiffDots({ n, max=3 }) {
  return (
    <span style={{display:"inline-flex", gap:3, alignItems:"center"}}>
      {Array.from({length:max}).map((_,i) => (
        <span key={i} style={{
          width:5, height:5, borderRadius:"50%",
          background: i<n ? "var(--ink)" : "var(--line-2)"
        }}/>
      ))}
    </span>
  );
}

window.P = { Chip, Dot, Key, IconArrowRight, IconArrowLeft, IconSpark, IconCheck, IconX, IconBook, IconGraph, IconPaper, IconBrain, IconSettings, Drawer, TopBar, GhostBtn, PrimaryBtn, DiffDots };
