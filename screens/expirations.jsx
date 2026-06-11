/* Caducidades y mermas */
const ExpirationsScreen = ({ role }) => {
  const totalAtRisk = EXPIRING.reduce((s,e) => {
    const it = INVENTORY.find(i => i.sku === e.sku);
    return s + (it ? it.cost * e.qty : 0);
  }, 0);
  const totalWaste = WASTE_LOG.reduce((s,w) => s + w.cost, 0);

  return (
    <div className="content">
      <PageHead
        eyebrow="Caducidades · mermas"
        title="Caducidades y mermas"
        sub="Vigilancia de productos por vencer y bitácora de mermas"
        actions={<>
          <button className="btn"><Icon name="cal" size={14}/> Esta semana</button>
          {role === 'operator' && <button className="btn btn-primary"><Icon name="plus" size={14}/> Registrar merma</button>}
        </>}
      />

      <div className="row cols-4">
        <div className="card kpi">
          <div className="kpi-label">En riesgo · ≤ 5 días</div>
          <div className="kpi-value num">{EXPIRING.filter(e => e.severity !== 'muted').length}</div>
          <div className="kpi-target">Costo expuesto {fmtMXN(totalAtRisk)}</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Merma este mes</div>
          <div className="kpi-value"><span className="currency">$</span>{(totalWaste).toLocaleString('es-MX')}</div>
          <Delta value={-12.3} invert/>
        </div>
        <div className="card kpi">
          <div className="kpi-label">% de mermas / ventas</div>
          <div className="kpi-value">{fmtPct(0.8)}</div>
          <div className="kpi-target">Objetivo &lt; 1.0%</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Ahorro vs. mes anterior</div>
          <div className="kpi-value"><span className="currency">$</span>2,080</div>
          <div className="kpi-target">Por mejor rotación FIFO</div>
        </div>
      </div>

      <div className="row" style={{ gridTemplateColumns: '1.4fr 1fr', marginTop: 16 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Línea de caducidad</div>
              <div className="card-meta">Orden por días restantes · costo expuesto</div>
            </div>
          </div>
          <div className="timeline">
            {EXPIRING.map((e, i) => {
              const it = INVENTORY.find(x => x.sku === e.sku);
              const exposed = it ? it.cost * e.qty : 0;
              return (
                <React.Fragment key={i}>
                  <div className={'when ' + (e.severity)}>{e.when}</div>
                  <div className="body">
                    <div className="ti">{e.item} <span className="muted mono" style={{ fontSize: 11.5 }}>· {e.sku}</span></div>
                    <div className="sb">{e.qty} {e.unit} · {e.loc}</div>
                    <div className="meta">
                      <span className={'pill ' + (e.severity === 'danger' ? 'danger' : e.severity === 'warning' ? 'warning' : 'neutral')}>
                        <span className="dot"/>{fmtMXN(exposed)} en riesgo
                      </span>
                      {role === 'operator' && (
                        <>
                          <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11.5 }}>Marcar usado</button>
                          <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11.5 }}>Crear especial</button>
                        </>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Bitácora de mermas</div>
              <div className="card-meta">Últimos 7 días · {fmtMXN(totalWaste)}</div>
            </div>
          </div>

          <BarChart
            data={[2840, 2210, 1980, 1640, 1420, 1180, 880]}
            labels={['15','16','17','18','19','20','21']}
            color="var(--positive)"
            format={v => `$${(v/1000).toFixed(1)}k`}
            height={140}
          />

          <div className="divider"/>

          {WASTE_LOG.map((w, i) => (
            <div key={i} className="flex between" style={{ padding: '10px 0', borderBottom: i < WASTE_LOG.length - 1 ? '1px dashed var(--border)' : 0 }}>
              <div>
                <div style={{ fontSize: 13 }}>{w.item} · <span className="muted mono" style={{ fontSize: 11.5 }}>{w.qty} {w.unit}</span></div>
                <div className="sub" style={{ color: 'var(--muted)', fontSize: 11.5 }}>{w.reason} · {w.by} · {w.date}</div>
              </div>
              <div className="num" style={{ color: 'var(--danger)' }}>-{fmtMXN(w.cost)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
window.ExpirationsScreen = ExpirationsScreen;
