/* global React */
/* Variation C — faithful HTML recreation of the original pcr.ai run-file REPORT
   screen (Westgards tab, with floater point info dialog).
   Mirrors uploads/Runfile report - Westgards - point.png. */
const { useMemo: useMemoCR } = React;

// Sidebar matches list view but with the Run File breadcrumb tabs at top
const NAV_CR = [
  { label: "Run Files", icon: "folder", active: true },
  { label: "Reports", icon: "report" },
  { label: "LJ Report", icon: "blank", indent: true },
  { label: "Trends Report", icon: "blank", indent: true },
  { label: "Outcomes Report", icon: "blank", indent: true },
  { label: "Audits", icon: "audit" },
  { label: "Sites", icon: "sites" },
];

// Open run-file tabs in the sidebar (under Run Files)
const OPEN_TABS_CR = [
  { name: "TAQMAN35 07032...", active: true },
  { name: "CA:INH_ALL_VZV_...", active: false },
];

// Tabs in main panel
const REPORT_TABS = [
  { label: "Assay Summary", active: false },
  { label: "Outcome Summary", active: false },
  { label: "Westgards", active: true },
  { label: "Plate Map", active: false },
];

// Westgards chart — render in SVG for fidelity. Coordinate system: 800×420 inner.
function WestgardChart({ floaterX = 540 }) {
  // Background zones (LJ): top→bottom: red(>3SD), yellow(2-3), green(0-2), green, yellow, red
  // Each cell = sliding-window column, 11 cols × 6 rows. We'll mimic the screenshot's pattern.
  const W = 800, H = 420;
  const COLS = 11, ROWS_Y = 6;
  const zoneColors = ["#73161B", "#897527", "#23553A", "#23553A", "#897527", "#73161B"]; // dark teal-tinted because of overlay
  // Tweak to match shot: heavily desaturated dark zones
  const zoneFills = ["#5C2024", "#7E6B26", "#1F4D34", "#1F4D34", "#7E6B26", "#5C2024"];
  const cw = W / COLS, ch = H / ROWS_Y;

  // Sample line data (Ct ~33-36, dipping then rising)
  const samples = [34, 33.5, 34, 33, 34.2, 33.5, 32, 33, 34, 34.2, 34.3];
  const yToPx = (ct) => H - ((ct - 29) / (38 - 29)) * H; // y axis 29..38
  const xToPx = (i) => (i + 0.5) * cw;
  const pts = samples.map((s, i) => `${xToPx(i)},${yToPx(s)}`).join(" ");

  // X-axis dates (all 2022-08-21 in shot)
  const xDates = Array.from({ length: COLS }, () => "2022-\n08-21");

  return (
    <div style={{ position: "relative", background: "#0E2C3D", padding: "20px 28px 22px", borderRadius: 0 }}>
      {/* gear icon top right */}
      <div style={{ position: "absolute", right: 22, top: 18, color: "#B5C7D0" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>
      </div>
      <div style={{ color: "#B5C7D0", fontSize: 12.5, textAlign: "center", marginBottom: 8 }}>
        The westgard settings shown here have been changed for current controls
      </div>

      {/* Plot area with y-axis */}
      <div style={{ display: "flex", gap: 8 }}>
        {/* Y-axis Ct labels */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: 4, paddingBottom: 30, color: "#B5C7D0", fontSize: 11.5 }}>
          {[38,37,36,35,34,33,32,31,30,29].map(n => <span key={n} style={{ height: H/9 - 4 }}>{n}</span>)}
        </div>
        <div style={{ position: "relative", flex: 1 }}>
          <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
            {/* zones */}
            {zoneFills.map((c, r) =>
              Array.from({ length: COLS }).map((_, i) => (
                <rect key={`${r}-${i}`} x={i*cw} y={r*ch} width={cw} height={ch} fill={c}/>
              ))
            )}
            {/* sample line */}
            <polyline points={pts} fill="none" stroke="white" strokeWidth="1.5"/>
            {samples.map((s, i) => (
              <circle key={i} cx={xToPx(i)} cy={yToPx(s)} r="3" fill="white"/>
            ))}
            {/* vertical floater pointer line */}
            <line x1={floaterX} y1="0" x2={floaterX} y2={H} stroke="white" strokeOpacity="0.55" strokeWidth="1"/>
          </svg>
          {/* Floater dialog */}
          <div style={{
            position: "absolute",
            left: floaterX - 280,
            top: 24,
            width: 560,
            background: "rgba(255,255,255,0.96)",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            padding: "12px 18px 14px",
            fontSize: 12,
            color: "#0B1620",
          }}>
            {/* Mini chart inside floater */}
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingTop: 2, paddingBottom: 12, color: "#5F727C", fontSize: 10 }}>
                {[1, 0.75, 0.5, 0.25, 0, -0.25].map(n => <span key={n}>{n}</span>)}
              </div>
              <div style={{ flex: 1, position: "relative", height: 110 }}>
                <svg width="100%" height="100%" viewBox="0 0 480 110" preserveAspectRatio="none" style={{ display: "block" }}>
                  {/* axis */}
                  <line x1="0" y1="100" x2="480" y2="100" stroke="#DDE4E8"/>
                  {/* curve - sigmoid amplification */}
                  <path d="M 0 95 C 80 95, 160 92, 220 85 C 260 75, 290 55, 320 38 C 360 22, 420 18, 480 17" stroke="#1463A8" strokeWidth="2" fill="none"/>
                  {/* threshold cycle vertical */}
                  <line x1="332" y1="0" x2="332" y2="100" stroke="#9AA8B0" strokeWidth="1" strokeDasharray="2 2"/>
                  <text x="338" y="10" fill="#5F727C" fontSize="10">31.5</text>
                </svg>
                <span style={{ position: "absolute", left: -20, top: 38, transform: "rotate(-90deg)", fontSize: 10, color: "#5F727C" }}>Fluorescence</span>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: -16, display: "flex", justifyContent: "space-between", color: "#5F727C", fontSize: 10 }}>
                  <span>0</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span><span>35</span>
                </div>
                <div style={{ position: "absolute", left: "50%", bottom: -30, fontSize: 10, color: "#5F727C", transform: "translateX(-50%)" }}>Cycle</div>
              </div>
            </div>
            {/* Data grid */}
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto 1fr", rowGap: 4, columnGap: 14, fontSize: 11.5, marginTop: 18, paddingTop: 10, borderTop: "1px solid #EEF2F4" }}>
              <span style={{ fontWeight: 700 }}>Runfile:</span><span>wg22s_1st_wg12s</span>
              <span style={{ fontWeight: 700 }}>Ct:</span><span>31.599</span>
              <span style={{ fontWeight: 700 }}>Well:</span><span>A2</span>
              <span style={{ fontWeight: 700 }}>Quantity:</span><span>174</span>
              <span style={{ fontWeight: 700 }}>Date of Upload:</span><span>27-08-2020, 1:15 am</span>
              <span style={{ fontWeight: 700 }}>Date of Extraction:</span><span>27-08-2020, 1:15 am</span>
              <span style={{ fontWeight: 700 }}>Instraction Instrument:</span><span>default_instrument</span>
            </div>
          </div>

          {/* X-axis dates */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 4px 0", color: "#B5C7D0", fontSize: 10.5 }}>
            {xDates.map((d, i) => <span key={i} style={{ whiteSpace: "pre" }}>{d}</span>)}
          </div>
        </div>
      </div>
      <div style={{ color: "white", fontSize: 12.5, textAlign: "center", marginTop: 4 }}>EZ - San Juan Capistrano CA</div>
      {/* x-axis label */}
      <div style={{ position: "absolute", left: "50%", bottom: 38, fontSize: 11, color: "#B5C7D0", transform: "translateX(-50%)" }}>Extraction Date</div>
      {/* y-axis label */}
      <div style={{ position: "absolute", left: 4, top: "50%", fontSize: 11, color: "#B5C7D0", transform: "translateY(-50%) rotate(-90deg)" }}>Ct</div>
    </div>
  );
}

