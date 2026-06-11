/* Pagar a proveedor */
const PaySupplierScreen = ({ role, navigate }) => {
  const [selected, setSelected] = useState(['Lácteos La Esperanza', 'Pescados del Pacífico']);
  const [method, setMethod] = useState('spei');
  const [account, setAccount] = useState('bbva');
  const [date, setDate] = useState('2026-05-22');
  const [ref, setRef] = useState('NOM-21052-PAGO-LOTE');
  const [concept, setConcept] = useState('Pago consolidado de facturas vencidas y por vencer · Mayo 2026');
  const [submitted, setSubmitted] = useState(false);

  const pending = SUPPLIERS.filter(s => s.status !== 'paid');
  const selectedItems = pending.filter(s => selected.includes(s.name));
  const total = selectedItems.reduce((s,x) => s + x.amount, 0);

  const toggle = (name) => {
    setSelected(selected.includes(name) ? selected.filter(n => n !== name) : [...selected, name]);
  };

  if (submitted) {
    return (
      <div className="content">
        <div className="success-card">
          <div className="ic"><Icon name="check" size={28}/></div>
          <div className="t">Pago programado</div>
          <div className="s">
            {fmtMXN(total)} a {selectedItems.length} proveedores · {date}<br/>
            Referencia: {ref} · BBVA Empresarial<br/>
            Se enviará comprobante CFDI al equipo de finanzas.
          </div>
          <div className="flex gap-2 center" style={{ justifyContent: 'center', marginTop: 18 }}>
            <button className="btn" onClick={() => setSubmitted(false)}>Nuevo pago</button>
            <button className="btn btn-primary" onClick={() => navigate && navigate('bank')}>Ver en conciliación</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <PageHead
        eyebrow="Tesorería · captura"
        title="Pagar a proveedor"
        sub="Selecciona cuentas por pagar y compón la transferencia"
        actions={<>
          <button className="btn">Guardar lote</button>
          <button className="btn btn-primary" disabled={selectedItems.length === 0} onClick={() => setSubmitted(true)}>
            Programar pago <Icon name="arrow_rt" size={13}/>
          </button>
        </>}
      />

      <div className="row" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        {/* LEFT: list of payables */}
        <div>
          <div className="flex between" style={{ marginBottom: 12 }}>
            <div>
              <div className="card-title">Cuentas por pagar</div>
              <div className="card-meta">{pending.length} cuentas abiertas · {fmtMXN(pending.reduce((s,x)=>s+x.amount,0))}</div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost">Solo vencidos</button>
              <button className="btn btn-ghost">Esta semana</button>
            </div>
          </div>

          <div className="pick-list">
            {pending.map(s => {
              const on = selected.includes(s.name);
              return (
                <div key={s.name} className={'pick-row ' + (on ? 'on' : '')} onClick={() => toggle(s.name)}>
                  <div className="ck">{on && <Icon name="check" size={11}/>}</div>
                  <div>
                    <div className="flex between center" style={{ gap: 12 }}>
                      <div>
                        <div className="nm">{s.name}</div>
                        <div className="sub">{s.cat} · {s.terms} · vence {s.next}</div>
                      </div>
                      <div>
                        {s.status === 'overdue' && <span className="pill danger"><span className="dot"/>Vencido</span>}
                        {s.status === 'urgent'  && <span className="pill warning"><span className="dot"/>Esta semana</span>}
                        {s.status === 'pending' && <span className="pill neutral"><span className="dot"/>Programado</span>}
                      </div>
                    </div>
                  </div>
                  <div className="amt">{fmtMXN(s.amount)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: payment composer */}
        <div>
          <div className="pay-summary">
            <div className="muted eyebrow">Total a pagar</div>
            <div className="lead">{fmtMXN(total)}</div>
            <div className="muted" style={{ fontSize: 12 }}>
              {selectedItems.length} cuenta{selectedItems.length === 1 ? '' : 's'} · {selectedItems.map(s => s.name).join(' · ') || 'sin selección'}
            </div>

            <div className="divider"/>

            <div className="field">
              <span className="field-label">Método de pago</span>
              <div className="method-grid">
                <div className={'method ' + (method === 'spei' ? 'on' : '')} onClick={() => setMethod('spei')}>
                  <span className="ic"><Icon name="bank" size={16}/></span>
                  <div className="t">SPEI</div>
                  <div className="s">Inmediato · sin costo</div>
                </div>
                <div className={'method ' + (method === 'check' ? 'on' : '')} onClick={() => setMethod('check')}>
                  <span className="ic"><Icon name="receipt" size={16}/></span>
                  <div className="t">Cheque</div>
                  <div className="s">Físico · entrega</div>
                </div>
                <div className={'method ' + (method === 'cash' ? 'on' : '')} onClick={() => setMethod('cash')}>
                  <span className="ic"><Icon name="cost" size={16}/></span>
                  <div className="t">Efectivo</div>
                  <div className="s">Caja chica</div>
                </div>
              </div>
            </div>

            <div className="field mt-4">
              <span className="field-label">Cuenta origen</span>
              <select className="select" value={account} onChange={e => setAccount(e.target.value)}>
                <option value="bbva">BBVA Empresarial ····7421 · $ 412,580</option>
                <option value="banamex">Banamex ····2308 · $ 184,200</option>
                <option value="caja">Caja chica · $ 22,400</option>
              </select>
            </div>

            <div className="form-grid c2 mt-4">
              <div className="field">
                <span className="field-label">Fecha de pago</span>
                <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)}/>
              </div>
              <div className="field">
                <span className="field-label">Referencia</span>
                <input className="input mono" value={ref} onChange={e => setRef(e.target.value)}/>
              </div>
            </div>

            <div className="field mt-4">
              <span className="field-label">Concepto</span>
              <textarea className="textarea" value={concept} onChange={e => setConcept(e.target.value)} rows={2}/>
            </div>

            <div className="divider"/>

            <div className="row-i"><span className="l">Subtotal facturas</span><span className="v">{fmtMXN(total)}</span></div>
            <div className="row-i"><span className="l">Comisión SPEI</span><span className="v">$ 0</span></div>
            <div className="row-i" style={{ fontSize: 15, marginTop: 6, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <span className="l" style={{ color: 'var(--ink)' }}>Cargo a {account === 'bbva' ? 'BBVA' : account === 'banamex' ? 'Banamex' : 'Caja chica'}</span>
              <span className="v" style={{ color: 'var(--accent)' }}>{fmtMXN(total)}</span>
            </div>

            <div className="flex gap-2 mt-4">
              <label className="checkbox"><input type="checkbox" defaultChecked/> Notificar al proveedor</label>
              <label className="checkbox"><input type="checkbox" defaultChecked/> Requiere segunda firma</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
window.PaySupplierScreen = PaySupplierScreen;
