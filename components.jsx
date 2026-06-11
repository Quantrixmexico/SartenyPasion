/* Shared components */
const { useState, useEffect, useMemo, useRef } = React;

/* ICONS — minimal stroke set */
const Icon = ({ name, size = 16, ...p }) => {
  const s = { width: size, height: size, stroke: 'currentColor', fill: 'none', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>,
    cost:      <><path d="M12 2v20M16 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 1 1 0 7H7"/></>,
    inventory: <><path d="M21 8L12 3 3 8m18 0L12 13m9-5v8L12 21m-9-13l9 5m-9-5v8l9 5"/></>,
    expire:    <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    sales:     <><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
    bank:      <><path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M3 10L12 4l9 6"/></>,
    suppliers: <><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/></>,
    payroll:   <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 21a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M14 15a4 4 0 0 1 7.5 2"/></>,
    partners:  <><path d="M5 21V10l7-5 7 5v11"/><path d="M9 21v-7h6v7"/></>,
    bell:      <><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 8H4c0-2 2-3 2-8z"/><path d="M10 21h4"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>,
    search:    <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    plus:      <><path d="M12 5v14M5 12h14"/></>,
    download:  <><path d="M12 3v13M6 11l6 6 6-6M5 21h14"/></>,
    filter:    <><path d="M3 5h18l-7 9v6l-4-2v-4z"/></>,
    arrow_up:  <><path d="M7 14l5-5 5 5"/></>,
    arrow_dn:  <><path d="M7 10l5 5 5-5"/></>,
    arrow_rt:  <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    check:     <><path d="M5 12l4 4 10-10"/></>,
    x:         <><path d="M6 6l12 12M6 18L18 6"/></>,
    info:      <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></>,
    flag:      <><path d="M5 21V5m0 0h12l-2 4 2 4H5"/></>,
    box:       <><path d="M21 16V8l-9-5-9 5v8l9 5 9-5zM12 13L3 8M12 13l9-5M12 13v10"/></>,
    cal:       <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
    receipt:   <><path d="M5 3h14v18l-3-2-3 2-3-2-3 2-2-2zM9 8h6M9 12h6M9 16h4"/></>,
    sun:       <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    chat:      <><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/></>,
    chart:     <><path d="M3 3v18h18"/><path d="M7 14l3-3 3 3 4-5"/></>,
    alert:     <><path d="M12 3 2 21h20L12 3z"/><path d="M12 9v6"/><circle cx="12" cy="18" r="0.6" fill="currentColor"/></>,
    inbox:     <><path d="M3 13l3-9h12l3 9"/><path d="M3 13v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-5a3 3 0 0 1-6 0H3z"/></>,
    lock:      <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    unlock:    <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7-2.6"/></>,
    pencil:    <><path d="M16 3l5 5L8 21H3v-5z"/><path d="M14 5l5 5"/></>,
    link:      <><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>,
    dots:      <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
    archive:   <><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4"/></>,
    tag:       <><path d="M20.6 12.4l-9 9a1.5 1.5 0 0 1-2.1 0l-7-7a1.5 1.5 0 0 1-.4-1V4.5A1.5 1.5 0 0 1 3.6 3h8.9c.4 0 .7.2 1 .4l7.1 7.1c.6.6.6 1.5 0 2"/><circle cx="8" cy="8" r="1.4"/></>,
    flame:     <><path d="M12 2S6 7 6 13a6 6 0 0 0 12 0c0-2-1-3.6-2.6-5.1.1 1.2-.6 2.1-1.4 2.1 1-3-2-5-2-8z"/></>,
    table:     <><path d="M3 10h18"/><path d="M5 10V6h14v4"/><path d="M7 10v8M17 10v8"/></>,
    doc:       <><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h5"/></>,
    pos:       <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6"/><circle cx="12" cy="17" r="1"/></>,
    team:      <><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17.5" cy="9" r="2.2"/><path d="M16 14.6A4.5 4.5 0 0 1 21 19"/></>,
    timer:     <><circle cx="12" cy="13" r="8"/><path d="M12 13V9M9 2h6"/></>,
    chevron:   <><path d="M6 9l6 6 6-6"/></>,
    menu:      <><path d="M3 6h18M3 12h18M3 18h18"/></>,
  };
  return <svg viewBox="0 0 24 24" style={s} className={'icon ' + (p.className || '')}>{paths[name]}</svg>;
};

/* ----- SPARKLINE ----- */
const Sparkline = ({ data, color = 'var(--accent)', fill = true, height = 36 }) => {
  const w = 100, h = 100;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - ((v - min) / range) * h * 0.85 - 4]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = d + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg className="kpi-spark" width="100%" height={height} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {fill && <path d={area} fill={color} opacity="0.12"/>}
      <path d={d} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke"/>
    </svg>
  );
};

