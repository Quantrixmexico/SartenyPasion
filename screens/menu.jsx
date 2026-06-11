/* Menú y Recetas — platillos con receta vinculada al catálogo
   Costea automáticamente y descuenta inventario al venderse.
*/
const MenuScreen = ({ role, navigate }) => {
  const [tab, setTab] = useState('active');
  const [cat, setCat] = useState('Todas');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [drawerMode, setDrawerMode] = useState('view');

  const computeCost = (recipe) => recipe.reduce((sum, line) => {
    const c = CATALOG.find(s => s.sku === line.sku);
    if (!c) return sum;
    return sum + (c.cost * line.qty);
  }, 0);

  const enriched = MENU_DISHES.map(d => {
    const cost = computeCost(d.recipe);
    const fc = d.price > 0 ? (cost / d.price * 100) : 0;
    const margin = d.price - cost;
    return { ...d, foodCost: cost, foodCostPct: fc, margin, marginPct: 100 - fc };
  });

  const counts = {
    active:    enriched.filter(d => d.status === 'active').length,
    inactive:  enriched.filter(d => d.status === 'inactive').length,
    featured:  enriched.filter(d => d.featured).length,
  };

  const cats = ['Todas', ...DISH_CATEGORIES];

  const list = enriched
    .filter(d => tab === 'active' ? d.status === 'active' : tab === 'inactive' ? d.status === 'inactive' : true)
    .filter(d => cat === 'Todas' || d.cat === cat)
    .filter(d => !query || d.name.toLowerCase().includes(query.toLowerCase()));

  // KPIs
  const active = enriched.filter(d => d.status === 'active');
  const avgFc = active.length ? active.reduce((s, d) => s + d.foodCostPct, 0) / active.length : 0;
  const avgMargin = active.length ? active.reduce((s, d) => s + d.marginPct, 0) / active.length : 0;
  const todayRevenue = active.reduce((s, d) => s + (d.sold * d.price), 0);

  // Find dishes that depend on blocked SKUs
  const blockedSkus = CATALOG.filter(c => c.status !== 'active').map(c => c.sku);
  const atRisk = enriched.filter(d =>
    d.status === 'active' && d.recipe.some(r => blockedSkus.includes(r.sku))
  );

  const openView = (d) => { setSelected(d); setDrawerMode('view'); };
  const closeDrawer = () => { setSelected(null); setDrawerMode('view'); };

  return (
    <div className="content">
      <PageHead
        eyebrow="Operación · maestro de carta"
        title="Menú y recetas"
        sub={`${MENU_DISHES.length} platillos · food cost promedio ${avgFc.toFixed(1)}% · costeo auto vinculado al catálogo`}
        actions={<>
          <button className="btn"><Icon name="download" size={14}/> Exportar carta</button>
          <button className="btn" onClick={() => navigate && navigate('catalog')}>
            <Icon name="link" size={14}/> Catálogo
          </button>
          {role === 'operator' && (
            <button className="btn btn-primary">
              <Icon name="plus" size={14}/> Nuevo platillo
            </button>
          )}
        </>}
      />

      <div className="row cols-4">
        <div className="card kpi">
          <div className="kpi-label">Platillos activos</div>
          <div className="kpi-value num">{counts.active}</div>
          <div className="kpi-target">{counts.featured} destacados · {counts.inactive} inactivos</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Food cost promedio</div>
          <div className="kpi-value num" style={{
            color: avgFc > 32 ? 'var(--danger)' : avgFc > 30 ? 'var(--warning)' : 'var(--positive)'
          }}>
            {avgFc.toFixed(1)}%
          </div>
          <div className="kpi-target">Meta &lt; 30% · {Math.round((avgFc-30)*10)/10 > 0 ? '+' : ''}{(avgFc-30).toFixed(1)} pp</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Ventas hoy · carta</div>
          <div className="kpi-value"><span className="currency">$</span>{(todayRevenue/1000).toFixed(1)}k</div>
          <div className="kpi-target">{active.reduce((s,d)=>s+d.sold,0)} platillos servidos</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Platillos en riesgo</div>
          <div className="kpi-value num" style={{ color: atRisk.length > 0 ? 'var(--warning)' : 'var(--ink)' }}>
            {atRisk.length}
          </div>
          <div className="kpi-target">Ingrediente bloqueado o sin stock</div>
        </div>
      </div>

      {/* SERVICES STRIP */}
      <div className="services-strip">
        <div className="eyebrow" style={{ marginRight: 'auto' }}>Servicios del día</div>
        {MENU_SERVICES.map(s => (
          <div key={s.id} className={'service-chip ' + (s.active ? 'on' : 'off')}>
            <span className="dot"/>
            <div>
              <div className="t">{s.label}</div>
              <div className="s mono">{s.hours} · {s.dishes} platillos</div>
            </div>
          </div>
        ))}
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[
        { value: 'active',   label: 'Activos',          count: counts.active },
        { value: 'inactive', label: 'Inactivos',         count: counts.inactive },
        { value: 'all',      label: 'Todos',             count: MENU_DISHES.length },
      ]}/>

      <div className="card" style={{ padding: 14 }}>
        <div className="flex between center" style={{ marginBottom: 14, gap: 16 }}>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {cats.map(c => (
              <button key={c}
                onClick={() => setCat(c)}
                style={{
                  cursor: 'pointer',
                  background: cat === c ? 'var(--accent-soft)' : 'var(--surface-2)',
                  color: cat === c ? 'var(--accent)' : 'var(--ink-2)',
                  border: '1px solid ' + (cat === c ? 'var(--accent-soft)' : 'var(--border)'),
                  borderRadius: 100, padding: '4px 12px', fontSize: 11.5
                }}>
                {c}
              </button>
            ))}
          </div>
          <div className="search" style={{ flex: '0 0 240px' }}>
            <Icon name="search" size={13}/>
            <input placeholder="Buscar platillo…" value={query} onChange={e => setQuery(e.target.value)}/>
          </div>
        </div>

        <div className="dish-grid">
          {list.map(d => <DishCard key={d.id} d={d} onClick={() => openView(d)} atRisk={atRisk.includes(d)}/>)}
          {list.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
              Sin platillos en esta vista.
            </div>
          )}
        </div>
      </div>

      {/* DRAWER */}
      <div className={'drawer-backdrop ' + (selected ? 'open' : '')} onClick={closeDrawer}/>
      <div className={'drawer ' + (selected ? 'open' : '')} style={{ width: 640 }}>
        {selected && <DishDetail d={selected} navigate={navigate} onClose={closeDrawer}/>}
      </div>
    </div>
  );
};

