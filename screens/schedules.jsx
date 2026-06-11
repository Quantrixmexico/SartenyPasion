/* Horarios y Turnos — planificación semanal del equipo
   Vincula Colaboradores con cobertura, horas extra y vacantes
*/
const SchedulesScreen = ({ role, navigate }) => {
  const [area, setArea] = useState('all');
  const [view, setView] = useState('grid');     // 'grid' | 'coverage'
  const [editing, setEditing] = useState(null); // { row, day }

  const areas = ['all', 'cocina', 'piso', 'bar'];
  const filtered = SHIFTS.filter(s => area === 'all' || s.area === area);

  // KPIs
  const totalHours = filtered.reduce((s, r) => s + r.hours, 0);
  const totalOT = filtered.reduce((s, r) => s + r.ot, 0);
  const vacancies = filtered.filter(r => r.vacancy).length;
  const blocked = filtered.filter(r => r.blocked).length;
  // costo proyectado: tasa promedio por hora (estimación demo)
  const projectedCost = filtered.reduce((s, r) => {
    const staff = STAFF.find(st => st.name === r.name);
    if (!staff) return s;
    const hourly = staff.salary / 80;  // quincena ≈ 80 h normales
    return s + (r.hours * hourly) + (r.ot * hourly * 1.5);
  }, 0);

  // coverage by day: count active shifts (not blocked, not vacancy, not '—', not '?')
  const coverage = SCHEDULE_WEEK.days.map((_, di) => {
    const cooks = filtered.filter(r => r.area === 'cocina' && r.shifts[di] && !['—','?',''].includes(r.shifts[di])).length;
    const piso  = filtered.filter(r => r.area === 'piso'   && r.shifts[di] && !['—','?',''].includes(r.shifts[di])).length;
    const bar   = filtered.filter(r => r.area === 'bar'    && r.shifts[di] && !['—','?',''].includes(r.shifts[di])).length;
    return { cooks, piso, bar, total: cooks + piso + bar };
  });

  const cellClass = (shift) => {
    if (shift === '—') return 'cell blocked-cell';
    if (shift === '?') return 'cell vacant-cell';
    if (shift === '')  return 'cell empty-cell';
    return 'cell shift-cell';
  };

  return (
    <div className="content">
      <PageHead
        eyebrow="Equipo · planificación"
        title="Horarios y turnos"
        sub={`Semana del ${SCHEDULE_WEEK.weekOf} · ${totalHours} horas asignadas · ${vacancies} vacante${vacancies !== 1 ? 's' : ''} por cubrir`}
        actions={<>
          <button className="btn"><Icon name="download" size={14}/> Exportar</button>
          <button className="btn"><Icon name="cal" size={14}/> Semana anterior</button>
          <button className="btn"><Icon name="cal" size={14}/> Semana siguiente</button>
          {role === 'operator' && (
            <button className="btn btn-primary">
              <Icon name="plus" size={14}/> Asignar turno
            </button>
          )}
        </>}
      />

      <div className="row cols-4">
        <div className="card kpi">
          <div className="kpi-label">Horas asignadas · semana</div>
          <div className="kpi-value num">{totalHours}h</div>
          <div className="kpi-target">{totalOT}h extra · {((totalOT/totalHours)*100).toFixed(1)}% sobre estándar</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Costo proyectado</div>
          <div className="kpi-value"><span className="currency">$</span>{(projectedCost/1000).toFixed(1)}k</div>
          <div className="kpi-target">Incluye 1.5× hora extra</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Cobertura promedio</div>
          <div className="kpi-value num">{(coverage.reduce((s,c)=>s+c.total,0)/coverage.length).toFixed(1)}</div>
          <div className="kpi-target">Personas por día · min recomendado 7</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Pendientes</div>
          <div className="kpi-value num" style={{ color: vacancies > 0 ? 'var(--warning)' : 'var(--ink)' }}>
            {vacancies}
          </div>
          <div className="kpi-target">{blocked} bloqueado{blocked !== 1 ? 's' : ''} · {SHIFT_INCIDENTS.length} incidencias</div>
        </div>
      </div>

      {/* AREA FILTER + VIEW SWITCH */}
      <div className="flex between center" style={{ marginTop: 18 }}>
        <div className="flex gap-2">
          {areas.map(a => (
            <button key={a}
              onClick={() => setArea(a)}
              style={{
                cursor: 'pointer',
                background: area === a ? 'var(--accent-soft)' : 'var(--surface-2)',
                color: area === a ? 'var(--accent)' : 'var(--ink-2)',
                border: '1px solid ' + (area === a ? 'var(--accent-soft)' : 'var(--border)'),
                borderRadius: 100, padding: '6px 14px', fontSize: 12,
                textTransform: 'capitalize'
              }}>
              {a === 'all' ? 'Todas las áreas' : a}
            </button>
          ))}
        </div>
        <div className="seg-control">
          <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}>
            Grid semanal
          </button>
          <button className={view === 'coverage' ? 'on' : ''} onClick={() => setView('coverage')}>
            Cobertura por turno
          </button>
        </div>
      </div>

      {view === 'grid' && (
        <div className="card" style={{ padding: 0, marginTop: 14, overflow: 'hidden' }}>
          <div className="schedule-grid">
            {/* HEADER */}
            <div className="sg-head sg-emp">Colaborador</div>
            {SCHEDULE_WEEK.days.map((d, i) => {
              const isWeekend = i >= 4;
              return (
                <div key={i} className={'sg-head sg-day ' + (isWeekend ? 'weekend' : '')}>
                  <div className="d-name">{d}</div>
                  <div className="d-cover mono">{coverage[i].total} pax</div>
                </div>
              );
            })}
            <div className="sg-head sg-tot">Horas</div>

            {/* ROWS */}
            {filtered.map((r, i) => (
              <React.Fragment key={i}>
                <div className={'sg-emp-cell ' + (r.blocked ? 'blocked' : '') + (r.vacancy ? ' vacancy' : '')}>
                  <div className="av" style={{ background: r.color }}>
                    {r.initials}
                    {r.blocked && <span className="lock-dot"><Icon name="lock" size={8}/></span>}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="nm">{r.name}</div>
                    <div className="role">{r.role}</div>
                    {r.blockNote && <div className="block-note">{r.blockNote}</div>}
                  </div>
                </div>
                {r.shifts.map((sh, di) => (
                  <div key={di} className={cellClass(sh)}
                       onClick={() => !r.blocked && setEditing({ row: r, day: di })}>
                    {sh && sh !== '—' && sh !== '?' && <span className="shift-time mono">{sh}</span>}
                    {sh === '?' && <span className="vacant-label"><Icon name="plus" size={11}/> Cubrir</span>}
                    {sh === '—' && <span className="blocked-label"><Icon name="lock" size={10}/></span>}
                    {sh === ''  && <span className="off-label">Libre</span>}
                  </div>
                ))}
                <div className={'sg-tot-cell ' + (r.ot > 0 ? 'ot' : '')}>
                  <div className="num">{r.hours}h</div>
                  {r.ot > 0 && <div className="ot-tag">+{r.ot} extra</div>}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {view === 'coverage' && (
        <div className="card" style={{ padding: 20, marginTop: 14 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Cobertura por área y día</div>
          <div className="coverage-grid">
            <div></div>
            {SCHEDULE_WEEK.days.map((d, i) => (
              <div key={i} className="cov-head">{d}</div>
            ))}
            {['cocina','piso','bar'].map(a => (
              <React.Fragment key={a}>
                <div className="cov-area">{a}</div>
                {coverage.map((c, di) => {
                  const v = c[a === 'cocina' ? 'cooks' : a === 'piso' ? 'piso' : 'bar'];
                  const min = a === 'cocina' ? 3 : a === 'piso' ? 3 : 1;
                  const ok = v >= min;
                  return (
                    <div key={di} className={'cov-cell ' + (ok ? 'ok' : 'low')}>
                      <div className="cov-v num">{v}</div>
                      <div className="cov-bar">
                        <span style={{
                          width: Math.min(100, (v/min)*50) + '%',
                          background: ok ? 'var(--positive)' : 'var(--warning)'
                        }}/>
                      </div>
                      <div className="cov-min mono">min {min}</div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* INCIDENTS */}
      <div className="row cols-2 mt-4">
        <div className="card">
          <div className="card-head">
            <div className="section-title">Incidencias de la semana</div>
            <button className="btn btn-ghost">Ver todas →</button>
          </div>
          <div className="activity">
            {SHIFT_INCIDENTS.map((inc, i) => (
              <div key={i} className="activity-row">
                <div className="dot" style={{
                  background:
                    inc.kind === 'late'     ? 'var(--warning)' :
                    inc.kind === 'overtime' ? 'var(--accent)'  :
                    inc.kind === 'absent'   ? 'var(--danger)'  :
                                              'var(--positive)'
                }}/>
                <div>
                  <div className="t">
                    {inc.who}
                    <span style={{ marginLeft: 8, fontWeight: 400, color: 'var(--muted)', fontSize: 11.5 }}>
                      {inc.kind === 'late' && '· Retraso'}
                      {inc.kind === 'overtime' && '· Hora extra'}
                      {inc.kind === 'absent' && '· Falta'}
                      {inc.kind === 'swap' && '· Intercambio'}
                    </span>
                  </div>
                  <div className="s">{inc.detail}</div>
                </div>
                <div className="when">{inc.when}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="section-title">Resumen por colaborador</div>
            <button className="btn btn-ghost" onClick={() => navigate && navigate('employees')}>
              Equipo →
            </button>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th className="right">Horas</th>
                <th className="right">Extra</th>
                <th className="right">% sobre estándar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.filter(r => !r.vacancy && !r.blocked).slice(0, 6).map((r, i) => {
                const overPct = r.hours > 48 ? ((r.hours - 48) / 48 * 100) : 0;
                return (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: r.color, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 9.5, fontWeight: 600 }}>
                          {r.initials}
                        </div>
                        <div>
                          <div style={{ fontSize: 12.5 }}>{r.name}</div>
                          <div className="sub">{r.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="right num">{r.hours}h</td>
                    <td className="right num" style={{ color: r.ot > 0 ? 'var(--warning)' : 'var(--muted)' }}>
                      {r.ot > 0 ? '+' + r.ot + 'h' : '—'}
                    </td>
                    <td className="right num" style={{ color: overPct > 8 ? 'var(--danger)' : overPct > 0 ? 'var(--warning)' : 'var(--positive)' }}>
                      {overPct > 0 ? '+' + overPct.toFixed(0) + '%' : 'OK'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SHIFT EDIT POPOVER */}
      {editing && (
        <>
          <div className="drawer-backdrop open" onClick={() => setEditing(null)}/>
          <div className="drawer open" style={{ width: 460 }}>
            <div className="drawer-head">
              <div>
                <div className="page-eyebrow">{SCHEDULE_WEEK.days[editing.day]}</div>
                <div className="t">{editing.row.name}</div>
                <div className="s">{editing.row.role}</div>
              </div>
              <button className="btn btn-ghost" onClick={() => setEditing(null)} style={{ padding: 6 }}>
                <Icon name="x" size={14}/>
              </button>
            </div>
            <div className="drawer-body">
              <div className="form-section">
                <div className="legend">Asignar turno</div>
                <div className="form-grid c2">
                  <div className="field">
                    <span className="field-label">Entrada</span>
                    <input className="input" type="time" defaultValue={editing.row.shifts[editing.day].split('—')[0] || ''}/>
                  </div>
                  <div className="field">
                    <span className="field-label">Salida</span>
                    <input className="input" type="time" defaultValue={editing.row.shifts[editing.day].split('—')[1] || ''}/>
                  </div>
                  <div className="field" style={{ gridColumn: 'span 2' }}>
                    <span className="field-label">Posición</span>
                    <select className="select" defaultValue={editing.row.role}>
                      <option>Chef ejecutivo</option>
                      <option>Sous chef</option>
                      <option>Garde manger</option>
                      <option>Pastelería</option>
                      <option>Gerente piso</option>
                      <option>Bartender</option>
                      <option>Mesero/Mesera</option>
                      <option>Hostess</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-section">
                <div className="legend">Notas</div>
                <textarea className="textarea" placeholder="Indicaciones específicas, intercambios, observaciones…"/>
              </div>
              <div className="form-section">
                <div className="legend">Tipo</div>
                <div className="flex gap-2" style={{ flexDirection: 'column' }}>
                  <label className="checkbox"><input type="radio" name="kind" defaultChecked/> Turno regular</label>
                  <label className="checkbox"><input type="radio" name="kind"/> Hora extra autorizada</label>
                  <label className="checkbox"><input type="radio" name="kind"/> Intercambio con compañero</label>
                  <label className="checkbox"><input type="radio" name="kind"/> Día libre / descanso</label>
                </div>
              </div>
            </div>
            <div className="drawer-foot">
              <button className="btn btn-danger" style={{ marginRight: 'auto' }}>
                <Icon name="x" size={13}/> Eliminar turno
              </button>
              <button className="btn" onClick={() => setEditing(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => setEditing(null)}>Guardar</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
window.SchedulesScreen = SchedulesScreen;