// Bottom data-table (Mix/Well/Name/etc.)
function CRDataTable() {
  const ROWS = [
    { mix: "HDV", well: "A2", name: "QVZVLPC", role: "QVZVLPC", target: "QVZVQBL", cls: "HDV", ct: "28.540", q: "173", chartCol: "blue", outcome: { type: "ok", text: "Control Passed" } },
    { mix: "HDV", well: "A2", name: "QVZVLPC", role: "QVZVLPC", target: "QVZVQBL", cls: "HDV", ct: "28.540", q: "173", chartCol: "blue", outcome: null },
    { mix: "HDV", well: "A2", name: "QVZVLPC", role: "QVZVLPC", target: "QVZVQBL", cls: "HDV", ct: "28.540", q: "173", chartCol: "blue", outcome: { type: "err", text: "The IC is inhibited" }, hot: true },
    { mix: "HDV", well: "A2", name: "QVZVLPC", role: "QVZVLPC", target: "QVZVQBL", cls: "HDV", ct: "28.540", q: "173", chartCol: "blue", outcome: null },
  ];
  return (
    <div className="cr-bottom">
      <style>{`
        .cr-filters { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 0 12px; }
        .cr-filters .field { background: white; border: 1px solid #DDE4E8; border-radius: 4px; padding: 6px 10px; min-width: 175px; display: flex; flex-direction: column; }
        .cr-filters .field label { font-size: 10px; color: #5F727C; }
        .cr-filters .field .v { font-size: 12.5px; color: #0B1620; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .cr-data { width: 100%; border-collapse: collapse; background: white; }
        .cr-data thead th.group { background: #F8FAFB; padding: 8px 10px; font-size: 11px; font-weight: 600; color: #0B1620; text-align: center; border-bottom: 1px solid #DDE4E8; }
        .cr-data thead th { padding: 10px; font-size: 12px; font-weight: 600; color: #0B1620; text-align: left; border-bottom: 1px solid #DDE4E8; background: white; }
        .cr-data tbody td { padding: 12px 10px; font-size: 12.5px; color: #29383F; border-bottom: 1px solid #EEF2F4; vertical-align: middle; }
        .cr-data tbody tr.hot td { background: #FFF3F2; }
        .cr-ct-pill { background: #FF6B5C; color: white; padding: 3px 8px; border-radius: 3px; font-size: 11.5px; }
        .cr-chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; font-size: 11.5px; border-radius: 3px; }
        .cr-chip.ok { color: #1F8856; }
        .cr-chip.err { color: #C2362F; }
        .cr-chart-cell svg { display: block; }
        .cr-action { color: #5F727C; cursor: pointer; }
      `}</style>
      <div className="cr-filters">
        {[
          { l: "Mix", v: "CMVQ2, COVID, COVID-IPC..." },
          { l: "Name", v: "Patient, QVZVHPC" },
          { l: "Sample Roles", v: "Patient, QVZVHPC" },
          { l: "Targets", v: "Patient, QVZVHPC" },
          { l: "Classes", v: "Neg, Pos" },
        ].map((f, i) => (
          <div key={i} className="field">
            <label>{f.l}</label>
            <span className="v">{f.v}<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg></span>
          </div>
        ))}
        <div className="field">
          <label>Outcomes</label>
          <span className="v">Control Passed, The IC is …<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg></span>
        </div>
        <div className="field">
          <label>Actions</label>
          <span className="v">Flag the well<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg></span>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, border: "1px solid #DDE4E8", borderRadius: 4, background: "white" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M7 12h10M10 18h4"/></svg>
        </span>
      </div>

      <table className="cr-data">
        <thead>
          <tr>
            <th colSpan={4}/>
            <th colSpan={5} className="group">Result</th>
            <th colSpan={2}/>
          </tr>
          <tr>
            {["Mix","Well","Name","Sample role","Target","Class","CT","Quant","Chart","Outcome","Action"].map(h => <th key={h}>{h} {!["Chart","Outcome","Action"].includes(h) && <span style={{ opacity: 0.5 }}>↕</span>}</th>)}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <tr key={i} className={r.hot ? "hot" : ""}>
              <td>{r.mix}</td><td>{r.well}</td><td>{r.name}</td><td>{r.role}</td>
              <td>{r.target}</td><td>{r.cls}</td>
              <td>{r.hot ? <span className="cr-ct-pill">{r.ct}</span> : r.ct}</td>
              <td>{r.q}</td>
              <td className="cr-chart-cell">
                <svg width="60" height="20" viewBox="0 0 60 20"><path d="M 0 18 C 15 18, 25 17, 32 12 C 38 7, 45 4, 60 3" stroke="#1463A8" strokeWidth="1.5" fill="none"/></svg>
              </td>
              <td>
                {r.outcome && (
                  <span className={`cr-chip ${r.outcome.type}`}>
                    {r.outcome.type === "ok"
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="#1F8856"><circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 7-7" stroke="white" strokeWidth="2" fill="none"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="#C2362F"><circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16v.5" stroke="white" strokeWidth="2"/></svg>
                    }
                    {r.outcome.text}
                  </span>
                )}
              </td>
              <td><span className="cr-action">⋮</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VariationCReport({ onBack }) {
  return (
    <div className="vcr-frame">
      <style>{`
        .vcr-frame { font-family: var(--font-sans); width: 1440px; height: 1340px; background: #F5F8FA; color: #0B1620; display: grid; grid-template-columns: 220px 1fr; grid-template-rows: 50px 1fr; }
        .vcr-frame * { box-sizing: border-box; }

        /* sidebar — same as list */
        .vcr-side { grid-row: 1 / span 2; grid-column: 1; background: #021F2C; color: #B5C7D0; display: flex; flex-direction: column; }
        .vcr-logo { display: flex; align-items: center; gap: 8px; padding: 16px 18px 18px; }
        .vcr-logo .dot { width: 18px; height: 18px; border-radius: 50%; background: #0ACFFE; position: relative; }
        .vcr-logo .dot::after { content: ""; position: absolute; left: 4px; top: 4px; width: 4px; height: 4px; border-radius: 50%; background: #021F2C; }
        .vcr-logo .name { font-size: 15px; font-weight: 700; color: white; letter-spacing: 0.01em; }
        .vcr-logo .name em { color: #0ACFFE; font-style: normal; }
        .vcr-nav { padding: 6px 10px; flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .vcr-navitem { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 4px; font-size: 13.5px; color: #B5C7D0; cursor: pointer; }
        .vcr-navitem.active { background: #12394C; color: white; }
        .vcr-navitem.indent { padding-left: 38px; font-size: 12.5px; }
        .vcr-tab { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px 8px 38px; font-size: 12.5px; color: #B5C7D0; cursor: pointer; }
        .vcr-tab.active { background: #12394C; color: white; }
        .vcr-tab .x { color: #5F727C; font-size: 14px; line-height: 1; }

        /* topbar — same teal */
        .vcr-top { grid-row: 1; grid-column: 2; background: #1C4E66; color: white; display: flex; align-items: center; padding: 0 18px; gap: 14px; }
        .vcr-top .right { margin-left: auto; display: flex; align-items: center; gap: 18px; font-size: 13px; }

        .vcr-main { grid-row: 2; grid-column: 2; padding: 20px 24px 0; overflow-y: auto; }
        .vcr-titleRow { display: flex; align-items: flex-start; justify-content: space-between; }
        .vcr-h1 { font-size: 22px; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 10px; }
        .vcr-h1 .badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-size: 11.5px; font-weight: 600; color: white; }
        .vcr-h1 .b-q { background: #0B1620; }
        .vcr-h1 .b-r { background: #C2362F; }
        .vcr-h1 .b-w { background: #FF6B5C; }
        .vcr-h1 .b-warn { background: #FFB100; color: #3a2a00; }
        .vcr-h1 .b-ok { color: #1F8856; }
        .vcr-h1 .b-cmt { color: #5F727C; }
        .vcr-toolrow { display: flex; gap: 6px; align-items: center; color: #5F727C; }
        .vcr-toolbtn { width: 30px; height: 30px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
        .vcr-toolbtn:hover { background: #EEF2F4; }
        .vcr-toolbtn.filter { color: #0ACFFE; background: #1C4E66; }
        .vcr-info { display: inline-flex; align-items: center; gap: 8px; color: #1F8856; font-size: 12.5px; margin-top: 8px; }
        .vcr-tabs { display: flex; gap: 8px; margin-top: 16px; padding-bottom: 0; border-bottom: 1px solid #DDE4E8; }
        .vcr-tabs .tab { padding: 8px 16px; font-size: 13px; color: #5F727C; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; border-radius: 4px 4px 0 0; }
        .vcr-tabs .tab.active { background: #1C4E66; color: white; }
        .vcr-tabs .tab.active::after { color: white; }
        .vcr-pickrow { display: flex; align-items: center; gap: 14px; margin-top: 14px; }
        .vcr-pickrow .field { background: white; border: 1px solid #DDE4E8; border-radius: 4px; padding: 6px 12px; min-width: 360px; display: flex; flex-direction: column; }
        .vcr-pickrow .field label { font-size: 10px; color: #5F727C; }
        .vcr-pickrow .field .v { font-size: 13px; color: #0B1620; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .vcr-pickright { margin-left: auto; display: flex; gap: 6px; align-items: center; }
        .vcr-pickright .icon { width: 28px; height: 28px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; }
        .vcr-pickright .icon.cyan { background: #0ACFFE; color: white; }
        .vcr-pickright .icon.ghost { color: #0ACFFE; border: 1px solid #0ACFFE; }
        .vcr-chartwrap { margin-top: 14px; border-radius: 4px; overflow: hidden; border: 1px solid #DDE4E8; }
      `}</style>

      {/* SIDEBAR */}
      <aside className="vcr-side">
        <div className="vcr-logo">
          <span className="dot"/>
          <span className="name">pcr<em>.</em>ai</span>
          <span style={{ marginLeft: "auto" }}><window.HeaderIcon kind="pin"/></span>
        </div>
        <nav className="vcr-nav">
          <div className="vcr-navitem active" onClick={onBack} style={{ cursor: "pointer" }}>
            <window.NavIcon kind="folder"/>
            <span>Run Files</span>
          </div>
          {OPEN_TABS_CR.map((t, i) => (
            <div key={i} className={`vcr-tab ${t.active ? "active" : ""}`}>
              <span>{t.name}</span>
              <span className="x">×</span>
            </div>
          ))}
          <div className="vcr-navitem"><window.NavIcon kind="report"/><span>Reports</span></div>
          <div className="vcr-navitem indent"><span>LJ Report</span></div>
          <div className="vcr-navitem indent"><span>Trends Report</span></div>
          <div className="vcr-navitem indent"><span>Outcomes Report</span></div>
          <div className="vcr-navitem"><window.NavIcon kind="audit"/><span>Audits</span></div>
          <div className="vcr-navitem"><window.NavIcon kind="sites"/><span>Sites</span></div>
        </nav>
      </aside>

      {/* TOPBAR */}
      <header className="vcr-top">
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 500 }}>
          <window.HeaderIcon kind="warn"/>
          <span>For evaluation purpose only. DO NOT use results!</span>
        </div>
        <div className="right">
          <span>philip@darly.solutions</span>
          <span><window.HeaderIcon kind="gear"/></span>
          <span><window.HeaderIcon kind="bell"/></span>
          <span><window.HeaderIcon kind="logout"/></span>
        </div>
      </header>

      {/* MAIN */}
      <main className="vcr-main">
        <div className="vcr-titleRow">
          <div>
            <h1 className="vcr-h1">
              <span>Run name: wg22s_1st_wg12s_high-1</span>
              <span className="badge b-q">? 10</span>
              <span className="badge b-r">! 1</span>
              <span className="badge b-w">! 95</span>
              <span className="badge b-warn">⚠ 1</span>
              <span className="b-ok" style={{ fontSize: 13 }}>✓ 1</span>
              <span className="b-cmt" style={{ fontSize: 13 }}>💬 3</span>
            </h1>
            <div className="vcr-info">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#1F8856"><circle cx="12" cy="12" r="10"/><text x="12" y="16" fontSize="12" fill="white" textAnchor="middle" fontWeight="700">i</text></svg>
              The results in this run-file are based on the thermocycler software
            </div>
          </div>
          <div className="vcr-toolrow">
            <span className="vcr-toolbtn"><window.HeaderIcon kind="help"/></span>
            <span className="vcr-toolbtn filter"><window.HeaderIcon kind="filter"/></span>
            <span className="vcr-toolbtn"><window.HeaderIcon kind="refresh"/></span>
            <span className="vcr-toolbtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 2"/></svg></span>
            <span className="vcr-toolbtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polyline points="6 9 6 2 18 2 18 9"/><rect x="6" y="14" width="12" height="8"/><path d="M6 18H2v-5h20v5h-4"/></svg></span>
            <span className="vcr-toolbtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 2"/></svg></span>
            <span className="vcr-toolbtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9M16 4l4 4-12 12H4v-4z"/></svg></span>
            <span className="vcr-toolbtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 2v6h6M6 2h8l6 6v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg></span>
            <span className="vcr-toolbtn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polyline points="3 6 5 6 21 6"/><path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></span>
          </div>
        </div>

        {/* Tabs */}
        <div className="vcr-tabs">
          {REPORT_TABS.map((t, i) => (
            <span key={i} className={`tab ${t.active ? "active" : ""}`}>
              {t.label}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d={t.active ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"}/></svg>
            </span>
          ))}
        </div>

        {/* Picker row */}
        <div className="vcr-pickrow">
          <div className="field">
            <label>Select control to view plot:</label>
            <span className="v">QVZVLPC, VZVQBL - QVZVQBL, default_instrument <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5F727C" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg></span>
          </div>
          <div className="vcr-pickright">
            <span className="icon ghost"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16 4l4 4-12 12H4v-4z"/></svg></span>
            <span className="icon cyan"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>
          </div>
        </div>

        {/* Westgards chart */}
        <div className="vcr-chartwrap">
          <WestgardChart/>
        </div>

        {/* Bottom data table */}
        <CRDataTable/>
      </main>
    </div>
  );
}

window.VariationCReport = VariationCReport;
