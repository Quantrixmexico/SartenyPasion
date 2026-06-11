/* Catálogo de Mercancías — base maestra de SKUs
   Vinculado a: Inventario, Recibir compra, Recetas
*/
const CatalogScreen = ({ role, navigate }) => {
  const [filter, setFilter] = useState('active');
  const [cat, setCat] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [drawerMode, setDrawerMode] = useState('view');     // 'view' | 'new' | 'edit'

  // form state for new SKU
  const empty = {
    sku: '', name: '', cat: 'Carnes', unit: 'kg', pack: '',
    supplier: SUPPLIER_DIR[0].name, altSupplier: '—',
    cost: '', taxRate: 0.16, shelfLife: 30, storage: 'Despensa seca',
    barcode: '', notes: ''
  };
  const [form, setForm] = useState(empty);
  const set = (k, v) => setForm({ ...form, [k]: v });

  const openNew = () => { setForm(empty); setSelected(null); setDrawerMode('new'); };
  const openView = (s) => { setSelected(s); setDrawerMode('view'); };
  const openEdit = () => {
    if (!selected) return;
    setForm({
      sku: selected.sku, name: selected.name, cat: selected.cat, unit: selected.unit,
      pack: selected.pack, supplier: selected.supplier, altSupplier: selected.altSupplier,
      cost: String(selected.cost), taxRate: selected.taxRate, shelfLife: selected.shelfLife,
      storage: selected.storage, barcode: selected.barcode, notes: ''
    });
    setDrawerMode('edit');
  };
  const close = () => { setSelected(null); setDrawerMode('view'); };

  const counts = {
    active: CATALOG.filter(s => s.status === 'active').length,
    blocked: CATALOG.filter(s => s.status === 'blocked').length,
    discontinued: CATALOG.filter(s => s.status === 'discontinued').length,
  };

  const cats = ['all', ...Array.from(new Set(CATALOG.map(s => s.cat)))];
  const list = CATALOG
    .filter(s => filter === 'active' ? s.status === 'active' : filter === 'blocked' ? s.status === 'blocked' : s.status === 'discontinued')
    .filter(s => cat === 'all' || s.cat === cat)
    .filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.sku.toLowerCase().includes(query.toLowerCase()));

  // resolve inventory linkage
  const getStock = (sku) => (INVENTORY.find(i => i.sku === sku) || null);

  const statusPill = (st) => {
    if (st === 'active')       return <span className="pill positive"><span className="dot"/>Activo</span>;
    if (st === 'blocked')      return <span className="pill warning"><span className="dot"/>Bloqueado</span>;
    if (st === 'discontinued') return <span className="pill neutral"><span className="dot"/>Descontinuado</span>;
    return null;
  };

  const totalValue = CATALOG
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      const inv = INVENTORY.find(i => i.sku === s.sku);
      return sum + (inv ? inv.stock * s.cost : 0);
    }, 0);

  const noStock = CATALOG.filter(s => s.status === 'active' && !INVENTORY.find(i => i.sku === s.sku)).length;

  return (
    <div className="content">
      <PageHead
        eyebrow="Maestro · base de datos"
        title="Catálogo de mercancías"
        sub={`${CATALOG.length} SKUs · ${counts.active} activos · ${counts.blocked} bloqueados · vinculado a Inventario y Recibir compra`}
        actions={<>
          <button className="btn"><Icon name="download" size={14}/> Exportar CSV</button>
          <button className="btn"><Icon name="filter" size={14}/> Importar</button>
          <button className="btn btn-primary" onClick={openNew}>
            <Icon name="plus" size={14}/> Nueva mercancía
          </button>
        </>}
      />

      <div className="row cols-4">
        <div className="card kpi">
          <div className="kpi-label">SKUs en catálogo</div>
          <div className="kpi-value num">{CATALOG.length}</div>
          <div className="kpi-target">{cats.length - 1} categorías · {SUPPLIER_DIR.filter(s=>s.status==='active').length} proveedores</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Valor en almacén</div>
          <div className="kpi-value"><span className="currency">$</span>{(totalValue/1000).toFixed(1)}k</div>
          <div className="kpi-target">Costo actual × stock</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Bloqueados</div>
          <div className="kpi-value num" style={{ color: counts.blocked > 0 ? 'var(--warning)' : 'var(--ink)' }}>{counts.blocked}</div>
          <div className="kpi-target">No comprables · revisar motivo</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Sin stock registrado</div>
          <div className="kpi-value num">{noStock}</div>
          <div className="kpi-target">Activos sin movimiento en inventario</div>
        </div>
      </div>

      <Tabs value={filter} onChange={setFilter} tabs={[
        { value: 'active',       label: 'Activos',       count: counts.active },
        { value: 'blocked',      label: 'Bloqueados',    count: counts.blocked },
        { value: 'discontinued', label: 'Descontinuados', count: counts.discontinued },
      ]}/>

      <div className="card" style={{ padding: 0 }}>
        <div className="card-head" style={{ padding: '14px 18px 0', marginBottom: 0 }}>
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
                {c === 'all' ? 'Todas' : c}
              </button>
            ))}
          </div>
          <div className="search" style={{ flex: '0 0 240px' }}>
            <Icon name="search" size={13}/>
            <input placeholder="Buscar SKU o producto…" value={query} onChange={e => setQuery(e.target.value)}/>
          </div>
        </div>

        <table className="tbl" style={{ marginTop: 8 }}>
          <thead>
            <tr>
              <th style={{ paddingLeft: 18 }}>SKU</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th className="right">Costo unit.</th>
              <th>Proveedor preferido</th>
              <th className="right">Stock</th>
              <th className="right">Caducidad</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((s, i) => {
              const inv = getStock(s.sku);
              const low = inv && inv.stock < inv.reorder;
              const costDelta = s.cost - s.lastCost;
              return (
                <tr key={i} onClick={() => openView(s)} style={{ cursor: 'pointer' }}>
                  <td className="num" style={{ color: 'var(--muted)', fontSize: 11.5, paddingLeft: 18 }}>{s.sku}</td>
                  <td>
                    <div>{s.name}</div>
                    <div className="sub">{s.pack} · {s.usedIn[0] || '—'}</div>
                  </td>
                  <td><span className="tag">{s.cat}</span></td>
                  <td className="right num">
                    ${s.cost}<span style={{ color: 'var(--muted)', fontSize: 11 }}>/{s.unit}</span>
                    {costDelta !== 0 && (
                      <div className="mono" style={{
                        fontSize: 10.5, marginTop: 2,
                        color: costDelta > 0 ? 'var(--danger)' : 'var(--positive)'
                      }}>
                        {costDelta > 0 ? '▲' : '▼'} ${Math.abs(costDelta)}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: 12.5 }}>
                    {s.supplier}
                    {s.altSupplier !== '—' && (
                      <div className="sub">alt. {s.altSupplier}</div>
                    )}
                  </td>
                  <td className="right num">
                    {inv ? (
                      <span style={{ color: low ? 'var(--warning)' : 'var(--ink)' }}>
                        {inv.stock} {s.unit}
                      </span>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="right">
                    {s.shelfLife > 30
                      ? <span className="muted mono" style={{ fontSize: 11.5 }}>{s.shelfLife}d</span>
                      : <span className={'pill ' + (s.shelfLife <= 3 ? 'danger' : s.shelfLife <= 7 ? 'warning' : 'neutral')}>
                          <span className="dot"/>{s.shelfLife}d
                        </span>}
                  </td>
                  <td>{statusPill(s.status)}</td>
                  <td className="right" style={{ paddingRight: 18 }}>
                    <Icon name="arrow_rt" size={13}/>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                Sin resultados — ajusta filtros o crea una nueva mercancía.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="row cols-3 mt-4">
        <div className="card lift" onClick={() => navigate && navigate('inventory')} style={{ cursor: 'pointer' }}>
          <div className="flex between center">
            <div>
              <div className="eyebrow"><Icon name="link" size={11}/> Vinculado</div>
              <div className="section-title" style={{ margin: '6px 0 2px' }}>Inventario</div>
              <div className="muted" style={{ fontSize: 12 }}>Stocks y movimientos por SKU</div>
            </div>
            <Icon name="arrow_rt" size={16}/>
          </div>
        </div>
        <div className="card lift" onClick={() => navigate && navigate('intake')} style={{ cursor: 'pointer' }}>
          <div className="flex between center">
            <div>
              <div className="eyebrow"><Icon name="link" size={11}/> Vinculado</div>
              <div className="section-title" style={{ margin: '6px 0 2px' }}>Recibir compra</div>
              <div className="muted" style={{ fontSize: 12 }}>El SKU se autocompleta al recibir</div>
            </div>
            <Icon name="arrow_rt" size={16}/>
          </div>
        </div>
        <div className="card lift" onClick={() => navigate && navigate('suppliers')} style={{ cursor: 'pointer' }}>
          <div className="flex between center">
            <div>
              <div className="eyebrow"><Icon name="link" size={11}/> Vinculado</div>
              <div className="section-title" style={{ margin: '6px 0 2px' }}>Proveedores</div>
              <div className="muted" style={{ fontSize: 12 }}>Asignación de proveedor preferido</div>
            </div>
            <Icon name="arrow_rt" size={16}/>
          </div>
        </div>
      </div>

      {/* DETAIL / EDIT / NEW DRAWER */}
      <div className={'drawer-backdrop ' + ((selected || drawerMode === 'new') ? 'open' : '')} onClick={close}/>
      <div className={'drawer ' + ((selected || drawerMode === 'new') ? 'open' : '')} style={{ width: 620 }}>
        {drawerMode === 'view' && selected && (
          <CatalogDetail item={selected} onClose={close} onEdit={openEdit} navigate={navigate}/>
        )}
        {(drawerMode === 'new' || drawerMode === 'edit') && (
          <CatalogForm
            mode={drawerMode}
            form={form}
            set={set}
            onClose={close}
            onCancel={() => selected ? setDrawerMode('view') : close()}
            selected={selected}
          />
        )}
      </div>
    </div>
  );
};

/* DETALLE DE UN SKU */
const CatalogDetail = ({ item, onClose, onEdit, navigate }) => {
  const inv = INVENTORY.find(i => i.sku === item.sku);
  return (
    <>
      <div className="drawer-head">
        <div>
          <div className="page-eyebrow">{item.cat}</div>
          <div className="t">{item.name}</div>
          <div className="s mono">{item.sku} · {item.pack}</div>
        </div>
        <div className="flex gap-2">
          {item.status === 'active'
            ? <span className="pill positive"><span className="dot"/>Activo</span>
            : item.status === 'blocked'
              ? <span className="pill warning"><span className="dot"/>Bloqueado</span>
              : <span className="pill neutral"><span className="dot"/>Descontinuado</span>}
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: 6 }}>
            <Icon name="x" size={14}/>
          </button>
        </div>
      </div>

      <div className="drawer-body">
        {item.status === 'blocked' && item.blockReason && (
          <div className="form-section" style={{ paddingTop: 16 }}>
            <div className="alert-card" style={{ background: 'var(--warning-soft)', borderColor: 'var(--warning)' }}>
              <div className="ico" style={{ background: 'var(--warning)', color: 'var(--bg)' }}>
                <Icon name="lock" size={16}/>
              </div>
              <div>
                <div className="t">Motivo de bloqueo</div>
                <div className="s">{item.blockReason}</div>
              </div>
            </div>
          </div>
        )}

        <div className="form-section">
          <div className="legend">Identificación</div>
          <div className="kv-grid">
            <KV l="SKU"           v={<span className="mono">{item.sku}</span>}/>
            <KV l="Código de barras" v={<span className="mono">{item.barcode}</span>}/>
            <KV l="Unidad base"   v={item.unit}/>
            <KV l="Presentación"  v={item.pack}/>
            <KV l="Categoría"     v={<span className="tag">{item.cat}</span>}/>
            <KV l="Almacén"       v={item.storage}/>
          </div>
        </div>

        <div className="form-section">
          <div className="legend">Costo y fiscal</div>
          <div className="kv-grid">
            <KV l="Costo actual"  v={<span className="num">${item.cost}/{item.unit}</span>}/>
            <KV l="Último costo"  v={<span className="num muted">${item.lastCost}/{item.unit}</span>}/>
            <KV l="IVA"           v={`${(item.taxRate*100).toFixed(0)} %`}/>
            <KV l="Vida útil"     v={`${item.shelfLife} días`}/>
          </div>
        </div>

        <div className="form-section">
          <div className="legend">Proveedores</div>
          <div className="kv-grid">
            <KV l="Preferido"     v={item.supplier}/>
            <KV l="Alterno"       v={item.altSupplier}/>
          </div>
        </div>

        <div className="form-section">
          <div className="legend">Vinculación</div>
          <div className="link-grid">
            <div className="link-card" onClick={() => navigate && navigate('inventory')}>
              <div className="flex between center">
                <div>
                  <div className="eyebrow"><Icon name="inventory" size={11}/> Inventario</div>
                  <div className="num" style={{ fontSize: 22, marginTop: 6 }}>
                    {inv ? `${inv.stock} ${item.unit}` : '—'}
                  </div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                    {inv ? `par ${inv.par}${item.unit} · reorden ${inv.reorder}` : 'Sin movimientos'}
                  </div>
                </div>
                <Icon name="arrow_rt" size={14}/>
              </div>
            </div>
            <div className="link-card" onClick={() => navigate && navigate('intake')}>
              <div className="flex between center">
                <div>
                  <div className="eyebrow"><Icon name="box" size={11}/> Recibir compra</div>
                  <div className="num" style={{ fontSize: 22, marginTop: 6 }}>3</div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>
                    Recepciones últimos 30 días
                  </div>
                </div>
                <Icon name="arrow_rt" size={14}/>
              </div>
            </div>
          </div>

          <div className="eyebrow" style={{ marginTop: 16 }}>Usado en recetas</div>
          <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: 8 }}>
            {item.usedIn.map((r, i) => (
              <span key={i} className="tag" style={{ fontSize: 11.5, padding: '4px 10px' }}>{r}</span>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="legend">Bitácora</div>
          <div className="activity">
            <div className="activity-row">
              <div className="dot" style={{ background: 'var(--accent)' }}/>
              <div>
                <div className="t">Costo actualizado</div>
                <div className="s">${item.lastCost} → ${item.cost} · alza {(((item.cost-item.lastCost)/item.lastCost)*100).toFixed(1)}%</div>
              </div>
              <div className="when">{item.updated}</div>
            </div>
            <div className="activity-row">
              <div className="dot"/>
              <div>
                <div className="t">Alta en catálogo</div>
                <div className="s">Creado por Rodrigo Cárdenas</div>
              </div>
              <div className="when">{item.created}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="drawer-foot">
        {item.status === 'active' && (
          <button className="btn btn-danger" style={{ marginRight: 'auto' }}>
            <Icon name="lock" size={13}/> Bloquear / descontinuar
          </button>
        )}
        {item.status !== 'active' && (
          <button className="btn" style={{ marginRight: 'auto' }}>
            <Icon name="unlock" size={13}/> Reactivar
          </button>
        )}
        <button className="btn" onClick={onClose}>Cerrar</button>
        <button className="btn btn-primary" onClick={onEdit}>
          <Icon name="pencil" size={13}/> Editar
        </button>
      </div>
    </>
  );
};

/* FORMULARIO ALTA / EDICIÓN */
const CatalogForm = ({ mode, form, set, onClose, onCancel, selected }) => (
  <>
    <div className="drawer-head">
      <div>
        <div className="page-eyebrow">{mode === 'new' ? 'Alta de mercancía' : 'Editar mercancía'}</div>
        <div className="t">{mode === 'new' ? 'Nueva mercancía' : form.name || 'Editar'}</div>
        <div className="s">El SKU se asigna al catálogo y queda disponible en recepciones, inventario y recetas.</div>
      </div>
      <button className="btn btn-ghost" onClick={onClose} style={{ padding: 6 }}>
        <Icon name="x" size={14}/>
      </button>
    </div>

    <div className="drawer-body">
      <div className="form-section">
        <div className="legend">Identificación</div>
        <div className="form-grid c2">
          <div className="field">
            <span className="field-label">SKU</span>
            <input className="input mono" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="CAT-###"/>
          </div>
          <div className="field">
            <span className="field-label">Código de barras</span>
            <input className="input mono" value={form.barcode} onChange={e => set('barcode', e.target.value)} placeholder="EAN-13"/>
          </div>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <span className="field-label">Nombre del producto</span>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="ej. Lomo de res Angus"/>
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
            <span className="field-label">Unidad de compra</span>
            <select className="select" value={form.unit} onChange={e => set('unit', e.target.value)}>
              <option>kg</option><option>L</option><option>pz</option><option>bot</option><option>manojo</option><option>caja</option>
            </select>
          </div>
          <div className="field" style={{ gridColumn: 'span 2' }}>
            <span className="field-label">Presentación</span>
            <input className="input" value={form.pack} onChange={e => set('pack', e.target.value)} placeholder="ej. Caja 6 bot · 750 mL"/>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="legend">Costo y fiscal</div>
        <div className="form-grid c2">
          <div className="field">
            <span className="field-label">Costo unitario</span>
            <div className="input-prefix">
              <span className="prefix">$</span>
              <input className="input num" value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="0.00"/>
            </div>
          </div>
          <div className="field">
            <span className="field-label">IVA</span>
            <select className="select" value={form.taxRate} onChange={e => set('taxRate', parseFloat(e.target.value))}>
              <option value="0">Exento (0 %)</option>
              <option value="0.08">Frontera (8 %)</option>
              <option value="0.16">General (16 %)</option>
            </select>
          </div>
          <div className="field">
            <span className="field-label">Vida útil (días)</span>
            <input className="input num" type="number" value={form.shelfLife} onChange={e => set('shelfLife', parseInt(e.target.value) || 0)}/>
          </div>
          <div className="field">
            <span className="field-label">Almacén</span>
            <select className="select" value={form.storage} onChange={e => set('storage', e.target.value)}>
              <option>Cámara fría 1</option><option>Cámara fría 2</option>
              <option>Refri prep</option><option>Congelador</option>
              <option>Despensa fría</option><option>Despensa seca</option>
              <option>Cava</option><option>Barra</option><option>Bodega químicos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="legend">Proveedores</div>
        <div className="form-grid c2">
          <div className="field">
            <span className="field-label">Proveedor preferido</span>
            <select className="select" value={form.supplier} onChange={e => set('supplier', e.target.value)}>
              {SUPPLIER_DIR.filter(s => s.status === 'active').map(s => <option key={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="field">
            <span className="field-label">Proveedor alterno</span>
            <select className="select" value={form.altSupplier} onChange={e => set('altSupplier', e.target.value)}>
              <option>—</option>
              {SUPPLIER_DIR.filter(s => s.status === 'active' && s.name !== form.supplier).map(s => <option key={s.name}>{s.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="legend">Notas internas</div>
        <textarea className="textarea" value={form.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Observaciones de calidad, especificación o trato con cocina…"/>
      </div>
    </div>

    <div className="drawer-foot">
      {mode === 'edit' && selected && selected.status === 'active' && (
        <button className="btn btn-danger" style={{ marginRight: 'auto' }}>
          <Icon name="archive" size={13}/> Descontinuar
        </button>
      )}
      <button className="btn" onClick={onCancel}>Cancelar</button>
      <button className="btn btn-primary" onClick={onClose}>
        {mode === 'new' ? 'Crear mercancía' : 'Guardar cambios'}
      </button>
    </div>
  </>
);

/* small helpers */
const KV = ({ l, v }) => (
  <div className="kv-row">
    <div className="kv-l">{l}</div>
    <div className="kv-v">{v}</div>
  </div>
);

window.CatalogScreen = CatalogScreen;
