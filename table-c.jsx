/* global React */
/* Variation C — faithful HTML recreation of the original pcr.ai Run Files screen.
   Mirrors the screenshot exactly: dark teal sidebar, teal evaluation banner,
   filter row, sortable table, status tooltips, summary row, pagination. */
const { useState: useStateC } = React;

// Reuse the same dataset shape as A/B but render in the original visual idiom.
const ROWS_C = [
  { date: "06-08-20, 11:29am", modified: "06-08-20, 11:29am", name: "multiple_patient_wells_for_testing-1", site: "EZ - San Juan Capistrano CA", mixes: "VZV, VZVQC, VZVQBL, VZVQ", uploader: "fangel", plate: "96/96", q: 10, r: 1, w95: 95, warn: 1, ok: 1, comments: 3, locked: true },
  { date: "06-08-20, 11:29am", modified: "06-08-20, 11:29am", name: "multiple_patient_wells_for_testing-1", site: "EZ - San Juan Capistrano CA", mixes: "VZV, VZVQC, VZVQBL, VZVQ", uploader: "fangel", plate: "96/96", q: 10, r: 1, w95: 95, warn: 1, ok: 1, comments: 3 },
  { date: "06-08-20, 11:29am", modified: "06-08-20, 11:29am", name: "multiple_patient_wells_for_testing-1", site: "EZ - San Juan Capistrano CA", mixes: "VZV, VZVQC, VZVQBL, VZVQ", uploader: "fangel", plate: "96/96", q: 10, r: 1, w95: 95, warn: 1, ok: 1, comments: 3 },
  { date: "06-08-20, 11:29am", modified: "06-08-20, 11:29am", name: "multiple_patient_wells_for_testing-1", site: "EZ - San Juan Capistrano CA", mixes: "VZV, VZVQC, VZVQBL, VZVQ", uploader: "fangel", plate: "96/96", q: 10, r: 1, w95: 95, warn: 1, ok: 1, comments: 3 },
  { date: "06-08-20, 11:29am", modified: "06-08-20, 11:29am", name: "multiple_patient_wells_for_testing-1", site: "EZ - San Juan Capistrano CA", mixes: "VZV, VZVQC, VZVQBL, VZVQ", uploader: "fangel", plate: "96/96", q: 10, r: 1, w95: 95, warn: 1, ok: 1, comments: 3 },
  { date: "06-08-20, 11:29am", modified: "06-08-20, 11:29am", name: "multiple_patient_wells_for_testing-1", site: "EZ - San Juan Capistrano CA", mixes: "VZV, VZVQC, VZVQBL, VZVQ", uploader: "fangel", plate: "96/96", q: 10, r: 1, w95: 95, warn: 1, ok: 1, comments: 3 },
  { date: "06-08-20, 11:29am", modified: "06-08-20, 11:29am", name: "multiple_patient_wells_for_testing-1", site: "EZ - San Juan Capistrano CA", mixes: "VZV, VZVQC, VZVQBL, VZVQ", uploader: "fangel", plate: "96/96", q: 10, r: 1, w95: 95, warn: 1, ok: 1, comments: 3 },
];

// --- Sidebar nav items
const NAV_C = [
  { label: "Run Files", icon: "folder", active: true },
  { label: "Reports", icon: "report" },
  { label: "LJ Report", icon: "blank", indent: true },
  { label: "Trends Report", icon: "blank", indent: true },
  { label: "Outcomes Report", icon: "blank", indent: true },
  { label: "Audits", icon: "audit" },
  { label: "Sites", icon: "sites" },
];

// --- Inline icons (kept tiny — match the line weight of the original)
const NavIcon = ({ kind }) => {
  const stroke = "#B5C7D0";
  switch (kind) {
    case "folder": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>;
    case "report": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>;
    case "audit":  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7"><path d="M9 12l2 2 4-4"/><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z"/></svg>;
    case "sites":  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7"><path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M10 21v-6h4v6"/></svg>;
    default: return <span style={{ width: 18, height: 18, display: "inline-block" }}/>;
  }
};

