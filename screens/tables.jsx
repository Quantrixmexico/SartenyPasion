/* Mapa de mesas — plano interactivo del salón en tiempo real
   Click en una mesa → panel con detalle y acciones que cambian su estado
   (libre → sentada → cuenta → por limpiar → libre / reservada → sentada).
   KPIs, filtros por estado, selector de zona y próximas reservas en vivo.
*/

/* posición de cada mesa en el plano (coordenadas % dentro del lienzo) */
const FLOOR_ZONES = {
  'Terraza': { x: 3,  y: 4,  w: 94, h: 20 },
  'Barra':   { x: 3,  y: 28, w: 15, h: 68 },
  'Salón':   { x: 20, y: 28, w: 55, h: 68 },
  'Privado': { x: 77, y: 28, w: 20, h: 68 },
};
const TABLE_POS = {
  T1: { x: 12, y: 14 }, T2: { x: 26, y: 14 }, T3: { x: 42, y: 13 }, T4: { x: 58, y: 14 }, T5: { x: 73, y: 14 }, T6: { x: 88, y: 14 },
  B1: { x: 10, y: 40 }, B2: { x: 10, y: 54 }, B3: { x: 10, y: 68 }, B4: { x: 10, y: 82 },
  S1: { x: 30, y: 42 }, S2: { x: 44, y: 42 }, S3: { x: 57, y: 42 }, S4: { x: 69, y: 42 },
  S5: { x: 30, y: 77 }, S6: { x: 44, y: 77 }, S7: { x: 57, y: 77 }, S8: { x: 69, y: 77 },
  P1: { x: 87, y: 40 }, P2: { x: 87, y: 58 }, P3: { x: 87, y: 76 }, P4: { x: 87, y: 90 },
};

const TABLE_STATUS = {
  free:     { label: 'Libre',       cls: 'free',     color: 'var(--positive)' },
  seated:   { label: 'Ocupada',     cls: 'seated',   color: 'var(--accent)' },
  bill:     { label: 'En cuenta',   cls: 'bill',     color: 'var(--warning)' },
  reserved: { label: 'Reservada',   cls: 'reserved', color: '#6E8AAA' },
  dirty:    { label: 'Por limpiar', cls: 'dirty',    color: 'var(--faint)' },
};

/* meseros que operan piso (para reasignación) */
const FLOOR_SERVERS = [
  { id: 'PN', name: 'Paola Nieves',   color: '#7E9C6E' },
  { id: 'RG', name: 'Ricardo Gómez',   color: '#B07F86' },
  { id: 'MC', name: 'Mariana Castro', color: '#9C7AB0' },
  { id: 'DF', name: 'Daniela Ferrer', color: '#6E8AAA' },
];
const serverName = (id) => (FLOOR_SERVERS.find(s => s.id === id) || {}).name || id;

const nodeSize = (seats) => seats <= 2 ? { w: 46, h: 46, r: '50%' }
  : seats <= 4 ? { w: 62, h: 58, r: '14px' }
  : seats <= 6 ? { w: 84, h: 58, r: '14px' }
  : { w: 100, h: 62, r: '16px' };

