/* Correr nómina · dispersión quincenal */
const PayrollRunScreen = ({ role, navigate }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // build per-employee rows
  const initial = STAFF.map((s, i) => ({
    ...s,
    quincenaBase: Math.round(s.salary / (s.pay.includes('Mensual') ? 2 : 1)),
    extraHrs: [0, 4, 0, 0, 2, 6, 8, 0, 0][i] || 0,
    extraPay: [0, 4, 0, 0, 2, 6, 8, 0, 0][i] * 180,
    bonus: i === 0 ? 4000 : i === 4 ? 2000 : 0,
    tips: s.pay.includes('propina') ? [0,0,0,0,0,2400,3200,2800,0][i] : 0,
    isr: Math.round(s.salary * (s.pay.includes('Mensual') ? 0.5 : 1) * 0.085),
    imss: Math.round(s.salary * (s.pay.includes('Mensual') ? 0.5 : 1) * 0.025),
    other: i === 7 ? 600 : 0,
    include: true,
  }));

  const [rows, setRows] = useState(initial);

  const toggle = (i) => setRows(rows.map((r, idx) => idx === i ? { ...r, include: !r.include } : r));

  const totals = rows.reduce((acc, r) => {
    if (!r.include) return acc;
    const gross = r.quincenaBase + r.extraPay + r.bonus + r.tips;
    const ded = r.isr + r.imss + r.other;
    const net = gross - ded;
    return {
      gross: acc.gross + gross,
      ded: acc.ded + ded,
      net: acc.net + net,
      tips: acc.tips + r.tips,
      headcount: acc.headcount + 1,
    };
  }, { gross: 0, ded: 0, net: 0, tips: 0, headcount: 0 });

  if (submitted) {
    return (
      <div className="content">
        <div className="success-card">
          <div className="ic"><Icon name="check" size={28}/></div>
          <div className="t">Nómina dispersada</div>
          <div className="s">
            Quincena 02 mayo — 15 mayo · {totals.headcount} colaboradores<br/>
            Cargo total {fmtMXN(totals.net)} a BBVA Empresarial<br/>
            Comprobantes CFDI enviados · alta SUA programada
          </div>
          <div className="flex gap-2 center" style={{ justifyContent: 'center', marginTop: 18 }}>
            <button className="btn" onClick={() => { setSubmitted(false); setStep(1); }}>Nueva nómina</button>
            <button className="btn btn-primary" onClick={() => navigate && navigate('payroll')}>Ver dispersiones</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <PageHead
        eyebrow="Capital humano · dispersión"
        title="Correr nómina"
        sub="Quincena 02 mayo — 15 mayo 2026 · dispersa el lote a las cuentas registradas"
        actions={<>
          <button className="btn">Guardar borrador</button>
          {step < 3 && <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Continuar <Icon name="arrow_rt" size={13}/></button>}
          {step === 3 && <button className="btn btn-primary" onClick={() => setSubmitted(true)}>Dispersar {fmtMXN(totals.net)}</button>}
        </>}
      />

      <div className="steps">
        <div className={'step ' + (step === 1 ? 'on' : 'done')}>
          <div className="n">{step > 1 ? <Icon name="check" size={11}/> : '1'}</div>
          Periodo y parámetros
        </div>
        <div className={'step-link ' + (step > 1 ? 'done' : '')}/>
        <div className={'step ' + (step === 2 ? 'on' : step > 2 ? 'done' : '')}>
          <div className="n">{step > 2 ? <Icon name="check" size={11}/> : '2'}</div>
          Cálculo por colaborador
        </div>
        <div className={'step-link ' + (step > 2 ? 'done' : '')}/>
        <div className={'step ' + (step === 3 ? 'on' : '')}>
          <div className="n">3</div>
          Confirmar y dispersar
        </div>
      </div>

      {step === 1 && (
        <div className="card" style={{ padding: 0 }}>
          <div className="form-section">
            <div className="legend">Periodo</div>
            <div className="legend-sub">Selecciona la quincena a procesar</div>
            <div className="form-grid c4">
              <div className="field">
                <span className="field-label">Tipo de periodo</span>
                <select className="select" defaultValue="quincenal">
                  <option value="quincenal">Quincenal</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                  <option value="extraordinario">Extraordinario</option>
                </select>
              </div>
              <div className="field">
                <span className="field-label">Inicio</span>
                <input className="input" type="date" defaultValue="2026-05-02"/>
              </div>
              <div className="field">
                <span className="field-label">Fin</span>
                <input className="input" type="date" defaultValue="2026-05-15"/>
              </div>
              <div className="field">
                <span className="field-label">Fecha de dispersión</span>
                <input className="input" type="date" defaultValue="2026-05-22"/>
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="legend">Parámetros</div>
            <div className="form-grid c3">
              <div className="field">
                <span className="field-label">Cuenta de cargo</span>
                <select className="select" defaultValue="bbva">
                  <option value="bbva">BBVA Empresarial · $ 412,580</option>
                  <option value="banamex">Banamex · $ 184,200</option>
                </select>
              </div>
              <div className="field">
                <span className="field-label">Bolsa de propinas</span>
                <div className="input-prefix">
                  <span className="prefix">$</span>
                  <input className="input num" defaultValue="18420"/>
                </div>
                <span className="field-hint">Distribuida por puntos según área y horas trabajadas</span>
              </div>
              <div className="field">
                <span className="field-label">Bono de productividad</span>
                <div className="input-prefix">
                  <span className="prefix">$</span>
                  <input className="input num" defaultValue="6000"/>
                </div>
                <span className="field-hint">Asignado manualmente en el siguiente paso</span>
              </div>
            </div>
            <div className="form-grid c3 mt-4">
              <label className="checkbox"><input type="checkbox" defaultChecked/> Incluir ISR retenido</label>
              <label className="checkbox"><input type="checkbox" defaultChecked/> Incluir IMSS empleado</label>
              <label className="checkbox"><input type="checkbox" defaultChecked/> Calcular horas extra automáticamente</label>
              <label className="checkbox"><input type="checkbox" defaultChecked/> Generar CFDI 4.0 nómina</label>
              <label className="checkbox"><input type="checkbox"/> Aplicar préstamos pendientes</label>
              <label className="checkbox"><input type="checkbox" defaultChecked/> Notificar a colaboradores</label>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div className="card-title">Cálculo por colaborador</div>
              <div className="card-meta">{totals.headcount} de {STAFF.length} incluidos · valida horas extra y bonos antes de continuar</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost">Importar checador</button>
              <button className="btn btn-ghost">Reset cálculo</button>
            </div>
          </div>

          <table className="run-table">
            <thead>
              <tr>
                <th style={{ width: 24 }}></th>
                <th>Colaborador</th>
                <th className="right">Base</th>
                <th className="right">Hrs extra</th>
                <th className="right">Bono</th>
                <th className="right">Propinas</th>
                <th className="right">ISR</th>
                <th className="right">IMSS</th>
                <th className="right">Otros</th>
                <th className="right">Neto a pagar</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const gross = r.quincenaBase + r.extraPay + r.bonus + r.tips;
                const ded = r.isr + r.imss + r.other;
                const net = gross - ded;
                return (
                  <tr key={i} style={{ opacity: r.include ? 1 : 0.4 }}>
                    <td>
                      <input type="checkbox" checked={r.include} onChange={() => toggle(i)} style={{ accentColor: 'var(--accent)' }}/>
                    </td>
                    <td>
                      <div className="flex gap-2 center">
                        <div className="av" style={{ background: r.color, width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 10.5 }}>{r.initials}</div>
                        <div>
                          <div>{r.name}</div>
                          <div className="muted" style={{ fontSize: 11 }}>{r.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="right num">{fmtMXN(r.quincenaBase)}</td>
                    <td className="right num">
                      {r.extraHrs > 0 ? <span>{fmtMXN(r.extraPay)} <span className="muted" style={{ fontSize: 10.5 }}>· {r.extraHrs}h</span></span> : <span className="muted">—</span>}
                    </td>
                    <td className="right num">{r.bonus > 0 ? fmtMXN(r.bonus) : <span className="muted">—</span>}</td>
                    <td className="right num">{r.tips > 0 ? fmtMXN(r.tips) : <span className="muted">—</span>}</td>
                    <td className="right num" style={{ color: 'var(--muted)' }}>−{fmtMXN(r.isr)}</td>
                    <td className="right num" style={{ color: 'var(--muted)' }}>−{fmtMXN(r.imss)}</td>
                    <td className="right num" style={{ color: 'var(--muted)' }}>{r.other > 0 ? '−' + fmtMXN(r.other) : '—'}</td>
                    <td className="right num" style={{ fontWeight: 600, color: 'var(--ink)' }}>{fmtMXN(net)}</td>
                  </tr>
                );
              })}
              <tr className="totals-row">
                <td></td>
                <td>Totales · {totals.headcount} colaboradores</td>
                <td className="right">{fmtMXN(rows.filter(r=>r.include).reduce((s,r)=>s+r.quincenaBase,0))}</td>
                <td className="right">{fmtMXN(rows.filter(r=>r.include).reduce((s,r)=>s+r.extraPay,0))}</td>
                <td className="right">{fmtMXN(rows.filter(r=>r.include).reduce((s,r)=>s+r.bonus,0))}</td>
                <td className="right">{fmtMXN(totals.tips)}</td>
                <td className="right" style={{ color: 'var(--muted)' }}>−{fmtMXN(rows.filter(r=>r.include).reduce((s,r)=>s+r.isr,0))}</td>
                <td className="right" style={{ color: 'var(--muted)' }}>−{fmtMXN(rows.filter(r=>r.include).reduce((s,r)=>s+r.imss,0))}</td>
                <td className="right" style={{ color: 'var(--muted)' }}>−{fmtMXN(rows.filter(r=>r.include).reduce((s,r)=>s+r.other,0))}</td>
                <td className="right" style={{ color: 'var(--accent)' }}>{fmtMXN(totals.net)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {step === 3 && (
        <div className="row" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="card">
            <div className="card-title">Resumen de dispersión</div>
            <div className="card-meta">Revisa antes de ejecutar · esta acción no se puede deshacer</div>

            <div className="divider"/>

            <div className="pay-summary" style={{ padding: 0, border: 0, background: 'transparent' }}>
              <div className="muted eyebrow">Cargo total</div>
              <div className="lead">{fmtMXN(totals.net)}</div>
              <div className="muted" style={{ fontSize: 12 }}>{totals.headcount} colaboradores · CFDI 4.0 nómina</div>
            </div>

            <div className="divider"/>

            <div className="row-i pay-summary" style={{ padding: 0, border: 0, background: 'transparent', display: 'grid', gap: 4 }}>
              <div className="flex between"><span className="muted">Sueldos brutos</span><span className="num">{fmtMXN(totals.gross)}</span></div>
              <div className="flex between"><span className="muted">Bolsa de propinas</span><span className="num">{fmtMXN(totals.tips)}</span></div>
              <div className="flex between"><span className="muted">Deducciones (ISR + IMSS)</span><span className="num">−{fmtMXN(totals.ded)}</span></div>
              <div className="flex between" style={{ paddingTop: 8, borderTop: '1px solid var(--border)', marginTop: 6 }}>
                <span style={{ fontWeight: 500 }}>Neto a dispersar</span>
                <span className="num" style={{ color: 'var(--accent)', fontWeight: 500 }}>{fmtMXN(totals.net)}</span>
              </div>
            </div>

            <div className="divider"/>

            <div className="muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
              Cargo a <strong style={{ color: 'var(--ink-2)' }}>BBVA Empresarial ····7421</strong> el 22 de mayo, 2026.<br/>
              Se enviarán {totals.headcount} comprobantes por email y se cargará el archivo SUA al portal del IMSS.
            </div>
          </div>

          <div className="card">
            <div className="card-title">Lista de dispersión</div>
            <div className="card-meta">Cuentas destino · banco · monto neto</div>
            <div className="divider"/>
            {rows.filter(r => r.include).map((r, i) => {
              const net = r.quincenaBase + r.extraPay + r.bonus + r.tips - r.isr - r.imss - r.other;
              return (
                <div key={i} className="flex between" style={{ padding: '10px 0', borderBottom: i < rows.filter(x => x.include).length - 1 ? '1px dashed var(--border)' : 0 }}>
                  <div className="flex gap-3 center">
                    <div className="av" style={{ background: r.color, width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 11 }}>{r.initials}</div>
                    <div>
                      <div style={{ fontSize: 13 }}>{r.name}</div>
                      <div className="muted mono" style={{ fontSize: 11 }}>BBVA · 012180····{(8000 + i).toString().slice(-4)}</div>
                    </div>
                  </div>
                  <div className="num" style={{ fontSize: 14 }}>{fmtMXN(net)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
window.PayrollRunScreen = PayrollRunScreen;