const HeaderIcon = ({ kind }) => {
  const stroke = "#FFFFFF";
  switch (kind) {
    case "help":   return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7v.5"/><circle cx="12" cy="17" r=".8" fill={stroke} stroke="none"/></svg>;
    case "filter": return <svg width="18" height="18" viewBox="0 0 24 24" fill="#0ACFFE" stroke="#0ACFFE" strokeWidth="1.5" strokeLinejoin="round"><path d="M4 5h16l-6 8v6l-4-2v-4z"/></svg>;
    case "eye":    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "refresh":return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7"><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/></svg>;
    case "gear":   return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>;
    case "bell":   return <svg width="18" height="18" viewBox="0 0 24 24" fill={stroke} stroke="none"><path d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1Z"/></svg>;
    case "logout": return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>;
    case "warn":   return <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFB100"><path d="M12 2 1 21h22L12 2Zm1 14h-2v2h2v-2Zm0-7h-2v6h2V9Z"/></svg>;
    case "pin":    return <svg width="14" height="14" viewBox="0 0 24 24" fill="#B5C7D0" stroke="none"><path d="M12 2 9 8H4l4 4-2 9 6-5 6 5-2-9 4-4h-5z"/></svg>;
    default: return null;
  }
};

const FieldChevron = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>;
const SortChevron = ({ dir }) => <svg width="9" height="11" viewBox="0 0 24 24" fill="none" stroke="#0ACFFE" strokeWidth="2.5"><path d={dir === "asc" ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"}/></svg>;

// Notification bubble (the colored circles with counts in the screenshot)
function NotifBubble({ color, n, ringed }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "0 6px 0 0", whiteSpace: "nowrap"
    }}>
      <span style={{
        width: 18, height: 18, borderRadius: "50%",
        background: color, color: "white",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 700,
        boxShadow: ringed ? "0 0 0 2px rgba(0,0,0,0.06)" : "none",
      }}>
        {n === "?" ? "?" : (n === "!" ? "!" : "")}
      </span>
      {n !== "?" && n !== "!" && <span style={{ fontSize: 12, color: "#3F525C", fontWeight: 600 }}>{n}</span>}
    </span>
  );
}