const TablesScreen = ({ role, navigate }) => {
  const [tables, setTables] = useState(() => TABLES.map(t => ({ ...t })));
  const [selId, setSelId] = useState(null);
  const [zone, setZone] = useState('Todas');
  const [statusFilter, setStatusFilter] = useState('all');

  const sel = tables.find(t => t.id === selId) || null;

  const setStatus = (id, patch) => setTables(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));

  // ---- transferencia / unión de mesas ----
  // action = { type:'transfer'|'merge', fromId }
  const [action, setAction] = useState(null);
  const validTarget = (a, t) => a.type === 'transfer'
    ? t.status === 'free'
    : (t.status === 'seated' || t.status === 'bill') && t.id !== a.fromId;
  const startAction = (type, fromId) => { setAction({ type, fromId }); setZone('Todas'); setStatusFilter('all'); setSelId(null); };
  const cancelAction = () => setAction(null);
  const completeAction = (targetId) => {
    const from = tables.find(x => x.id === action.fromId);
    if (!from) { setAction(null); return; }
    if (action.type === 'transfer') {
      setTables(ts => ts.map(t => {
        if (t.id === from.id) return { ...t, status: 'dirty', pax: 0, server: null, opened: 0, ticket: 0, course: null, resv: undefined };
        if (t.id === targetId) return { ...t, status: from.status, pax: from.pax, server: from.server, opened: from.opened, ticket: from.ticket, course: from.course };
        return t;
      }));
    } else {
      setTables(ts => ts.map(t => {
        if (t.id === from.id) return { ...t, status: 'dirty', pax: 0, server: null, opened: 0, ticket: 0, course: null, resv: undefined };
        if (t.id === targetId) return { ...t, pax: t.pax + from.pax, ticket: t.ticket + from.ticket, opened: Math.max(t.opened, from.opened), status: t.status === 'bill' ? 'bill' : 'seated' };
        return t;
      }));
    }
    setAction(null);
    setSelId(targetId);
  };

  // métricas en vivo
  const m = useMemo(() => {
    const occupied = tables.filter(t => t.status === 'seated' || t.status === 'bill');
    const free = tables.filter(t => t.status === 'free');
    const reserved = tables.filter(t => t.status === 'reserved');
    const dirty = tables.filter(t => t.status === 'dirty');
    const covers = occupied.reduce((s, t) => s + t.pax, 0);
    const liveSales = occupied.reduce((s, t) => s + t.ticket, 0);
    const avgTicket = occupied.length ? liveSales / occupied.length : 0;
    return {
      occupied, free, reserved, dirty, covers, liveSales, avgTicket,
      occPct: Math.round(occupied.length / tables.length * 100),
    };
  }, [tables]);

  const upcoming = tables.filter(t => t.status === 'reserved' && t.resv)
    .sort((a, b) => (a.resv || '').localeCompare(b.resv || ''));

  const shownZones = zone === 'Todas' ? TABLE_ZONES : [zone];

  const dim = (t) => statusFilter !== 'all' && t.status !== statusFilter;

  return (
    <div className="content tables-content">
      <PageHead
        eyebrow="Operación · salón en tiempo real · 21:05"
        title="Mapa de mesas"
        sub="Plano interactivo del salón: ocupación, rotación y reservas. Toca una mesa para gestionarla."
        actions={<>
          <button className="btn"><Icon name="cal" size={14}/> Reservas del día</button>
          <button className="btn btn-primary" onClick={() => navigate && navigate('pos')}>
            <Icon name="plus" size={14}/> Abrir cuenta
          </button>
        </>}
      />

      {/* KPIs en vivo */}
      <div className="row cols-4">
        <div className="card kpi lift">
          <div className="kpi-label">Ocupación</div>
          <div className="kpi-value num" style={{ color: m.occPct > 80 ? 'var(--danger)' : 'var(--ink)' }}>{m.occPct}%</div>
          <div className="bar thin" style={{ marginTop: 8 }}><span style={{ width: m.occPct + '%', background: m.occPct > 80 ? 'var(--danger)' : 'var(--accent)' }}/></div>
          <div className="kpi-target" style={{ marginTop: 8 }}>{m.occupied.length} de {tables.length} mesas</div>
        </div>
        <div className="card kpi lift">
          <div className="kpi-label">Comensales sentados</div>
          <div className="kpi-value num">{m.covers}</div>
          <div className="kpi-target">{m.free.length} mesas libres · {m.dirty.length} por limpiar</div>
        </div>
        <div className="card kpi lift">
          <div className="kpi-label">Venta en piso</div>
          <div className="kpi-value"><span className="currency">$</span>{(m.liveSales/1000).toFixed(1)}k</div>
          <div className="kpi-target">Ticket prom. activo {fmtMXN(m.avgTicket, { short: true })}</div>
        </div>
        <div className="card kpi lift">
          <div className="kpi-label">Reservas pendientes</div>
          <div className="kpi-value num">{m.reserved.length}</div>
          <div className="kpi-target">{upcoming[0] ? 'Próxima ' + (upcoming[0].resv.split(' · ')[0]) : 'Sin reservas próximas'}</div>
        </div>
      </div>

      {/* Controles */}
      <div className="floor-toolbar">
        <div className="zone-seg">
          {['Todas', ...TABLE_ZONES].map(z => (
            <button key={z} className={zone === z ? 'on' : ''} onClick={() => setZone(z)}>{z}</button>
          ))}
        </div>
        <div className="floor-legend">
          <button className={'fl-chip ' + (statusFilter === 'all' ? 'on' : '')} onClick={() => setStatusFilter('all')}>Todas</button>
          {Object.entries(TABLE_STATUS).map(([k, s]) => (
            <button key={k} className={'fl-chip ' + (statusFilter === k ? 'on' : '')} onClick={() => setStatusFilter(statusFilter === k ? 'all' : k)}>
              <span className="fl-dot" style={{ background: s.color }}/>{s.label}
              <span className="fl-count num">{tables.filter(t => t.status === k).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="floor-grid">
        {/* PLANO */}
        <div className="floor card">
          {action && (
            <div className={'floor-action-bar ' + action.type}>
              <span className="fab-dot"/>
              <span className="fab-txt">
                {action.type === 'transfer'
                  ? <>Transfiriendo cuenta de <b>Mesa {action.fromId}</b> — toca una mesa <b>libre</b> como destino</>
                  : <>Uniendo <b>Mesa {action.fromId}</b> — toca una mesa <b>ocupada</b> para combinar cuentas</>}
              </span>
              <button className="btn btn-sm" onClick={cancelAction}><Icon name="x" size={12}/> Cancelar</button>
            </div>
          )}
          {Object.entries(FLOOR_ZONES).filter(([z]) => shownZones.includes(z)).map(([z, r]) => (
            <div key={z} className="floor-zone" style={{ left: r.x + '%', top: r.y + '%', width: r.w + '%', height: r.h + '%' }}>
              <span className="floor-zone-label">{z}</span>
            </div>
          ))}
          {tables.filter(t => shownZones.includes(t.zone)).map(t => {
            const p = TABLE_POS[t.id]; if (!p) return null;
            const sz = nodeSize(t.seats);
            const st = TABLE_STATUS[t.status];
            const busy = t.status === 'seated' || t.status === 'bill';
            const isFrom = action && action.fromId === t.id;
            const targetable = action ? validTarget(action, t) : false;
            const notarget = action && !targetable && !isFrom;
            const actCls = action ? (targetable ? ' targetable' : isFrom ? ' is-from' : ' notarget') : (dim(t) ? ' dim' : '');
            return (
              <button
                key={t.id}
                className={'tbl-node st-' + st.cls + (selId === t.id ? ' active' : '') + actCls}
                style={{ left: p.x + '%', top: p.y + '%', width: sz.w, height: sz.h, borderRadius: sz.r }}
                onClick={() => action ? (targetable && completeAction(t.id)) : setSelId(t.id)}
                title={'Mesa ' + t.id + ' · ' + st.label}
              >
                <span className="tbl-node-id">{t.id}</span>
                <span className="tbl-node-seats">{busy ? t.pax + '/' + t.seats : t.seats + 'p'}</span>
                {busy && <span className="tbl-node-time num">{t.opened}′</span>}
                {t.status === 'reserved' && <span className="tbl-node-resv">{t.resv ? t.resv.split(' · ')[0] : '—'}</span>}
                {t.status === 'dirty' && <span className="tbl-node-clean"><Icon name="timer" size={11}/></span>}
              </button>
            );
          })}
          <div className="floor-door"><span>Acceso · Av. Negrete</span></div>
        </div>

        {/* RESERVAS */}
        <div className="card floor-aside">
          <div className="card-head">
            <div>
              <div className="card-title">Próximas reservas</div>
              <div className="card-meta">{upcoming.length} confirmadas para hoy</div>
            </div>
          </div>
          <div className="resv-list">
            {upcoming.length === 0 && <div className="muted" style={{ fontSize: 12.5, padding: '8px 0' }}>Sin reservas próximas.</div>}
            {upcoming.map(t => (
              <button key={t.id} className="resv-row" onClick={() => { setZone('Todas'); setSelId(t.id); }}>
                <div className="resv-time num">{t.resv.split(' · ')[0]}</div>
                <div className="resv-body">
                  <div className="resv-name">{t.resv.split(' · ').slice(1).join(' · ')}</div>
                  <div className="resv-meta">Mesa {t.id} · {t.zone} · {t.seats} lugares</div>
                </div>
                <Icon name="arrow_rt" size={14}/>
              </button>
            ))}
          </div>
          <div className="form-section" style={{ borderBottom: 0 }}>
            <div className="legend" style={{ fontSize: 18 }}>Estado del salón</div>
            <div className="resv-summary">
              {Object.entries(TABLE_STATUS).map(([k, s]) => (
                <div key={k} className="resv-sum-row">
                  <span className="fl-dot" style={{ background: s.color }}/>
                  <span className="resv-sum-label">{s.label}</span>
                  <span className="num">{tables.filter(t => t.status === k).length}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DRAWER detalle de mesa */}
      <div className={'drawer-backdrop ' + (sel ? 'open' : '')} onClick={() => setSelId(null)}/>
      <div className={'drawer ' + (sel ? 'open' : '')} style={{ width: 460 }}>
        {sel && <TableDetail t={sel} setStatus={setStatus} onClose={() => setSelId(null)} navigate={navigate} onAction={startAction}/>}
      </div>
    </div>
  );
};

const TableDetail = ({ t, setStatus, onClose, navigate, onAction }) => {
  const st = TABLE_STATUS[t.status];
  const busy = t.status === 'seated' || t.status === 'bill';
  const [reassign, setReassign] = useState(false);

  const seat = () => setStatus(t.id, { status: 'seated', pax: t.pax || Math.min(2, t.seats), server: t.server || 'PN', opened: 0, ticket: t.ticket || 0, course: 'Entradas', resv: undefined });
  const bill = () => setStatus(t.id, { status: 'bill', course: 'Cuenta' });
  const clear = () => setStatus(t.id, { status: 'dirty', pax: 0, server: null, opened: 0, ticket: 0, course: null });
  const clean = () => setStatus(t.id, { status: 'free' });
  const cancelResv = () => setStatus(t.id, { status: 'free', resv: undefined });

  return (
    <>
      <div className="drawer-head" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className={'tbl-badge st-' + st.cls}>{t.id}</div>
          <div>
            <div className="t">Mesa {t.id}</div>
            <div className="s">{t.zone} · {t.seats} lugares {t.tag ? '· ' + t.tag : ''}</div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={onClose}><Icon name="x" size={14}/></button>
      </div>

      <div className="drawer-body">
        <div className="form-section">
          <div className="flex" style={{ alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span className={'pill ' + (t.status === 'free' ? 'positive' : t.status === 'seated' ? 'accent' : t.status === 'bill' ? 'warning' : t.status === 'reserved' ? 'neutral' : 'neutral')}>
              <span className="dot" style={{ background: st.color }}/>{st.label}
            </span>
          </div>

          {busy && (
            <div className="kv-grid">
              <KV l="Comensales" v={<span className="num">{t.pax} / {t.seats}</span>}/>
              <KV l="Mesero" v={t.server}/>
              <KV l="Tiempo en mesa" v={<span className="num">{t.opened} min</span>}/>
              <KV l="Etapa" v={t.course}/>
              <KV l="Cuenta actual" v={<span className="num serif" style={{ fontSize: 17 }}>{fmtMXN(t.ticket)}</span>}/>
              <KV l="Por persona" v={<span className="num">{fmtMXN(t.pax ? t.ticket / t.pax : 0, { short: true })}</span>}/>
            </div>
          )}

          {t.status === 'reserved' && (
            <div className="alert-card" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <div className="ico" style={{ background: '#6E8AAA', color: 'var(--bg)' }}><Icon name="cal" size={16}/></div>
              <div>
                <div className="t">Reserva confirmada</div>
                <div className="s">{t.resv}</div>
              </div>
            </div>
          )}

          {t.status === 'free' && (
            <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>Mesa disponible para {t.seats} personas. Sienta comensales para abrir una cuenta.</div>
          )}

          {t.status === 'dirty' && (
            <div className="alert-card" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
              <div className="ico" style={{ background: 'var(--faint)', color: 'var(--bg)' }}><Icon name="timer" size={16}/></div>
              <div>
                <div className="t">Mesa por limpiar</div>
                <div className="s">Marcar limpia para volverla disponible.</div>
              </div>
            </div>
          )}
        </div>

        {busy && (
          <div className="form-section">
            <div className="legend" style={{ fontSize: 18 }}>Acciones de mesa</div>
            <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: 4 }}>
              <button className="btn btn-sm" onClick={() => navigate && navigate('pos')}><Icon name="pos" size={13}/> Ver comanda</button>
              <button className="btn btn-sm" onClick={() => navigate && navigate('cocina')}><Icon name="flame" size={13}/> Cocina</button>
              <button className="btn btn-sm" onClick={() => setReassign(v => !v)}><Icon name="team" size={13}/> Reasignar mesero</button>
            </div>

            {reassign && (
              <div className="reassign-list">
                {FLOOR_SERVERS.map(s => (
                  <button key={s.id} className={'reassign-opt ' + (t.server === s.id ? 'on' : '')}
                          onClick={() => { setStatus(t.id, { server: s.id }); setReassign(false); }}>
                    <span className="ps-avatar sm" style={{ background: s.color }}>{s.id}</span>
                    <span className="reassign-nm">{s.name}</span>
                    {t.server === s.id && <Icon name="check" size={14}/>}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: 10 }}>
              <button className="btn btn-sm" onClick={() => { onAction && onAction('transfer', t.id); onClose(); }}>
                <Icon name="arrow_rt" size={13}/> Transferir cuenta
              </button>
              <button className="btn btn-sm" onClick={() => { onAction && onAction('merge', t.id); onClose(); }}>
                <Icon name="team" size={13}/> Unir mesas
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="drawer-foot">
        {t.status === 'free' && <button className="btn btn-primary" onClick={seat}><Icon name="team" size={14}/> Sentar comensales</button>}
        {t.status === 'reserved' && <>
          <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={cancelResv}>Cancelar</button>
          <button className="btn btn-primary" onClick={seat}><Icon name="check" size={14}/> Sentar reserva</button>
        </>}
        {t.status === 'seated' && <>
          <button className="btn" style={{ marginRight: 'auto' }} onClick={clear}>Liberar</button>
          <button className="btn btn-primary" onClick={bill}><Icon name="receipt" size={14}/> Pedir cuenta</button>
        </>}
        {t.status === 'bill' && <button className="btn btn-primary" onClick={clear}><Icon name="check" size={14}/> Cerrar y cobrar</button>}
        {t.status === 'dirty' && <button className="btn btn-primary" onClick={clean}><Icon name="check" size={14}/> Marcar limpia</button>}
      </div>
    </>
  );
};

window.TablesScreen = TablesScreen;
