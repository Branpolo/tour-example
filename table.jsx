/* global React */
const { useState, useMemo, useEffect, useRef } = React;

// ---------- Sample clinical data ----------
const ROWS = [
  { id: "RF-9241", patient: "PT-00482-A", study: "VZV Multiplex / Inhibition", site: "EZ — San Juan Capistrano, CA", uploaded: "2026-04-29 11:29", uploader: "fangel", plate: "96/96", mixes: ["VZV","VZVQC","VZVQBL"], status: "reanalyze", statusNote: "Westgard 1-3s on QC well B4", q:10, r:1, w:1, g:0, c:2 },
  { id: "RF-9240", patient: "PT-00481-C", study: "Hepatitis HDV Panel", site: "NUH — London", uploaded: "2026-04-29 11:27", uploader: "rgunson", plate: "96/96", mixes: ["HDV","HDVQC"], status: "passed", statusNote: "All wells passed — ready to export", q:0, r:0, w:0, g:96, c:2 },
  { id: "RF-9239", patient: "PT-00478-B", study: "Flu Quad Screen (INFA/INFB/RSV)", site: "King's College NHS", uploaded: "2026-04-28 16:12", uploader: "msmith", plate: "96/96", mixes: ["INFA","INFB","RSV"], status: "review", statusNote: "3 controls outside 2SD — reanalyse", q:0, r:3, w:8, g:85, c:0 },
  { id: "RF-9238", patient: "PT-00475-A", study: "VZV Inhibition (BL)", site: "Quest Diagnostics, CA", uploaded: "2026-04-28 14:56", uploader: "fangel", plate: "96/96", mixes: ["VZV","VZVQBL"], status: "passed", statusNote: "2 wells flagged: spike artefact", q:0, r:0, w:2, g:94, c:1 },
  { id: "RF-9237", patient: "PT-00471-D", study: "SARS-CoV-2 / Flu A+B", site: "EZ — San Juan Capistrano, CA", uploaded: "2026-04-28 09:02", uploader: "lkhan", plate: "96/96", mixes: ["SARS","INFA","INFB"], status: "processing", statusNote: "Analysis in progress — 62%", q:0, r:0, w:0, g:0, c:0 },
  { id: "RF-9236", patient: "PT-00468-A", study: "HSV-1/2 Differentiation", site: "NUH — London", uploaded: "2026-04-27 18:45", uploader: "rgunson", plate: "96/96", mixes: ["HSV1","HSV2"], status: "passed", statusNote: "Released to LIS at 19:02", q:0, r:0, w:0, g:96, c:0 },
  { id: "RF-9235", patient: "PT-00465-B", study: "CMV Quantitative", site: "King's College NHS", uploaded: "2026-04-27 13:11", uploader: "msmith", plate: "96/96", mixes: ["CMV","CMVQC"], status: "reanalyze", statusNote: "Calibrator drift > 0.3 log", q:4, r:0, w:1, g:91, c:3 },
  { id: "RF-9234", patient: "PT-00461-A", study: "VZV Multiplex / Inhibition", site: "Quest Diagnostics, CA", uploaded: "2026-04-26 10:30", uploader: "fangel", plate: "48/96", mixes: ["VZV","VZVQ"], status: "review", statusNote: "Partial plate — manual sign-off needed", q:0, r:0, w:0, g:48, c:0 },
];

const STATUS_META = {
  passed:    { label: "Passed",       dot: "var(--status-success)",  text: "var(--status-success-deep)", bg: "rgba(47,163,101,0.10)" },
  review:    { label: "Needs review", dot: "var(--status-warning)",  text: "#9C7A0A",                    bg: "rgba(209,165,27,0.12)" },
  reanalyze: { label: "Reanalyze",    dot: "var(--status-danger)",   text: "var(--status-danger-deep)",  bg: "rgba(226,59,59,0.10)" },
  processing:{ label: "Processing",   dot: "var(--brand-cyan-500)",  text: "var(--brand-cyan-700)",      bg: "rgba(10,207,254,0.10)" },
};

// ---------- shared icons ----------
const Icon = {
  search: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  filter: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M7 12h10M10 18h4"/></svg>,
  sort:   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6-6 6 6M6 15l6 6 6-6"/></svg>,
  sortAsc:<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 15 6-6 6 6"/></svg>,
  sortDesc:<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  more:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>,
  close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  download: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0 5-5m-5 5-5-5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>,
  flag:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V4h12l-2 4 2 4H4"/></svg>,
  plus:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  chevDown: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>,
  check:  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>,
};

// ---------- shared subcomponents ----------
function StatusPill({ status }) {
  const m = STATUS_META[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 9px 3px 7px", borderRadius: 999, fontSize: 11.5, fontWeight: 500, color: m.text, background: m.bg, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.dot }}/>{m.label}
    </span>
  );
}

function NotifChips({ row, compact }) {
  const items = [
    row.r > 0 && { c: "var(--status-danger)", n: row.r, t: "errors" },
    row.w > 0 && { c: "var(--status-warning)", n: row.w, t: "warnings" },
    row.q > 0 && { c: "var(--neutral-500)", n: row.q, t: "questions" },
    row.g > 0 && { c: "var(--status-success)", n: row.g, t: "passed" },
    row.c > 0 && { c: "var(--brand-cyan-600)", n: row.c, t: "comments" },
  ].filter(Boolean);
  if (compact) {
    return (
      <div style={{ display: "flex", gap: 4 }}>
        {items.map((it, i) => (
          <span key={i} title={`${it.n} ${it.t}`} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: it.c, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: it.c }}/>{it.n}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: `color-mix(in srgb, ${it.c} 12%, transparent)`, color: it.c }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: it.c }}/>{it.n}
        </span>
      ))}
    </div>
  );
}

