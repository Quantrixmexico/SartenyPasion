/* Reportes para socios */
const PartnersScreen = ({ role }) => {
  const totalDist = PARTNERS.reduce((s,p) => s + p.dist, 0);

  return (
    <div className="content">
      <PageHead
        eyebrow="Mayo 2026 · cierre preliminar"
        title="Reporte para socios"
        sub="Estado de resultados, distribución y notas operativas"
        actions={<>
          <button className="btn"><Icon name="cal" size={14}/> Mayo 2026</button>
          <button className="btn btn-primary"><Icon name="download" size={14}/> Descargar PDF</button>
        </>}
      />

      <div className="report-cover">
        <div>
          <div className="page-eyebrow">Resumen ejecutivo · período 01 — 21 May 2026</div>
          <div className="lead">
            Cerramos el mes con un <em>EBITDA</em> proyectado de <em>{fmtMXN(KPIS.month.ebitda, { short: true })}</em>, +4.2% vs. abril.
          </div>
          <div className="muted mt-4" style={{ fontSize: 13, maxWidth: 480 }}>
            Las ventas se mantienen 8.2% sobre meta, impulsadas por mayor ticket promedio y un mejor mix de canales. Food cost cerrará 0.9 puntos sobre objetivo por presión en pescados — se propone ajuste en porcionamiento de pulpo y aguachile.
          </div>
        </div>
        <div>
          <div className="card" style={{ background: 'var(--bg-2)', border: '1px solid var(--border-2)' }}>
            <div className="page-eyebrow">Distribución a socios</div>
            <div className="serif" style={{ fontSize: 38, lineHeight: 1, marginTop: 6 }}>{fmtMXN(totalDist, { short: true })}</div>
            <div className="muted" style={{ fontSize: 12 }}>Próxima dispersión: 30 Jun, 2026</div>
            <div className="divider"/>
            {PARTNERS.map((p, i) => (
              <div key={i} className="flex between" style={{ padding: '10px 0', borderBottom: i < PARTNERS.length-1 ? '1px dashed var(--border)' : 0 }}>
                <div className="flex gap-3 center">
                  <div className="av" style={{ background: i===0 ? 'var(--accent)' : i===1 ? '#B07F86' : '#6E8AAA', width: 32, height: 32, fontSize: 12 }}>{p.initials}</div>
                  <div>
                    <div style={{ fontSize: 13 }}>{p.name}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{p.role} · {p.share}%</div>
                  </div>
                </div>
                <div className="num" style={{ fontSize: 14 }}>{fmtMXN(p.dist)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row cols-3 mt-4">
        <div className="card kpi">
          <div className="kpi-label">Ventas mes</div>
          <div className="kpi-value"><span className="currency">$</span>{(KPIS.month.sales/1000000).toFixed(2)}M</div>
          <Delta value={8.2}/>
          <div className="kpi-target">vs. meta $ 2.00M · cierre proyectado $ 2.18M</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Margen operativo</div>
          <div className="kpi-value">{fmtPct(KPIS.month.margin)}</div>
          <Delta value={1.4}/>
          <div className="kpi-target">Saludable · arriba de promedio del sector (15.2%)</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Cash position</div>
          <div className="kpi-value"><span className="currency">$</span>412.6k</div>
          <Delta value={6.8}/>
          <div className="kpi-target">Runway operativo 47 días · reserva 1.6 meses OPEX</div>
        </div>
      </div>

      <div className="row" style={{ gridTemplateColumns: '1.4fr 1fr', marginTop: 16 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Estado de resultados · mayo 2026</div>
              <div className="card-meta">Cierre preliminar al 21 · proyección lineal</div>
            </div>
          </div>
          <table className="tbl">
            <tbody>
              {PL_ROWS.map((r, i) => (
                <tr key={i} style={{
                  background: r.kind === 'highlight' ? 'var(--accent-soft)' :
                              r.kind === 'sub' ? 'var(--surface-2)' : 'transparent'
                }}>
                  <td style={{
                    fontWeight: r.kind ? 600 : 400,
                    fontFamily: r.kind === 'highlight' ? "'Instrument Serif', serif" : 'inherit',
                    fontSize: r.kind === 'highlight' ? 18 : 13,
                    color: r.kind === 'highlight' ? 'var(--accent)' : 'var(--ink)',
                  }}>
                    {r.label}
                  </td>
                  <td className="right num" style={{
                    fontWeight: r.kind ? 600 : 400,
                    color: r.value < 0 ? 'var(--muted)' : r.kind === 'highlight' ? 'var(--accent)' : 'var(--ink)',
                    fontSize: r.kind === 'highlight' ? 17 : 13,
                  }}>
                    {fmtMXN(r.value)}
                  </td>
                  <td className="right num muted" style={{ width: 70 }}>
                    {r.pct !== undefined ? `${r.pct.toFixed(1)}%` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">Ventas vs. costos · 6 meses</div>
          <div className="card-meta">EBITDA en línea negra</div>
          <div className="mt-4" style={{ position: 'relative', height: 240 }}>
            <svg viewBox="0 0 600 240" style={{ width: '100%', height: '100%' }}>
              {/* grid */}
              {[0, 60, 120, 180, 240].map(y => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="var(--border)" strokeWidth="1" opacity="0.5"/>
              ))}
              {/* sales bars */}
              {MONTHLY_TREND.map((m, i) => {
                const max = 2000000;
                const w = 70;
                const x = i * 100 + 20;
                const h1 = (m.sales / max) * 220;
                const h2 = (m.costs / max) * 220;
                return (
                  <g key={i}>
                    <rect x={x} y={240 - h1} width={w/2 - 2} height={h1} fill="var(--accent)" opacity={i === MONTHLY_TREND.length-1 ? 1 : 0.5}/>
                    <rect x={x + w/2 + 2} y={240 - h2} width={w/2 - 2} height={h2} fill="var(--muted)" opacity={0.5}/>
                  </g>
                );
              })}
              {/* labels */}
              {MONTHLY_TREND.map((m, i) => (
                <text key={i} x={i * 100 + 55} y={236} fill="var(--faint)" fontSize="11" textAnchor="middle" fontFamily="JetBrains Mono">{m.m}</text>
              ))}
            </svg>
          </div>
          <div className="flex gap-3 mt-3">
            <div className="flex gap-2 center">
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)' }}/>
              <span className="muted" style={{ fontSize: 12 }}>Ventas</span>
            </div>
            <div className="flex gap-2 center">
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--muted)', opacity: 0.5 }}/>
              <span className="muted" style={{ fontSize: 12 }}>Costos</span>
            </div>
          </div>
          <div className="divider"/>
          <div className="flex between">
            <div>
              <div className="muted" style={{ fontSize: 11.5 }}>Mejor mes</div>
              <div className="serif" style={{ fontSize: 20 }}>Mayo · $1.84M</div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 11.5 }}>EBITDA YTD</div>
              <div className="serif" style={{ fontSize: 20 }}>$ 1.78M</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-title">Notas del operador en sitio</div>
        <div className="card-meta">Rodrigo Cárdenas · enviado 20 May, 19:42</div>
        <div className="divider"/>
        <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, lineHeight: 1.5, color: 'var(--ink-2)', maxWidth: 760 }}>
          "Mes sólido. La nueva carta de temporada movió bien — el risotto de huitlacoche está superando expectativas (+14% vs. forecast). Estamos viendo presión en pescados por el aumento del proveedor del Pacífico; voy a renegociar la próxima semana o probar con un proveedor de Ensenada. Necesitamos discutir la inversión en la barra del segundo piso — propongo revisar en la reunión del 30."
        </div>
      </div>
    </div>
  );
};
window.PartnersScreen = PartnersScreen;