// Q (gray "?" with count), R (red "!" with count), 95 W (yellow), check (green), comment
function NotifRow({ row, showWarnTip }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      {/* dark gray ? bubble + 10 */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
        <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#3F525C", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>?</span>
        <span style={{ fontSize: 12, color: "#3F525C" }}>{row.q}</span>
      </span>
      {/* red ! bubble + 1 */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
        <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#E23B3B", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>!</span>
        <span style={{ fontSize: 12, color: "#3F525C" }}>{row.r}</span>
      </span>
      {/* pink 95 bubble */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
        <span style={{ width: 22, height: 18, borderRadius: 9, background: "#E23B3B", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, padding: "0 4px" }}>95</span>
      </span>
      {/* yellow warning + 1 (with optional tooltip) */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, position: "relative" }}>
        <svg width="16" height="14" viewBox="0 0 24 22" fill="#F5C518" stroke="none"><path d="M12 1 1 21h22L12 1Zm1 14h-2v2h2v-2Zm0-7h-2v6h2V8Z"/></svg>
        <span style={{ fontSize: 12, color: "#3F525C" }}>{row.warn}</span>
        {showWarnTip && (
          <span style={{
            position: "absolute", top: 22, left: -10,
            background: "#0B1620", color: "white",
            fontSize: 11, padding: "4px 10px", borderRadius: 4, whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 5,
          }}>
            Warnings
            <span style={{ position: "absolute", top: -4, left: 14, width: 8, height: 8, background: "#0B1620", transform: "rotate(45deg)" }}/>
          </span>
        )}
      </span>
      {/* green check + 1 */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2FA365" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
        <span style={{ fontSize: 12, color: "#3F525C" }}>{row.ok}</span>
      </span>
      {/* gray comment + 3 */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#8FA0A9" stroke="none"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2Z"/></svg>
        <span style={{ fontSize: 12, color: "#3F525C" }}>{row.comments}</span>
      </span>
    </div>
  );
}

// --- Filter chip (label above value, with chevron or calendar)
function Field({ label, value, icon, hasTooltip, tipText }) {
  return (
    <div style={{
      position: "relative",
      flex: "0 0 auto",
      minWidth: 200,
      height: 52,
      background: "white", border: "1px solid #DDE4E8", borderRadius: 4,
      padding: "8px 36px 8px 36px",
      display: "flex", flexDirection: "column", justifyContent: "center",
      cursor: "pointer",
    }}>
      <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
        {icon === "search" && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>}
        {icon === "cal"    && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>}
      </div>
      <div style={{ fontSize: 11, color: "#5F727C" }}>{label}</div>
      <div style={{ fontSize: 13, color: "#0B1620", fontWeight: 500, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
      <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
        {icon === "cal"
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>
          : <FieldChevron/>}
      </div>
      {hasTooltip && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 8,
          background: "#0B1620", color: "white", fontSize: 12, padding: "5px 12px", borderRadius: 4,
          whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.25)", zIndex: 10,
        }}>
          {tipText}
          <span style={{ position: "absolute", top: -4, left: 16, width: 8, height: 8, background: "#0B1620", transform: "rotate(45deg)" }}/>
        </div>
      )}
    </div>
  );
}

// --- Sortable column header
function ThSort({ label, sortKey, sort, setSort, width, paddingLeft }) {
  const active = sort.key === sortKey;
  return (
    <th
      onClick={() => setSort(s => ({ key: sortKey, dir: s.key === sortKey && s.dir === "asc" ? "desc" : "asc" }))}
      style={{
        width, padding: `12px 14px 12px ${paddingLeft || 14}px`,
        textAlign: "left", fontSize: 12, fontWeight: 600, color: "#0B1620",
        borderBottom: "1px solid #DDE4E8", background: "#F8FAFB",
        cursor: "pointer", userSelect: "none", verticalAlign: "middle",
      }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        {label}
        <span style={{ display: "inline-flex", flexDirection: "column", gap: 1, opacity: active ? 1 : 0.45 }}>
          <SortChevron dir="asc"/>
          <SortChevron dir="desc"/>
        </span>
      </span>
    </th>
  );
}

function VariationC({ tour = true }) {
  const [sort, setSort] = useStateC({ key: "date", dir: "desc" });
  const [tourOn, setTourOn] = useStateC(tour);
  const [showReport, setShowReport] = useStateC(false);
  // Tour keyframes for the original UI: rest → glide to row 1 → click → report → click back arrow → loop
  const TOUR_C_KEYFRAMES = [
    { at: 0,    phase: "list",   target: { x: 6, y: 90 },  caption: "view summary of all your runs and quickly find those that need attention" },
    { at: 700,  phase: "list",   target: { x: 24, y: 30 }, caption: "select a run you want to review" },
    { at: 1100, phase: "list",   target: { x: 24, y: 30 }, click: true },
    { at: 1500, phase: "report", target: { x: 24, y: 30 }, caption: "review QC and other aspects of the run as required" },
    { at: 2400, phase: "report", target: { x: 56, y: 28 } },     // glide onto chart / floater
    { at: 4200, phase: "report", target: { x: 56, y: 28 } },     // dwell
    { at: 4800, phase: "report", target: { x: 8,  y: 9 } },      // glide to Run Files (back)
    { at: 5200, phase: "list",   target: { x: 8,  y: 9 }, click: true, caption: "view summary of all your runs and quickly find those that need attention" },
    { at: 5800, phase: "list",   target: { x: 8,  y: 9 } },
  ];
  const TOUR_C_DURATION = 5800;
  const tourState = window.useTourEngine(tourOn, TOUR_C_KEYFRAMES, TOUR_C_DURATION);
  // Most-recent caption at the current tour time (sticks until the next captioned keyframe).
  let tourCaption = "";
  for (const k of TOUR_C_KEYFRAMES) { if (tourState.t >= k.at && k.caption) tourCaption = k.caption; }

  // Drive showReport from tour phase (always, even when paused, so ‹/› step changes screens)
  React.useEffect(() => {
    setShowReport(tourState.phase === "report");
  }, [tourState.phase]);

  if (showReport) {
    return (
      <div style={{ position: "relative", width: 1440, height: 1340 }}>
        <window.VariationCReport onBack={() => setShowReport(false)}/>
        <window.TourCursor cursor={tourState.cursor} click={tourState.click && tourOn} clickAt={tourState.clickAt}/>
        <TourCaption text={tourCaption}/>
        <window.TourPill on={tourOn} onToggle={() => setTourOn(v => !v)} onPrev={() => { setTourOn(false); tourState.prev(); }} onNext={() => { setTourOn(false); tourState.next(); }}/>
      </div>
    );
  }

  return (
    <div className="vc-frame" style={{ position: "relative" }}>
      <style>{`
        .vc-frame { font-family: var(--font-sans); width: 1440px; height: 1270px; background: #F5F8FA; color: #0B1620; display: grid; grid-template-columns: 220px 1fr; grid-template-rows: 50px 1fr; }
        .vc-frame * { box-sizing: border-box; }

        /* sidebar */
        .vc-side { grid-row: 1 / span 2; grid-column: 1; background: #021F2C; color: #B5C7D0; display: flex; flex-direction: column; }
        .vc-logo { display: flex; align-items: center; gap: 8px; padding: 16px 18px 18px; }
        .vc-logo .dot { width: 18px; height: 18px; border-radius: 50%; background: #0ACFFE; position: relative; }
        .vc-logo .dot::after { content: ""; position: absolute; left: 4px; top: 4px; width: 4px; height: 4px; border-radius: 50%; background: #021F2C; }
        .vc-logo .name { font-size: 15px; font-weight: 700; color: white; letter-spacing: 0.01em; }
        .vc-logo .name em { color: #0ACFFE; font-style: normal; }
        .vc-nav { padding: 6px 10px; flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .vc-navitem { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 4px; font-size: 13.5px; color: #B5C7D0; cursor: pointer; }
        .vc-navitem:hover { background: rgba(255,255,255,0.04); }
        .vc-navitem.active { background: #12394C; color: white; }
        .vc-navitem.indent { padding-left: 38px; font-size: 12.5px; }

        /* topbar */
        .vc-top { grid-row: 1; grid-column: 2; background: #1C4E66; color: white; display: flex; align-items: center; padding: 0 18px; gap: 14px; }
        .vc-warn-msg { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; }
        .vc-top .right { margin-left: auto; display: flex; align-items: center; gap: 18px; font-size: 13px; }
        .vc-top .right .iconbtn { display: inline-flex; opacity: 0.95; cursor: pointer; }
        .vc-top .right .iconbtn:hover { opacity: 1; }

        /* main */
        .vc-main { grid-row: 2; grid-column: 2; padding: 22px 24px 0; overflow: hidden; }
        .vc-pageh { display: flex; align-items: flex-start; justify-content: space-between; }
        .vc-h1 { font-size: 24px; font-weight: 700; letter-spacing: -0.01em; color: #0B1620; margin: 0; }
        .vc-pagetools { display: flex; gap: 12px; align-items: center; }
        .vc-tool { width: 32px; height: 32px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; color: #5F727C; }
        .vc-tool:hover { background: #EEF2F4; }
        .vc-tool.filter { color: #0ACFFE; }

        .vc-fields { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
        .vc-fields-row2 { display: flex; gap: 8px; margin-top: 8px; align-items: center; }
        .vc-results { font-size: 12px; color: #5F727C; text-align: right; padding: 10px 2px 6px; }

        .vc-card { background: white; border: 1px solid #DDE4E8; border-radius: 4px; }
        .vc-table { width: 100%; border-collapse: collapse; }
        .vc-table th { font-size: 12px; font-weight: 600; color: #0B1620; padding: 12px 14px; text-align: left; border-bottom: 1px solid #DDE4E8; background: #F8FAFB; vertical-align: middle; }
        .vc-table td { padding: 14px 14px; border-bottom: 1px solid #EEF2F4; font-size: 13px; color: #29383F; vertical-align: middle; }
        .vc-table tr:last-child td { border-bottom: 0; }
        .vc-table tr:hover td { background: #F8FAFB; }
        .vc-runname { font-size: 12.5px; color: #29383F; word-break: break-word; }
        .vc-mixes { font-size: 12.5px; color: #29383F; }
        .vc-plate { font-size: 12.5px; color: #29383F; }
        .vc-uploader { font-size: 12.5px; color: #29383F; }

        /* summary mini-table */
        .vc-summary { margin-top: 14px; background: white; border: 1px solid #DDE4E8; border-radius: 4px; }
        .vc-summary table { width: 100%; border-collapse: collapse; }
        .vc-summary th { font-size: 12px; font-weight: 600; color: #0B1620; padding: 12px 14px; text-align: left; border-bottom: 1px solid #DDE4E8; background: #F8FAFB; }
        .vc-summary td { padding: 14px 14px; font-size: 13px; color: #29383F; }

        /* footer */
        .vc-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding: 4px 4px 12px; }
        .vc-perpage { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; color: #5F727C; }
        .vc-perpage .selectbox { display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px 4px 10px; border: 1px solid #DDE4E8; border-radius: 3px; font-size: 12.5px; color: #0B1620; background: white; cursor: pointer; }
        .vc-pager { display: inline-flex; align-items: center; gap: 4px; font-size: 12.5px; color: #5F727C; }
        .vc-pager .pgbtn { padding: 4px 10px; border: 1px solid #DDE4E8; background: white; border-radius: 3px; cursor: pointer; color: #29383F; font-size: 12.5px; }
        .vc-pager .pgbtn.active { background: #0ACFFE; color: white; border-color: #0ACFFE; }
        .vc-pager .pgbtn.ghost { border: none; background: transparent; color: #5F727C; }
        .vc-goto { display: inline-flex; align-items: center; gap: 8px; font-size: 12.5px; color: #5F727C; }
        .vc-goto .input { padding: 4px 8px; border: 1px solid #DDE4E8; border-radius: 3px; width: 60px; }
        .vc-goto .nextbtn { width: 28px; height: 24px; background: #0ACFFE; color: white; border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }

        /* row-level locked badge tooltip */
        .vc-locked-wrap { position: relative; display: inline-flex; align-items: center; }
        .vc-locked-tip { position: absolute; right: 26px; top: -2px; background: #0B1620; color: white; font-size: 11.5px; padding: 5px 10px; border-radius: 4px; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .vc-locked-tip::after { content: ""; position: absolute; right: -4px; top: 8px; width: 8px; height: 8px; background: #0B1620; transform: rotate(45deg); }

        .vc-pluscircle { width: 24px; height: 24px; border-radius: 50%; background: #0ACFFE; color: white; display: inline-flex; align-items: center; justify-content: center; font-weight: 600; font-size: 16px; cursor: pointer; }
        .vc-lockicon svg { color: #5F727C; }
      `}</style>

      {/* ================= SIDEBAR ================= */}
      <aside className="vc-side">
        <div className="vc-logo">
          <span className="dot"/>
          <span className="name">pcr<em>.</em>ai</span>
          <span style={{ marginLeft: "auto" }}><HeaderIcon kind="pin"/></span>
        </div>
        <nav className="vc-nav">
          {NAV_C.map((n, i) => (
            <div key={i} className={`vc-navitem ${n.active ? "active" : ""} ${n.indent ? "indent" : ""}`}>
              {!n.indent && <NavIcon kind={n.icon}/>}
              <span>{n.label}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* ================= TOPBAR ================= */}
      <header className="vc-top">
        <div className="vc-warn-msg">
          <HeaderIcon kind="warn"/>
          <span>For evaluation purpose only. DO NOT use results!</span>
        </div>
        <div className="right">
          <span>philip@darly.solutions</span>
          <span className="iconbtn"><HeaderIcon kind="gear"/></span>
          <span className="iconbtn"><HeaderIcon kind="bell"/></span>
          <span className="iconbtn"><HeaderIcon kind="logout"/></span>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="vc-main">
        <div className="vc-pageh">
          <h1 className="vc-h1">Run Files</h1>
          <div className="vc-pagetools">
            <span className="vc-tool"><HeaderIcon kind="help"/></span>
            <span className="vc-tool filter"><HeaderIcon kind="filter"/></span>
            <span className="vc-tool"><HeaderIcon kind="eye"/></span>
            <span className="vc-tool"><HeaderIcon kind="refresh"/></span>
          </div>
        </div>

        {/* Filter row 1 */}
        <div className="vc-fields">
          <Field icon="search" label="Search" value="Patients"/>
          <Field icon="cal" label="Uploaded date" value="07.09.2020 — 13.09.2020"/>
          <Field icon="cal" label="Modified date" value="07.09.2020 — 13.09.2020"/>
          <Field label="Mix" value="CMVQ2, COVID, COVID-IPC..."/>
          <Field label="Run Status" value="No export - errors to resolve," hasTooltip tipText="Status 1, Status 2, Status 3, Status 4"/>
        </div>

        {/* Filter row 2 */}
        <div className="vc-fields-row2">
          <Field label="Uploaded by" value="quest-pig-pp_clemente.i.mon"/>
          <Field label="Sites" value="AMD - Chantilly VA, EZ..."/>
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, border: "1px solid #DDE4E8", borderRadius: 4, background: "white", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M7 12h10M10 18h4"/></svg>
          </span>
        </div>

        <div className="vc-results">Showing 1-20 out of 891</div>

        {/* Main table */}
        <div className="vc-card">
          <table className="vc-table">
            <thead>
              <tr>
                <ThSort label="Date uploaded" sortKey="date" sort={sort} setSort={setSort} width={130}/>
                <ThSort label="Date modified" sortKey="modified" sort={sort} setSort={setSort} width={130}/>
                <ThSort label="Run File Name" sortKey="name" sort={sort} setSort={setSort} width={170}/>
                <ThSort label="Site" sortKey="site" sort={sort} setSort={setSort} width={130}/>
                <ThSort label="Mixes" sortKey="mixes" sort={sort} setSort={setSort} width={130}/>
                <ThSort label="Notifications" sortKey="notif" sort={sort} setSort={setSort} width={210}/>
                <ThSort label="Run status" sortKey="status" sort={sort} setSort={setSort} width={170}/>
                <ThSort label="Uploaded by" sortKey="uploader" sort={sort} setSort={setSort} width={120}/>
                <ThSort label="Plate size" sortKey="plate" sort={sort} setSort={setSort} width={90}/>
                <th style={{ width: 50, background: "#F8FAFB", borderBottom: "1px solid #DDE4E8" }}/>
              </tr>
            </thead>
            <tbody>
              {ROWS_C.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.modified}</td>
                  <td className="vc-runname">{r.name}</td>
                  <td>{r.site}</td>
                  <td className="vc-mixes">{r.mixes}</td>
                  <td><NotifRow row={r} showWarnTip={i === 0}/></td>
                  <td style={{ fontSize: 12.5, lineHeight: 1.4, color: "#29383F" }}>
                    Reanalysis required (Westgard)<br/>
                    Some wells ready for export with errors to resolve
                  </td>
                  <td>{r.uploader}</td>
                  <td style={{ position: "relative" }}>
                    {r.locked ? (
                      <span className="vc-locked-wrap">
                        <span style={{ marginRight: 8 }}>{r.plate}</span>
                        <span className="vc-lockicon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2"><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                        </span>
                        <span className="vc-locked-tip">Locked by user_x</span>
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        <span>{r.plate}</span>
                        <span className="vc-lockicon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2"><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                        </span>
                      </span>
                    )}
                  </td>
                  <td><span className="vc-pluscircle">+</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary mini-table */}
        <div className="vc-summary">
          <table>
            <thead>
              <tr>
                <th style={{ width: 200 }}>Mix</th>
                <th style={{ width: 200 }}>No. of Targets</th>
                <th style={{ width: 200 }}>No. of Wells</th>
                <th style={{ width: 200 }}>No. of Samples</th>
                <th>Notifications</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>HEV</td>
                <td>1</td>
                <td>3</td>
                <td>3</td>
                <td><NotifRow row={{ q:10, r:1, w95:95, warn:1, ok:1, comments:3 }} showWarnTip={false}/></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="vc-foot">
          <div className="vc-perpage">
            <span>Show items per page</span>
            <span className="selectbox">10 <FieldChevron/></span>
          </div>
          <div className="vc-pager">
            <button className="pgbtn ghost">Prev</button>
            <button className="pgbtn active">1</button>
            <button className="pgbtn">2</button>
            <button className="pgbtn">3</button>
            <span style={{ color: "#5F727C" }}>…</span>
            <button className="pgbtn">6</button>
            <button className="pgbtn ghost">Next</button>
          </div>
          <div className="vc-goto">
            <span>Go to page</span>
            <input className="input" type="text"/>
            <span className="nextbtn">›</span>
          </div>
        </div>
      </main>
      <window.TourCursor cursor={tourState.cursor} click={tourState.click && tourOn} clickAt={tourState.clickAt}/>
      <TourCaption text={tourCaption}/>
      <window.TourPill on={tourOn} onToggle={() => setTourOn(v => !v)} onPrev={() => { setTourOn(false); tourState.prev(); }} onNext={() => { setTourOn(false); tourState.next(); }}/>
    </div>
  );
}

function TourCaption({ text }) {
  return (
    <div style={{
      position: "absolute", left: "50%", bottom: 28, transform: "translateX(-50%)",
      background: "rgba(2, 31, 44, 0.92)", color: "white",
      padding: "10px 22px", borderRadius: 999,
      fontSize: 14, fontWeight: 500, letterSpacing: "0.01em",
      maxWidth: 760, textAlign: "center",
      boxShadow: "0 6px 24px rgba(0,0,0,0.28)",
      backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
      pointerEvents: "none", zIndex: 150,
      opacity: text ? 1 : 0, transition: "opacity 200ms ease",
    }}>
      {text}
    </div>
  );
}

window.VariationC = VariationC;
window.NavIcon = NavIcon;
window.HeaderIcon = HeaderIcon;
