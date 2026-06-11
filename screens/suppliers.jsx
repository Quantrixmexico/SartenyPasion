/* Proveedores — directorio, lifecycle y antigüedad de saldos */
const SuppliersScreen = ({ role, navigate }) => {
  const [tab, setTab] = useState('active');
  const [drawer, setDrawer] = useState(null);          // 'new' | 'view' | 'edit' | null
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');

  const empty = {
    name: '', cat: 'Carnes', rfc: '', contact: '', phone: '', email: '', address: '',
    terms: 'Crédito 30 días', bank: 'BBVA', clabe: '', notes: ''
  };
  const [form, setForm] = useState(empty);
  const set = (k, v) => setForm({ ...form, [k]: v });

  const openNew = () => { setForm(empty); setSelected(null); setDrawer('new'); };
  const openView = (s) => { setSelected(s); setDrawer('view'); };
  const close = () => { setSelected(null); setDrawer(null); };

  const counts = {
    active:   SUPPLIER_DIR.filter(s => s.status === 'active').length,
    blocked:  SUPPLIER_DIR.filter(s => s.status === 'blocked').length,
    inactive: SUPPLIER_DIR.filter(s => s.status === 'inactive').length,
  };

  // payables from existing SUPPLIERS data
  const totalOwed = SUPPLIERS.filter(s => s.status !== 'paid').reduce((sum, s) => sum + s.amount, 0);
  const overdue   = SUPPLIERS.filter(s => s.status === 'overdue').length;

  // Aging totals across all suppliers
  const agingTotals = AGING.reduce((acc, r) => ({
    b030:  acc.b030  + r.b030,
    b3160: acc.b3160 + r.b3160,
    b6190: acc.b6190 + r.b6190,
    b90:   acc.b90   + r.b90,
  }), { b030: 0, b3160: 0, b6190: 0, b90: 0 });
  const agingTotal = agingTotals.b030 + agingTotals.b3160 + agingTotals.b6190 + agingTotals.b90;
  const pct = (n) => agingTotal ? (n / agingTotal * 100).toFixed(1) : '0.0';

  const statusPill = (st) => {
    if (st === 'active')   return <span className="pill positive"><span className="dot"/>Activo</span>;
    if (st === 'blocked')  return <span className="pill warning"><span className="dot"/>Bloqueado</span>;
    if (st === 'inactive') return <span className="pill neutral"><span className="dot"/>Baja</span>;
    return null;
  };

  const dir = SUPPLIER_DIR
    .filter(s => tab === 'aging' ? true :
      tab === 'active'   ? s.status === 'active'  :
      tab === 'blocked'  ? s.status === 'blocked' :
      tab === 'inactive' ? s.status === 'inactive' : true)
    .filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.rfc.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="content">
      <PageHead
        eyebrow="Proveedores · directorio"
        title="Control de proveedores"
        sub={`${SUPPLIER_DIR.length} proveedores en directorio · ${counts.active} activos · ${fmtMXN(totalOwed)} por pagar`}
        actions={<>
          <button className="btn"><Icon name="download" size={14}/> Exportar</button>
          <button className="btn" onClick={() => navigate && navigate('pay')}>
            <Icon name="receipt" size={14}/> Pagar
          </button>
          {role === 'operator' && (
            <button className="btn btn-primary" onClick={openNew}>
              <Icon name="plus" size={14}/> Alta de proveedor
            </button>
          )}
        </>}
      />

      <div className="row cols-4">
        <div className="card kpi">
          <div className="kpi-label">Activos</div>
          <div className="kpi-value num">{counts.active}</div>
          <div className="kpi-target">Comprables · facturación al día</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Bloqueados</div>
          <div className="kpi-value num" style={{ color: counts.blocked > 0 ? 'var(--warning)' : 'var(--ink)' }}>{counts.blocked}</div>
          <div className="kpi-target">No comprables · revisar motivo</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Por pagar · total</div>
          <div className="kpi-value"><span className="currency">$</span>{(totalOwed/1000).toFixed(1)}k</div>
          <div className="kpi-target">{SUPPLIERS.filter(s => s.status !== 'paid').length} cuentas abiertas</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Vencidos &gt; 60 días</div>
          <div className="kpi-value num" style={{ color: agingTotals.b6190 + agingTotals.b90 > 0 ? 'var(--danger)' : 'var(--ink)' }}>
            {fmtMXN(agingTotals.b6190 + agingTotals.b90, { short: true })}
          </div>
          <div className="kpi-target">Riesgo · negociar quita o pago</div>
        </div>
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[
        { value: 'active',   label: 'Activos',     count: counts.active },
        { value: 'blocked',  label: 'Bloqueados',  count: counts.blocked },
        { value: 'inactive', label: 'Bajas',       count: counts.inactive },
        { value: 'aging',    label: 'Antigüedad de saldos' },
      ]}/>

      {/* DIRECTORIO */}
      {tab !== 'aging' && (
        <div className="card" style={{ padding: 0 }}>
          <div className="card-head" style={{ padding: '14px 18px 0', marginBottom: 0 }}>
            <div className="muted" style={{ fontSize: 12 }}>{dir.length} proveedor{dir.length !== 1 ? 'es' : ''}</div>
            <div className="search" style={{ flex: '0 0 240px' }}>
              <Icon name="search" size={13}/>
              <input placeholder="Buscar por nombre o RFC…" value={query} onChange={e => setQuery(e.target.value)}/>
            </div>
          </div>

          <table className="tbl" style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: 18 }}>Proveedor</th>
                <th>RFC</th>
                <th>Contacto</th>
                <th>Categoría</th>
                <th>Condiciones</th>
                <th className="right">SKUs</th>
                <th className="right">YTD</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {dir.map((s, i) => {
                const pay = SUPPLIERS.find(p => p.name === s.name);
                return (
                  <tr key={i} onClick={() => openView(s)} style={{ cursor: 'pointer', opacity: s.status === 'inactive' ? 0.65 : 1 }}>
                    <td style={{ paddingLeft: 18 }}>
                      <div>{s.name}</div>
                      <div className="sub">Desde {s.since} · ★ {s.rating.toFixed(1)}</div>
                    </td>
                    <td className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{s.rfc}</td>
                    <td>
                      <div style={{ fontSize: 12.5 }}>{s.contact}</div>
                      <div className="sub mono">{s.phone}</div>
                    </td>
                    <td><span className="tag">{s.cat}</span></td>
                    <td className="mono" style={{ fontSize: 11.5 }}>{s.terms}</td>
                    <td className="right num">{s.skus}</td>
                    <td className="right num">{pay ? fmtMXN(pay.ytd, { short: true }) : '—'}</td>
                    <td>{statusPill(s.status)}</td>
                    <td className="right" style={{ paddingRight: 18 }}><Icon name="arrow_rt" size={13}/></td>
                  </tr>
                );
              })}
              {dir.length === 0 && (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                  Sin resultados.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ANTIGÜEDAD DE SALDOS */}
      {tab === 'aging' && (
        <>
          <div className="card aging-summary">
            <div className="aging-buckets">
              {[
                { l: 'Al corriente (0-30 d)', v: agingTotals.b030,  cls: 'positive', p: pct(agingTotals.b030) },
                { l: 'Vencido 31-60 días',     v: agingTotals.b3160, cls: 'accent',   p: pct(agingTotals.b3160) },
                { l: 'Vencido 61-90 días',     v: agingTotals.b6190, cls: 'warning',  p: pct(agingTotals.b6190) },
                { l: 'Vencido +90 días',       v: agingTotals.b90,   cls: 'danger',   p: pct(agingTotals.b90) },
              ].map((b, i) => (
                <div key={i} className={'aging-bucket ' + b.cls}>
                  <div className="bk-label">{b.l}</div>
                  <div className="bk-value">{fmtMXN(b.v)}</div>
                  <div className="bk-pct mono">{b.p}% del total</div>
                </div>
              ))}
            </div>
            <div className="aging-bar">
              <span style={{ width: pct(agingTotals.b030)  + '%', background: 'var(--positive)' }}/>
              <span style={{ width: pct(agingTotals.b3160) + '%', background: 'var(--accent)' }}/>
              <span style={{ width: pct(agingTotals.b6190) + '%', background: 'var(--warning)' }}/>
              <span style={{ width: pct(agingTotals.b90)   + '%', background: 'var(--danger)' }}/>
            </div>
            <div className="aging-foot muted" style={{ fontSize: 12 }}>
              Total adeudado: <span className="num" style={{ color: 'var(--ink)' }}>{fmtMXN(agingTotal)}</span>
              {' · '}DPO promedio 28 días · corte al 21 may 26
            </div>
          </div>

          <div className="card mt-4" style={{ padding: 0 }}>
            <div className="card-head" style={{ padding: '14px 18px 0', marginBottom: 0 }}>
              <div className="section-title" style={{ margin: 0 }}>Detalle por proveedor</div>
              <div className="flex gap-2">
                <button className="btn"><Icon name="filter" size={13}/> Filtros</button>
                <button className="btn"><Icon name="download" size={13}/> Exportar</button>
              </div>
            </div>

            <table className="tbl aging-table" style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: 18 }}>Proveedor</th>
                  <th className="right">Al corriente<br/><span className="mono" style={{ fontWeight: 400, color: 'var(--faint)' }}>0-30 d</span></th>
                  <th className="right">Vencido<br/><span className="mono" style={{ fontWeight: 400, color: 'var(--faint)' }}>31-60 d</span></th>
                  <th className="right">Vencido<br/><span className="mono" style={{ fontWeight: 400, color: 'var(--faint)' }}>61-90 d</span></th>
                  <th className="right">Vencido<br/><span className="mono" style={{ fontWeight: 400, color: 'var(--faint)' }}>+90 d</span></th>
                  <th className="right">Total</th>
                  <th>Más antiguo</th>
                  <th>Último pago</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {AGING.map((r, i) => {
                  const t = r.b030 + r.b3160 + r.b6190 + r.b90;
                  if (t === 0) {
                    return (
                      <tr key={i} style={{ opacity: 0.65 }}>
                        <td style={{ paddingLeft: 18 }}>{r.supplier}</td>
                        <td className="right num muted">—</td>
                        <td className="right num muted">—</td>
                        <td className="right num muted">—</td>
                        <td className="right num muted">—</td>
                        <td className="right num">{fmtMXN(0)}</td>
                        <td className="mono muted" style={{ fontSize: 11.5 }}>{r.oldest}</td>
                        <td className="mono muted" style={{ fontSize: 11.5 }}>{r.lastPay}</td>
                        <td className="right"><span className="pill positive"><span className="dot"/>Al día</span></td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={i}>
                      <td style={{ paddingLeft: 18 }}>{r.supplier}</td>
                      <td className="right num"><AmtCell v={r.b030} cls="positive"/></td>
                      <td className="right num"><AmtCell v={r.b3160} cls="accent"/></td>
                      <td className="right num"><AmtCell v={r.b6190} cls="warning"/></td>
                      <td className="right num"><AmtCell v={r.b90} cls="danger"/></td>
                      <td className="right num" style={{ fontWeight: 500 }}>{fmtMXN(t)}</td>
                      <td className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{r.oldest}</td>
                      <td className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{r.lastPay}</td>
                      <td className="right">
                        <button className="btn btn-ghost" style={{ padding: '4px 8px' }}
                          onClick={() => navigate && navigate('pay')}>
                          Pagar <Icon name="arrow_rt" size={11}/>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {/* totals row */}
                <tr style={{ background: 'var(--surface-2)', fontWeight: 500 }}>
                  <td style={{ paddingLeft: 18 }}>Totales</td>
                  <td className="right num">{fmtMXN(agingTotals.b030)}</td>
                  <td className="right num">{fmtMXN(agingTotals.b3160)}</td>
                  <td className="right num">{fmtMXN(agingTotals.b6190)}</td>
                  <td className="right num">{fmtMXN(agingTotals.b90)}</td>
                  <td className="right num serif" style={{ fontSize: 18 }}>{fmtMXN(agingTotal)}</td>
                  <td colSpan="3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* DRAWER — detail/new */}
      <div className={'drawer-backdrop ' + (drawer ? 'open' : '')} onClick={close}/>
      <div className={'drawer ' + (drawer ? 'open' : '')} style={{ width: 620 }}>
        {drawer === 'view' && selected && (
          <SupplierDetail s={selected} onClose={close} navigate={navigate}/>
        )}
        {drawer === 'new' && (
          <SupplierForm form={form} set={set} onClose={close}/>
        )}
      </div>
    </div>
  );
};

const AmtCell = ({ v, cls }) => v === 0
  ? <span className="muted">—</span>
  : <span style={{ color: `var(--${cls})` }}>{fmtMXN(v)}</span>;

/* SUPPLIER DETAIL */
const SupplierDetail = ({ s, onClose, navigate }) => {
  const pay = SUPPLIERS.find(p => p.name === s.name);
  const aging = AGING.find(a => a.supplier === s.name);
  const skus = CATALOG.filter(c => c.supplier === s.name);
  const statusPill =
    s.status === 'active'   ? <span className="pill positive"><span className="dot"/>Activo</span> :
    s.status === 'blocked'  ? <span className="pill warning"><span className="dot"/>Bloqueado</span> :
                              <span className="pill neutral"><span className="dot"/>Baja</span>;

  return (
    <>
      <div className="drawer-head">
        <div>
          <div className="page-eyebrow">{s.cat}</div>
          <div className="t">{s.name}</div>
          <div className="s">Desde {s.since} · ★ {s.rating.toFixed(1)} · {s.skus} SKUs vinculados</div>
        </div>
        <div className="flex gap-2">
          {statusPill}
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: 6 }}>
            <Icon name="x" size={14}/>
          </button>
        </div>
      </div>

      <div className="drawer-body">
        {s.status !== 'active' && s.blockReason && (
          <div className="form-section" style={{ paddingTop: 16 }}>
            <div className="alert-card" style={{
              background: s.status === 'blocked' ? 'var(--warning-soft)' : 'var(--surface-2)',
              borderColor: s.status === 'blocked' ? 'var(--warning)' : 'var(--border-2)'
            }}>
              <div className="ico" style={{
                background: s.status === 'blocked' ? 'var(--warning)' : 'var(--muted)',
                color: 'var(--bg)'
              }}>
                <Icon name={s.status === 'blocked' ? 'lock' : 'archive'} size={16}/>
              </div>
              <div>
                <div className="t">{s.status === 'blocked' ? 'Motivo de bloqueo' : 'Motivo de baja'}</div>
                <div className="s">{s.blockReason}</div>
              </div>
            </div>
          </div>
        )}

        <div className="form-section">
          <div className="legend">Datos fiscales</div>
          <div className="kv-grid">
            <KV l="Razón social"   v={s.name}/>
            <KV l="RFC"            v={<span className="mono">{s.rfc}</span>}/>
            <KV l="Régimen"        v="Personas Morales"/>
            <KV l="Condiciones"    v={s.terms}/>
            <KV l="DPO objetivo"   v={`${s.dpoTarget} días`}/>
          </div>
        </div>

        <div className="form-section">
          <div className="legend">Contacto</div>
          <div className="kv-grid">
            <KV l="Responsable"    v={s.contact}/>
            <KV l="Teléfono"       v={<span className="mono">{s.phone}</span>}/>
            <KV l="Email"          v={s.email}/>
            <KV l="Dirección"      v={s.address}/>
          </div>
        </div>

        <div className="form-section">
          <div className="legend">Cuenta para pago</div>
          <div className="kv-grid">
            <KV l="Banco"          v={s.bank}/>
            <KV l="CLABE"          v={<span className="mono">{s.clabe}</span>}/>
          </div>
        </div>

        {aging && (s.status === 'active') && (
          <div className="form-section">
            <div className="legend">Antigüedad de saldo</div>
            <div className="aging-mini">
              <div className="aging-mini-row">
                <span>0-30 d</span>
                <span className="num">{fmtMXN(aging.b030)}</span>
                <div className="bar" style={{ flex: 1 }}>
                  <span style={{ width: aging.b030 ? '100%' : '0%', background: 'var(--positive)' }}/>
                </div>
              </div>
              <div className="aging-mini-row">
                <span>31-60 d</span>
                <span className="num">{fmtMXN(aging.b3160)}</span>
                <div className="bar" style={{ flex: 1 }}>
                  <span style={{ width: aging.b3160 ? '100%' : '0%', background: 'var(--accent)' }}/>
                </div>
              </div>
              <div className="aging-mini-row">
                <span>61-90 d</span>
                <span className="num">{fmtMXN(aging.b6190)}</span>
                <div className="bar" style={{ flex: 1 }}>
                  <span style={{ width: aging.b6190 ? '100%' : '0%', background: 'var(--warning)' }}/>
                </div>
              </div>
              <div className="aging-mini-row">
                <span>+90 d</span>
                <span className="num">{fmtMXN(aging.b90)}</span>
                <div className="bar" style={{ flex: 1 }}>
                  <span style={{ width: aging.b90 ? '100%' : '0%', background: 'var(--danger)' }}/>
                </div>
              </div>
            </div>
          </div>
        )}

        {skus.length > 0 && (
          <div className="form-section">
            <div className="legend">SKUs vinculados</div>
            <div className="legend-sub">Productos del catálogo asignados a este proveedor</div>
            {skus.map((c, i) => (
              <div key={i} className="link-row" onClick={() => navigate && navigate('catalog')}>
                <span className="mono" style={{ color: 'var(--muted)', fontSize: 11.5, width: 80 }}>{c.sku}</span>
                <span style={{ flex: 1 }}>{c.name}</span>
                <span className="mono" style={{ fontSize: 12 }}>${c.cost}/{c.unit}</span>
                <Icon name="arrow_rt" size={12}/>
              </div>
            ))}
          </div>
        )}

        <div className="form-section">
          <div className="legend">Bitácora</div>
          <div className="activity">
            {pay && (
              <div className="activity-row">
                <div className="dot" style={{ background: 'var(--positive)' }}/>
                <div>
                  <div className="t">Último pago procesado</div>
                  <div className="s">{fmtMXN(pay.amount)} · {pay.last}</div>
                </div>
                <div className="when">{pay.last}</div>
              </div>
            )}
            <div className="activity-row">
              <div className="dot" style={{ background: 'var(--accent)' }}/>
              <div>
                <div className="t">Validación SAT · 69-B</div>
                <div className="s">Resultado: no listado · vigente</div>
              </div>
              <div className="when">02 may 26</div>
            </div>
            <div className="activity-row">
              <div className="dot"/>
              <div>
                <div className="t">Alta en directorio</div>
                <div className="s">Capturado por Rodrigo Cárdenas</div>
              </div>
              <div className="when">{s.since}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="drawer-foot">
        {s.status === 'active' && (
          <>
            <button className="btn btn-danger" style={{ marginRight: 'auto' }}>
              <Icon name="lock" size={13}/> Bloquear
            </button>
            <button className="btn">Dar de baja</button>
          </>
        )}
        {s.status === 'blocked' && (
          <button className="btn" style={{ marginRight: 'auto' }}>
            <Icon name="unlock" size={13}/> Desbloquear
          </button>
        )}
        {s.status === 'inactive' && (
          <button className="btn" style={{ marginRight: 'auto' }}>
            <Icon name="check" size={13}/> Reactivar
          </button>
        )}
        <button className="btn" onClick={onClose}>Cerrar</button>
        <button className="btn btn-primary">
          <Icon name="pencil" size={13}/> Editar
        </button>
      </div>
    </>
  );
};

/* NEW SUPPLIER FORM */
const SupplierForm = ({ form, set, onClose }) => (
  <>
    <div className="drawer-head">
      <div>
        <div className="page-eyebrow">Alta de proveedor</div>
        <div className="t">Nuevo proveedor</div>
        <div className="s">Datos fiscales, contacto, condiciones de crédito y cuenta para pago.</div>
      </div>
      <button className="btn btn-ghost" onClick={onClose} style={{ padding: 6 }}>
        <Icon name="x" size={14}/>
      </button>
    </div>

    <div className="drawer-body">
      <div className="form-section">
        <div className="legend">Datos fiscales</div>
        <div className="form-grid c2">
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <span className="field-label">Razón social</span>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="ej. Carnes Premium GDL SA de CV"/>
          </div>
          <div className="field">
            <span className="field-label">RFC</span>
            <input className="input mono" value={form.rfc} onChange={e => set('rfc', e.target.value)} placeholder="XXX000000XX0"/>
          </div>
          <div className="field">
            <span className="field-label">Categoría</span>
            <select className="select" value={form.cat} onChange={e => set('cat', e.target.value)}>
              <option>Carnes</option><option>Pescados</option><option>Verduras</option>
              <option>Lácteos</option><option>Secos</option><option>Vinos</option>
              <option>Bebidas</option><option>Insumos</option>
            </select>
          </div>
          <div className="field">
            <span className="field-label">Régimen fiscal</span>
            <select className="select" defaultValue="moral">
              <option value="moral">Personas Morales (601)</option>
              <option value="fisica">Personas Físicas con act. emp. (612)</option>
              <option value="rif">RIF / RESICO (621)</option>
            </select>
          </div>
          <div className="field">
            <span className="field-label">Condiciones</span>
            <select className="select" value={form.terms} onChange={e => set('terms', e.target.value)}>
              <option>Contado</option>
              <option>Crédito 15 días</option>
              <option>Crédito 30 días</option>
              <option>Crédito 45 días</option>
              <option>Crédito 60 días</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="legend">Contacto</div>
        <div className="form-grid c2">
          <div className="field">
            <span className="field-label">Responsable de cuenta</span>
            <input className="input" value={form.contact} onChange={e => set('contact', e.target.value)} placeholder="Nombre completo"/>
          </div>
          <div className="field">
            <span className="field-label">Teléfono</span>
            <input className="input mono" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+52 664 ····"/>
          </div>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <span className="field-label">Email</span>
            <input className="input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="pedidos@empresa.mx"/>
          </div>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <span className="field-label">Dirección fiscal</span>
            <input className="input" value={form.address} onChange={e => set('address', e.target.value)}/>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="legend">Cuenta para pago</div>
        <div className="form-grid c2">
          <div className="field">
            <span className="field-label">Banco</span>
            <select className="select" value={form.bank} onChange={e => set('bank', e.target.value)}>
              <option>BBVA</option><option>Banamex</option><option>Santander</option>
              <option>Banorte</option><option>HSBC</option><option>Scotiabank</option>
            </select>
          </div>
          <div className="field">
            <span className="field-label">CLABE interbancaria</span>
            <input className="input mono" value={form.clabe} onChange={e => set('clabe', e.target.value)} placeholder="18 dígitos"/>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="legend">Validaciones</div>
        <div className="flex gap-3" style={{ flexDirection: 'column' }}>
          <label className="checkbox"><input type="checkbox" defaultChecked/> Validar contra Lista 69-B del SAT</label>
          <label className="checkbox"><input type="checkbox" defaultChecked/> Solicitar constancia de situación fiscal</label>
          <label className="checkbox"><input type="checkbox"/> Requerir certificación HACCP (manipulación de alimentos)</label>
          <label className="checkbox"><input type="checkbox" defaultChecked/> Notificar a cocina y compras del nuevo proveedor</label>
        </div>
      </div>
    </div>

    <div className="drawer-foot">
      <button className="btn" onClick={onClose}>Cancelar</button>
      <button className="btn btn-primary" onClick={onClose}>Crear proveedor</button>
    </div>
  </>
);

window.SuppliersScreen = SuppliersScreen;
