/* Inventario */
const InventoryScreen = ({ role, navigate }) => {
  const [filter, setFilter] = useState('all');
  const cats = ['all', ...new Set(INVENTORY.map(i => i.cat))];
  const filtered = filter === 'all' ? INVENTORY : INVENTORY.filter(i => i.cat === filter);

  const lowStock = INVENTORY.filter(i => i.stock < i.reorder).length;
  const totalValue = INVENTORY.reduce((s,i) => s + i.stock * i.cost, 0);

  return (
    <div className="content">
      <PageHead
        eyebrow="Inventario · tiempo real"
        title="Inventario"
        sub={`${INVENTORY.length} SKUs activos · valor en almacén ${fmtMXN(totalValue)} · vinculado al catálogo de mercancías`}
        actions={<>
          <button className="btn" onClick={() => navigate && navigate('catalog')}><Icon name="link" size={14}/> Ver catálogo</button>
          <button className="btn"><Icon name="download" size={14}/> Exportar</button>
          {role === 'operator' && <button className="btn btn-primary" onClick={() => navigate && navigate('intake')}><Icon name="plus" size={14}/> Recepción</button>}
        </>}
      />

      <div className="row cols-4">
        <div className="card kpi">
          <div className="kpi-label">Valor en almacén</div>
          <div className="kpi-value"><span className="currency">$</span>{(totalValue/1000).toFixed(1)}k</div>
          <div className="kpi-target">{INVENTORY.length} SKUs · 6 categorías</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Bajo nivel de reorden</div>
          <div className="kpi-value">{lowStock}</div>
          <div className="kpi-target">Genera OC sugerida automática</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Próximos a caducar</div>
          <div className="kpi-value">{EXPIRING.filter(e => e.severity !== 'muted').length}</div>
          <div className="kpi-target">≤ 5 días · costo $ 3,820</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Rotación promedio</div>
          <div className="kpi-value num">3.8<span style={{fontSize:18, color:'var(--muted)'}}>x</span></div>
          <div className="kpi-target">Mensual · saludable</div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-head">
          <div className="flex gap-2">
            {cats.map(c => (
              <button key={c}
                onClick={() => setFilter(c)}
                className={'tag ' + (filter === c ? '' : '')}
                style={{
                  cursor: 'pointer',
                  background: filter === c ? 'var(--accent-soft)' : 'var(--surface-2)',
                  color: filter === c ? 'var(--accent)' : 'var(--ink-2)',
                  borderColor: filter === c ? 'var(--accent-soft)' : 'var(--border)',
                  padding: '4px 10px', fontSize: 11.5
                }}>
                {c === 'all' ? 'Todos' : c}
              </button>
            ))}
          </div>
          <div className="card-meta">{filtered.length} SKUs · actualizado hace 2 min</div>
        </div>

        <table className="tbl">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th className="right">Stock actual</th>
              <th>Nivel</th>
              <th className="right">Reorden</th>
              <th className="right">Costo unit.</th>
              <th className="right">Valor</th>
              <th className="right">Caducidad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it, i) => {
              const pct = (it.stock / it.par) * 100;
              const low = it.stock < it.reorder;
              const critical = it.stock < it.reorder * 0.6;
              return (
                <tr key={i}>
                  <td className="num" style={{ color: 'var(--muted)', fontSize: 11.5 }}>
                    <span
                      onClick={(e) => { e.stopPropagation(); navigate && navigate('catalog'); }}
                      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      title="Abrir en catálogo"
                    >
                      <Icon name="link" size={10}/> {it.sku}
                    </span>
                  </td>
                  <td>
                    <div>{it.name}</div>
                    <div className="sub">{it.cat} · {it.unit}</div>
                  </td>
                  <td className="right num">
                    <span style={{ color: critical ? 'var(--danger)' : low ? 'var(--warning)' : 'var(--ink)' }}>
                      {it.stock} {it.unit}
                    </span>
                  </td>
                  <td style={{ width: 160 }}>
                    <div className="bar">
                      <span style={{
                        width: Math.min(100, pct) + '%',
                        background: critical ? 'var(--danger)' : low ? 'var(--warning)' : 'var(--accent)'
                      }}/>
                    </div>
                    <div className="muted mono" style={{ fontSize: 10.5, marginTop: 3 }}>
                      par {it.par}{it.unit}
                    </div>
                  </td>
                  <td className="right num">{it.reorder}</td>
                  <td className="right num">${it.cost}</td>
                  <td className="right num">{fmtMXN(it.stock * it.cost)}</td>
                  <td className="right">
                    {it.expDays > 30 ?
                      <span className="muted mono" style={{fontSize: 11.5}}>{it.expDays}d</span> :
                      <span className={'pill ' + (it.expDays <= 2 ? 'danger' : it.expDays <= 5 ? 'warning' : 'neutral')}>
                        <span className="dot"/>{it.expDays}d
                      </span>
                    }
                  </td>
                  <td className="right">
                    <button className="btn btn-ghost" style={{ padding: '4px 8px' }} onClick={() => navigate && navigate('catalog')}>
                      <Icon name="arrow_rt" size={12}/>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
window.InventoryScreen = InventoryScreen;
