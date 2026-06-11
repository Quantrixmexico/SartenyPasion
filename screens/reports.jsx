/* Reportes — granulares por hora, mesero, producto y food cost trend
   Complementa Ventas por canal y Dashboard con desglose ejecutivo.
*/
const ReportsScreen = ({ role, navigate }) => {
  const [tab, setTab] = useState('hourly');

  // totals
  const hourTotal = HOURLY_HEATMAP.data.flat().reduce((a, b) => a + b, 0);
  const serverTotal = SERVER_PERFORMANCE.reduce((s, x) => s + x.sales, 0);
  const productTotal = PRODUCT_REPORT.reduce((s, p) => s + p.sales, 0);
  const productSold  = PRODUCT_REPORT.reduce((s, p) => s + p.sold,  0);

  const tabs = [
    { value: 'hourly',   label: 'Por hora · día',   icon: 'cal' },
    { value: 'category', label: 'Por categoría',     icon: 'tag' },
    { value: 'operation',label: 'Operación',          icon: 'timer' },
    { value: 'servers',  label: 'Por mesero',        icon: 'team' },
    { value: 'products', label: 'Por producto',      icon: 'tag' },
    { value: 'foodcost', label: 'Food cost trend',   icon: 'cost' },
  ];

  return (
    <div className="content">
      <PageHead
        eyebrow="Analítica · operación granular"
        title="Reportes ejecutivos"
        sub="Ventas por hora · desempeño por mesero · platillos por velocidad y margen · evolución de food cost"
        actions={<>
          <button className="btn"><Icon name="cal" size={14}/> Esta semana</button>
          <button className="btn"><Icon name="download" size={14}/> Exportar PDF</button>
          <button className="btn" onClick={() => navigate && navigate('partners')}>
            <Icon name="partners" size={14}/> Reporte a socios
          </button>
        </>}
      />

      {/* Quick KPIs */}
      <div className="row cols-4">
        <div className="card kpi">
          <div className="kpi-label">Ventas semana</div>
          <div className="kpi-value"><span className="currency">$</span>{(hourTotal/1000).toFixed(0)}k</div>
          <div className="kpi-target">vs semana anterior +9.2%</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Mejor hora del día</div>
          <div className="kpi-value serif" style={{ fontSize: 26 }}>21:00</div>
          <div className="kpi-target">Pico viernes y sábado</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Mesero top</div>
          <div className="kpi-value serif" style={{ fontSize: 22 }}>Paola N.</div>
          <div className="kpi-target">{fmtMXN(142800, { short: true })} · ticket prom. $776</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Food cost · semana</div>
          <div className="kpi-value num" style={{ color: 'var(--warning)' }}>31.8%</div>
          <div className="kpi-target">Meta 30% · +1.8 pp · alza de mariscos</div>
        </div>
      </div>

      <Tabs value={tab} onChange={setTab} tabs={tabs.map(t => ({ value: t.value, label: t.label }))}/>

      {tab === 'hourly'   && <HourlyHeatmap/>}
      {tab === 'category' && <CategoryReport/>}
      {tab === 'operation'&& <OperationReport/>}
      {tab === 'servers'  && <ServerLeaderboard role={role}/>}
      {tab === 'products' && <ProductReport navigate={navigate}/>}
      {tab === 'foodcost' && <FoodCostTrendView/>}
    </div>
  );
};

/* ============================================================
   HEATMAP HORA × DÍA
   ============================================================ */
