/* Conciliación bancaria */
const ReconciliationScreen = ({ role }) => {
  const matched = BANK_LINES.filter(l => l.status === 'matched').length;
  const flagged = BANK_LINES.filter(l => l.status === 'flagged').length;
  const pending = BANK_LINES.filter(l => l.status === 'pending').length;
  const totalIn  = BANK_LINES.filter(l => l.dir === 'in').reduce((s,l) => s + l.amt, 0);
  const totalOut = BANK_LINES.filter(l => l.dir === 'out').reduce((s,l) => s + l.amt, 0);

  return (
    <div className="content">
      <PageHead
        eyebrow="Tesorería · conciliación"
        title="Conciliación bancaria"
        sub="Comparación entre movimientos bancarios y libro contable"
        actions={<>
          <Segmented value="semana" onChange={()=>{}} options={[
            {value:'dia', label:'Día'},{value:'semana', label:'Semana'},{value:'mes', label:'Mes'}
          ]}/>
          <button className="btn"><Icon name="download" size={14}/> CFDI · XML</button>
          {role === 'operator' && <button className="btn btn-primary">Auto-conciliar</button>}
        </>}
      />

      <div className="row cols-4">
        <div className="card kpi">
          <div className="kpi-label">Conciliado</div>
          <div className="kpi-value num">{matched}<span style={{fontSize:18, color:'var(--muted)'}}>/{BANK_LINES.length}</span></div>
          <div className="kpi-target">{fmtPct((matched/BANK_LINES.length)*100)} cubierto</div>
          <div className="bar mt-3"><span style={{ width: ((matched/BANK_LINES.length)*100) + '%', background: 'var(--positive)' }}/></div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Marcado para revisión</div>
          <div className="kpi-value num">{flagged}</div>
          <div className="kpi-target">$ 45,560 · revisar discrepancias</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Ingresos · semana</div>
          <div className="kpi-value"><span className="currency">$</span>{(totalIn/1000).toFixed(1)}k</div>
          <Delta value={9.2}/>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Egresos · semana</div>
          <div className="kpi-value"><span className="currency">$</span>{(totalOut/1000).toFixed(1)}k</div>
          <div className="kpi-target">Flujo neto +{fmtMXN(totalIn-totalOut)}</div>
        </div>
      </div>

      <div className="card mt-4" style={{ padding: 0 }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="card-title">Movimientos · BBVA · BANAMEX · STP</div>
            <div className="card-meta">Últimos 7 días · auto-conciliación 88.9%</div>
          </div>
          <div className="flex gap-2">
            <span className="pill positive"><span className="dot"/>conciliado</span>
            <span className="pill warning"><span className="dot"/>revisar</span>
            <span className="pill neutral"><span className="dot"/>pendiente</span>
          </div>
        </div>

        {BANK_LINES.map((l, i) => (
          <div key={i} className={'recline ' + (l.status === 'matched' ? 'matched' : l.status === 'flagged' ? 'flagged' : '')}>
            <div className="check">
              {l.status === 'matched' && <Icon name="check" size={12}/>}
              {l.status === 'flagged' && <Icon name="flag" size={12}/>}
            </div>
            <div className="d">{l.date}</div>
            <div className="desc">
              <div>{l.desc}</div>
              <div className="src">{l.src}</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              <div>{l.match}</div>
              <div className="mono" style={{ fontSize: 10.5, marginTop: 2 }}>
                {l.status === 'matched' && 'auto · 09:00'}
                {l.status === 'flagged' && 'revisar manualmente'}
                {l.status === 'pending' && 'sin contraparte'}
              </div>
            </div>
            <div className={'amt ' + l.dir}>
              {l.dir === 'in' ? '+' : '−'}{fmtMXN(l.amt)}
            </div>
            <div style={{ textAlign: 'right' }}>
              <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 11.5 }}>
                Detalle <Icon name="arrow_rt" size={11}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
window.ReconciliationScreen = ReconciliationScreen;
