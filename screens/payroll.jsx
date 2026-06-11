/* Nómina y asistencia */
const PayrollScreen = ({ role }) => {
  const present = STAFF.filter(s => s.status === 'in').length;
  const late = STAFF.filter(s => s.status === 'late').length;
  const absent = STAFF.filter(s => s.status === 'out').length;
  const totalSalary = STAFF.reduce((s,e) => s + e.salary, 0);

  const statusPill = (st) => {
    if (st === 'in')   return <span className="pill positive"><span className="dot"/>En turno</span>;
    if (st === 'late') return <span className="pill warning"><span className="dot"/>Retraso</span>;
    return <span className="pill neutral"><span className="dot"/>Fuera</span>;
  };

  return (
    <div className="content">
      <PageHead
        eyebrow="Capital humano"
        title="Nómina y asistencia"
        sub={`${STAFF.length} colaboradores · ${present} en turno ahora`}
        actions={<>
          <Segmented value="hoy" onChange={()=>{}} options={[
            {value:'hoy', label:'Hoy'},{value:'sem', label:'Semana'},{value:'qna', label:'Quincena'}
          ]}/>
          {role === 'operator' && <button className="btn btn-primary"><Icon name="plus" size={14}/> Registrar entrada</button>}
        </>}
      />

      <div className="row cols-4">
        <div className="card kpi">
          <div className="kpi-label">Asistencia hoy</div>
          <div className="kpi-value num">{present}<span style={{fontSize:18, color:'var(--muted)'}}>/{STAFF.length}</span></div>
          <div className="kpi-target">{late} retrasos · {absent} fuera de turno</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Nómina quincenal</div>
          <div className="kpi-value"><span className="currency">$</span>{(totalSalary/1000).toFixed(1)}k</div>
          <div className="kpi-target">Próxima dispersión: 31 May</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Horas extra · semana</div>
          <div className="kpi-value num">48<span style={{fontSize:18, color:'var(--muted)'}}>h</span></div>
          <Delta value={-8.4} invert/>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Propinas pendientes</div>
          <div className="kpi-value"><span className="currency">$</span>18,420</div>
          <div className="kpi-target">Distribución viernes</div>
        </div>
      </div>

      <div className="row" style={{ gridTemplateColumns: '1.6fr 1fr', marginTop: 16 }}>
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="card-title">Turno actual</div>
              <div className="card-meta">Jueves 21 May · turno noche</div>
            </div>
            <div className="muted mono" style={{ fontSize: 11.5 }}>14:38</div>
          </div>

          {STAFF.map((s, i) => (
            <div key={i} className="shift-row" style={{ borderTop: i ? '1px solid var(--border)' : 0, borderRadius: 0 }}>
              <div className="av" style={{ background: s.color }}>{s.initials}</div>
              <div>
                <div className="nm">{s.name}</div>
                <div className="role">{s.role}</div>
              </div>
              <div className="m s">{s.shift}</div>
              <div>{statusPill(s.status)}</div>
              <div className="m">{s.hrsWk}h</div>
              <div className="m" style={{ textAlign: 'right' }}>{fmtMXN(s.salary, { short: true })}</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Costo de nómina · 8 quincenas</div>
          <div className="card-meta">vs. ventas netas</div>
          <BarChart
            data={[412000, 421000, 408000, 432000, 445000, 438000, 442000, 452100]}
            labels={['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8']}
            color="var(--accent)"
            format={v => `$${(v/1000).toFixed(0)}k`}
            height={180}
          />
          <div className="divider"/>
          <div className="card-title">Distribución por área</div>
          <div className="mt-3">
            {[
              ['Cocina',      52, '#7E9C6E'],
              ['Piso',        28, '#B07F86'],
              ['Gerencia',    14, '#6E8AAA'],
              ['Limpieza',     6, '#A88B5C'],
            ].map((r, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div className="flex between" style={{ fontSize: 12 }}>
                  <span>{r[0]}</span>
                  <span className="num">{r[1]}%</span>
                </div>
                <div className="bar mt-2"><span style={{ width: r[1] + '%', background: r[2] }}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
window.PayrollScreen = PayrollScreen;
