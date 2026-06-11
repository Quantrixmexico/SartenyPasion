/* Recibir compra de insumos */
const PurchaseIntakeScreen = ({ role, navigate }) => {
  const [supplier, setSupplier] = useState('Pescados del Pacífico');
  const [oc, setOc] = useState('OC-21052-B');
  const [received, setReceived] = useState('Rodrigo Cárdenas');
  const [date, setDate] = useState('2026-05-21');
  const [paymentTerm, setPaymentTerm] = useState('credito');
  const [notes, setNotes] = useState('Llegó con 2 cajas en condiciones óptimas. Robalo dentro de especificación.');
  const [submitted, setSubmitted] = useState(false);

  const [items, setItems] = useState([
    { id: 1, sku: 'PES-001', name: 'Robalo entero',  qty: 12,  unit: 'kg', cost: 320, expDays: 5,  lot: 'L-12305' },
    { id: 2, sku: 'PES-002', name: 'Camarón U-15',   qty:  6,  unit: 'kg', cost: 540, expDays: 4,  lot: 'L-12306' },
    { id: 3, sku: 'PES-003', name: 'Pulpo cocido',   qty:  4.5,unit: 'kg', cost: 410, expDays: 6,  lot: 'L-12307' },
  ]);

  // Catalog lookup: choosing an SKU autocompletes name/unit/cost/shelfLife
  const pickFromCatalog = (id, sku) => {
    const c = CATALOG.find(x => x.sku === sku);
    if (!c) return;
    setItems(items.map(i => i.id === id ? {
      ...i,
      sku: c.sku, name: c.name, unit: c.unit,
      cost: c.cost, expDays: c.shelfLife
    } : i));
  };

  const subtotal = items.reduce((s,i) => s + i.qty * i.cost, 0);
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  const update = (id, key, val) => setItems(items.map(i => i.id === id ? { ...i, [key]: val } : i));
  const remove = (id) => setItems(items.filter(i => i.id !== id));
  const addRow = () => setItems([...items, { id: Date.now(), sku: '', name: '', qty: 0, unit: 'kg', cost: 0, expDays: 0, lot: '' }]);

  if (submitted) {
    return (
      <div className="content">
        <div className="success-card">
          <div className="ic"><Icon name="check" size={28}/></div>
          <div className="t">Recepción registrada</div>
          <div className="s">
            {oc} · {supplier} · {fmtMXN(total)} agregados al inventario.<br/>
            Cuenta por pagar creada con vencimiento el 20 Jun 2026.
          </div>
          <div className="flex gap-2 center" style={{ justifyContent: 'center', marginTop: 18 }}>
            <button className="btn" onClick={() => setSubmitted(false)}>Nueva recepción</button>
            <button className="btn btn-primary" onClick={() => navigate && navigate('inventory')}>Ver en inventario</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <PageHead
        eyebrow="Operación diaria · captura"
        title="Recibir compra de insumos"
        sub="Registrar entrada de mercancía y actualizar inventario"
        actions={<>
          <button className="btn">Guardar borrador</button>
          <button className="btn btn-primary" onClick={() => setSubmitted(true)}>
            Confirmar recepción <Icon name="arrow_rt" size={13}/>
          </button>
        </>}
      />

      <div className="steps">
        <div className="step done"><div className="n"><Icon name="check" size={11}/></div>OC creada</div>
        <div className="step-link done"/>
        <div className="step on"><div className="n">2</div>Recepción</div>
        <div className="step-link"/>
        <div className="step"><div className="n">3</div>Cuenta por pagar</div>
        <div className="step-link"/>
        <div className="step"><div className="n">4</div>Pago</div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {/* Sección A — encabezado */}
        <div className="form-section">
          <div className="legend">Encabezado</div>
          <div className="legend-sub">Datos del proveedor y la orden de compra</div>
          <div className="form-grid c4">
            <div className="field">
              <span className="field-label">Proveedor</span>
              <select className="select" value={supplier} onChange={e => setSupplier(e.target.value)}>
                {SUPPLIERS.map(s => <option key={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="field">
              <span className="field-label">Orden de compra</span>
              <input className="input" value={oc} onChange={e => setOc(e.target.value)} placeholder="OC-XXXXX"/>
            </div>
            <div className="field">
              <span className="field-label">Recibido por</span>
              <select className="select" value={received} onChange={e => setReceived(e.target.value)}>
                {STAFF.map(s => <option key={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="field">
              <span className="field-label">Fecha de recepción</span>
              <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)}/>
            </div>
            <div className="field">
              <span className="field-label">Almacén destino</span>
              <select className="select" defaultValue="Cámara fría 1">
                <option>Cámara fría 1</option>
                <option>Cámara fría 2</option>
                <option>Refri prep</option>
                <option>Despensa seca</option>
              </select>
            </div>
            <div className="field">
              <span className="field-label">Factura / CFDI</span>
              <input className="input" placeholder="A-145728"/>
            </div>
            <div className="field">
              <span className="field-label">Condiciones</span>
              <select className="select" value={paymentTerm} onChange={e => setPaymentTerm(e.target.value)}>
                <option value="contado">Contado</option>
                <option value="credito">Crédito 30 días</option>
                <option value="credito15">Crédito 15 días</option>
                <option value="credito45">Crédito 45 días</option>
              </select>
            </div>
            <div className="field">
              <span className="field-label">Moneda</span>
              <select className="select"><option>MXN — Pesos</option><option>USD</option></select>
            </div>
          </div>
        </div>

        {/* Sección B — items */}
        <div className="form-section">
          <div className="flex between" style={{ marginBottom: 14 }}>
            <div>
              <div className="legend">Productos recibidos</div>
              <div className="legend-sub">
                {items.length} líneas · selecciona SKU del <a onClick={() => navigate && navigate('catalog')} style={{ color: 'var(--accent)', cursor: 'pointer' }}>catálogo de mercancías</a> para autocompletar
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn" onClick={() => navigate && navigate('catalog')}>
                <Icon name="link" size={13}/> Ver catálogo
              </button>
              <button className="btn" onClick={addRow}><Icon name="plus" size={13}/> Agregar línea</button>
            </div>
          </div>

          <table className="lines">
            <thead>
              <tr>
                <th style={{ width: 110 }}>SKU</th>
                <th>Producto</th>
                <th style={{ width: 80 }} className="right">Cantidad</th>
                <th style={{ width: 70 }}>Unidad</th>
                <th style={{ width: 110 }} className="right">Costo unit.</th>
                <th style={{ width: 110 }} className="right">Subtotal</th>
                <th style={{ width: 90 }} className="right">Cad. (días)</th>
                <th style={{ width: 100 }}>Lote</th>
                <th style={{ width: 28 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => {
                const inCat = CATALOG.find(c => c.sku === it.sku);
                return (
                <tr key={it.id}>
                  <td className="compact">
                    <select className="select mono" value={it.sku} onChange={e => pickFromCatalog(it.id, e.target.value)}>
                      <option value="">—</option>
                      {CATALOG.filter(c => c.status === 'active' && (c.supplier === supplier || c.altSupplier === supplier)).map(c =>
                        <option key={c.sku} value={c.sku}>{c.sku}</option>
                      )}
                      <optgroup label="Otros SKUs">
                        {CATALOG.filter(c => c.status === 'active' && c.supplier !== supplier && c.altSupplier !== supplier).map(c =>
                          <option key={c.sku} value={c.sku}>{c.sku}</option>
                        )}
                      </optgroup>
                    </select>
                  </td>
                  <td className="compact">
                    <input className="input" value={it.name} onChange={e => update(it.id, 'name', e.target.value)}/>
                    {inCat && <div className="mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 3 }}>
                      <Icon name="link" size={9}/> {inCat.cat} · {inCat.pack}
                    </div>}
                  </td>
                  <td className="compact right"><input className="input num" type="number" value={it.qty} style={{ textAlign: 'right' }} onChange={e => update(it.id, 'qty', parseFloat(e.target.value) || 0)}/></td>
                  <td className="compact">
                    <select className="select" value={it.unit} onChange={e => update(it.id, 'unit', e.target.value)}>
                      <option>kg</option><option>L</option><option>pz</option><option>bot</option><option>manojo</option>
                    </select>
                  </td>
                  <td className="compact right">
                    <input className="input num" type="number" value={it.cost} style={{ textAlign: 'right' }} onChange={e => update(it.id, 'cost', parseFloat(e.target.value) || 0)}/>
                    {inCat && it.cost !== inCat.cost && (
                      <div className="mono" style={{ fontSize: 10.5, marginTop: 3, color: it.cost > inCat.cost ? 'var(--danger)' : 'var(--positive)' }}>
                        cat. ${inCat.cost}
                      </div>
                    )}
                  </td>
                  <td className="compact right num">{fmtMXN(it.qty * it.cost)}</td>
                  <td className="compact right"><input className="input num" type="number" value={it.expDays} style={{ textAlign: 'right' }} onChange={e => update(it.id, 'expDays', parseInt(e.target.value) || 0)}/></td>
                  <td className="compact"><input className="input mono" value={it.lot} onChange={e => update(it.id, 'lot', e.target.value)}/></td>
                  <td className="compact right">
                    <button className="btn btn-ghost" onClick={() => remove(it.id)} style={{ padding: 4 }}>
                      <Icon name="x" size={13}/>
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="totals">
          <div className="notes">
            <div className="field">
              <span className="field-label">Notas de recepción</span>
              <textarea className="textarea" value={notes} onChange={e => setNotes(e.target.value)}/>
            </div>
            <div className="flex gap-3 mt-3" style={{ fontSize: 12, color: 'var(--muted)' }}>
              <label className="checkbox"><input type="checkbox" defaultChecked/> Adjuntar foto de remisión</label>
              <label className="checkbox"><input type="checkbox" defaultChecked/> Validar contra OC</label>
            </div>
          </div>
          <div className="sum">
            <div className="sum-row"><span className="muted">Subtotal</span><span className="num">{fmtMXN(subtotal)}</span></div>
            <div className="sum-row"><span className="muted">IVA 16%</span><span className="num">{fmtMXN(iva)}</span></div>
            <div className="sum-row total"><span>Total</span><span>{fmtMXN(total)}</span></div>
            <div className="muted" style={{ fontSize: 11.5, marginTop: 10 }}>
              Se generará cuenta por pagar a <strong style={{ color: 'var(--ink-2)' }}>{supplier}</strong>
              {paymentTerm === 'contado' ? ' a pagar hoy.' : paymentTerm === 'credito15' ? ', vence en 15 días.' : paymentTerm === 'credito45' ? ', vence en 45 días.' : ', vence en 30 días.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
window.PurchaseIntakeScreen = PurchaseIntakeScreen;
