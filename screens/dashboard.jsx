/* Dashboard ejecutivo */
const DashboardScreen = ({ role }) => {
  const k = KPIS.today;
  const labels = ['8 May','','10','','12','','14','15','','17','','19','','21'];

  return (
    <div className="content">
      <PageHead
        eyebrow="Hoy · jueves 21 de mayo, 2026"
        title={role === 'partner' ? 'Vista ejecutiva' : 'Operación del día'}
        sub={role === 'partner' ? 'Resumen consolidado para socios — KPIs, tendencias y alertas críticas' : 'Tiempo real — turno actual, pendientes y prioridades'}
        actions={<>
          <button className="btn btn-ghost"><Icon name="cal" size={14}/> 21 May, 2026</button>
          <button className="btn"><Icon name="download" size={14}/> Exportar</button>
          {role === 'operator' && <button className="btn btn-primary"><Icon name="plus" size={14}/> Acción rápida</button>}
        </>}
      />

      {/* KPI row */}
      <div className="row cols-4">
        <KpiCard
          label="Ventas hoy"
          value={fmtMXN(k.sales).replace('$','')}
          currency
          delta={k.salesDelta}
          target="Meta diaria $ 90,000"
          spark={SALES_TREND}
        />
        <KpiCard
          label="Food cost"
          value={fmtPct(k.foodCost)}
          delta={k.foodCost - k.foodTarget}
          deltaInvert
          target={`Objetivo ${fmtPct(k.foodTarget)}`}
          spark={[28.4, 29.1, 30.2, 29.8, 30.5, 31.0, 31.8]}
          sparkColor="var(--danger)"
        />
        <KpiCard
          label="Labor cost"
          value={fmtPct(k.laborCost)}
          delta={k.laborCost - k.laborTarget}
          deltaInvert
          target={`Objetivo ${fmtPct(k.laborTarget)}`}
          spark={[25.8, 25.4, 25.1, 24.9, 24.8, 24.7, 24.6]}
          sparkColor="var(--positive)"
        />
        <KpiCard
          label="Margen operativo"
          value={fmtPct(k.margin)}
          delta={k.marginDelta}
          target="vs. semana pasada"
          spark={[21.1, 20.4, 19.8, 19.6, 19.0, 18.9, 18.4]}
        />
      </div>

      {/* Sales trend + Channels */}
      <div className="row" style={{ gridTemplateColumns: '1.7fr 1fr' }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Ventas — últimos 14 días</div>
              <div className="card-meta">Pico jueves 15: $102.3k · Promedio diario $80.1k</div>
            </div>
            <Segmented value="14d" onChange={()=>{}} options={[
              {value:'7d', label:'7d'}, {value:'14d', label:'14d'}, {value:'30d', label:'30d'}, {value:'90d', label:'90d'}
            ]}/>
          </div>
          <LineChart
            data={SALES_TREND}
            labels={labels}
            format={v => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`}
            height={220}
          />
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Ventas por canal</div>
              <div className="card-meta">Hoy · 6 canales activos</div>
            </div>
          </div>
          <div className="donut-wrap">
            <Donut
              data={CHANNELS_TODAY.map(c => ({ value: c.amount, color: c.color }))}
              total={CHANNELS_TODAY.reduce((s,c) => s+c.amount, 0)}
              centerValue={fmtMXN(CHANNELS_TODAY.reduce((s,c) => s+c.amount, 0), { short: true })}
              centerLabel="Total hoy"
              size={140}
            />
            <div className="legend">
              {CHANNELS_TODAY.map(c => (
                <div className="legend-row" key={c.id}>
                  <span className="sw" style={{ background: c.color }}/>
                  <span className="nm">{c.name}</span>
                  <span className="v">{fmtMXN(c.amount, { short: true })}</span>
                  <span className="pct">{c.share.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Operación en vivo — tiempo cocina, rotación, ocupación */}
      <div className="row cols-4">
        {(() => {
          const oc = OPERATION_KPIS;
          return <>
            <KpiCard label={oc.cookTime.label}   value={oc.cookTime.value + '′'}  delta={oc.cookTime.delta}  deltaInvert target={oc.cookTime.note}  spark={oc.cookTime.spark}  sparkColor="var(--positive)"/>
            <KpiCard label={oc.tableTurns.label} value={oc.tableTurns.value + 'x'} delta={oc.tableTurns.delta}             target={oc.tableTurns.note} spark={oc.tableTurns.spark}/>
            <KpiCard label={oc.occupancy.label}  value={oc.occupancy.value + '%'}  delta={oc.occupancy.delta}             target={oc.occupancy.note}  spark={oc.occupancy.spark}  sparkColor="var(--warning)"/>
            <KpiCard label={oc.dwellTime.label}  value={oc.dwellTime.value + '′'}  delta={oc.dwellTime.delta}  deltaInvert target={oc.dwellTime.note}  spark={oc.dwellTime.spark}/>
          </>;
        })()}
      </div>

      {/* Ventas por categoría + Ocupación por zona */}
      <div className="row" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Ventas por categoría</div>
              <div className="card-meta">Hoy · {SALES_BY_CATEGORY.length} categorías de menú</div>
            </div>
          </div>
          <div className="donut-wrap">
            <Donut
              data={SALES_BY_CATEGORY.map(c => ({ value: c.amount, color: c.color }))}
              total={SALES_BY_CATEGORY.reduce((s,c) => s+c.amount, 0)}
              centerValue={fmtMXN(SALES_BY_CATEGORY.reduce((s,c) => s+c.amount, 0), { short: true })}
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

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Ocupación por zona</div>
              <div className="card-meta">Mesas ocupadas · tiempo real · 21:05</div>
            </div>
            <a className="btn-ghost btn" onClick={() => window.__navigate && window.__navigate('pos')}>Ir a POS</a>
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
            <div className="sb-row" style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 2 }}>
              <div className="sb-label" style={{ color: 'var(--ink)' }}>Total</div>
              <div className="sb-bar">
                <span style={{ width: (TABLES.filter(t=>t.status==='seated'||t.status==='bill').length / TABLES.length * 100) + '%', background: 'var(--accent)' }}/>
              </div>
              <div className="sb-val mono" style={{ color: 'var(--ink)' }}>
                {TABLES.filter(t=>t.status==='seated'||t.status==='bill').length}/{TABLES.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts grid */}
      <div className="row cols-3">
        <div className="alert-card danger">
          <div className="ico"><Icon name="expire"/></div>
          <div>
            <div className="t">3 SKUs caducan en ≤ 2 días</div>
            <div className="s">Robalo (hoy) · Huitlacoche (mañana) · $ 1,696 en costo</div>
          </div>
          <Icon name="arrow_rt" size={14}/>
        </div>
        <div className="alert-card">
          <div className="ico"><Icon name="suppliers"/></div>
          <div>
            <div className="t">2 pagos a proveedores vencidos</div>
            <div className="s">Lácteos La Esperanza · $ 6,280 · vencido hace 1 día</div>
          </div>
          <Icon name="arrow_rt" size={14}/>
        </div>
        <div className="alert-card info">
          <div className="ico"><Icon name="cost"/></div>
          <div>
            <div className="t">Food cost 1.8 pts sobre objetivo</div>
            <div className="s">Pulpo y aguachile arrastran el costo · revisar porciones</div>
          </div>
          <Icon name="arrow_rt" size={14}/>
        </div>
      </div>

      {/* Bottom row: Top dishes + Activity */}
      <div className="row" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Platillos más vendidos hoy</div>
              <div className="card-meta">Ordenado por unidades · margen sobre precio</div>
            </div>
            <a className="btn-ghost btn">Ver menú completo</a>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Platillo</th>
                <th className="right">Vendidos</th>
                <th className="right">Precio</th>
                <th className="right">Food cost</th>
                <th className="right">Margen</th>
                <th className="right">vs. ayer</th>
              </tr>
            </thead>
            <tbody>
              {TOP_DISHES.slice(0, 6).map((d, i) => (
                <tr key={i}>
                  <td>{d.name}</td>
                  <td className="right num">{d.sold}</td>
                  <td className="right num">${d.price}</td>
                  <td className="right num">{fmtPct(d.foodCost)}</td>
                  <td className="right">
                    <span className={'pill ' + (d.margin > 70 ? 'positive' : d.margin > 60 ? 'accent' : 'warning')}>
                      <span className="dot"/>{fmtPct(d.margin)}
                    </span>
                  </td>
                  <td className="right num" style={{ color: d.trend > 0 ? 'var(--positive)' : 'var(--danger)' }}>
                    {d.trend > 0 ? '+' : ''}{d.trend}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Actividad reciente</div>
              <div className="card-meta">Eventos del día · todos los módulos</div>
            </div>
          </div>
          <div className="activity">
            {ACTIVITY.map((a, i) => (
              <div className="activity-row" key={i}>
                <div className="dot" style={{
                  background: a.who === 'finanzas' ? 'var(--accent)' :
                              a.who === 'inventario' ? 'var(--warning)' :
                              a.who === 'cocina' ? 'var(--positive)' : 'var(--muted)'
                }}/>
                <div>
                  <div className="t">{a.t}</div>
                  <div className="s">{a.s}</div>
                </div>
                <div className="when">{a.when}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats for operator */}
      {role === 'operator' && (
        <div className="row cols-4">
          <div className="card kpi">
            <div className="kpi-label">Comensales hoy</div>
            <div className="kpi-value num">{k.covers}</div>
            <Delta value={k.coversDelta}/>
          </div>
          <div className="card kpi">
            <div className="kpi-label">Ticket promedio</div>
            <div className="kpi-value"><span className="currency">$</span>{k.ticket}</div>
            <Delta value={k.ticketDelta}/>
          </div>
          <div className="card kpi">
            <div className="kpi-label">Personal en piso</div>
            <div className="kpi-value num">7<span style={{ fontSize: 18, color: 'var(--muted)' }}>/9</span></div>
            <div className="kpi-target">2 fuera de turno · 1 retraso</div>
          </div>
          <div className="card kpi">
            <div className="kpi-label">Mesas ocupadas</div>
            <div className="kpi-value num">14<span style={{ fontSize: 18, color: 'var(--muted)' }}>/22</span></div>
            <div className="kpi-target">Lista de espera: 0</div>
          </div>
        </div>
      )}

      {role === 'partner' && (
        <div className="row cols-4">
          <div className="card kpi">
            <div className="kpi-label">Caja disponible</div>
            <div className="kpi-value"><span className="currency">$</span>{(k.cash/1000).toFixed(1)}k</div>
            <div className="kpi-target">Runway operativo: {k.runway} días</div>
          </div>
          <div className="card kpi">
            <div className="kpi-label">Ventas mes</div>
            <div className="kpi-value"><span className="currency">$</span>{(KPIS.month.sales/1000000).toFixed(2)}M</div>
            <div className="kpi-target">92.1% de meta mensual</div>
          </div>
          <div className="card kpi">
            <div className="kpi-label">EBITDA proyectado</div>
            <div className="kpi-value"><span className="currency">$</span>{(KPIS.month.ebitda/1000).toFixed(0)}k</div>
            <Delta value={4.2}/>
          </div>
          <div className="card kpi">
            <div className="kpi-label">Próxima distribución</div>
            <div className="kpi-value serif" style={{ fontSize: 24 }}>30 Jun</div>
            <div className="kpi-target">Reserva acumulada $ 354k</div>
          </div>
        </div>
      )}
    </div>
  );
};
window.DashboardScreen = DashboardScreen;