const HourlyHeatmap = () => {
  const max = Math.max(...HOURLY_HEATMAP.data.flat());
  const min = Math.min(...HOURLY_HEATMAP.data.flat().filter(v => v > 0));

  const heat = (v) => {
    if (v === 0) return { bg: 'var(--surface-2)', color: 'var(--faint)' };
    const t = (v - min) / (max - min);   // 0..1
    // mix from positive-soft to accent
    const alpha = 0.15 + 0.75 * t;
    return {
      bg: `color-mix(in srgb, var(--accent) ${(alpha * 100).toFixed(0)}%, transparent)`,
      color: t > 0.6 ? 'var(--bg)' : 'var(--ink)'
    };
  };

  // totals per day, per hour
  const dayTotals = HOURLY_HEATMAP.data.map(row => row.reduce((a,b) => a+b, 0));
  const hourTotals = HOURLY_HEATMAP.hours.map((_, hi) =>
    HOURLY_HEATMAP.data.reduce((sum, row) => sum + row[hi], 0)
  );

  return (
    <>
      <div className="card" style={{ padding: 20 }}>
        <div className="flex between" style={{ marginBottom: 14 }}>
          <div>
            <div className="section-title">Ventas por hora y día (MXN)</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Identifica horas pico, valles de servicio y oportunidades de personal
            </div>
          </div>
          <div className="heat-legend">
            <span style={{ fontSize: 10.5, color: 'var(--muted)' }}>$0</span>
            <div className="heat-legend-bar">
              {[0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1].map((t, i) => (
                <span key={i} style={{ background: `color-mix(in srgb, var(--accent) ${(0.15 + 0.75 * t) * 100}%, transparent)` }}/>
              ))}
            </div>
            <span className="num" style={{ fontSize: 10.5, color: 'var(--muted)' }}>{fmtMXN(max, { short: true })}</span>
          </div>
        </div>

        <div className="heatmap-wrap">
          <div className="heatmap" style={{ gridTemplateColumns: `60px repeat(${HOURLY_HEATMAP.hours.length}, 1fr) 80px` }}>
            {/* Header */}
            <div className="hm-corner"></div>
            {HOURLY_HEATMAP.hours.map((h, i) => (
              <div key={i} className="hm-hour mono">{h}:00</div>
            ))}
            <div className="hm-corner mono">Día</div>

            {/* Rows */}
            {HOURLY_HEATMAP.days.map((d, di) => (
              <React.Fragment key={di}>
                <div className="hm-day">{d}</div>
                {HOURLY_HEATMAP.data[di].map((v, hi) => {
                  const style = heat(v);
                  return (
                    <div key={hi}
                         className="hm-cell"
                         style={{ background: style.bg, color: style.color }}
                         title={`${d} ${HOURLY_HEATMAP.hours[hi]}:00 · ${fmtMXN(v)}`}>
                      {v > 0 && <span className="hm-val mono">{(v/1000).toFixed(1)}</span>}
                    </div>
                  );
                })}
                <div className="hm-total mono">{fmtMXN(dayTotals[di], { short: true })}</div>
              </React.Fragment>
            ))}

            {/* Footer */}
            <div className="hm-corner mono">Hora</div>
            {hourTotals.map((t, hi) => (
              <div key={hi} className="hm-total mono">{fmtMXN(t, { short: true })}</div>
            ))}
            <div className="hm-corner"></div>
          </div>
        </div>
      </div>

      <div className="row cols-2 mt-4">
        <div className="card">
          <div className="card-head">
            <div className="section-title">Insights</div>
          </div>
          <div className="insight-list">
            <Insight kind="pos" t="Pico nocturno consolidado"
              d="Vie–sáb 20:00–21:00 concentran 38% de la semana. Reforzar bar y caja en esas franjas."/>
            <Insight kind="warn" t="Domingo después de las 16:00 cae"
              d="80% de las ventas del domingo ocurren antes de las 16. Considerar cierre temprano o promo vespertina."/>
            <Insight kind="pos" t="Brunch dominical sostenido"
              d="Domingo 13–15 promedia $8.7k/h. Mantener equipo completo de garde manger."/>
            <Insight kind="neg" t="Lunes valle entre comida y cena"
              d="16–18h promedia &lt;$1k/h. Probar happy hour mejorado o cocina cerrada parcial."/>
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <div className="section-title">Distribución por servicio</div>
          </div>
          <div className="service-bars">
            {[
              { l: 'Comida (13-17)', v: 0.42, c: 'var(--accent)' },
              { l: 'Happy hour (17-19)', v: 0.18, c: 'var(--warning)' },
              { l: 'Cena (19-23)', v: 0.32, c: 'var(--positive)' },
              { l: 'Cierre (23+)',  v: 0.08, c: 'var(--muted)' },
            ].map((b, i) => (
              <div key={i} className="sb-row">
                <div className="sb-label">{b.l}</div>
                <div className="sb-bar">
                  <span style={{ width: (b.v * 100) + '%', background: b.c }}/>
                </div>
                <div className="sb-val mono">{(b.v * 100).toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Insight = ({ kind, t, d }) => (
  <div className="insight-row">
    <span className={'insight-pip ' + kind}/>
    <div>
      <div className="t">{t}</div>
      <div className="s">{d}</div>
    </div>
  </div>
);

/* ============================================================
   LEADERBOARD MESEROS
   ============================================================ */
const ServerLeaderboard = ({ role }) => {
  const total = SERVER_PERFORMANCE.reduce((s, x) => s + x.sales, 0);
  const max = Math.max(...SERVER_PERFORMANCE.map(s => s.sales));
  return (
    <div className="card" style={{ padding: 0 }}>
      <div className="card-head" style={{ padding: '18px 20px 14px' }}>
        <div>
          <div className="section-title">Desempeño por mesero · semana</div>
          <div className="muted" style={{ fontSize: 12 }}>
            Ventas, ticket promedio, propinas y banderas operativas
          </div>
        </div>
        <div className="muted" style={{ fontSize: 12 }}>
          Total {fmtMXN(total)}
        </div>
      </div>
      <table className="tbl server-tbl">
        <thead>
          <tr>
            <th style={{ paddingLeft: 20 }}>#</th>
            <th>Mesero</th>
            <th className="right">Ventas</th>
            <th>Share</th>
            <th className="right">Tickets</th>
            <th className="right">Ticket prom.</th>
            <th className="right">Propinas %</th>
            <th className="right">Cancelaciones</th>
            <th className="right">Comps · MXN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {SERVER_PERFORMANCE.map((s, i) => {
            const share = (s.sales / total * 100);
            const isTop = i === 0;
            return (
              <tr key={i}>
                <td className="num" style={{ paddingLeft: 20, color: 'var(--muted)' }}>
                  {isTop ? <span className="trophy">★</span> : (i + 1)}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="srv-av" style={{ background: s.color }}>{s.initials}</div>
                    <div>
                      <div>{s.name}</div>
                      <div className="sub">
                        {s.flag && <span className="pill warning" style={{ fontSize: 10, marginRight: 6 }}>
                          <span className="dot"/>{s.flag}
                        </span>}
                        {s.note || `${s.tickets} órdenes esta semana`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="right num serif" style={{ fontSize: 17 }}>{fmtMXN(s.sales, { short: true })}</td>
                <td>
                  <div className="srv-bar">
                    <span style={{ width: (s.sales / max * 100) + '%', background: s.color }}/>
                  </div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)' }}>
                    {share.toFixed(1)}%
                  </div>
                </td>
                <td className="right num">{s.tickets}</td>
                <td className="right num">{fmtMXN(s.avgTicket)}</td>
                <td className="right num" style={{
                  color: s.tipPct >= 14 ? 'var(--positive)' : s.tipPct >= 11 ? 'var(--muted)' : 'var(--warning)'
                }}>
                  {s.tipPct.toFixed(1)}%
                </td>
                <td className="right num" style={{ color: s.voids >= 3 ? 'var(--danger)' : 'var(--muted)' }}>
                  {s.voids || '—'}
                </td>
                <td className="right num muted">{s.comps ? fmtMXN(s.comps) : '—'}</td>
                <td className="right" style={{ paddingRight: 20 }}>
                  <button className="btn btn-ghost" style={{ padding: 4 }}>
                    <Icon name="arrow_rt" size={12}/>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 20, fontSize: 12, color: 'var(--muted)' }}>
        <span><Icon name="info" size={12}/> Eduardo M. acumula 4 cancelaciones · revisar con gerente</span>
        <span style={{ marginLeft: 'auto' }}>
          Promedio ticket general: <b style={{ color: 'var(--ink)' }}>{fmtMXN(total / SERVER_PERFORMANCE.reduce((s,x)=>s+x.tickets,0))}</b>
        </span>
      </div>
    </div>
  );
};

/* ============================================================
   PRODUCTOS — TOP MOVERS + ENGINEERING MATRIX
   ============================================================ */
const ProductReport = ({ navigate }) => {
  const total = PRODUCT_REPORT.reduce((s, p) => s + p.sales, 0);
  const maxSold = Math.max(...PRODUCT_REPORT.map(p => p.sold));

  // Menu engineering quadrants:
  // popularity high/low (by sold) · margin high/low (by marginPct)
  const popMedian = 23;  // sold
  const marMedian = 70;  // margin %
  const classify = (p) => {
    const hPop = p.sold >= popMedian;
    const hMar = p.margin >= marMedian;
    if (hPop && hMar)   return { q: 'star',     l: 'Estrella',      cls: 'positive' };
    if (hPop && !hMar)  return { q: 'workhorse',l: 'Caballo carga',cls: 'accent' };
    if (!hPop && hMar)  return { q: 'puzzle',   l: 'Rompecabezas', cls: 'warning' };
    return                       { q: 'dog',     l: 'Perro',         cls: 'danger' };
  };
  const rows = PRODUCT_REPORT.map(p => ({ ...p, ...classify(p) }));
  const quad = { star: [], workhorse: [], puzzle: [], dog: [] };
  rows.forEach(r => quad[r.q].push(r));

  return (
    <>
      <div className="card" style={{ padding: 0 }}>
        <div className="card-head" style={{ padding: '18px 20px 14px' }}>
          <div>
            <div className="section-title">Platillos · ranking por ventas</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {PRODUCT_REPORT.length} platillos · {PRODUCT_REPORT.reduce((s,p)=>s+p.sold,0)} servidos · {fmtMXN(total)} total
            </div>
          </div>
          <button className="btn" onClick={() => navigate && navigate('menu')}>
            <Icon name="link" size={13}/> Ver carta
          </button>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ paddingLeft: 20 }}>Platillo</th>
              <th className="right">Servidos</th>
              <th>Velocidad</th>
              <th className="right">Ingreso</th>
              <th className="right">Food cost</th>
              <th className="right">Margen %</th>
              <th>Clasificación</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={i} onClick={() => navigate && navigate('menu')} style={{ cursor: 'pointer' }}>
                <td style={{ paddingLeft: 20 }}>
                  <div>{p.name}</div>
                  <div className="sub">{p.cat}</div>
                </td>
                <td className="right num">{p.sold}</td>
                <td>
                  <div className="prod-bar">
                    <span style={{
                      width: (p.sold / maxSold * 100) + '%',
                      background: p.cls === 'positive' ? 'var(--positive)' : p.cls === 'accent' ? 'var(--accent)' : p.cls === 'warning' ? 'var(--warning)' : 'var(--danger)'
                    }}/>
                  </div>
                </td>
                <td className="right num">{fmtMXN(p.sales)}</td>
                <td className="right num muted">{p.foodCost.toFixed(1)}%</td>
                <td className="right num" style={{
                  color: p.margin >= 70 ? 'var(--positive)' : p.margin >= 60 ? 'var(--muted)' : 'var(--warning)'
                }}>
                  {p.margin.toFixed(1)}%
                </td>
                <td><span className={'pill ' + p.cls}><span className="dot"/>{p.l}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MENU ENGINEERING MATRIX */}
      <div className="card mt-4" style={{ padding: 20 }}>
        <div className="flex between">
          <div>
            <div className="section-title">Menu engineering · cuadrantes</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Popularidad (eje X) vs margen (eje Y) · estrategia por cuadrante
            </div>
          </div>
        </div>
        <div className="quad-grid">
          <Quadrant title="Estrellas" sub="Alta venta · alto margen · proteger y promover" cls="positive" items={quad.star}/>
          <Quadrant title="Caballos de carga" sub="Alta venta · bajo margen · subir precio o reducir costo" cls="accent" items={quad.workhorse}/>
          <Quadrant title="Rompecabezas" sub="Baja venta · alto margen · empujar con sugerencia de mesero" cls="warning" items={quad.puzzle}/>
          <Quadrant title="Perros" sub="Baja venta · bajo margen · evaluar retiro" cls="danger" items={quad.dog}/>
        </div>
      </div>
    </>
  );
};

const Quadrant = ({ title, sub, cls, items }) => (
  <div className={'quad ' + cls}>
    <div className="quad-head">
      <div className="quad-title">{title}</div>
      <span className={'pill ' + cls}><span className="dot"/>{items.length}</span>
    </div>
    <div className="quad-sub">{sub}</div>
    <div className="quad-items">
      {items.length === 0 && <div className="muted" style={{ fontSize: 12 }}>— sin platillos —</div>}
      {items.map((p, i) => (
        <div key={i} className="quad-item">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="t">{p.name}</div>
            <div className="s">{p.sold} servidos · margen {p.margin.toFixed(0)}%</div>
          </div>
          <div className="num serif">{fmtMXN(p.sales, { short: true })}</div>
        </div>
      ))}
    </div>
  </div>
);

/* ============================================================
   FOOD COST TREND
   ============================================================ */
const FoodCostTrendView = () => {
  const max = Math.max(...FOOD_COST_TREND.map(t => t.pct));
  const min = Math.min(...FOOD_COST_TREND.map(t => t.pct));
  const target = FOOD_COST_TREND[0].target;
  const W = 720, H = 220, P = 30;
  const xStep = (W - P * 2) / (FOOD_COST_TREND.length - 1);
  const yScale = (v) => H - P - ((v - (min - 1)) / ((max + 1) - (min - 1))) * (H - P * 2);

  const path = FOOD_COST_TREND.map((t, i) =>
    `${i === 0 ? 'M' : 'L'} ${P + i * xStep} ${yScale(t.pct)}`
  ).join(' ');

  const area = path + ` L ${P + (FOOD_COST_TREND.length - 1) * xStep} ${H - P} L ${P} ${H - P} Z`;

  const maxCat = Math.max(...FOOD_COST_BY_CAT.map(c => c.pct));

  return (
    <>
      <div className="card" style={{ padding: 20 }}>
        <div className="flex between" style={{ marginBottom: 14 }}>
          <div>
            <div className="section-title">Food cost · últimas 12 semanas</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Meta {target}% · variación significa cambios en precios de insumos o desperdicio
            </div>
          </div>
          <div className="flex gap-3">
            <Legend color="var(--accent)" label="Food cost real"/>
            <Legend color="var(--positive)" label="Meta" dashed/>
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          {/* grid */}
          {[28, 30, 32, 34].map(g => (
            <g key={g}>
              <line x1={P} x2={W-P} y1={yScale(g)} y2={yScale(g)} stroke="var(--border)" strokeDasharray="2 4"/>
              <text x={P-4} y={yScale(g)+3} fill="var(--faint)" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">{g}%</text>
            </g>
          ))}
          {/* target line */}
          <line x1={P} x2={W-P} y1={yScale(target)} y2={yScale(target)} stroke="var(--positive)" strokeWidth="1.5" strokeDasharray="4 4"/>
          {/* area */}
          <path d={area} fill="var(--accent)" opacity="0.12"/>
          {/* line */}
          <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2"/>
          {/* points */}
          {FOOD_COST_TREND.map((t, i) => {
            const cx = P + i * xStep, cy = yScale(t.pct);
            const overTarget = t.pct > target;
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="4" fill={overTarget ? 'var(--warning)' : 'var(--positive)'} stroke="var(--bg)" strokeWidth="2"/>
                <text x={cx} y={H - 12} fill="var(--faint)" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono">{t.w}</text>
                {(i === FOOD_COST_TREND.length - 1) && (
                  <text x={cx + 10} y={cy + 3} fill="var(--accent)" fontSize="11" fontWeight="500">{t.pct}%</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="row cols-2 mt-4">
        <div className="card">
          <div className="card-head">
            <div className="section-title">Food cost por categoría</div>
            <div className="muted" style={{ fontSize: 12 }}>vs meta</div>
          </div>
          <div className="cat-bars">
            {FOOD_COST_BY_CAT.map((c, i) => {
              const overTarget = c.vsTarget > 0;
              return (
                <div key={i} className="cat-row">
                  <div className="cat-label">{c.cat}</div>
                  <div className="cat-bar">
                    <span style={{
                      width: (c.pct / maxCat * 100) + '%',
                      background: overTarget ? 'var(--warning)' : 'var(--positive)'
                    }}/>
                  </div>
                  <div className="cat-pct num">{c.pct.toFixed(1)}%</div>
                  <div className={'cat-delta mono ' + (overTarget ? 'danger' : 'positive')}>
                    {overTarget ? '+' : ''}{c.vsTarget.toFixed(1)} pp
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="section-title">Acciones sugeridas</div>
          </div>
          <div className="insight-list">
            <Insight kind="warn" t="Mariscos +8.1 pp sobre meta"
              d="Veda y alza de Pescados del Pacífico. Considerar reducir frecuencia de Robalo a la sal en cena entre semana."/>
            <Insight kind="warn" t="Carnes +4.2 pp sobre meta"
              d="Lomo Angus subió 1.7%. Evaluar pasar alza al menú o cambiar corte secundario en el tartar."/>
            <Insight kind="pos" t="Verduras y lácteos por debajo de meta"
              d="Compensan parcialmente. Buen desempeño de La Hoja Verde como proveedor preferido."/>
            <Insight kind="pos" t="Promedio últimas 6 semanas: 30.9%"
              d="Aún cerca de meta. Revisión de costo estándar trimestral programada para 1 jun."/>
          </div>
        </div>
      </div>
    </>
  );
};

const Legend = ({ color, label, dashed }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--muted)' }}>
    <span style={{
      width: 14, height: 2, background: dashed ? 'transparent' : color,
      borderTop: dashed ? `2px dashed ${color}` : 'none'
    }}/>
    {label}
  </div>
);

/* ============================================================
   VENTAS POR CATEGORÍA
   ============================================================ */
const CategoryReport = () => {
  const total = SALES_BY_CATEGORY.reduce((s, c) => s + c.amount, 0);
  const maxA = Math.max(...SALES_BY_CATEGORY.map(c => c.amount));
  return (
    <div className="row" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
      <div className="card">
        <div className="card-head">
          <div>
            <div className="section-title" style={{ margin: 0 }}>Mezcla del día</div>
            <div className="muted" style={{ fontSize: 12 }}>{fmtMXN(total)} en {SALES_BY_CATEGORY.length} categorías</div>
          </div>
        </div>
        <div className="donut-wrap" style={{ marginTop: 8 }}>
          <Donut
            data={SALES_BY_CATEGORY.map(c => ({ value: c.amount, color: c.color }))}
            total={total}
            centerValue={fmtMXN(total, { short: true })}
            centerLabel="Total hoy"
            size={140}
          />
          <div className="legend">
            {SALES_BY_CATEGORY.map(c => (
              <div className="legend-row" key={c.cat}>
                <span className="sw" style={{ background: c.color }}/>
                <span className="nm">{c.cat}</span>
                <span className="v">{fmtMXN(c.amount, { short: true })}</span>
                <span className="pct">{c.share.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="card-head" style={{ padding: '18px 20px 14px' }}>
          <div>
            <div className="section-title" style={{ margin: 0 }}>Ranking por categoría · vs. ayer</div>
            <div className="muted" style={{ fontSize: 12 }}>Ingreso, participación y tendencia diaria</div>
          </div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ paddingLeft: 20 }}>Categoría</th>
              <th>Participación</th>
              <th className="right">Ingreso</th>
              <th className="right">Share</th>
              <th className="right">vs. ayer</th>
            </tr>
          </thead>
          <tbody>
            {SALES_BY_CATEGORY.map((c, i) => (
              <tr key={i}>
                <td style={{ paddingLeft: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: c.color }}/>
                    {c.cat}
                  </div>
                </td>
                <td>
                  <div className="prod-bar" style={{ width: 160 }}>
                    <span style={{ width: (c.amount / maxA * 100) + '%', background: c.color }}/>
                  </div>
                </td>
                <td className="right num serif" style={{ fontSize: 16 }}>{fmtMXN(c.amount)}</td>
                <td className="right num muted">{c.share.toFixed(1)}%</td>
                <td className="right num" style={{ color: c.delta >= 0 ? 'var(--positive)' : 'var(--danger)' }}>
                  {c.delta >= 0 ? '+' : ''}{c.delta.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ============================================================
   OPERACIÓN — tiempo de cocina, rotación, ocupación por zona
   ============================================================ */
const OperationReport = () => {
  const oc = OPERATION_KPIS;
  const maxAvg = Math.max(...KDS_STATIONS.map(s => s.avg));
  return (
    <>
      <div className="row cols-4">
        <KpiCard label={oc.cookTime.label}   value={oc.cookTime.value + '′'}  delta={oc.cookTime.delta}  deltaInvert target={oc.cookTime.note}  spark={oc.cookTime.spark}  sparkColor="var(--positive)"/>
        <KpiCard label={oc.tableTurns.label} value={oc.tableTurns.value + 'x'} delta={oc.tableTurns.delta}             target={oc.tableTurns.note} spark={oc.tableTurns.spark}/>
        <KpiCard label={oc.occupancy.label}  value={oc.occupancy.value + '%'}  delta={oc.occupancy.delta}             target={oc.occupancy.note}  spark={oc.occupancy.spark}  sparkColor="var(--warning)"/>
        <KpiCard label={oc.dwellTime.label}  value={oc.dwellTime.value + '′'}  delta={oc.dwellTime.delta}  deltaInvert target={oc.dwellTime.note}  spark={oc.dwellTime.spark}/>
      </div>

      <div className="row cols-2 mt-4">
        <div className="card">
          <div className="card-head">
            <div className="section-title" style={{ margin: 0 }}>Ocupación por zona</div>
            <div className="muted" style={{ fontSize: 12 }}>Mesas ocupadas ahora</div>
          </div>
          <div className="service-bars">
            {TABLE_ZONES.map(z => {
              const ts = TABLES.filter(t => t.zone === z);
              const occ = ts.filter(t => t.status === 'seated' || t.status === 'bill').length;
              const pct = occ / ts.length;
              return (
                <div key={z} className="sb-row">
                  <div className="sb-label">{z}</div>
                  <div className="sb-bar">
                    <span style={{ width: (pct * 100) + '%', background: pct > 0.8 ? 'var(--danger)' : pct > 0.5 ? 'var(--accent)' : 'var(--positive)' }}/>
                  </div>
                  <div className="sb-val mono">{occ}/{ts.length}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="section-title" style={{ margin: 0 }}>Tiempo promedio por estación</div>
            <div className="muted" style={{ fontSize: 12 }}>Ticket → pase · objetivo ≤ 15′</div>
          </div>
          <div className="cat-bars">
            {KDS_STATIONS.map((s, i) => {
              const over = s.avg > 15;
              return (
                <div key={i} className="cat-row" style={{ gridTemplateColumns: '90px 1fr 48px 64px' }}>
                  <div className="cat-label">{s.label}</div>
                  <div className="cat-bar">
                    <span style={{ width: (s.avg / maxAvg * 100) + '%', background: over ? 'var(--warning)' : s.color }}/>
                  </div>
                  <div className="cat-pct num">{s.avg.toFixed(1)}′</div>
                  <div className={'cat-delta mono ' + (over ? 'danger' : 'positive')}>
                    {s.active} act.
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-head">
          <div className="section-title" style={{ margin: 0 }}>Lectura operativa</div>
        </div>
        <div className="insight-list">
          <Insight kind="pos" t="Tiempo de cocina por debajo de meta"
            d="Promedio 14.2′ vs objetivo 15′. Parrilla es el cuello de botella a 18.2′ — revisar mise en place del pulpo y el robalo."/>
          <Insight kind="warn" t="Estancia 6′ sobre objetivo"
            d="96′ promedio sentado→cuenta. Mesas P1 y P3 superan 100′; ofrecer cuenta proactiva para subir rotación."/>
          <Insight kind="pos" t="Rotación al alza (+0.2x)"
            d="2.4 vueltas por turno. Liberar S7 (limpieza) y T4 sube la capacidad del pico de 21:00."/>
        </div>
      </div>
    </>
  );
};

window.ReportsScreen = ReportsScreen;
