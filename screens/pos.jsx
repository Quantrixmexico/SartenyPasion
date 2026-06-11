/* POS / Órdenes — vista de captura de comanda
   Cuentas abiertas, rejilla de menú por categoría, ticket en vivo con
   modificadores, desglose de IVA y propina, envío a cocina / cobro.
*/
const PosScreen = ({ role }) => {
  const [activeOrder, setActiveOrder] = useState('#1045');
  const [cat, setCat] = useState('Entradas');
  const [lines, setLines] = useState(() => POS_DRAFT.items.map(i => ({ ...i })));
  const [sent, setSent] = useState(false);

  const menu = MENU_DISHES.filter(d => d.status === 'active');
  const cats = DISH_CATEGORIES.filter(c => menu.some(d => d.cat === c));

  const addItem = (d) => {
    setSent(false);
    setLines(ls => {
      const ix = ls.findIndex(l => l.id === d.id && (l.mods || []).length === 0);
      if (ix >= 0) return ls.map((l, i) => i === ix ? { ...l, qty: l.qty + 1 } : l);
      return [...ls, { id: d.id, name: d.name, qty: 1, price: d.price, mods: [] }];
    });
  };
  const step = (i, n) => setLines(ls => ls.map((l, x) => x === i ? { ...l, qty: Math.max(0, l.qty + n) } : l).filter(l => l.qty > 0));
  const removeLine = (i) => setLines(ls => ls.filter((_, x) => x !== i));

  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const subtotal = total / 1.16;
  const iva = total - subtotal;
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <div className="content pos-content">
      <PageHead
        eyebrow="Punto de venta · turno de cena · 21:05"
        title="POS / Órdenes"
        sub="Captura de comanda, modificadores y envío a cocina en tiempo real"
        actions={<>
          <button className="btn"><Icon name="table" size={14}/> Mapa de mesas</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> Nueva cuenta</button>
        </>}
      />

      {/* OPEN ORDERS STRIP */}
      <div className="pos-orders">
        {POS_OPEN_ORDERS.map(o => (
          <button
            key={o.id}
            className={'pos-order ' + (activeOrder === o.id ? 'on' : '')}
            onClick={() => setActiveOrder(o.id)}
          >
            <div className="pos-order-top">
              <span className="pos-order-table">Mesa {o.table}</span>
              <span className={'pos-order-st ' + o.status}>
                {o.status === 'kitchen' ? 'En cocina' : o.status === 'bill' ? 'Cuenta' : 'Abierta'}
              </span>
            </div>
            <div className="pos-order-meta">{o.zone} · {o.server}</div>
            <div className="pos-order-foot">
              <span className="muted">{o.items} items · {o.opened}</span>
              <span className="num">{fmtMXN(o.total, { short: true })}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="pos-grid">
        {/* MENU */}
        <div className="pos-menu card" style={{ padding: 0 }}>
          <div className="pos-cats">
            {cats.map(c => (
              <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="pos-tiles">
            {menu.filter(d => d.cat === cat).map(d => (
              <button key={d.id} className="pos-tile" onClick={() => addItem(d)}>
                <span className="pos-tile-tone" style={{ background: d.photoTone }}>
                  <span className="pos-tile-station">{d.station}</span>
                </span>
                <span className="pos-tile-name">{d.name}</span>
                <span className="pos-tile-foot">
                  <span className="num">{fmtMXN(d.price)}</span>
                  <span className="pos-tile-add"><Icon name="plus" size={13}/></span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* TICKET */}
        <div className="pos-ticket card" style={{ padding: 0 }}>
          <div className="pos-ticket-head">
            <div>
              <div className="pos-ticket-table">Mesa {POS_DRAFT.table} <span className="muted" style={{ fontSize: 12 }}>· {POS_DRAFT.zone}</span></div>
              <div className="muted" style={{ fontSize: 12 }}>{POS_DRAFT.server} · {POS_DRAFT.pax} pax · abierta {POS_DRAFT.opened}</div>
            </div>
            <span className="tag">{activeOrder}</span>
          </div>

          <div className="pos-lines">
            {lines.length === 0 && <div className="pos-empty muted">Toca un platillo para iniciar la comanda</div>}
            {lines.map((l, i) => (
              <div key={i} className="pos-line">
                <div className="pos-stepper">
                  <button onClick={() => step(i, -1)} aria-label="Quitar uno">−</button>
                  <span className="num">{l.qty}</span>
                  <button onClick={() => step(i, +1)} aria-label="Agregar uno">+</button>
                </div>
                <div className="pos-line-body">
                  <div className="pos-line-name">{l.name}</div>
                  {l.mods.length > 0 && <div className="pos-line-mods">{l.mods.join(' · ')}</div>}
                </div>
                <div className="pos-line-amt num">{fmtMXN(l.price * l.qty)}</div>
                <button className="pos-line-x" onClick={() => removeLine(i)} aria-label="Eliminar"><Icon name="x" size={12}/></button>
              </div>
            ))}
          </div>

          <div className="pos-totals">
            <div className="pos-tot-row"><span>Subtotal</span><span className="num">{fmtMXN(subtotal)}</span></div>
            <div className="pos-tot-row"><span>IVA 16%</span><span className="num">{fmtMXN(iva)}</span></div>
            <div className="pos-tot-row total"><span>Total</span><span className="num">{fmtMXN(total)}</span></div>
            <div className="pos-tip">
              <span className="muted">Propina sugerida</span>
              <div className="pos-tip-opts">
                {[10, 12.5, 15].map(p => (
                  <span key={p} className="pos-tip-opt">
                    {p}% · <b className="num">{fmtMXN(total * p / 100, { short: true })}</b>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pos-actions">
            {sent ? (
              <div className="pos-sent"><Icon name="check" size={14}/> Comanda enviada a cocina · {count} items</div>
            ) : (
              <>
                <button className="btn" disabled={!count}><Icon name="receipt" size={14}/> Cobrar</button>
                <button className="btn btn-primary" disabled={!count} onClick={() => setSent(true)}>
                  <Icon name="flame" size={14}/> Enviar a cocina
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
window.PosScreen = PosScreen;
