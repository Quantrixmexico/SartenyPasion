/* Cortes de caja y turnos de cajero
   - Turnos abiertos por caja (cajero, fondo, ventas por método, propinas).
   - Arqueo X (corte de lectura, sin cerrar) y corte Z (cierre de turno).
   - Conteo de efectivo por denominación → efectivo esperado vs contado → diferencia.
   - Retiros / ingresos de efectivo con autorización. Historial de cortes Z.
*/

const expectedCash = (r) => r.fund + r.cashSales + r.payIns - r.payOuts - r.cashRefunds;
const totalSales  = (r) => r.cashSales + r.cardSales + r.transferSales;

const CashScreen = ({ role }) => {
  const [regs, setRegs]   = useState(() => CASH_REGISTERS.map(r => ({ ...r })));
  const [drawer, setDrawer] = useState(null); // { kind:'cut'|'move', regId, cutType, moveType }
  const [flash, setFlash]   = useState(null);

  const open = regs.filter(r => r.status === 'open');

  const k = useMemo(() => ({
    expected: open.reduce((s, r) => s + expectedCash(r), 0),
    sales:    open.reduce((s, r) => s + totalSales(r), 0),
    txns:     open.reduce((s, r) => s + r.txns, 0),
    tips:     open.reduce((s, r) => s + r.tips, 0),
  }), [regs]);

  const reg = drawer ? regs.find(r => r.id === drawer.regId) : null;

  const applyMove = (regId, type, amount) => {
    setRegs(rs => rs.map(r => {
      if (r.id !== regId) return r;
      if (type === 'payin')  return { ...r, payIns: r.payIns + amount };
      return { ...r, payOuts: r.payOuts + amount };
    }));
  };
  const closeShift = (regId) => {
    setRegs(rs => rs.map(r => r.id === regId ? { ...r, status: 'closed' } : r));
  };
  const ping = (msg) => { setFlash(msg); setTimeout(() => setFlash(null), 2600); };

  return (
    <div className="content cash-content">
      <PageHead
        eyebrow="Operación · caja · turno de cena · 21:05"
        title="Cortes de caja y turnos"
        sub="Arqueo de efectivo, retiros y cierre de turno por cajero. El efectivo esperado se calcula en vivo a partir del fondo, ventas y movimientos."
        actions={<>
          <button className="btn"><Icon name="receipt" size={14}/> Historial de cortes</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> Abrir turno</button>
        </>}
      />

      {flash && (
        <div className="cash-flash"><Icon name="check" size={14}/> {flash}</div>
      )}

      {/* KPIs */}
      <div className="row cols-4">
        <div className="card kpi lift">
          <div className="kpi-label">Efectivo esperado en cajón</div>
          <div className="kpi-value"><span className="currency">$</span>{(k.expected/1000).toFixed(1)}k</div>
          <div className="kpi-target">{open.length} turnos · suma de fondos + ventas en efectivo</div>
        </div>
        <div className="card kpi lift">
          <div className="kpi-label">Ventas del turno</div>
          <div className="kpi-value"><span className="currency">$</span>{(k.sales/1000).toFixed(1)}k</div>
          <div className="kpi-target">{k.txns} transacciones cobradas</div>
        </div>
        <div className="card kpi lift">
          <div className="kpi-label">Turnos abiertos</div>
          <div className="kpi-value num">{open.length}<span className="muted" style={{ fontSize: 16 }}> / {regs.length}</span></div>
          <div className="kpi-target">{regs.filter(r => r.status === 'closed').length} cajas sin turno</div>
        </div>
        <div className="card kpi lift">
          <div className="kpi-label">Propinas por repartir</div>
          <div className="kpi-value"><span className="currency">$</span>{(k.tips/1000).toFixed(1)}k</div>
          <div className="kpi-target">Acumuladas en el turno actual</div>
        </div>
      </div>

      {/* CAJAS */}
      <div className="cash-grid">
        {regs.map(r => (
          <RegisterCard
            key={r.id} r={r}
            onCut={(cutType) => setDrawer({ kind: 'cut', regId: r.id, cutType })}
            onMove={(moveType) => setDrawer({ kind: 'move', regId: r.id, moveType })}
            onOpen={() => ping('Apertura de turno — flujo de demostración')}
          />
        ))}
      </div>

      {/* MOVIMIENTOS + CORTES */}
      <div className="cash-cols">
        <div className="card" style={{ padding: 0 }}>
          <div className="card-head" style={{ padding: '16px 20px 12px' }}>
            <div>
              <div className="card-title">Movimientos de efectivo · hoy</div>
              <div className="card-meta">Retiros, ingresos y devoluciones con autorización</div>
            </div>
          </div>
          <div className="cash-moves">
            {CASH_MOVEMENTS.map((mv, i) => (
              <div key={i} className="cash-move">
                <span className="cash-move-time num">{mv.time}</span>
                <span className={'cash-move-chip ' + mv.type}>
                  {mv.type === 'payin' ? 'Ingreso' : mv.type === 'payout' ? 'Retiro' : 'Devolución'}
                </span>
                <div className="cash-move-body">
                  <div className="cash-move-concept">{mv.concept}</div>
                  <div className="cash-move-meta">{mv.register} · por {mv.by} · autoriza {mv.auth}</div>
                </div>
                <span className={'cash-move-amt num ' + (mv.type === 'payin' ? 'pos' : 'neg')}>
                  {mv.type === 'payin' ? '+' : '−'}{fmtMXN(mv.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div className="card-head" style={{ padding: '16px 20px 12px' }}>
            <div>
              <div className="card-title">Cortes Z recientes</div>
              <div className="card-meta">Cierres de turno auditables</div>
            </div>
          </div>
          <div className="cash-cuts">
            <div className="cash-cut head">
              <span>Folio · caja</span><span className="num">Ventas</span><span className="num">Esperado</span><span className="num">Contado</span><span className="num">Dif.</span>
            </div>
            {CASH_CUTS.map(c => {
              const diff = c.counted - c.expected;
              return (
                <div key={c.id} className="cash-cut">
                  <div className="cash-cut-id">
                    <div className="mono-id">{c.id}</div>
                    <div className="cash-cut-sub">{c.register} · {c.cashier} · {c.closed}</div>
                  </div>
                  <span className="num">{fmtMXN(c.sales, { short: true })}</span>
                  <span className="num">{fmtMXN(c.expected, { short: true })}</span>
                  <span className="num">{fmtMXN(c.counted, { short: true })}</span>
                  <span className={'cash-cut-diff num ' + (diff === 0 ? 'ok' : diff > 0 ? 'over' : 'under')}>
                    {diff === 0 ? '✓' : (diff > 0 ? '+' : '−') + fmtMXN(Math.abs(diff))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* DRAWER */}
      <div className={'drawer-backdrop ' + (drawer ? 'open' : '')} onClick={() => setDrawer(null)}/>
      <div className={'drawer ' + (drawer ? 'open' : '')} style={{ width: 520 }}>
        {drawer && reg && drawer.kind === 'cut' && (
          <CutDrawer
            r={reg} cutType={drawer.cutType}
            onClose={() => setDrawer(null)}
            onConfirm={(type, diff) => {
              if (type === 'Z') { closeShift(reg.id); ping(`Corte Z de ${reg.name} cerrado · diferencia ${diff === 0 ? 'cuadrada' : fmtMXN(diff)}`); }
              else ping(`Arqueo X de ${reg.name} registrado (turno sigue abierto)`);
              setDrawer(null);
            }}
          />
        )}
        {drawer && reg && drawer.kind === 'move' && (
          <MoveDrawer
            r={reg} moveType={drawer.moveType}
            onClose={() => setDrawer(null)}
            onConfirm={(type, amount, concept) => {
              applyMove(reg.id, type, amount);
              ping(`${type === 'payin' ? 'Ingreso' : 'Retiro'} de ${fmtMXN(amount)} en ${reg.name} · ${concept}`);
              setDrawer(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

/* ---- Tarjeta de caja ---- */
const RegisterCard = ({ r, onCut, onMove, onOpen }) => {
  if (r.status === 'closed') {
    return (
      <div className="card cash-reg closed">
        <div className="cash-reg-head">
          <div>
            <div className="cash-reg-name">{r.name}</div>
            <div className="cash-reg-area">{r.area}</div>
          </div>
          <span className="pill neutral"><span className="dot" style={{ background: 'var(--faint)' }}/>Sin turno</span>
        </div>
        <div className="cash-reg-empty">
          <Icon name="lock" size={20}/>
          <span>Caja cerrada</span>
        </div>
        <div className="cash-reg-foot">
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={onOpen}><Icon name="plus" size={14}/> Abrir turno</button>
        </div>
      </div>
    );
  }
  const exp = expectedCash(r);
  return (
    <div className="card cash-reg">
      <div className="cash-reg-head">
        <div>
          <div className="cash-reg-name">{r.name}</div>
          <div className="cash-reg-area">{r.area} · turno {r.shift}</div>
        </div>
        <span className="pill positive"><span className="dot" style={{ background: 'var(--positive)' }}/>Abierto</span>
      </div>

      <div className="cash-reg-cashier">
        <span className="ps-avatar sm" style={{ background: r.color }}>{r.initials}</span>
        <div className="cash-reg-cashier-id">
          <div className="nm">{r.cashier}</div>
          <div className="mt">Abrió {r.opened} · folio {r.sessionId}</div>
        </div>
      </div>

      <div className="cash-reg-grid">
        <div className="crg"><span>Efectivo</span><b className="num">{fmtMXN(r.cashSales)}</b></div>
        <div className="crg"><span>Tarjeta</span><b className="num">{fmtMXN(r.cardSales)}</b></div>
        <div className="crg"><span>Transferencia</span><b className="num">{fmtMXN(r.transferSales)}</b></div>
        <div className="crg"><span>Propinas</span><b className="num">{fmtMXN(r.tips)}</b></div>
      </div>

      <div className="cash-reg-expect">
        <div>
          <div className="lbl">Efectivo esperado en cajón</div>
          <div className="cash-reg-expect-sub">Fondo {fmtMXN(r.fund)} · {r.txns} tickets</div>
        </div>
        <div className="cash-reg-expect-amt num serif">{fmtMXN(exp)}</div>
      </div>

      <div className="cash-reg-foot">
        <button className="btn btn-sm" onClick={() => onCut('X')}><Icon name="search" size={13}/> Arqueo X</button>
        <button className="btn btn-sm" onClick={() => onMove('payout')}><Icon name="arrow_rt" size={13}/> Retiro</button>
        <button className="btn btn-sm btn-primary" onClick={() => onCut('Z')}><Icon name="lock" size={13}/> Corte Z</button>
      </div>
    </div>
  );
};

/* ---- Drawer de corte (arqueo por denominación) ---- */
const CutDrawer = ({ r, cutType, onClose, onConfirm }) => {
  const [type, setType] = useState(cutType || 'X');
  const [counts, setCounts] = useState(() => CASH_DENOMS.reduce((o, d) => (o[d.v] = '', o), {}));

  const exp = expectedCash(r);
  const counted = CASH_DENOMS.reduce((s, d) => s + d.v * (parseInt(counts[d.v], 10) || 0), 0);
  const diff = counted - exp;

  const set = (v, val) => setCounts(c => ({ ...c, [v]: val.replace(/[^0-9]/g, '') }));
  const fmtDenom = (v) => v < 1 ? '50¢' : '$' + v;

  return (
    <>
      <div className="drawer-head" style={{ alignItems: 'center' }}>
        <div>
          <div className="t">Corte de {r.name}</div>
          <div className="s">{r.cashier} · turno {r.shift} · folio {r.sessionId}</div>
        </div>
        <button className="btn btn-ghost" onClick={onClose}><Icon name="x" size={14}/></button>
      </div>

      <div className="drawer-body">
        <div className="form-section">
          <Segmented
            value={type}
            onChange={setType}
            options={[
              { value: 'X', label: 'Arqueo X · lectura' },
              { value: 'Z', label: 'Corte Z · cierre' },
            ]}
          />
          <div className="muted" style={{ fontSize: 12.5, marginTop: 10, lineHeight: 1.5 }}>
            {type === 'X'
              ? 'Lectura intermedia: cuenta el efectivo sin cerrar el turno. No reinicia contadores.'
              : 'Cierre de turno: cuadra el cajón, cierra la sesión del cajero y genera el folio Z auditable.'}
          </div>
        </div>

        {/* Esperado */}
        <div className="form-section">
          <div className="legend" style={{ fontSize: 18 }}>Efectivo esperado</div>
          <div className="cash-calc">
            <div className="cc-row"><span>Fondo de apertura</span><span className="num">{fmtMXN(r.fund)}</span></div>
            <div className="cc-row"><span>+ Ventas en efectivo</span><span className="num">{fmtMXN(r.cashSales)}</span></div>
            <div className="cc-row"><span>+ Ingresos</span><span className="num">{fmtMXN(r.payIns)}</span></div>
            <div className="cc-row"><span>− Retiros</span><span className="num">−{fmtMXN(r.payOuts)}</span></div>
            <div className="cc-row"><span>− Devoluciones</span><span className="num">−{fmtMXN(r.cashRefunds)}</span></div>
            <div className="cc-row total"><span>Efectivo esperado</span><span className="num">{fmtMXN(exp)}</span></div>
          </div>
          <div className="cash-auto">
            <span>Tarjeta {fmtMXN(r.cardSales)} · Transfer. {fmtMXN(r.transferSales)}</span>
            <span className="muted">conciliación automática</span>
          </div>
        </div>

        {/* Conteo por denominación */}
        <div className="form-section">
          <div className="legend" style={{ fontSize: 18 }}>Conteo de efectivo</div>
          <div className="denom-list">
            {CASH_DENOMS.map(d => {
              const n = parseInt(counts[d.v], 10) || 0;
              return (
                <div key={d.v} className="denom-row">
                  <span className={'denom-tag ' + d.kind}>{fmtDenom(d.v)}</span>
                  <span className="denom-x">×</span>
                  <input
                    className="denom-input num" inputMode="numeric" placeholder="0"
                    value={counts[d.v]} onChange={e => set(d.v, e.target.value)}
                  />
                  <span className="denom-sub num">{fmtMXN(d.v * n)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resultado fijo abajo */}
      <div className="cash-result">
        <div className="cash-result-row">
          <span>Efectivo contado</span>
          <span className="num">{fmtMXN(counted)}</span>
        </div>
        <div className={'cash-result-diff ' + (counted === 0 ? 'idle' : diff === 0 ? 'ok' : diff > 0 ? 'over' : 'under')}>
          <span>{counted === 0 ? 'Captura el conteo' : diff === 0 ? 'Caja cuadrada' : diff > 0 ? 'Sobrante' : 'Faltante'}</span>
          <span className="num">{counted === 0 ? '—' : (diff > 0 ? '+' : diff < 0 ? '−' : '') + fmtMXN(Math.abs(diff))}</span>
        </div>
      </div>

      <div className="drawer-foot">
        <button className="btn" style={{ marginRight: 'auto' }} onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" disabled={counted === 0} onClick={() => onConfirm(type, diff)}>
          <Icon name={type === 'Z' ? 'lock' : 'check'} size={14}/> {type === 'Z' ? 'Cerrar turno (Z)' : 'Registrar arqueo (X)'}
        </button>
      </div>
    </>
  );
};

/* ---- Drawer de retiro / ingreso ---- */
const MoveDrawer = ({ r, moveType, onClose, onConfirm }) => {
  const [type, setType] = useState(moveType || 'payout');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [auth, setAuth] = useState('Gerente');
  const amt = parseInt(amount, 10) || 0;
  const valid = amt > 0 && concept.trim().length > 0;

  return (
    <>
      <div className="drawer-head" style={{ alignItems: 'center' }}>
        <div>
          <div className="t">Movimiento de efectivo</div>
          <div className="s">{r.name} · {r.cashier}</div>
        </div>
        <button className="btn btn-ghost" onClick={onClose}><Icon name="x" size={14}/></button>
      </div>

      <div className="drawer-body">
        <div className="form-section">
          <Segmented
            value={type}
            onChange={setType}
            options={[
              { value: 'payout', label: 'Retiro de caja' },
              { value: 'payin',  label: 'Ingreso a caja' },
            ]}
          />
        </div>

        <div className="form-section">
          <label className="fld">
            <span className="fld-l">Monto</span>
            <div className="fld-money">
              <span>$</span>
              <input className="num" inputMode="numeric" placeholder="0" value={amount}
                     onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}/>
            </div>
          </label>
          <label className="fld">
            <span className="fld-l">Concepto</span>
            <input className="fld-in" placeholder={type === 'payout' ? 'p.ej. Pago a proveedor de hielo' : 'p.ej. Fondo adicional de cambio'}
                   value={concept} onChange={e => setConcept(e.target.value)}/>
          </label>
          <label className="fld">
            <span className="fld-l">Autoriza</span>
            <select className="fld-in" value={auth} onChange={e => setAuth(e.target.value)}>
              <option>Gerente</option>
              <option>Subgerente</option>
              <option>{r.cashier}</option>
            </select>
          </label>
        </div>

        <div className="form-section">
          <div className="alert-card" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
            <div className="ico" style={{ background: type === 'payout' ? 'var(--warning)' : 'var(--positive)', color: 'var(--bg)' }}>
              <Icon name={type === 'payout' ? 'arrow_rt' : 'plus'} size={16}/>
            </div>
            <div>
              <div className="t">{type === 'payout' ? 'Sale de la caja' : 'Entra a la caja'}</div>
              <div className="s">Ajusta el efectivo esperado del corte en {fmtMXN(amt)}.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="drawer-foot">
        <button className="btn" style={{ marginRight: 'auto' }} onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" disabled={!valid} onClick={() => onConfirm(type, amt, concept.trim())}>
          <Icon name="check" size={14}/> Confirmar
        </button>
      </div>
    </>
  );
};

window.CashScreen = CashScreen;