// ---------- VARIATION A — refined classic ----------
function VariationA({ tour = true }) {
  const [sort, setSort] = useState({ key: "uploaded", dir: "desc" });
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drawerRow, setDrawerRow] = useState(null);
  const [reportRow, setReportRow] = useState(null);
  const [tourOn, setTourOn] = useState(tour);
  const tourState = useTourA(tourOn);

  const sorted = useMemo(() => {
    const filtered = ROWS.filter(r =>
      (statusFilter === "all" || r.status === statusFilter) &&
      (search === "" || r.patient.toLowerCase().includes(search.toLowerCase()) || r.study.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))
    );
    return [...filtered].sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [sort, search, statusFilter]);

  const toggleSort = (key) => {
    setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  };
  const toggleRow = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allSelected = sorted.length > 0 && sorted.every(r => selected.has(r.id));
  const toggleAll = () => setSelected(s => allSelected ? new Set() : new Set(sorted.map(r => r.id)));

  // Drive state from tour phase (always, so manual ‹/› stepping changes screens too).
  useEffect(() => {
    const p = tourState.phase;
    if (p === "list") { setDrawerRow(null); setReportRow(null); }
    else if (p === "row1") { setDrawerRow(sorted[0] || null); setReportRow(null); }
    else if (p === "report") { setDrawerRow(null); setReportRow(sorted[0] || null); }
  }, [tourState.phase, sorted]);

  const Th = ({ k, children, w }) => (
    <th onClick={() => toggleSort(k)} style={{ width: w, cursor: "pointer", userSelect: "none" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        {children}
        <span style={{ opacity: sort.key === k ? 1 : 0.35, color: sort.key === k ? "var(--brand-cyan-600)" : "currentColor" }}>
          {sort.key === k ? (sort.dir === "asc" ? Icon.sortAsc : Icon.sortDesc) : Icon.sort}
        </span>
      </span>
    </th>
  );

  const counts = useMemo(() => ({
    all: ROWS.length,
    review: ROWS.filter(r => r.status === "review").length,
    reanalyze: ROWS.filter(r => r.status === "reanalyze").length,
    passed: ROWS.filter(r => r.status === "passed").length,
    processing: ROWS.filter(r => r.status === "processing").length,
  }), []);

  return (
    <div className="va-frame">
      <style>{`
        .va-frame { font-family: var(--font-sans); background: #fff; color: var(--neutral-900); width: 1240px; border-radius: 14px; border: 1px solid var(--neutral-200); overflow: hidden; box-shadow: 0 1px 2px rgba(7,24,34,0.04); position: relative; }
        .va-frame * { box-sizing: border-box; }
        .va-head { padding: 22px 28px 16px; border-bottom: 1px solid var(--neutral-100); display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
        .va-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--neutral-500); }
        .va-title { font-size: 24px; font-weight: 700; letter-spacing: -0.015em; color: var(--brand-teal-700); margin: 4px 0 0; }
        .va-sub { font-size: 13px; color: var(--neutral-500); margin-top: 4px; }
        .va-actions { display: flex; gap: 8px; align-items: center; }
        .va-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; font-size: 13px; font-weight: 500; border-radius: 6px; border: 1px solid var(--neutral-200); background: white; color: var(--neutral-700); cursor: pointer; font-family: inherit; }
        .va-btn:hover { background: var(--neutral-50); border-color: var(--neutral-300); }
        .va-btn.primary { background: var(--brand-cyan-500); color: white; border-color: var(--brand-cyan-500); }
        .va-btn.primary:hover { background: var(--brand-cyan-600); border-color: var(--brand-cyan-600); }
        .va-tabs { display: flex; gap: 2px; padding: 0 28px; border-bottom: 1px solid var(--neutral-100); }
        .va-tab { padding: 12px 14px; font-size: 13px; color: var(--neutral-500); border-bottom: 2px solid transparent; cursor: pointer; font-weight: 500; display: inline-flex; gap: 6px; align-items: center; }
        .va-tab:hover { color: var(--neutral-700); }
        .va-tab.active { color: var(--brand-cyan-700); border-bottom-color: var(--brand-cyan-500); }
        .va-tab .badge { font-size: 11px; padding: 1px 6px; border-radius: 999px; background: var(--neutral-100); color: var(--neutral-600); font-weight: 600; }
        .va-tab.active .badge { background: var(--brand-cyan-50); color: var(--brand-cyan-700); }
        .va-toolbar { padding: 12px 28px; display: flex; gap: 10px; align-items: center; border-bottom: 1px solid var(--neutral-100); background: var(--neutral-50); }
        .va-search { flex: 1; max-width: 320px; display: flex; align-items: center; gap: 8px; padding: 7px 12px; background: white; border: 1px solid var(--neutral-200); border-radius: 6px; color: var(--neutral-500); font-size: 13px; }
        .va-search:focus-within { border-color: var(--brand-cyan-500); box-shadow: 0 0 0 3px rgba(10,207,254,0.15); }
        .va-search input { border: none; outline: none; background: transparent; font-family: inherit; font-size: 13px; flex: 1; color: var(--neutral-900); }
        .va-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px dashed var(--neutral-300); border-radius: 6px; font-size: 12.5px; color: var(--neutral-600); cursor: pointer; background: white; font-family: inherit; }
        .va-chip:hover { border-style: solid; border-color: var(--neutral-400); color: var(--neutral-800); }
        .va-bulkbar { display: flex; align-items: center; gap: 10px; padding: 10px 28px; background: var(--brand-cyan-50); border-bottom: 1px solid var(--brand-cyan-100); font-size: 13px; color: var(--brand-cyan-700); font-weight: 500; }
        .va-bulkbar .va-btn { background: white; border-color: var(--brand-cyan-100); color: var(--brand-cyan-700); }
        .va-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .va-table th { text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--neutral-500); padding: 10px 14px; border-bottom: 1px solid var(--neutral-200); background: white; position: sticky; top: 0; }
        .va-table td { padding: 14px 14px; border-bottom: 1px solid var(--neutral-100); vertical-align: middle; }
        .va-table tr:hover td { background: var(--brand-cyan-50); cursor: pointer; }
        .va-table tr.selected td { background: rgba(10,207,254,0.08); }
        .va-mono { font-family: var(--font-mono); font-size: 12px; color: var(--neutral-600); }
        .va-cell-strong { font-weight: 600; color: var(--neutral-900); }
        .va-meta { font-size: 11.5px; color: var(--neutral-500); margin-top: 2px; }
        .va-mix { display: inline-flex; gap: 3px; flex-wrap: wrap; }
        .va-mix span { font-size: 10.5px; font-weight: 600; padding: 1.5px 6px; border-radius: 3px; background: var(--neutral-100); color: var(--neutral-700); letter-spacing: 0.02em; }
        .va-checkbox { width: 16px; height: 16px; border: 1.5px solid var(--neutral-300); border-radius: 3px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; background: white; }
        .va-checkbox.checked { background: var(--brand-cyan-500); border-color: var(--brand-cyan-500); color: white; }
        .va-foot { padding: 12px 28px; display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; color: var(--neutral-500); border-top: 1px solid var(--neutral-100); }
        .va-pager { display: flex; gap: 4px; }
        .va-pager button { width: 28px; height: 28px; border: 1px solid var(--neutral-200); background: white; border-radius: 5px; font-size: 12px; cursor: pointer; color: var(--neutral-600); font-family: inherit; }
        .va-pager button.active { background: var(--brand-cyan-500); color: white; border-color: var(--brand-cyan-500); }
        .va-rowbtn { width: 26px; height: 26px; border-radius: 5px; border: none; background: transparent; color: var(--neutral-400); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .va-rowbtn:hover { background: white; color: var(--neutral-700); }

        /* Drawer */
        .va-drawer-back { position: absolute; inset: 0; background: rgba(2,31,44,0.35); display: flex; justify-content: flex-end; z-index: 50; }
        .va-drawer { width: 460px; background: white; height: 100%; box-shadow: -8px 0 32px rgba(0,0,0,0.12); display: flex; flex-direction: column; }
        .va-drawer-h { padding: 20px 24px; border-bottom: 1px solid var(--neutral-100); display: flex; justify-content: space-between; align-items: flex-start; }
        .va-drawer-b { padding: 20px 24px; flex: 1; overflow: auto; }
        .va-field { margin-bottom: 18px; }
        .va-field-l { font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--neutral-500); font-weight: 500; margin-bottom: 4px; }
        .va-field-v { font-size: 14px; color: var(--neutral-900); }
        .va-drawer-f { padding: 16px 24px; border-top: 1px solid var(--neutral-100); display: flex; gap: 8px; justify-content: flex-end; background: var(--neutral-50); }
      `}</style>

      <div className="va-head">
        <div>
          <div className="va-eyebrow">pcr.ai · Workspace</div>
          <h2 className="va-title">Patient run files</h2>
          <div className="va-sub">{ROWS.length} runs · last sync 2 min ago · EZ &amp; partner sites</div>
        </div>
        <div className="va-actions">
          <button className="va-btn">{Icon.download} Export</button>
          <button className="va-btn primary">{Icon.plus} New run</button>
        </div>
      </div>

      <div className="va-tabs">
        {[
          ["all","All runs",counts.all],
          ["reanalyze","Reanalyze",counts.reanalyze],
          ["review","Needs review",counts.review],
          ["processing","Processing",counts.processing],
          ["passed","Passed",counts.passed],
        ].map(([k,l,n]) => (
          <div key={k} className={`va-tab ${statusFilter===k?"active":""}`} onClick={() => setStatusFilter(k)}>
            {l}<span className="badge">{n}</span>
          </div>
        ))}
      </div>

      <div className="va-toolbar">
        <div className="va-search">
          {Icon.search}
          <input placeholder="Search by patient, study, or run ID…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <button className="va-chip">Site {Icon.chevDown}</button>
        <button className="va-chip">Mix {Icon.chevDown}</button>
        <button className="va-chip">Uploaded by {Icon.chevDown}</button>
        <button className="va-chip">Date {Icon.chevDown}</button>
        <div style={{ flex: 1 }}/>
        <button className="va-chip">{Icon.filter} More filters</button>
      </div>

      {selected.size > 0 && (
        <div className="va-bulkbar">
          <span>{selected.size} selected</span>
          <div style={{ flex: 1 }}/>
          <button className="va-btn">{Icon.flag} Flag</button>
          <button className="va-btn">{Icon.download} Export</button>
          <button className="va-btn" onClick={() => setSelected(new Set())}>{Icon.close} Clear</button>
        </div>
      )}

      <div style={{ position: "relative" }}>
        <table className="va-table">
          <thead>
            <tr>
              <th style={{ width: 32 }}>
                <span className={`va-checkbox ${allSelected?"checked":""}`} onClick={toggleAll}>{allSelected && Icon.check}</span>
              </th>
              <Th k="id" w={110}>Run ID</Th>
              <Th k="patient" w={130}>Patient</Th>
              <Th k="study">Study / Type</Th>
              <Th k="site" w={180}>Site</Th>
              <Th k="uploaded" w={140}>Uploaded</Th>
              <Th k="status" w={170}>Status</Th>
              <th style={{ width: 100 }}>Activity</th>
              <th style={{ width: 40 }}/>
            </tr>
          </thead>
          <tbody>
            {sorted.map(r => (
              <tr key={r.id} className={selected.has(r.id) ? "selected" : ""} onClick={() => setDrawerRow(r)}>
                <td onClick={e => e.stopPropagation()}>
                  <span className={`va-checkbox ${selected.has(r.id)?"checked":""}`} onClick={() => toggleRow(r.id)}>{selected.has(r.id) && Icon.check}</span>
                </td>
                <td className="va-mono">{r.id}</td>
                <td><span className="va-cell-strong">{r.patient}</span><div className="va-meta">{r.plate}</div></td>
                <td>
                  <div className="va-cell-strong">{r.study}</div>
                  <div className="va-mix" style={{ marginTop: 4 }}>{r.mixes.map(m => <span key={m}>{m}</span>)}</div>
                </td>
                <td style={{ fontSize: 12.5, color: "var(--neutral-600)" }}>{r.site}</td>
                <td>
                  <div style={{ fontSize: 12.5 }}>{r.uploaded.split(" ")[0]}</div>
                  <div className="va-meta">by {r.uploader} · {r.uploaded.split(" ")[1]}</div>
                </td>
                <td>
                  <StatusPill status={r.status}/>
                  <div className="va-meta" style={{ marginTop: 4, maxWidth: 160 }}>{r.statusNote}</div>
                </td>
                <td><NotifChips row={r} compact/></td>
                <td onClick={e => e.stopPropagation()}>
                  <button className="va-rowbtn">{Icon.more}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {drawerRow && (
          <div className="va-drawer-back" onClick={() => setDrawerRow(null)}>
            <div className="va-drawer" onClick={e => e.stopPropagation()}>
              <div className="va-drawer-h">
                <div>
                  <div className="va-eyebrow">{drawerRow.id}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-teal-700)", marginTop: 4 }}>{drawerRow.patient}</div>
                  <div style={{ fontSize: 13, color: "var(--neutral-500)", marginTop: 2 }}>{drawerRow.study}</div>
                </div>
                <button className="va-rowbtn" onClick={() => setDrawerRow(null)}>{Icon.close}</button>
              </div>
              <div className="va-drawer-b">
                <div className="va-field"><div className="va-field-l">Status</div><StatusPill status={drawerRow.status}/><div style={{ fontSize: 13, color: "var(--neutral-600)", marginTop: 6 }}>{drawerRow.statusNote}</div></div>
                <div className="va-field"><div className="va-field-l">Site</div><div className="va-field-v">{drawerRow.site}</div></div>
                <div className="va-field"><div className="va-field-l">Mixes</div><div className="va-mix">{drawerRow.mixes.map(m => <span key={m}>{m}</span>)}</div></div>
                <div className="va-field"><div className="va-field-l">Plate coverage</div><div className="va-field-v">{drawerRow.plate} wells</div></div>
                <div className="va-field"><div className="va-field-l">Uploaded</div><div className="va-field-v">{drawerRow.uploaded} · by {drawerRow.uploader}</div></div>
                <div className="va-field"><div className="va-field-l">Activity</div><NotifChips row={drawerRow}/></div>
              </div>
              <div className="va-drawer-f">
                <button className="va-btn" onClick={() => setDrawerRow(null)}>Close</button>
                <button className="va-btn primary">Open run →</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="va-foot">
        <div>Showing {sorted.length} of {ROWS.length} runs</div>
        <div className="va-pager">
          <button>‹</button><button className="active">1</button><button>2</button><button>3</button><button>›</button>
        </div>
      </div>

      {/* Report overlay (mounts during 'report' phase) */}
      {reportRow && (
        <div style={{ position: "absolute", inset: 0, background: "#fff", zIndex: 5, animation: "vaFade .35s ease both" }}>
          <ReportScreenA row={reportRow} onBack={() => setReportRow(null)} hoverFloater={tourState.phase === "report" && tourState.cursor.x < 65} />
        </div>
      )}

      {/* Tour cursor + toggle (cursor stays visible when paused so users see where they stepped) */}
      <TourCursor cursor={tourState.cursor} click={tourState.click && tourOn} clickAt={tourState.clickAt} />
      <TourPill on={tourOn} onToggle={() => setTourOn(v => !v)} onPrev={() => { setTourOn(false); tourState.prev(); }} onNext={() => { setTourOn(false); tourState.next(); }} />
      <style>{`
        @keyframes vaFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

// ---------- AUTO-TOUR engine (shared by A and B) ----------
// Each variation supplies its own keyframes; this hook drives time and cursor lerp.
function useTourEngine(enabled, keyframes, duration) {
  const [t, setT] = useState(0);
  const baseRef = React.useRef({ start: performance.now(), pausedAt: 0 });
  const stateRef = React.useRef({ t: 0, keyframes, duration });
  stateRef.current = { t, keyframes, duration };

  useEffect(() => {
    if (!enabled) {
      baseRef.current.pausedAt = stateRef.current.t;
      return;
    }
    baseRef.current.start = performance.now() - baseRef.current.pausedAt;
    let raf;
    const tick = (now) => {
      setT((now - baseRef.current.start) % duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, duration]);

  const jumpTo = React.useCallback((newT) => {
    const d = stateRef.current.duration;
    const wrapped = ((newT % d) + d) % d;
    baseRef.current.start = performance.now() - wrapped;
    baseRef.current.pausedAt = wrapped;
    // Force re-render even if React thinks t is unchanged after rounding
    setT(prev => wrapped === prev ? wrapped + 0.0001 : wrapped);
  }, []);
  const prev = React.useCallback(() => {
    const { t: ct, keyframes: kfs } = stateRef.current;
    let ci = 0;
    for (let i = 0; i < kfs.length; i++) { if (ct >= kfs[i].at) ci = i; }
    const atCurStart = Math.abs(ct - kfs[ci].at) < 50;
    const idx = atCurStart ? (ci - 1 + kfs.length) % kfs.length : ci;
    jumpTo(kfs[idx].at);
  }, [jumpTo]);
  const next = React.useCallback(() => {
    const { t: ct, keyframes: kfs } = stateRef.current;
    let ci = 0;
    for (let i = 0; i < kfs.length; i++) { if (ct >= kfs[i].at) ci = i; }
    // Always advance — wrap around if at last
    const idx = (ci + 1) % kfs.length;
    jumpTo(kfs[idx].at);
  }, [jumpTo]);

  let cur = keyframes[0], nx = keyframes[1] || keyframes[0];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (t >= keyframes[i].at && t < keyframes[i + 1].at) { cur = keyframes[i]; nx = keyframes[i + 1]; break; }
  }
  const span = Math.max(1, nx.at - cur.at);
  const localT = Math.min(1, (t - cur.at) / span);
  const e = 1 - Math.pow(1 - localT, 3); // ease-out cubic
  const cursor = { x: cur.target.x + (nx.target.x - cur.target.x) * e, y: cur.target.y + (nx.target.y - cur.target.y) * e };
  let phase = keyframes[0].phase;
  for (const k of keyframes) { if (t >= k.at) phase = k.phase; }
  const clickKf = keyframes.find(k => k.click && t >= k.at && t < k.at + 260);
  return { t, phase, cursor, click: !!clickKf, clickAt: clickKf ? clickKf.target : null, prev, next, jumpTo };
}
function TourCursor({ cursor, click, clickAt, strokeColor = "#021F2C" }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 100, borderRadius: 14, overflow: "hidden" }}>
      {click && clickAt && (
        <span style={{ position: "absolute", left: `${clickAt.x}%`, top: `${clickAt.y}%`, width: 38, height: 38, marginLeft: -19, marginTop: -19, borderRadius: "50%", border: "2px solid rgba(10,207,254,0.95)", background: "rgba(10,207,254,0.18)", animation: "tour-ping 260ms ease-out forwards" }}/>
      )}
      <div style={{ position: "absolute", left: `${cursor.x}%`, top: `${cursor.y}%`, transform: "translate(-3px, -2px)", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))" }}>
        <svg width="22" height="26" viewBox="0 0 22 26" fill="none"><path d="M2 2 L2 19 L7 15 L10.5 22.5 L13 21.3 L9.5 14 L16 13.5 Z" fill="white" stroke={strokeColor} strokeWidth="1.4" strokeLinejoin="round"/></svg>
      </div>
      <style>{`@keyframes tour-ping { from { transform: scale(0.4); opacity: 1; } to { transform: scale(1.5); opacity: 0; } }`}</style>
    </div>
  );
}
function TourPill({ on, onToggle, onPrev, onNext, dark }) {
  const baseBtn = {
    width: 26, height: 26, borderRadius: 999,
    border: dark ? "1px solid var(--brand-teal-700)" : "1px solid var(--neutral-200)",
    background: dark ? "rgba(2,31,44,0.85)" : "rgba(255,255,255,0.95)",
    color: dark ? "#B5C7D0" : "var(--neutral-600)",
    cursor: "pointer",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  };
  return (
    <div style={{ position: "absolute", top: 14, right: 14, zIndex: 200, display: "inline-flex", gap: 4, alignItems: "center" }}>
      {onPrev && (
        <button onClick={onPrev} title="Previous step" style={baseBtn}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      )}
      <button
        onClick={onToggle}
        title={on ? "Pause auto-tour" : "Play auto-tour"}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 10px", borderRadius: 999,
          border: dark ? "1px solid var(--brand-teal-700)" : "1px solid var(--neutral-200)",
          background: on ? "rgba(10,207,254,0.12)" : (dark ? "rgba(2,31,44,0.85)" : "rgba(255,255,255,0.95)"),
          backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
          color: on ? (dark ? "var(--brand-cyan-300)" : "var(--brand-cyan-700)") : (dark ? "#B5C7D0" : "var(--neutral-500)"),
          fontSize: 11.5, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.04em",
          boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
        }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: on ? "var(--brand-cyan-500)" : "#5F727C", boxShadow: on ? "0 0 0 3px rgba(10,207,254,0.25)" : "none", animation: on ? "tour-pulse 1.5s ease-in-out infinite" : "none" }}/>
        {on ? "AUTO-TOUR" : "TOUR PAUSED"}
      </button>
      {onNext && (
        <button onClick={onNext} title="Next step" style={baseBtn}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      )}
      <style>{`@keyframes tour-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}

// ---------- VARIATION A — Report sub-screen (Westgards tab with floater) ----------
function ReportScreenA({ row, onBack, hoverFloater }) {
  // Sample data for the chart — Westgard zones + sample line + floater hovering one point.
  const points = [
    { d: "08-21", v: 34 }, { d: "08-21", v: 33.5 }, { d: "08-21", v: 33.8 },
    { d: "08-21", v: 33 }, { d: "08-21", v: 33.2 }, { d: "08-21", v: 32.5 },
    { d: "08-21", v: 32.8 }, { d: "08-21", v: 33 }, { d: "08-21", v: 33.5 },
    { d: "08-21", v: 33.6 }, { d: "08-21", v: 34 },
  ];
  // 11 evenly spaced cols, y from 29 to 38
  const W = 1180, H = 360, padL = 56, padR = 24, padT = 28, padB = 36;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const xAt = (i) => padL + (innerW * i) / (points.length - 1);
  const yAt = (v) => padT + innerH * (1 - (v - 29) / (38 - 29));

  // Westgard zones (vertical column bands per sample) — rough approximation of the screenshot.
  // Each column has a stack of three zones: pass (green) middle, warn (gold) above/below, fail (deep red) outer.
  // We'll just paint the whole canvas with horizontal bands then overlay vertical column dividers.
  return (
    <div style={{ position: "absolute", inset: 0, background: "white", display: "flex", flexDirection: "column" }}>
      {/* Sub-tabs row */}
      <div style={{ padding: "14px 28px 0", display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} className="va-rowbtn" style={{ width: 28, height: 28, border: "1px solid var(--neutral-200)", borderRadius: 6 }} aria-label="Back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div>
            <div style={{ fontSize: 11, color: "var(--neutral-500)", letterSpacing: "0.06em" }}>
              <span>All runs</span> <span style={{ opacity: 0.5 }}>›</span> <span>{row.id}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-teal-700)", marginTop: 2, letterSpacing: "-0.01em" }}>{row.patient}<span style={{ marginLeft: 10, fontSize: 13, color: "var(--neutral-500)", fontWeight: 500 }}>{row.study}</span></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <NotifChips row={row} compact/>
          <button className="va-btn">{Icon.download} Export</button>
          <button className="va-btn primary">Approve</button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 6, padding: "16px 28px 0", borderBottom: "1px solid var(--neutral-100)" }}>
        {[
          ["assay","Assay Summary"],
          ["outcome","Outcome Summary"],
          ["wg","Westgards"],
          ["plate","Plate Map"],
        ].map(([k,l]) => (
          <div key={k} style={{
            padding: "8px 14px", fontSize: 13, fontWeight: 500, borderRadius: "6px 6px 0 0",
            color: k === "wg" ? "white" : "var(--neutral-600)",
            background: k === "wg" ? "var(--brand-cyan-600)" : "transparent",
            border: k === "wg" ? "1px solid var(--brand-cyan-600)" : "1px solid transparent",
            borderBottom: "none",
            cursor: "pointer",
          }}>{l}</div>
        ))}
      </div>

      {/* Control selector */}
      <div style={{ padding: "12px 28px 8px", display: "flex", alignItems: "center", gap: 12, fontSize: 12.5, color: "var(--neutral-500)" }}>
        <span>Select control to view plot:</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", border: "1px solid var(--neutral-200)", borderRadius: 6, fontSize: 12.5, color: "var(--neutral-900)", background: "white", fontWeight: 500 }}>
          QVZVLPC, VZVQBL — QVZVQBL, default_instrument {Icon.chevDown}
        </span>
        <div style={{ flex: 1 }}/>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "1px solid var(--neutral-200)", color: "var(--brand-cyan-600)", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17v4h4M21 7V3h-4M17 21h4v-4M3 3h4v4M9 9h6v6H9z"/></svg>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, background: "var(--brand-cyan-500)", color: "white", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </span>
      </div>

      {/* Chart */}
      <div style={{ margin: "8px 28px 0", borderRadius: 10, overflow: "hidden", background: "var(--brand-teal-900)", position: "relative" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="320" style={{ display: "block" }}>
          {/* Westgard zone bands (horizontal) */}
          <rect x={padL} y={padT} width={innerW} height={innerH * 0.18} fill="#651F24"/>
          <rect x={padL} y={padT + innerH * 0.18} width={innerW} height={innerH * 0.16} fill="#A8961D"/>
          <rect x={padL} y={padT + innerH * 0.34} width={innerW} height={innerH * 0.32} fill="#1F5E3D"/>
          <rect x={padL} y={padT + innerH * 0.66} width={innerW} height={innerH * 0.16} fill="#A8961D"/>
          <rect x={padL} y={padT + innerH * 0.82} width={innerW} height={innerH * 0.18} fill="#651F24"/>
          {/* Vertical column dividers (gives the 'columned' look from the screenshot) */}
          {points.map((p, i) => (
            <line key={`v${i}`} x1={xAt(i)} x2={xAt(i)} y1={padT} y2={padT + innerH} stroke="#274452" strokeWidth="1" opacity="0.5"/>
          ))}
          {/* Y-axis labels */}
          {[29,30,31,32,33,34,35,36,37,38].map(v => (
            <g key={`y${v}`}>
              <text x={padL - 8} y={yAt(v) + 3} fontSize="9.5" fill="#8FA9B5" textAnchor="end" fontFamily="var(--font-mono)">{v}</text>
              <line x1={padL} x2={padL + innerW} y1={yAt(v)} y2={yAt(v)} stroke="#274452" strokeWidth="0.6" opacity="0.4"/>
            </g>
          ))}
          {/* X axis label */}
          <text x={W/2} y={H - 6} fontSize="10" fill="white" textAnchor="middle" fontWeight="500">Extraction Date · EZ — San Juan Capistrano CA</text>
          {/* Sample line + dots */}
          <polyline
            points={points.map((p,i) => `${xAt(i)},${yAt(p.v)}`).join(" ")}
            fill="none" stroke="white" strokeWidth="1.6"/>
          {points.map((p,i) => (
            <circle key={`p${i}`} cx={xAt(i)} cy={yAt(p.v)} r="4" fill="white" stroke="#0B2A3A" strokeWidth="1.4"/>
          ))}
          {/* Y-axis title */}
          <text x={16} y={padT + innerH/2} fontSize="11" fill="white" textAnchor="middle" transform={`rotate(-90, 16, ${padT + innerH/2})`}>Ct</text>
          {/* Title strip */}
          <rect x={padL + innerW * 0.18} y={padT - 14} width={innerW * 0.64} height={20} fill="#0B2A3A" opacity="0.85"/>
          <text x={padL + innerW * 0.5} y={padT} fontSize="11" fill="white" textAnchor="middle" fontStyle="italic">The westgard settings shown here have been changed for current controls</text>
          {/* Gear icon (top-right) */}
          <g transform={`translate(${W - padR - 24}, ${padT + 8})`}>
            <circle cx="6" cy="6" r="10" fill="#0B2A3A" opacity="0.6"/>
            <circle cx="6" cy="6" r="3" fill="none" stroke="white" strokeWidth="1.2"/>
          </g>
        </svg>

        {/* Floating well-detail card (the popup from the screenshot) */}
        {hoverFloater && (
          <div style={{
            position: "absolute",
            left: "44%", top: 22,
            width: 380,
            background: "white", borderRadius: 6,
            boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
            border: "1px solid #DDE4E8",
            transition: "opacity 200ms ease-out",
          }}>
            {/* Mini fluorescence chart inside card */}
            <div style={{ padding: "10px 14px 0" }}>
              <svg viewBox="0 0 360 110" width="100%" height="88" style={{ display: "block" }}>
                <text x="6" y="18" fontSize="9" fill="#5F727C">1</text>
                <text x="6" y="40" fontSize="9" fill="#5F727C">0.75</text>
                <text x="6" y="62" fontSize="9" fill="#5F727C">0.5</text>
                <text x="6" y="84" fontSize="9" fill="#5F727C">0.25</text>
                <text x="6" y="105" fontSize="9" fill="#5F727C">0</text>
                <text x="180" y="106" fontSize="8.5" fill="#5F727C" textAnchor="middle">Cycle</text>
                <text x="200" y="14" fontSize="9" fill="#5F727C">31.5</text>
                <line x1="200" y1="18" x2="200" y2="100" stroke="#8FA9B5" strokeDasharray="2 2"/>
                {/* Curve */}
                <path d="M28,90 L60,89 L92,86 L124,82 L156,72 L188,55 L220,42 L252,35 L284,30 L320,28 L350,28" fill="none" stroke="#0ACFFE" strokeWidth="2"/>
              </svg>
            </div>
            {/* Detail key-values */}
            <div style={{ padding: "8px 14px 12px", display: "grid", gridTemplateColumns: "auto 1fr auto 1fr", gap: "4px 10px", fontSize: 11, color: "var(--neutral-700)" }}>
              <span style={{ color: "var(--neutral-500)" }}>Runfile:</span><b>wg22s_1st_wg12s</b>
              <span style={{ color: "var(--neutral-500)" }}>Ct:</span><b>31.599</b>
              <span style={{ color: "var(--neutral-500)" }}>Well:</span><b>A2</b>
              <span style={{ color: "var(--neutral-500)" }}>Quantity:</span><b>174</b>
              <span style={{ color: "var(--neutral-500)" }}>Date of Upload:</span><b>27-08-2020, 1:15 am</b>
              <span style={{ color: "var(--neutral-500)" }}>Date of Extraction:</span><b>27-08-2020, 1:15 am</b>
              <span style={{ color: "var(--neutral-500)" }}>Instruction:</span><b>default_instrument</b>
            </div>
          </div>
        )}
      </div>

      {/* Result table */}
      <div style={{ margin: "16px 28px 0", border: "1px solid var(--neutral-200)", borderRadius: 8, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "var(--neutral-50)", color: "var(--neutral-700)" }}>
              {["Mix","Well","Name","Sample role","Target","Class","CT","Quant","Outcome"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: "1px solid var(--neutral-200)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { mix:"HDV", well:"A2", name:"QVZVLPC", role:"QVZVLPC", target:"QVZVQBL", cls:"HDV", ct:"28.540", quant:"173", outcome:"ok" },
              { mix:"HDV", well:"A2", name:"QVZVLPC", role:"QVZVLPC", target:"HDV", cls:"HDV", ct:"28.540", quant:"173", outcome:"ok" },
              { mix:"HDV", well:"A2", name:"QVZVLPC", role:"QVZVLPC", target:"QVZVQBL", cls:"HDV", ct:"28.540", quant:"173", outcome:"fail", flagged: true },
              { mix:"HDV", well:"A2", name:"QVZVLPC", role:"QVZVLPC", target:"HDV", cls:"HDV", ct:"28.540", quant:"173", outcome:"fail" },
            ].map((r,i) => (
              <tr key={i} style={{ borderBottom: i < 3 ? "1px solid var(--neutral-100)" : "none" }}>
                <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)" }}>{r.mix}</td>
                <td style={{ padding: "10px 12px" }}>{r.well}</td>
                <td style={{ padding: "10px 12px" }}>{r.name}</td>
                <td style={{ padding: "10px 12px" }}>{r.role}</td>
                <td style={{ padding: "10px 12px" }}>{r.target}</td>
                <td style={{ padding: "10px 12px" }}>{r.cls}</td>
                <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)", background: r.flagged ? "rgba(226,59,59,0.12)" : "transparent", color: r.flagged ? "var(--status-danger-deep)" : "inherit", fontWeight: r.flagged ? 600 : 400 }}>{r.ct}</td>
                <td style={{ padding: "10px 12px", fontFamily: "var(--font-mono)" }}>{r.quant}</td>
                <td style={{ padding: "10px 12px" }}>
                  {r.outcome === "ok"
                    ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--status-success-deep)" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--status-success)" }}/>Control Passed</span>
                    : <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--status-danger-deep)" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--status-danger)" }}/>The IC is inhibited</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- VARIATION B — Report sub-screen (dark Westgards with floater) ----------
function ReportScreenB({ row, onBack, hoverFloater }) {
  const points = [
    { v: 34 }, { v: 33.5 }, { v: 33.8 }, { v: 33 }, { v: 33.2 },
    { v: 32.5 }, { v: 32.8 }, { v: 33 }, { v: 33.5 }, { v: 33.6 }, { v: 34 },
  ];
  const W = 1180, H = 320, padL = 56, padR = 24, padT = 24, padB = 32;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const xAt = (i) => padL + (innerW * i) / (points.length - 1);
  const yAt = (v) => padT + innerH * (1 - (v - 29) / (38 - 29));

  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--brand-teal-950)", color: "white", display: "flex", flexDirection: "column", fontFamily: "var(--font-sans)" }}>
      {/* Header — matches B's chrome */}
      <div style={{ padding: "20px 32px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, borderBottom: "1px solid var(--brand-teal-800)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} aria-label="Back" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--brand-teal-700)", background: "transparent", color: "#B5C7D0", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--brand-cyan-300)", letterSpacing: "0.05em" }}>
              <span style={{ opacity: 0.65 }}>All runs ›</span> {row.id}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "white", marginTop: 4, letterSpacing: "-0.01em" }}>
              {row.patient} <span style={{ marginLeft: 8, fontSize: 13, color: "#8FA9B5", fontWeight: 500 }}>{row.study}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <NotifChips row={row} compact/>
          <button className="vb-btn">{Icon.download} Export</button>
          <button className="vb-btn primary">Approve</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, padding: "14px 32px 0", borderBottom: "1px solid var(--brand-teal-800)" }}>
        {[["assay","Assay Summary"],["outcome","Outcome Summary"],["wg","Westgards"],["plate","Plate Map"]].map(([k,l]) => (
          <div key={k} style={{
            padding: "9px 16px", fontSize: 13, fontWeight: 600, borderRadius: "8px 8px 0 0",
            color: k === "wg" ? "var(--brand-teal-950)" : "#B5C7D0",
            background: k === "wg" ? "var(--brand-cyan-500)" : "transparent",
            cursor: "pointer", letterSpacing: "0.01em",
          }}>{l}</div>
        ))}
      </div>

      {/* Control selector + tools */}
      <div style={{ padding: "14px 32px 6px", display: "flex", alignItems: "center", gap: 12, fontSize: 12.5, color: "#8FA9B5" }}>
        <span style={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 10.5 }}>Select control</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", border: "1px solid var(--brand-teal-700)", background: "var(--brand-teal-900)", borderRadius: 8, fontSize: 12.5, color: "white", fontWeight: 500 }}>
          QVZVLPC, VZVQBL — QVZVQBL · default_instrument {Icon.chevDown}
        </span>
        <div style={{ flex: 1 }}/>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, border: "1px solid var(--brand-teal-700)", color: "var(--brand-cyan-300)", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17v4h4M21 7V3h-4M17 21h4v-4M3 3h4v4M9 9h6v6H9z"/></svg>
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 8, background: "var(--brand-cyan-500)", color: "var(--brand-teal-950)", cursor: "pointer" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </span>
      </div>

      {/* Chart */}
      <div style={{ margin: "10px 32px 0", borderRadius: 10, overflow: "hidden", border: "1px solid var(--brand-teal-800)", position: "relative", background: "var(--brand-teal-900)" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="320" style={{ display: "block" }} preserveAspectRatio="none">
          {/* Westgard zones (horizontal) */}
          <rect x={padL} y={padT} width={innerW} height={innerH * 0.18} fill="#65232B"/>
          <rect x={padL} y={padT + innerH * 0.18} width={innerW} height={innerH * 0.16} fill="#9C8C2B"/>
          <rect x={padL} y={padT + innerH * 0.34} width={innerW} height={innerH * 0.32} fill="#1F6845"/>
          <rect x={padL} y={padT + innerH * 0.66} width={innerW} height={innerH * 0.16} fill="#9C8C2B"/>
          <rect x={padL} y={padT + innerH * 0.82} width={innerW} height={innerH * 0.18} fill="#65232B"/>
          {/* Vertical column dividers */}
          {points.map((_, i) => (
            <line key={`v${i}`} x1={xAt(i)} x2={xAt(i)} y1={padT} y2={padT + innerH} stroke="#0A2231" strokeOpacity="0.55" strokeWidth="1"/>
          ))}
          {/* Y axis labels */}
          {[29,30,31,32,33,34,35,36,37,38].map(v => (
            <g key={`y${v}`}>
              <text x={padL - 8} y={yAt(v) + 3} fontSize="9.5" fill="#8FA9B5" textAnchor="end" fontFamily="var(--font-mono)">{v}</text>
              <line x1={padL} x2={padL + innerW} y1={yAt(v)} y2={yAt(v)} stroke="#0A2231" strokeOpacity="0.45" strokeWidth="0.6"/>
            </g>
          ))}
          {/* Sample line + points */}
          <polyline points={points.map((p,i) => `${xAt(i)},${yAt(p.v)}`).join(" ")} fill="none" stroke="#0ACFFE" strokeWidth="2"/>
          {points.map((p,i) => (
            <circle key={`p${i}`} cx={xAt(i)} cy={yAt(p.v)} r="4" fill="#0ACFFE" stroke="var(--brand-teal-950)" strokeWidth="1.5"/>
          ))}
          {/* X label */}
          <text x={W/2} y={H - 6} fontSize="10" fill="#8FA9B5" textAnchor="middle">Extraction Date · EZ — San Juan Capistrano CA</text>
          {/* Y title */}
          <text x={16} y={padT + innerH/2} fontSize="11" fill="#8FA9B5" textAnchor="middle" transform={`rotate(-90, 16, ${padT + innerH/2})`}>Ct</text>
          {/* Title strip */}
          <text x={padL + innerW * 0.5} y={padT + 10} fontSize="11" fill="#B5C7D0" textAnchor="middle" fontStyle="italic">Westgard settings have been changed for current controls</text>
        </svg>

        {/* Floater dialog */}
        {hoverFloater && (
          <div style={{
            position: "absolute", left: "44%", top: 18, width: 380,
            background: "var(--brand-teal-950)",
            border: "1px solid var(--brand-cyan-500)",
            borderRadius: 10,
            boxShadow: "0 12px 32px rgba(0,0,0,0.55)",
            padding: 14,
          }}>
            <div style={{ fontSize: 10.5, color: "var(--brand-cyan-300)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>Well A2 · Amplification</div>
            <svg viewBox="0 0 360 96" width="100%" height="80" style={{ display: "block" }}>
              <text x="6" y="14" fontSize="9" fill="#8FA9B5">1</text>
              <text x="6" y="36" fontSize="9" fill="#8FA9B5">0.75</text>
              <text x="6" y="58" fontSize="9" fill="#8FA9B5">0.5</text>
              <text x="6" y="80" fontSize="9" fill="#8FA9B5">0.25</text>
              <text x="6" y="92" fontSize="9" fill="#8FA9B5">0</text>
              <line x1="200" y1="6" x2="200" y2="88" stroke="#5F727C" strokeDasharray="2 2"/>
              <text x="206" y="14" fontSize="9" fill="#8FA9B5">Ct 31.5</text>
              <path d="M28,82 L60,81 L92,79 L124,75 L156,66 L188,50 L220,36 L252,28 L284,22 L320,20 L350,20" fill="none" stroke="#0ACFFE" strokeWidth="2"/>
            </svg>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--brand-teal-800)", display: "grid", gridTemplateColumns: "auto 1fr auto 1fr", gap: "5px 10px", fontSize: 11, color: "white" }}>
              <span style={{ color: "#8FA9B5" }}>Runfile:</span><b style={{ fontFamily: "var(--font-mono)" }}>wg22s_1st_wg12s</b>
              <span style={{ color: "#8FA9B5" }}>Ct:</span><b style={{ fontFamily: "var(--font-mono)" }}>31.599</b>
              <span style={{ color: "#8FA9B5" }}>Well:</span><b style={{ fontFamily: "var(--font-mono)" }}>A2</b>
              <span style={{ color: "#8FA9B5" }}>Quantity:</span><b style={{ fontFamily: "var(--font-mono)" }}>174</b>
              <span style={{ color: "#8FA9B5" }}>Uploaded:</span><b>27-08-2020, 1:15 am</b>
              <span style={{ color: "#8FA9B5" }}>Extracted:</span><b>27-08-2020, 1:15 am</b>
              <span style={{ color: "#8FA9B5" }}>Instrument:</span><b>default_instrument</b>
            </div>
          </div>
        )}
      </div>

      {/* Result table */}
      <div style={{ margin: "16px 32px 0", border: "1px solid var(--brand-teal-800)", borderRadius: 10, overflow: "hidden", background: "var(--brand-teal-900)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.18)", color: "#B5C7D0" }}>
              {["Mix","Well","Name","Sample role","Target","Class","CT","Quant","Outcome"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid var(--brand-teal-800)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { mix:"HDV", well:"A2", name:"QVZVLPC", role:"QVZVLPC", target:"QVZVQBL", cls:"HDV", ct:"28.540", quant:"173", outcome:"ok" },
              { mix:"HDV", well:"A2", name:"QVZVLPC", role:"QVZVLPC", target:"HDV", cls:"HDV", ct:"28.540", quant:"173", outcome:"ok" },
              { mix:"HDV", well:"A2", name:"QVZVLPC", role:"QVZVLPC", target:"QVZVQBL", cls:"HDV", ct:"28.540", quant:"173", outcome:"fail", flagged:true },
              { mix:"HDV", well:"A2", name:"QVZVLPC", role:"QVZVLPC", target:"HDV", cls:"HDV", ct:"28.540", quant:"173", outcome:"fail" },
            ].map((r,i) => (
              <tr key={i} style={{ borderBottom: i < 3 ? "1px solid var(--brand-teal-800)" : "none" }}>
                <td style={{ padding: "11px 12px", fontFamily: "var(--font-mono)", color: "white" }}>{r.mix}</td>
                <td style={{ padding: "11px 12px", color: "white" }}>{r.well}</td>
                <td style={{ padding: "11px 12px", color: "white" }}>{r.name}</td>
                <td style={{ padding: "11px 12px", color: "#B5C7D0" }}>{r.role}</td>
                <td style={{ padding: "11px 12px", color: "#B5C7D0" }}>{r.target}</td>
                <td style={{ padding: "11px 12px", color: "#B5C7D0" }}>{r.cls}</td>
                <td style={{ padding: "11px 12px", fontFamily: "var(--font-mono)", background: r.flagged ? "rgba(226,59,59,0.20)" : "transparent", color: r.flagged ? "#FF8C8C" : "white", fontWeight: r.flagged ? 700 : 400 }}>{r.ct}</td>
                <td style={{ padding: "11px 12px", fontFamily: "var(--font-mono)", color: "white" }}>{r.quant}</td>
                <td style={{ padding: "11px 12px" }}>
                  {r.outcome === "ok"
                    ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#67D89A", fontWeight: 600 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#67D89A" }}/>Control Passed</span>
                    : <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#FF8C8C", fontWeight: 600 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF8C8C" }}/>The IC is inhibited</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- AUTO-TOUR (Variation A — list → drawer → report → back) ----------
// 5s loop:
//   0.0s  list, idle
//   0.7s  click row 1 → drawer opens
//   1.7s  click "Open run →" → navigate to Report
//   2.6s  pause on Report
//   3.4s  cursor moves to Westgards floater
//   4.3s  click Back → list
const TOUR_A_KEYFRAMES = [
  { at: 0,    phase: "list",    target: { x: 6,  y: 96 } },
  { at: 500,  phase: "list",    target: { x: 30, y: 50 } },                // toward row 1
  { at: 700,  phase: "row1",    target: { x: 30, y: 50 }, click: true },   // click row 1 → drawer
  { at: 1500, phase: "row1",    target: { x: 86, y: 95 } },                // toward "Open run →"
  { at: 1700, phase: "report",  target: { x: 86, y: 95 }, click: true },   // click Open run
  { at: 2300, phase: "report",  target: { x: 70, y: 36 } },                // glide onto chart
  { at: 3300, phase: "report",  target: { x: 56, y: 38 } },                // hover over floater
  { at: 4000, phase: "report",  target: { x: 4,  y: 11 } },                // glide to back arrow
  { at: 4300, phase: "list",    target: { x: 4,  y: 11 }, click: true },   // click back
  { at: 5000, phase: "list",    target: { x: 4,  y: 11 } },                // loop
];
const TOUR_A_DURATION = 5000;
function useTourA(enabled) { return useTourEngine(enabled, TOUR_A_KEYFRAMES, TOUR_A_DURATION); }

// ---------- AUTO-TOUR (Variation B only) ----------
// 6s loop:  0.0s list · 0.7s click row 1 · 1.5s click row 4 · 2.2s back to row 1 · 2.7s click "Open run →"
//          · 3.0s report mounted · 3.8s glide to floater · 5.0s glide to back · 5.4s click back · 6.0s loop
const TOUR_B_KEYFRAMES = [
  { at: 0,    phase: "list",   target: { x: 6,  y: 96 } },
  { at: 500,  phase: "list",   target: { x: 18, y: 31 } },                  // toward row 1
  { at: 700,  phase: "row1",   target: { x: 18, y: 31 }, click: true },     // click row 1
  { at: 1300, phase: "row1",   target: { x: 18, y: 53 } },                  // glide to row 4
  { at: 1500, phase: "row4",   target: { x: 18, y: 53 }, click: true },     // click row 4
  { at: 2000, phase: "row4",   target: { x: 18, y: 31 } },                  // back toward row 1
  { at: 2200, phase: "row1",   target: { x: 18, y: 31 }, click: true },     // click row 1 again (settle)
  { at: 2500, phase: "row1",   target: { x: 92, y: 75 } },                  // glide to "Open run →"
  { at: 2700, phase: "report", target: { x: 92, y: 75 }, click: true },     // click Open run → report
  { at: 3500, phase: "report", target: { x: 56, y: 38 } },                  // glide onto chart / floater
  { at: 4800, phase: "report", target: { x: 56, y: 38 } },                  // dwell at floater
  { at: 5200, phase: "report", target: { x: 6,  y: 8 } },                   // glide to back arrow
  { at: 5500, phase: "list",   target: { x: 6,  y: 8 }, click: true },      // click back
  { at: 6000, phase: "list",   target: { x: 6,  y: 8 } },                   // loop
];
const TOUR_B_DURATION = 6000;
function useTourB(enabled) { return useTourEngine(enabled, TOUR_B_KEYFRAMES, TOUR_B_DURATION); }
const TourCursorB = (props) => <TourCursor {...props} strokeColor="#021F2C"/>;

// ---------- VARIATION B — bold dark, cards-on-rails ----------
function VariationB({ tour = true }) {
  const [sort, setSort] = useState({ key: "uploaded", dir: "desc" });
  const [active, setActive] = useState(null);
  const [reportRow, setReportRow] = useState(null);
  const [tourOn, setTourOn] = useState(tour);
  const tourState = useTourB(tourOn);

  const sorted = useMemo(() => {
    return [...ROWS].sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [sort]);

  // Drive `active` from tour phase (always, so manual ‹/› stepping changes screens too).
  useEffect(() => {
    if (tourState.phase === "list") { setActive(null); setReportRow(null); }
    else if (tourState.phase === "row1") { setActive(sorted[0]?.id ?? null); setReportRow(null); }
    else if (tourState.phase === "row4") { setActive(sorted[3]?.id ?? null); setReportRow(null); }
    else if (tourState.phase === "report") setReportRow(sorted[0] ?? null);
  }, [tourState.phase, sorted]);

  const toggleSort = (key) => setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
  const activeRow = sorted.find(r => r.id === active) || null;

  return (
    <div className="vb-frame" data-theme="dark" style={{ position: "relative" }}>
      <style>{`
        .vb-frame { font-family: var(--font-sans); background: var(--brand-teal-950); color: var(--neutral-50); width: 1240px; border-radius: 14px; overflow: hidden; border: 1px solid var(--brand-teal-800); }
        .vb-frame * { box-sizing: border-box; }
        .vb-head { padding: 24px 32px 20px; display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; border-bottom: 1px solid var(--brand-teal-800); }
        .vb-eyebrow { font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--brand-cyan-500); font-weight: 500; }
        .vb-title { font-size: 28px; font-weight: 700; letter-spacing: -0.02em; color: white; margin: 6px 0 0; }
        .vb-sub { font-size: 13px; color: #8FA9B5; margin-top: 4px; }
        .vb-stats { display: flex; gap: 32px; }
        .vb-stat .n { font-size: 24px; font-weight: 700; color: white; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
        .vb-stat .l { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #8FA9B5; }
        .vb-stat .n.danger { color: var(--status-danger); }
        .vb-stat .n.warn { color: var(--status-warning); }
        .vb-stat .n.success { color: var(--status-success); }

        .vb-toolbar { padding: 14px 32px; display: flex; gap: 10px; align-items: center; border-bottom: 1px solid var(--brand-teal-800); background: var(--brand-teal-900); }
        .vb-search { flex: 1; max-width: 360px; display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--brand-teal-800); border: 1px solid var(--brand-teal-700); border-radius: 6px; color: #8FA9B5; font-size: 13px; }
        .vb-search input { border: none; outline: none; background: transparent; font-family: inherit; font-size: 13px; flex: 1; color: white; }
        .vb-chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border: 1px solid var(--brand-teal-700); border-radius: 6px; font-size: 12.5px; color: #B5C7D0; background: var(--brand-teal-900); cursor: pointer; font-family: inherit; }
        .vb-chip:hover { border-color: var(--brand-cyan-500); color: white; }
        .vb-chip.active { border-color: var(--brand-cyan-500); color: var(--brand-cyan-300); background: rgba(10,207,254,0.08); }

        .vb-grid { display: grid; grid-template-columns: 1fr 380px; min-height: 580px; }
        .vb-list { border-right: 1px solid var(--brand-teal-800); }
        .vb-listhead { display: grid; grid-template-columns: 110px 130px 1fr 140px 130px; gap: 12px; padding: 10px 32px; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: #8FA9B5; font-weight: 500; border-bottom: 1px solid var(--brand-teal-800); }
        .vb-listhead span { cursor: pointer; user-select: none; display: inline-flex; align-items: center; gap: 4px; }
        .vb-listhead span:hover { color: white; }
        .vb-listhead span.sorted { color: var(--brand-cyan-500); }
        .vb-row { display: grid; grid-template-columns: 110px 130px 1fr 140px 130px; gap: 12px; padding: 16px 32px; border-bottom: 1px solid var(--brand-teal-800); cursor: pointer; align-items: center; position: relative; }
        .vb-row:hover { background: rgba(10,207,254,0.05); }
        .vb-row.active { background: rgba(10,207,254,0.10); }
        .vb-row.active::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--brand-cyan-500); }
        .vb-mono { font-family: var(--font-mono); font-size: 11.5px; color: #8FA9B5; }
        .vb-patient { font-weight: 600; color: white; font-size: 13.5px; }
        .vb-study { color: white; font-size: 13px; font-weight: 500; }
        .vb-mixes { display: flex; gap: 3px; margin-top: 4px; flex-wrap: wrap; }
        .vb-mixes span { font-size: 10px; font-weight: 600; padding: 1.5px 5px; border-radius: 3px; background: var(--brand-teal-800); color: #B5C7D0; }
        .vb-rowstatus { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
        .vb-bar { width: 100%; height: 4px; border-radius: 2px; background: var(--brand-teal-800); overflow: hidden; display: flex; }
        .vb-bar > span { height: 100%; }
        .vb-meta { font-size: 11px; color: #8FA9B5; }

        .vb-detail { background: var(--brand-teal-900); padding: 24px 28px; overflow: auto; }
        .vb-d-head { padding-bottom: 20px; border-bottom: 1px solid var(--brand-teal-800); }
        .vb-d-id { font-family: var(--font-mono); font-size: 11px; color: var(--brand-cyan-300); letter-spacing: 0.05em; }
        .vb-d-patient { font-size: 22px; font-weight: 700; color: white; margin: 6px 0 4px; letter-spacing: -0.01em; }
        .vb-d-study { font-size: 13px; color: #B5C7D0; }
        .vb-d-section { padding: 18px 0; border-bottom: 1px solid var(--brand-teal-800); }
        .vb-d-l { font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: #8FA9B5; margin-bottom: 8px; }
        .vb-d-v { font-size: 13px; color: white; line-height: 1.5; }
        .vb-d-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .vb-d-actions { display: flex; gap: 8px; padding-top: 18px; }
        .vb-btn { flex: 1; padding: 10px 14px; font-size: 13px; font-weight: 500; border-radius: 6px; border: 1px solid var(--brand-teal-700); background: transparent; color: white; cursor: pointer; font-family: inherit; display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
        .vb-btn:hover { border-color: var(--brand-cyan-500); }
        .vb-btn.primary { background: var(--brand-cyan-500); color: var(--brand-teal-950); border-color: var(--brand-cyan-500); font-weight: 700; }
        .vb-btn.primary:hover { background: var(--brand-cyan-300); border-color: var(--brand-cyan-300); }

        .vb-foot { padding: 14px 32px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #8FA9B5; border-top: 1px solid var(--brand-teal-800); background: var(--brand-teal-900); }
      `}</style>

      <div className="vb-head">
        <div>
          <div className="vb-eyebrow">pcr.ai · Run files</div>
          <h2 className="vb-title">Patient runs</h2>
          <div className="vb-sub">Live across 4 sites · synced 2 min ago</div>
        </div>
        <div className="vb-stats">
          <div className="vb-stat"><div className="n">{ROWS.length}</div><div className="l">Total</div></div>
          <div className="vb-stat"><div className="n danger">{ROWS.filter(r=>r.status==="reanalyze").length}</div><div className="l">Reanalyze</div></div>
          <div className="vb-stat"><div className="n warn">{ROWS.filter(r=>r.status==="review").length}</div><div className="l">Review</div></div>
          <div className="vb-stat"><div className="n success">{ROWS.filter(r=>r.status==="passed").length}</div><div className="l">Passed</div></div>
        </div>
      </div>

      <div className="vb-toolbar">
        <div className="vb-search">{Icon.search}<input placeholder="Search by patient, study, or run ID…"/></div>
        <button className="vb-chip active">All <span style={{ opacity: 0.7, fontSize: 11 }}>· {ROWS.length}</span></button>
        <button className="vb-chip">Reanalyze</button>
        <button className="vb-chip">Review</button>
        <button className="vb-chip">Passed</button>
        <div style={{ flex: 1 }}/>
        <button className="vb-chip">Site {Icon.chevDown}</button>
        <button className="vb-chip">Date {Icon.chevDown}</button>
      </div>

      <div className="vb-grid">
        <div className="vb-list">
          <div className="vb-listhead">
            <span className={sort.key==="id"?"sorted":""} onClick={()=>toggleSort("id")}>Run ID {Icon.sort}</span>
            <span className={sort.key==="patient"?"sorted":""} onClick={()=>toggleSort("patient")}>Patient {Icon.sort}</span>
            <span>Study</span>
            <span className={sort.key==="uploaded"?"sorted":""} onClick={()=>toggleSort("uploaded")}>Uploaded {sort.key==="uploaded"?(sort.dir==="asc"?Icon.sortAsc:Icon.sortDesc):Icon.sort}</span>
            <span>Status</span>
          </div>
          {sorted.map(r => {
            const total = r.q + r.r + r.w + r.g;
            const m = STATUS_META[r.status];
            return (
              <div key={r.id} className={`vb-row ${active===r.id?"active":""}`} onClick={() => setActive(r.id)}>
                <div className="vb-mono">{r.id}</div>
                <div>
                  <div className="vb-patient">{r.patient}</div>
                  <div className="vb-meta">{r.plate}</div>
                </div>
                <div>
                  <div className="vb-study">{r.study}</div>
                  <div className="vb-mixes">{r.mixes.map(x => <span key={x}>{x}</span>)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: "white" }}>{r.uploaded.split(" ")[0]}</div>
                  <div className="vb-meta">{r.uploaded.split(" ")[1]} · {r.uploader}</div>
                </div>
                <div className="vb-rowstatus">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: m.dot }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: m.dot }}/>{m.label}
                  </span>
                  {total > 0 && (
                    <div className="vb-bar">
                      {r.g>0 && <span style={{ width: `${r.g/total*100}%`, background: "var(--status-success)" }}/>}
                      {r.w>0 && <span style={{ width: `${r.w/total*100}%`, background: "var(--status-warning)" }}/>}
                      {r.r>0 && <span style={{ width: `${r.r/total*100}%`, background: "var(--status-danger)" }}/>}
                      {r.q>0 && <span style={{ width: `${r.q/total*100}%`, background: "var(--neutral-500)" }}/>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <aside className="vb-detail">
          {activeRow ? (
            <React.Fragment>
              <div className="vb-d-head" style={{ position: "relative" }}>
                <div className="vb-d-id">{activeRow.id}</div>
                <div className="vb-d-patient">{activeRow.patient}</div>
                <div className="vb-d-study">{activeRow.study}</div>
                <button
                  onClick={() => setActive(null)}
                  aria-label="Close detail"
                  style={{ position: "absolute", top: -2, right: -4, width: 28, height: 28, borderRadius: 6, border: "1px solid var(--brand-teal-700)", background: "transparent", color: "#B5C7D0", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{Icon.close}</button>
              </div>

              <div className="vb-d-section">
                <div className="vb-d-l">Status</div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: `color-mix(in srgb, ${STATUS_META[activeRow.status].dot} 18%, transparent)`, color: STATUS_META[activeRow.status].dot }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_META[activeRow.status].dot }}/>{STATUS_META[activeRow.status].label}
                </span>
                <div style={{ fontSize: 13, color: "#B5C7D0", marginTop: 8, lineHeight: 1.5 }}>{activeRow.statusNote}</div>
              </div>

              <div className="vb-d-section">
                <div className="vb-d-grid">
                  <div><div className="vb-d-l">Site</div><div className="vb-d-v">{activeRow.site}</div></div>
                  <div><div className="vb-d-l">Plate</div><div className="vb-d-v">{activeRow.plate}</div></div>
                  <div><div className="vb-d-l">Uploaded</div><div className="vb-d-v">{activeRow.uploaded}</div></div>
                  <div><div className="vb-d-l">By</div><div className="vb-d-v">{activeRow.uploader}</div></div>
                </div>
              </div>

              <div className="vb-d-section">
                <div className="vb-d-l">Mixes</div>
                <div className="vb-mixes">{activeRow.mixes.map(x => <span key={x}>{x}</span>)}</div>
              </div>

              <div className="vb-d-section">
                <div className="vb-d-l">Activity</div>
                <NotifChips row={activeRow}/>
              </div>

              <div className="vb-d-actions">
                <button className="vb-btn">{Icon.flag} Flag</button>
                <button className="vb-btn primary">Open run →</button>
              </div>
            </React.Fragment>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: 32, color: "#8FA9B5" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--brand-teal-800)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5FDCFC" strokeWidth="1.8"><path d="M9 5h11M9 12h11M9 19h11"/><circle cx="4" cy="5" r="1.4" fill="#5FDCFC" stroke="none"/><circle cx="4" cy="12" r="1.4" fill="#5FDCFC" stroke="none"/><circle cx="4" cy="19" r="1.4" fill="#5FDCFC" stroke="none"/></svg>
              </div>
              <div style={{ fontSize: 14, color: "white", fontWeight: 600 }}>Select a run</div>
              <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5 }}>Pick a row to see status, site,<br/>mixes and activity.</div>
            </div>
          )}
        </aside>
      </div>

      <div className="vb-foot">
        <div>{ROWS.length} runs · keyboard: ↑↓ to navigate, ⏎ to open</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button className="vb-chip">‹</button>
          <button className="vb-chip">1 / 3</button>
          <button className="vb-chip">›</button>
        </div>
      </div>
      <TourPill on={tourOn} onToggle={() => setTourOn(v => !v)} onPrev={() => { setTourOn(false); tourState.prev(); }} onNext={() => { setTourOn(false); tourState.next(); }} dark/>
      <style>{`@keyframes vb-tour-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } } @keyframes vbFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }`}</style>
      {reportRow && (
        <div style={{ position: "absolute", inset: 0, zIndex: 5, animation: "vbFade .35s ease both" }}>
          <ReportScreenB row={reportRow} onBack={() => setReportRow(null)} hoverFloater={tourState.phase === "report" && tourState.cursor.x < 70 && tourState.cursor.x > 30} />
        </div>
      )}
      <TourCursorB cursor={tourState.cursor} click={tourState.click && tourOn} clickAt={tourState.clickAt}/>
    </div>
  );
}

window.VariationA = VariationA;
window.VariationB = VariationB;
window.TourCursor = TourCursor;
window.TourPill = TourPill;
window.useTourEngine = useTourEngine;