/* DISH CARD */
const DishCard = ({ d, onClick, atRisk }) => {
  const fcCls = d.foodCostPct > 35 ? 'danger' : d.foodCostPct > 30 ? 'warning' : 'positive';
  return (
    <div className="dish-card" onClick={onClick}>
      <div className="dish-photo" style={{ background: d.photoTone }}>
        <div className="dish-photo-fade"/>
        <div className="dish-photo-icon">
          {/* placeholder utensilio */}
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none">
            <circle cx="12" cy="12" r="9"/>
            <circle cx="12" cy="12" r="5" opacity="0.5"/>
          </svg>
        </div>
        {d.featured && (
          <span className="featured-badge"><Icon name="check" size={9}/> Destacado</span>
        )}
        {atRisk && (
          <span className="risk-badge" title={d.statusReason || 'Ingrediente con riesgo'}>
            <Icon name="alert" size={9}/> Riesgo
          </span>
        )}
        {d.status === 'inactive' && (
          <span className="inactive-badge">Inactivo</span>
        )}
      </div>
      <div className="dish-body">
        <div className="flex between" style={{ alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="dish-cat eyebrow">{d.cat}</div>
            <div className="dish-name">{d.name}</div>
          </div>
          <div className="dish-price serif">${d.price}</div>
        </div>
        <div className="dish-stats">
          <div>
            <div className="dish-stat-l">Food cost</div>
            <div className={'dish-stat-v ' + fcCls}>{d.foodCostPct.toFixed(1)}%</div>
          </div>
          <div>
            <div className="dish-stat-l">Costo unit.</div>
            <div className="dish-stat-v num">${d.foodCost.toFixed(0)}</div>
          </div>
          <div>
            <div className="dish-stat-l">Vendidos hoy</div>
            <div className="dish-stat-v num">{d.sold}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* DISH DETAIL */
const DishDetail = ({ d, onClose, navigate }) => {
  const recipeEnriched = d.recipe.map(r => {
    const c = CATALOG.find(s => s.sku === r.sku) || {};
    const inv = INVENTORY.find(i => i.sku === r.sku);
    return {
      ...r,
      name: c.name || '—',
      cat: c.cat || '—',
      unitCost: c.cost || 0,
      lineCost: (c.cost || 0) * r.qty,
      status: c.status || 'active',
      stock: inv ? inv.stock : null,
      portionsLeft: inv && r.qty > 0 ? Math.floor(inv.stock / r.qty) : null,
    };
  });

  const cost = recipeEnriched.reduce((s, l) => s + l.lineCost, 0);
  const fcPct = d.price ? (cost / d.price * 100) : 0;
  const margin = d.price - cost;

  // portions available = min across all ingredients
  const allPortions = recipeEnriched.filter(r => r.portionsLeft !== null).map(r => r.portionsLeft);
  const portionsLeft = allPortions.length ? Math.min(...allPortions) : null;
  const bottleneck = allPortions.length ? recipeEnriched.find(r => r.portionsLeft === Math.min(...allPortions)) : null;

  const fcCls = fcPct > 35 ? 'danger' : fcPct > 30 ? 'warning' : 'positive';

  return (
    <>
      <div className="dish-hero" style={{ background: d.photoTone }}>
        <div className="dish-hero-fade"/>
        <div className="dish-hero-content">
          <div className="page-eyebrow" style={{ color: 'rgba(255,255,255,0.6)' }}>{d.cat} · {d.id}</div>
          <div className="dish-hero-title serif">{d.name}</div>
          <div className="dish-hero-sub">{d.description}</div>
          <div className="dish-hero-meta">
            <span><Icon name="cal" size={11}/> Prep {d.prepTime} min</span>
            <span>· Estación {d.station}</span>
            {d.allergens.length > 0 && <span>· Alérgenos: {d.allergens.join(', ')}</span>}
          </div>
        </div>
        <button className="btn btn-ghost dish-close-btn" onClick={onClose}>
          <Icon name="x" size={14}/>
        </button>
      </div>

      <div className="drawer-body">
        {d.status === 'inactive' && d.statusReason && (
          <div className="form-section" style={{ paddingTop: 16 }}>
            <div className="alert-card" style={{ background: 'var(--warning-soft)', borderColor: 'var(--warning)' }}>
              <div className="ico" style={{ background: 'var(--warning)', color: 'var(--bg)' }}>
                <Icon name="lock" size={16}/>
              </div>
              <div>
                <div className="t">Platillo inactivo</div>
                <div className="s">{d.statusReason}</div>
              </div>
            </div>
          </div>
        )}

        {/* Costing strip */}
        <div className="form-section">
          <div className="legend">Costeo automático</div>
          <div className="legend-sub">
            Calculado en vivo desde costos del catálogo · cualquier cambio en SKU se refleja aquí
          </div>
          <div className="cost-grid">
            <div className="cost-box">
              <div className="l">Precio venta</div>
              <div className="v serif">${d.price}</div>
            </div>
            <div className="cost-box">
              <div className="l">Costo receta</div>
              <div className="v serif">${cost.toFixed(2)}</div>
            </div>
            <div className="cost-box">
              <div className="l">Food cost</div>
              <div className={'v serif ' + fcCls}>{fcPct.toFixed(1)}%</div>
            </div>
            <div className="cost-box">
              <div className="l">Margen $</div>
              <div className="v serif positive">${margin.toFixed(0)}</div>
            </div>
          </div>

          {/* Margin bar */}
          <div className="margin-bar" style={{ marginTop: 14 }}>
            <span className="seg cost"  style={{ width: fcPct + '%' }} title={`Costo ${fcPct.toFixed(1)}%`}/>
            <span className="seg margin" style={{ width: (100-fcPct) + '%' }} title={`Margen ${(100-fcPct).toFixed(1)}%`}/>
          </div>
          <div className="flex between mono" style={{ fontSize: 10.5, color: 'var(--muted)', marginTop: 4 }}>
            <span>Costo</span>
            <span>Margen contribución</span>
          </div>
        </div>

        {/* Recipe */}
        <div className="form-section">
          <div className="legend">Receta · ingredientes vinculados</div>
          <div className="legend-sub">
            Al vender este platillo, se descuenta del inventario en estas proporciones.
          </div>
          <table className="recipe-tbl">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Ingrediente</th>
                <th className="right">Cantidad</th>
                <th className="right">Costo unit.</th>
                <th className="right">Costo línea</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recipeEnriched.map((r, i) => (
                <tr key={i} onClick={() => navigate && navigate('catalog')} style={{ cursor: 'pointer' }}>
                  <td className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                    <Icon name="link" size={9}/> {r.sku}
                  </td>
                  <td>
                    <div>{r.name}</div>
                    <div className="sub">{r.cat}</div>
                  </td>
                  <td className="right num">{r.qty} {r.unit}</td>
                  <td className="right num muted">${r.unitCost}/{r.unit}</td>
                  <td className="right num">${r.lineCost.toFixed(2)}</td>
                  <td className="right">
                    {r.status !== 'active' && (
                      <span className="pill warning" style={{ fontSize: 10 }}>
                        <span className="dot"/>{r.status === 'blocked' ? 'Bloqueado' : 'Descontinuado'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              <tr style={{ background: 'var(--surface-2)', fontWeight: 500 }}>
                <td colSpan="4" style={{ paddingLeft: 12 }}>Total costo unitario</td>
                <td className="right num">${cost.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Inventory linkage */}
        {portionsLeft !== null && (
          <div className="form-section">
            <div className="legend">Disponibilidad en inventario</div>
            <div className="portion-card" onClick={() => navigate && navigate('inventory')}>
              <div>
                <div className="eyebrow"><Icon name="inventory" size={11}/> Porciones que se pueden servir</div>
                <div className="serif" style={{ fontSize: 32, lineHeight: 1, marginTop: 6 }}>
                  {portionsLeft}
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  {bottleneck && `Limitante: ${bottleneck.name} · ${bottleneck.stock} ${bottleneck.unit} disponibles`}
                </div>
              </div>
              <Icon name="arrow_rt" size={16}/>
            </div>
          </div>
        )}

        {/* Modifiers */}
        {d.modifiers.length > 0 && (
          <div className="form-section">
            <div className="legend">Modificadores y extras</div>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {d.modifiers.map((m, i) => (
                <span key={i} className="tag" style={{ fontSize: 11.5, padding: '5px 10px' }}>{m}</span>
              ))}
            </div>
          </div>
        )}

        {/* Schedules */}
        <div className="form-section">
          <div className="legend">Disponible en</div>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {MENU_SERVICES.filter(s => d.schedules.includes(s.label)).map(s => (
              <span key={s.id} className="pill accent" style={{ fontSize: 11 }}>
                <span className="dot"/>{s.label} · {s.hours}
              </span>
            ))}
          </div>
        </div>

        {/* Telemetry */}
        <div className="form-section">
          <div className="legend">Desempeño · hoy</div>
          <div className="kv-grid">
            <KV l="Vendidos" v={<span className="num">{d.sold}</span>}/>
            <KV l="Revenue" v={<span className="num">{fmtMXN(d.sold * d.price)}</span>}/>
            <KV l="Costo total" v={<span className="num muted">{fmtMXN(d.sold * cost)}</span>}/>
            <KV l="Margen contribución" v={<span className="num positive">{fmtMXN(d.sold * margin)}</span>}/>
          </div>
        </div>
      </div>

      <div className="drawer-foot">
        {d.status === 'active'
          ? <button className="btn" style={{ marginRight: 'auto' }}><Icon name="archive" size={13}/> Desactivar</button>
          : <button className="btn" style={{ marginRight: 'auto' }}><Icon name="check" size={13}/> Reactivar</button>}
        <button className="btn" onClick={onClose}>Cerrar</button>
        <button className="btn btn-primary"><Icon name="pencil" size={13}/> Editar receta</button>
      </div>
    </>
  );
};

/* small KV helper (reuse if not already global) */
if (typeof KV === 'undefined') {
  window.KV = ({ l, v }) => (
    <div className="kv-row">
      <div className="kv-l">{l}</div>
      <div className="kv-v">{v}</div>
    </div>
  );
}

window.MenuScreen = MenuScreen;