/* ----- LINE CHART ----- */
const LineChart = ({ data, labels, yTicks = 5, color = 'var(--accent)', height = 220, fill = true, format = v => v }) => {
  const W = 800, H = 240;
  const min = 0, max = Math.max(...data) * 1.15;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / (max - min)) * H
  ]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = d + ` L ${W} ${H} L 0 ${H} Z`;
  return (
    <div className="chart" style={{ height }}>
      <div className="chart-axis-y">
        {Array.from({ length: yTicks }).map((_, i) => {
          const t = max - (i / (yTicks - 1)) * (max - min);
          return <div key={i} style={{ top: `${(i / (yTicks - 1)) * 100}%`, transform: 'translateY(-50%)' }}>{format(t)}</div>;
        })}
      </div>
      <div className="chart-grid">
        {Array.from({ length: yTicks }).map((_, i) => (
          <div key={i} style={{ top: `${(i / (yTicks - 1)) * 100}%` }}/>
        ))}
      </div>
      <svg className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        {fill && <path d={area} fill={color} opacity="0.12"/>}
        <path d={d} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke"/>
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--bg)" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke"/>
        ))}
      </svg>
      <div className="chart-axis-x">
        {labels.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
};

/* ----- BAR CHART ----- */
const BarChart = ({ data, labels, color = 'var(--accent)', height = 220, format = v => v }) => {
  const max = Math.max(...data) * 1.1;
  return (
    <div className="chart" style={{ height }}>
      <div className="chart-axis-y">
        {[0,1,2,3,4].map(i => {
          const t = max - (i / 4) * max;
          return <div key={i} style={{ top: `${(i/4)*100}%`, transform: 'translateY(-50%)' }}>{format(t)}</div>;
        })}
      </div>
      <div className="chart-grid">
        {[0,1,2,3,4].map(i => <div key={i} style={{ top: `${(i/4)*100}%` }}/>)}
      </div>
      <div className="chart-svg" style={{ display: 'flex', alignItems: 'flex-end', gap: 6, padding: '0 4px' }}>
        {data.map((v, i) => (
          <div key={i} style={{ flex: 1, height: `${(v/max)*100}%`, background: color, borderRadius: '4px 4px 2px 2px', opacity: i === data.length - 1 ? 1 : 0.65 }}/>
        ))}
      </div>
      <div className="chart-axis-x">
        {labels.map((l, i) => <div key={i} style={{ flex: 1, textAlign: 'center' }}>{l}</div>)}
      </div>
    </div>
  );
};

/* ----- DONUT ----- */
const Donut = ({ data, total, centerValue, centerLabel, size = 140 }) => {
  const r = 56, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="donut" style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="18"/>
        {data.map((d, i) => {
          const len = (d.value / total) * c;
          const off = -acc;
          acc += len;
          return (
            <circle key={i}
              cx="70" cy="70" r={r}
              fill="none" stroke={d.color} strokeWidth="18"
              strokeDasharray={`${len} ${c}`}
              strokeDashoffset={off}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <div className="center">
        <div>
          <div className="v">{centerValue}</div>
          <div className="l">{centerLabel}</div>
        </div>
      </div>
    </div>
  );
};

/* ----- DELTA PILL ----- */
const Delta = ({ value, suffix = '%', invert = false }) => {
  const positive = invert ? value < 0 : value > 0;
  const cls = value === 0 ? '' : (positive ? 'up' : 'down');
  return (
    <span className={'kpi-delta ' + cls}>
      {value > 0 ? '▲' : value < 0 ? '▼' : '·'} {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
};

/* ----- KPI CARD ----- */
const KpiCard = ({ label, value, currency, delta, target, spark, sparkColor, deltaInvert }) => (
  <div className="card kpi lift">
    <div className="kpi-label">{label}</div>
    <div className="kpi-value">
      {currency && <span className="currency">$</span>}
      {value}
    </div>
    <div className="flex between center">
      {delta !== undefined && <Delta value={delta} invert={deltaInvert}/>}
      {target && <div className="kpi-target">{target}</div>}
    </div>
    {spark && <Sparkline data={spark} color={sparkColor || 'var(--accent)'} />}
  </div>
);

/* ----- PAGE HEAD ----- */
const PageHead = ({ eyebrow, title, sub, actions }) => (
  <div className="page-head">
    <div>
      {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
      <div className="page-title">{title}</div>
      {sub && <div className="page-sub">{sub}</div>}
    </div>
    {actions && <div className="page-actions">{actions}</div>}
  </div>
);

/* ----- SEGMENTED ----- */
const Segmented = ({ value, onChange, options }) => (
  <div className="segmented">
    {options.map(o => (
      <button key={o.value} className={value === o.value ? 'on' : ''} onClick={() => onChange(o.value)}>{o.label}</button>
    ))}
  </div>
);

/* ----- TABS ----- */
const Tabs = ({ value, onChange, tabs }) => (
  <div className="tabs">
    {tabs.map(t => (
      <button key={t.value} className={value === t.value ? 'on' : ''} onClick={() => onChange(t.value)}>
        {t.label}{t.count !== undefined && <span className="cnt">{t.count}</span>}
      </button>
    ))}
  </div>
);

/* expose */
Object.assign(window, {
  Icon, Sparkline, LineChart, BarChart, Donut, Delta, KpiCard, PageHead, Segmented, Tabs
});
