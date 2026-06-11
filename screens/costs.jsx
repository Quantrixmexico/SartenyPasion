/* Control de costos */
const CostsScreen = ({ role }) => {
  const [tab, setTab] = useState('dishes');

  return (
    <div className="content">
      <PageHead
        eyebrow="Costos · análisis mensual"
        title="Control de costos"
        sub="Food cost y labor cost por receta, categoría y turno"
        actions={<>
          <Segmented value="mes" onChange={()=>{}} options={[
            {value:'sem', label:'Semana'},{value:'mes', label:'Mes'},{value:'tri', label:'Trimestre'}
          ]}/>
          <button className="btn"><Icon name="download" size={14}/> Exportar</button>
        </>}
      />

      <div className="row cols-4">
        <div className="card kpi">
          <div className="kpi-label">Food cost mes</div>
          <div className="kpi-value">{fmtPct(KPIS.month.foodCost)}</div>
          <div className="flex between center">
            <Delta value={0.9} invert/>
            <div className="kpi-target">Objetivo 30.0%</div>
          </div>
          <div className="meter mt-3">
            <div className="barwrap">
              <div className="fill" style={{ width: '77.3%' }}/>
              <div className="target" style={{ left: '75%' }}/>
            </div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Labor cost mes</div>
          <div className="kpi-value">{fmtPct(KPIS.month.laborCost)}</div>
          <div className="flex between center">
            <Delta value={-0.9} invert/>
            <div className="kpi-target">Objetivo 26.0%</div>
          </div>
          <div className="meter mt-3">
            <div className="barwrap">
              <div className="fill" style={{ width: '62.8%', background: 'var(--positive)' }}/>
              <div className="target" style={{ left: '65%' }}/>
            </div>
          </div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Prime cost</div>
          <div className="kpi-value">{fmtPct(56.0)}</div>
          <div className="flex between center">
            <Delta value={0.4} invert/>
            <div className="kpi-target">Saludable &lt; 60%</div>
          </div>
          <Sparkline data={[57.8, 57.2, 56.9, 56.4, 56.1, 56.2, 56.0]} color="var(--accent)"/>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Mermas mes</div>
          <div className="kpi-value"><span className="currency">$</span>14,820</div>
          <div className="flex between center">
            <Delta value={-12.3} invert/>
            <div className="kpi-target">0.8% de ventas</div>
          </div>
          <Sparkline data={[18200, 17800, 17100, 16400, 15900, 15200, 14820]} color="var(--positive)"/>
        </div>
      </div>

      <div className="card mt-4">
        <Tabs value={tab} onChange={setTab} tabs={[
          { value: 'dishes',   label: 'Por platillo',  count: TOP_DISHES.length },
          { value: 'category', label: 'Por categoría', count: 6 },
          { value: 'labor',    label: 'Mano de obra',  count: STAFF.length },
        ]}/>

        {tab === 'dishes' && (
          <table className="tbl">
            <thead>
              <tr>
                <th>Platillo</th>
                <th className="right">Precio</th>
                <th className="right">Costo unitario</th>
                <th>Food cost vs objetivo</th>
                <th className="right">Margen</th>
                <th className="right">Vendidos hoy</th>
                <th className="right">Contribución mes</th>
              </tr>
            </thead>
            <tbody>
              {TOP_DISHES.map((d, i) => {
                const cost = (d.price * d.foodCost / 100).toFixed(0);
                const overTarget = d.foodCost > 32;
                return (
                  <tr key={i}>
                    <td>
                      <div>{d.name}</div>
                      <div className="sub">SKU MENU-{(100 + i)}</div>
                    </td>
                    <td className="right num">${d.price}</td>
                    <td className="right num">${cost}</td>
                    <td style={{ width: '24%' }}>
                      <div className="meter" style={{ marginTop: 0 }}>
                        <div className="label num">{fmtPct(d.foodCost)}</div>
                        <div className="vals">obj. 30%</div>
                        <div className="barwrap" style={{ marginTop: 6 }}>
                          <div className="fill" style={{ width: `${Math.min(100, d.foodCost*2)}%`, background: overTarget ? 'var(--danger)' : 'var(--accent)' }}/>
                          <div className="target" style={{ left: '60%' }}/>
                        </div>
                      </div>
                    </td>
                    <td className="right num">{fmtPct(d.margin)}</td>
                    <td className="right num">{d.sold}</td>
                    <td className="right num">{fmtMXN(d.price * d.sold * 28, { short: true })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {tab === 'category' && (
          <table className="tbl">
            <thead>
              <tr>
                <th>Categoría</th>
                <th className="right">Costo mes</th>
                <th className="right">% Ventas</th>
                <th>Tendencia (8 sem)</th>
                <th className="right">vs. objetivo</th>
              </tr>
            </thead>
            <tbody>
              {[
                { c: 'Carnes',    cost: 184300, pct: 32.4, trend: [31.2, 31.8, 32.4, 33.1, 32.8, 32.6, 32.4, 32.4], target: 30 },
                { c: 'Pescados',  cost: 142100, pct: 36.8, trend: [35.1, 35.4, 35.8, 36.4, 36.6, 36.8, 36.8, 36.8], target: 34 },
                { c: 'Verduras',  cost:  68400, pct: 22.4, trend: [24.1, 23.6, 23.2, 22.9, 22.6, 22.4, 22.4, 22.4], target: 24 },
                { c: 'Lácteos',   cost:  28900, pct: 18.4, trend: [19.2, 19.0, 18.8, 18.6, 18.5, 18.4, 18.4, 18.4], target: 20 },
                { c: 'Vinos',     cost:  84200, pct: 28.1, trend: [27.4, 27.8, 28.0, 28.2, 28.1, 28.1, 28.1, 28.1], target: 28 },
                { c: 'Secos',     cost:  48500, pct: 14.2, trend: [15.1, 14.8, 14.6, 14.4, 14.3, 14.2, 14.2, 14.2], target: 15 },
              ].map((r, i) => (
                <tr key={i}>
                  <td>{r.c}</td>
                  <td className="right num">{fmtMXN(r.cost)}</td>
                  <td className="right num">{fmtPct(r.pct)}</td>
                  <td style={{ width: 220 }}><Sparkline data={r.trend} color={r.pct > r.target ? 'var(--danger)' : 'var(--positive)'} height={28}/></td>
                  <td className="right">
                    <span className={'pill ' + (r.pct > r.target ? 'danger' : 'positive')}>
                      <span className="dot"/>{(r.pct - r.target > 0 ? '+' : '')}{(r.pct - r.target).toFixed(1)} pts
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'labor' && (
          <div>
            <div className="row cols-2 mt-3">
              <div className="card" style={{ background: 'var(--surface-2)' }}>
                <div className="card-title">Costo de nómina · mes</div>
                <div className="kpi-value mt-2">{fmtMXN(452100)}</div>
                <div className="muted" style={{ fontSize: 12 }}>25.1% sobre ventas netas · objetivo 26.0%</div>
                <div className="divider"/>
                <div className="flex between">
                  <span className="muted">Cocina</span>
                  <span className="num">{fmtMXN(238400)}</span>
                </div>
                <div className="bar mt-2"><span style={{ width: '52%' }}/></div>
                <div className="flex between mt-3">
                  <span className="muted">Piso (meseros + hostess)</span>
                  <span className="num">{fmtMXN(124800)}</span>
                </div>
                <div className="bar mt-2"><span style={{ width: '28%', background: '#B07F86' }}/></div>
                <div className="flex between mt-3">
                  <span className="muted">Gerencia y bar</span>
                  <span className="num">{fmtMXN(64200)}</span>
                </div>
                <div className="bar mt-2"><span style={{ width: '14%', background: '#7E9C6E' }}/></div>
                <div className="flex between mt-3">
                  <span className="muted">Lavaloza y limpieza</span>
                  <span className="num">{fmtMXN(24700)}</span>
                </div>
                <div className="bar mt-2"><span style={{ width: '6%', background: '#6E8AAA' }}/></div>
              </div>
              <div className="card" style={{ background: 'var(--surface-2)' }}>
                <div className="card-title">Horas trabajadas · semana en curso</div>
                <BarChart
                  data={[342, 388, 410, 432, 478, 512, 401]}
                  labels={['L','M','X','J','V','S','D']}
                  color="var(--accent)"
                  format={v => `${v.toFixed(0)}h`}
                  height={180}
                />
                <div className="divider"/>
                <div className="flex between">
                  <div>
                    <div className="muted" style={{fontSize:12}}>Total semana</div>
                    <div className="serif" style={{fontSize:22}}>2,963 h</div>
                  </div>
                  <div>
                    <div className="muted" style={{fontSize:12}}>Costo / cover</div>
                    <div className="serif" style={{fontSize:22}}>$ 146</div>
                  </div>
                  <div>
                    <div className="muted" style={{fontSize:12}}>Horas extra</div>
                    <div className="serif" style={{fontSize:22}}>48 h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
window.CostsScreen = CostsScreen;
