/* Ingresos / Ventas por canal */
const SalesScreen = ({ role }) => {
  const total = CHANNELS_TODAY.reduce((s,c) => s+c.amount, 0);

  return (
    <div className="content">
      <PageHead
        eyebrow="Ingresos · ventas"
        title="Ventas por canal"
        sub="Análisis de revenue por origen de pedido · hoy y mes en curso"
        actions={<>
          <Segmented value="hoy" onChange={()=>{}} options={[
            {value:'hoy', label:'Hoy'},{value:'sem', label:'Semana'},{value:'mes', label:'Mes'}
          ]}/>
          <button className="btn"><Icon name="download" size={14}/> Exportar</button>
        </>}
      />

      <div className="row" style={{ gridTemplateColumns: '1fr 1.4fr' }}>
        <div className="card">
          <div className="card-head">
            <div className="card-title">Mix de canales — hoy</div>
            <div className="card-meta">{CHANNELS_TODAY.length} activos</div>
          </div>
          <div className="donut-wrap">
            <Donut
              data={CHANNELS_TODAY.map(c => ({ value: c.amount, color: c.color }))}
              total={total}
              centerValue={fmtMXN(total, { short: true })}
              centerLabel="Total"
              size={180}
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

        <div className="card">
          <div className="card-head">
            <div className="card-title">Comparativo — mes en curso</div>
            <div className="card-meta">vs. mes anterior · {fmtMXN(KPIS.month.sales)} acumulado</div>
          </div>
          <LineChart
            data={MONTHLY_TREND.map(m => m.sales)}
            labels={MONTHLY_TREND.map(m => m.m)}
            color="var(--accent)"
            format={v => `$${(v/1000000).toFixed(1)}M`}
            height={240}
          />
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-head">
          <div className="card-title">Detalle por canal</div>
          <div className="card-meta">Comisiones, tiempo de depósito y ticket promedio</div>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Canal</th>
              <th className="right">Ventas hoy</th>
              <th className="right">% mix</th>
              <th className="right">Ticket prom.</th>
              <th className="right">Comisión</th>
              <th className="right">Neto</th>
              <th>Depósito</th>
              <th className="right">vs. ayer</th>
            </tr>
          </thead>
          <tbody>
            {[
              { ...CHANNELS_TODAY[0], commission: 2.8,  net: 46880, deposit: 'T+1 · Banamex',     ticket: 624 },
              { ...CHANNELS_TODAY[1], commission: 0,    net: 12410, deposit: 'Inmediato · efectivo', ticket: 412 },
              { ...CHANNELS_TODAY[2], commission: 30,   net:  6874, deposit: 'T+7 · STP MIT',     ticket: 386 },
              { ...CHANNELS_TODAY[3], commission: 30,   net:  5537, deposit: 'T+7 · STP',         ticket: 412 },
              { ...CHANNELS_TODAY[4], commission: 28,   net:  2534, deposit: 'T+14 · BBVA',       ticket: 348 },
              { ...CHANNELS_TODAY[5], commission: 0,    net:  2430, deposit: 'Adelantado',        ticket: 1215 },
            ].map((c, i) => (
              <tr key={i}>
                <td>
                  <div className="flex gap-2 center">
                    <div className="channel-card" style={{ padding: 0, background: 'transparent', border: 0, gridTemplateColumns: '28px 1fr' }}>
                      <div className="ico" style={{ width: 28, height: 28, background: c.color + '22', color: c.color, fontSize: 14 }}>{c.icon}</div>
                      <div className="nm">{c.name}</div>
                    </div>
                  </div>
                </td>
                <td className="right num">{fmtMXN(c.amount)}</td>
                <td className="right num">{c.share.toFixed(1)}%</td>
                <td className="right num">${c.ticket}</td>
                <td className="right num" style={{ color: c.commission > 0 ? 'var(--danger)' : 'var(--muted)' }}>
                  {c.commission > 0 ? `${c.commission}%` : '—'}
                </td>
                <td className="right num">{fmtMXN(c.net)}</td>
                <td className="muted" style={{ fontSize: 12 }}>{c.deposit}</td>
                <td className="right num" style={{ color: c.delta >= 0 ? 'var(--positive)' : 'var(--danger)' }}>
                  {c.delta > 0 ? '+' : ''}{c.delta.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row cols-3 mt-4">
        <div className="card">
          <div className="card-title">Hora pico · hoy</div>
          <div className="serif" style={{ fontSize: 34, marginTop: 8 }}>14:30 — 15:30</div>
          <div className="muted" style={{ fontSize: 12 }}>$ 18,420 en una hora · 28 órdenes</div>
          <BarChart
            data={[2100, 1840, 3210, 8420, 18420, 9100, 4200, 5400, 11200, 14800, 8900, 6440]}
            labels={['13','14','15','16','17','18','19','20','21','22','23','24']}
            color="var(--accent)"
            format={v => `$${(v/1000).toFixed(0)}k`}
            height={120}
          />
        </div>
        <div className="card">
          <div className="card-title">Conversión por canal</div>
          <div className="serif" style={{ fontSize: 34, marginTop: 8 }}>72.4%</div>
          <div className="muted" style={{ fontSize: 12 }}>De cotización a venta cerrada</div>
          <div className="mt-3">
            {[
              ['Salón',       96.1, '#D89757'],
              ['Para llevar', 88.4, '#B07F86'],
              ['Rappi',       64.2, '#7E9C6E'],
              ['Uber Eats',   58.8, '#6E8AAA'],
            ].map((r, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div className="flex between" style={{ fontSize: 12 }}>
                  <span>{r[0]}</span>
                  <span className="num">{r[1].toFixed(1)}%</span>
                </div>
                <div className="bar mt-2"><span style={{ width: r[1] + '%', background: r[2] }}/></div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Día más fuerte (mes)</div>
          <div className="serif" style={{ fontSize: 34, marginTop: 8 }}>Sábado 17</div>
          <div className="muted" style={{ fontSize: 12 }}>$ 124,800 · 198 comensales</div>
          <div className="divider"/>
          <div className="flex between" style={{ fontSize: 13 }}>
            <span className="muted">Días sobre meta</span>
            <span className="num">14 / 21</span>
          </div>
          <div className="flex between mt-2" style={{ fontSize: 13 }}>
            <span className="muted">Días bajo meta</span>
            <span className="num">7 / 21</span>
          </div>
          <div className="flex between mt-2" style={{ fontSize: 13 }}>
            <span className="muted">Récord mensual</span>
            <span className="num">$ 2.04 M</span>
          </div>
        </div>
      </div>
    </div>
  );
};
window.SalesScreen = SalesScreen;
