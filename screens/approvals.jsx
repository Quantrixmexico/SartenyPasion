/* Aprobaciones — bandeja con hilos de comentarios + Web Push */
const APR_TYPE_LABELS = {
  purchase:      'Compra de insumos',
  payment:       'Pago a proveedor',
  payroll:       'Nómina',
  supplier_new:  'Alta de proveedor',
  inventory_adj: 'Ajuste de inventario',
  price_change:  'Cambio de costo',
  staff_action:  'Acción de personal',
};

const ApprovalsScreen = ({ role, navigate }) => {
  const [tab, setTab] = useState('pending');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(APPROVALS[0]);
  const [reply, setReply] = useState('');
  const [pushState, setPushState] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [pushOpen, setPushOpen] = useState(false);

  const counts = {
    pending:  APPROVALS.filter(a => a.status === 'pending').length,
    decided:  APPROVALS.filter(a => a.status === 'approved' || a.status === 'rejected').length,
    changes:  APPROVALS.filter(a => a.status === 'changes_requested').length,
    mine:     APPROVALS.filter(a =>
      role === 'partner'
        ? a.approver.name === 'Andrea Solano' || a.approver.name === 'Rodrigo Cárdenas'
        : a.requester.name === 'Carlos Bernal'
    ).length,
  };

  const list = APPROVALS
    .filter(a =>
      tab === 'pending' ? a.status === 'pending' :
      tab === 'changes' ? a.status === 'changes_requested' :
      tab === 'decided' ? (a.status === 'approved' || a.status === 'rejected') :
      true
    )
    .filter(a => filter === 'all' ? true : a.type === filter);

  const types = [
    { v: 'all',           l: 'Todos los tipos' },
    { v: 'purchase',      l: 'Compras' },
    { v: 'payment',       l: 'Pagos' },
    { v: 'payroll',       l: 'Nómina' },
    { v: 'supplier_new',  l: 'Proveedores' },
    { v: 'inventory_adj', l: 'Inventario' },
    { v: 'price_change',  l: 'Costos' },
    { v: 'staff_action',  l: 'Personal' },
  ];

  const requestPush = async () => {
    if (typeof Notification === 'undefined') { alert('Tu navegador no soporta notificaciones'); return; }
    try {
      const r = await Notification.requestPermission();
      setPushState(r);
      if (r === 'granted') {
        new Notification('Sartén & Pasión · Aprobaciones', {
          body: 'Recibirás un aviso aquí cuando haya solicitudes pendientes.',
          icon: 'logo.png', tag: 'aprov-onboarding',
        });
      }
    } catch (e) { console.warn(e); }
  };

  const sendTestPush = () => {
    if (pushState !== 'granted') return;
    const pending = APPROVALS.filter(a => a.status === 'pending');
    const top = pending[0];
    new Notification(`Solicitud pendiente · ${pending.length} en bandeja`, {
      body: `${top.title} — ${top.requester.name} · ${top.sla}`,
      icon: 'logo.png', tag: 'apr-' + top.id,
      requireInteraction: top.slaUrgent,
    });
  };

  const pillFor = (st) => ({
    pending:            <span className="pill warning"><span className="dot"/>Pendiente</span>,
    approved:           <span className="pill positive"><span className="dot"/>Aprobada</span>,
    rejected:           <span className="pill danger"><span className="dot"/>Rechazada</span>,
    changes_requested:  <span className="pill accent"><span className="dot"/>Cambios solicitados</span>,
  }[st]);

  const priorityDot = (p) => ({
    urgent: 'var(--danger)',
    high:   'var(--warning)',
    medium: 'var(--accent)',
    low:    'var(--muted)',
  }[p] || 'var(--muted)');

  return (
    <div className="content">
      <PageHead
        eyebrow="Flujo de trabajo"
        title="Aprobaciones"
        sub={`${counts.pending} pendientes · ${counts.changes} con cambios solicitados · hilo de comentarios bidireccional`}
        actions={<>
          <button className={'btn ' + (pushState === 'granted' ? '' : '')} onClick={() => setPushOpen(true)}>
            <Icon name="bell" size={14}/>
            Notificaciones {pushState === 'granted' ? '· activas' : pushState === 'denied' ? '· bloqueadas' : '· configurar'}
          </button>
          <button className="btn"><Icon name="filter" size={14}/> Reglas</button>
        </>}
      />

      <div className="row cols-4">
        <div className="card kpi">
          <div className="kpi-label">Pendientes</div>
          <div className="kpi-value num" style={{ color: counts.pending > 0 ? 'var(--warning)' : 'var(--ink)' }}>{counts.pending}</div>
          <div className="kpi-target">SLA promedio · 4 h</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Cambios solicitados</div>
          <div className="kpi-value num">{counts.changes}</div>
          <div className="kpi-target">Esperando réplica del solicitante</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Resueltas · 7 días</div>
          <div className="kpi-value num">{counts.decided}</div>
          <div className="kpi-target">Tasa aprobación 78%</div>
        </div>
        <div className="card kpi">
          <div className="kpi-label">Push notifications</div>
          <div className="kpi-value" style={{
            fontSize: 20,
            color: pushState === 'granted' ? 'var(--positive)' : pushState === 'denied' ? 'var(--danger)' : 'var(--warning)'
          }}>
            {pushState === 'granted' ? 'Activas' : pushState === 'denied' ? 'Bloqueadas' : 'Sin configurar'}
          </div>
          <div className="kpi-target">
            <a onClick={() => setPushOpen(true)} style={{ color: 'var(--accent)', cursor: 'pointer' }}>
              Gestionar →
            </a>
          </div>
        </div>
      </div>

      <Tabs value={tab} onChange={setTab} tabs={[
        { value: 'pending', label: 'Pendientes',           count: counts.pending },
        { value: 'changes', label: 'Cambios solicitados',  count: counts.changes },
        { value: 'decided', label: 'Resueltas',            count: counts.decided },
        { value: 'all',     label: 'Todas',                count: APPROVALS.length },
      ]}/>

      {/* INBOX layout */}
      <div className="apr-layout">
        {/* LEFT: list */}
        <div className="apr-list card" style={{ padding: 0 }}>
          <div className="card-head" style={{ padding: '12px 14px 8px', marginBottom: 0, gap: 8 }}>
            <select className="select" value={filter} onChange={e => setFilter(e.target.value)} style={{ flex: 1, minWidth: 0 }}>
              {types.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
          </div>

          <div className="apr-items">
            {list.map(a => (
              <div key={a.id}
                   className={'apr-item ' + (selected && selected.id === a.id ? 'on' : '')}
                   onClick={() => setSelected(a)}>
                <div className="ic" style={{ borderLeft: `3px solid ${priorityDot(a.priority)}` }}>
                  <Icon name={a.icon} size={14}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex between" style={{ gap: 8 }}>
                    <div className="t" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {a.title}
                    </div>
                    {a.thread.length > 1 && (
                      <span className="thread-count">
                        <Icon name="chat" size={10}/> {a.thread.length}
                      </span>
                    )}
                  </div>
                  <div className="s">{APR_TYPE_LABELS[a.type]} · {a.requester.name.split(' ')[0]}</div>
                  <div className="apr-meta">
                    {pillFor(a.status)}
                    {a.amount != null && (
                      <span className="num" style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                        {fmtMXN(a.amount, { short: true })}
                      </span>
                    )}
                    <span className="mono" style={{
                      fontSize: 10.5,
                      color: a.slaUrgent ? 'var(--danger)' : 'var(--faint)',
                      marginLeft: 'auto'
                    }}>{a.sla}</span>
                  </div>
                </div>
              </div>
            ))}
            {list.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                Sin solicitudes en esta vista.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: detail + thread */}
        <div className="apr-detail card" style={{ padding: 0 }}>
          {selected ? (
            <ApprovalDetail
              a={selected}
              role={role}
              reply={reply} setReply={setReply}
              pillFor={pillFor}
              navigate={navigate}
            />
          ) : (
            <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>
              Selecciona una solicitud
            </div>
          )}
        </div>
      </div>

      {/* PUSH SETTINGS DRAWER */}
      <div className={'drawer-backdrop ' + (pushOpen ? 'open' : '')} onClick={() => setPushOpen(false)}/>
      <div className={'drawer ' + (pushOpen ? 'open' : '')} style={{ width: 520 }}>
        <PushSettings
          state={pushState}
          onRequest={requestPush}
          onTest={sendTestPush}
          onClose={() => setPushOpen(false)}
        />
      </div>
    </div>
  );
};

/* DETAIL + COMMENT THREAD */
const ApprovalDetail = ({ a, role, reply, setReply, pillFor, navigate }) => {
  const canDecide = a.status === 'pending' || a.status === 'changes_requested';
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const isApprover = role === 'partner' || a.approver.name === 'Rodrigo Cárdenas';

  return (
    <>
      <div className="apr-head">
        <div>
          <div className="page-eyebrow">{APR_TYPE_LABELS[a.type]} · <span className="mono">{a.id}</span></div>
          <div className="t">{a.title}</div>
          <div className="s">{a.summary}</div>
        </div>
        <div className="flex gap-2">
          {pillFor(a.status)}
        </div>
      </div>

      <div className="apr-body">
        {/* SLA strip */}
        {a.status === 'pending' && (
          <div className={'sla-strip ' + (a.slaUrgent ? 'urgent' : '')}>
            <Icon name="cal" size={13}/>
            <span><b>SLA:</b> {a.sla}</span>
            <span className="dot-sep">·</span>
            <span>Solicitado {a.requested}</span>
            <span className="dot-sep">·</span>
            <span>De {a.requester.name} → {a.approver.name}</span>
          </div>
        )}

        {/* fields */}
        <div className="apr-fields">
          {a.fields.map((f, i) => (
            <div key={i} className="apr-field">
              <div className="l">{f.l}</div>
              <div className="v">{f.v}</div>
            </div>
          ))}
        </div>

        {a.amount != null && (
          <div className="apr-amount-row">
            <span className="muted" style={{ fontSize: 12 }}>Monto involucrado</span>
            <span className="serif" style={{ fontSize: 28, lineHeight: 1 }}>{fmtMXN(a.amount)}</span>
          </div>
        )}

        {/* THREAD */}
        <div className="apr-section">
          <div className="apr-section-head">
            <div>
              <div className="legend" style={{ marginBottom: 2 }}>Historial de comentarios</div>
              <div className="legend-sub">
                {a.thread.length} mensaje{a.thread.length === 1 ? '' : 's'} · visible para solicitante y aprobador
              </div>
            </div>
            <span className="thread-count">
              <Icon name="chat" size={10}/> {a.thread.length}
            </span>
          </div>

          <div className="thread">
            {a.thread.map((m, i) => (
              <div key={i} className={'thread-msg ' + m.who + (m.kind ? ' ' + m.kind : '')}>
                <div className="av" style={{
                  background: m.who === 'approver' ? 'var(--accent)' : 'var(--surface-2)',
                  color: m.who === 'approver' ? 'var(--bg)' : 'var(--ink-2)',
                  border: m.who === 'approver' ? 'none' : '1px solid var(--border)',
                }}>
                  {m.name.split(' ').map(p => p[0]).slice(0,2).join('')}
                </div>
                <div className="msg-body">
                  <div className="msg-head">
                    <span className="who">{m.name}</span>
                    {m.kind === 'approve' && <span className="kind-pill positive"><Icon name="check" size={9}/> Aprobó</span>}
                    {m.kind === 'reject'  && <span className="kind-pill danger"><Icon name="x" size={9}/> Rechazó</span>}
                    {m.kind === 'changes' && <span className="kind-pill accent"><Icon name="pencil" size={9}/> Solicitó cambios</span>}
                    <span className="when">{m.when}</span>
                  </div>
                  <div className="msg-text">{m.text}</div>
                </div>
              </div>
            ))}
          </div>

          {/* INLINE REPLY */}
          {!showReject && (
            <div className="thread-reply">
              <div className="av" style={{
                background: 'var(--accent)', color: 'var(--bg)'
              }}>
                {role === 'partner' ? 'AS' : 'RC'}
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder={a.status === 'pending'
                    ? 'Pregunta o comenta antes de decidir…'
                    : 'Agregar comentario al hilo…'}
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                />
                <div className="flex between" style={{ marginTop: 8 }}>
                  <div className="muted" style={{ fontSize: 11.5 }}>
                    {role === 'partner' ? 'Comentas como Andrea Solano · Socia' : 'Comentas como Rodrigo Cárdenas · Operador'}
                  </div>
                  <button className="btn" disabled={!reply.trim()} onClick={() => setReply('')}>
                    <Icon name="arrow_rt" size={12}/> Enviar comentario
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* REJECT FORM (revela textarea obligatorio) */}
          {showReject && (
            <div className="reject-card">
              <div className="flex between center">
                <div className="t">Rechazar solicitud</div>
                <button className="btn btn-ghost" onClick={() => setShowReject(false)} style={{ padding: 4 }}>
                  <Icon name="x" size={13}/>
                </button>
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                El motivo se publicará en el hilo y el solicitante podrá responder. Sé específico — esto reemplaza al motivo aislado.
              </div>
              <textarea className="textarea" rows={4}
                placeholder="Motivo del rechazo · qué falta, qué cambiar, plazo para responder…"
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                style={{ marginTop: 12 }}
              />
              <div className="flex gap-2" style={{ marginTop: 10 }}>
                <label className="checkbox"><input type="checkbox" defaultChecked/> Permitir resometer con correcciones</label>
                <label className="checkbox"><input type="checkbox" defaultChecked/> Notificar por push</label>
              </div>
              <div className="flex gap-2" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
                <button className="btn" onClick={() => setShowReject(false)}>Cancelar</button>
                <button className="btn btn-danger" disabled={!rejectReason.trim()}
                  onClick={() => { setShowReject(false); setRejectReason(''); }}>
                  <Icon name="x" size={12}/> Confirmar rechazo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ACTION BAR */}
      {canDecide && isApprover && !showReject && (
        <div className="apr-actions">
          <div className="muted" style={{ fontSize: 12, marginRight: 'auto' }}>
            Decides como <b style={{ color: 'var(--ink)' }}>{a.approver.name}</b>
          </div>
          <button className="btn" onClick={() => setShowReject(true)}>
            <Icon name="pencil" size={13}/> Solicitar cambios
          </button>
          <button className="btn btn-danger" onClick={() => setShowReject(true)}>
            <Icon name="x" size={13}/> Rechazar con motivo
          </button>
          <button className="btn btn-primary">
            <Icon name="check" size={13}/> Aprobar
          </button>
        </div>
      )}

      {!canDecide && (
        <div className="apr-actions">
          <div className="muted" style={{ fontSize: 12, marginRight: 'auto' }}>
            <Icon name="check" size={12}/> Resuelta {a.decidedAt} · {a.thread.length} mensajes en el hilo
          </div>
          <button className="btn"><Icon name="download" size={12}/> Exportar bitácora</button>
        </div>
      )}
    </>
  );
};

/* PUSH SETTINGS */
const PushSettings = ({ state, onRequest, onTest, onClose }) => (
  <>
    <div className="drawer-head">
      <div>
        <div className="page-eyebrow">Web Push API</div>
        <div className="t">Notificaciones push</div>
        <div className="s">Recibe avisos del navegador cuando lleguen solicitudes pendientes — sin necesidad de tener la app abierta.</div>
      </div>
      <button className="btn btn-ghost" onClick={onClose} style={{ padding: 6 }}>
        <Icon name="x" size={14}/>
      </button>
    </div>

    <div className="drawer-body">
      <div className="form-section">
        <div className={'push-state ' + state}>
          <div className="ic">
            <Icon name={state === 'granted' ? 'check' : state === 'denied' ? 'lock' : 'bell'} size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div className="t">
              {state === 'granted' && 'Notificaciones activas'}
              {state === 'denied'  && 'Notificaciones bloqueadas'}
              {state === 'default' && 'Notificaciones sin configurar'}
            </div>
            <div className="s">
              {state === 'granted' && 'Recibirás avisos en este navegador. Puedes revocar el permiso desde la configuración del sitio.'}
              {state === 'denied'  && 'Permiso denegado. Para activarlas, ve a la configuración del sitio en tu navegador y permite notificaciones.'}
              {state === 'default' && 'Da permiso para que el navegador muestre avisos cuando haya solicitudes que requieran tu atención.'}
            </div>
          </div>
          {state !== 'granted' && state !== 'denied' && (
            <button className="btn btn-primary" onClick={onRequest}>
              <Icon name="bell" size={13}/> Activar
            </button>
          )}
          {state === 'granted' && (
            <button className="btn" onClick={onTest}>
              <Icon name="bell" size={13}/> Enviar prueba
            </button>
          )}
        </div>
      </div>

      <div className="form-section">
        <div className="legend">Qué notificar</div>
        <div className="legend-sub">Eventos que dispararán un aviso push</div>
        <div className="push-events">
          {[
            { l: 'Nueva solicitud pendiente',       d: 'Cuando un colaborador me asigna una solicitud', on: true,  pri: 'high' },
            { l: 'SLA por vencer (≤ 2 h)',           d: 'Aviso prioritario antes de incumplir',           on: true,  pri: 'urgent' },
            { l: 'Réplica del solicitante',           d: 'Cuando responden a una solicitud que rechacé', on: true,  pri: 'med' },
            { l: 'Mis solicitudes resueltas',         d: 'Cuando aprueban/rechazan algo que envié',       on: true,  pri: 'med' },
            { l: 'Resúmenes diarios',                d: '08:00 · pendientes y vencimientos del día',     on: false, pri: 'low' },
            { l: 'Solicitudes urgentes (priority)',  d: 'Notificación persistente · requiere interacción',on: true,  pri: 'urgent' },
          ].map((e, i) => (
            <div key={i} className="push-row">
              <span className={'pri pri-' + e.pri}/>
              <div style={{ flex: 1 }}>
                <div className="t">{e.l}</div>
                <div className="s">{e.d}</div>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked={e.on}/>
                <span/>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <div className="legend">Horario silencioso</div>
        <div className="form-grid c2">
          <div className="field">
            <span className="field-label">No molestar desde</span>
            <input className="input" type="time" defaultValue="23:00"/>
          </div>
          <div className="field">
            <span className="field-label">Hasta</span>
            <input className="input" type="time" defaultValue="07:00"/>
          </div>
        </div>
        <label className="checkbox" style={{ marginTop: 12 }}>
          <input type="checkbox" defaultChecked/> Permitir push urgentes durante horario silencioso
        </label>
      </div>

      <div className="form-section">
        <div className="legend">Canales paralelos</div>
        <div className="legend-sub">Para asegurar entrega si el push falla</div>
        <div className="push-events">
          <div className="push-row">
            <span className="ic-sm"><Icon name="bell" size={12}/></span>
            <div style={{ flex: 1 }}><div className="t">SMS</div><div className="s">+52 664 ····2210</div></div>
            <label className="toggle"><input type="checkbox"/><span/></label>
          </div>
          <div className="push-row">
            <span className="ic-sm"><Icon name="bell" size={12}/></span>
            <div style={{ flex: 1 }}><div className="t">Email</div><div className="s">rodrigo@sartenypasion.mx</div></div>
            <label className="toggle"><input type="checkbox" defaultChecked/><span/></label>
          </div>
          <div className="push-row">
            <span className="ic-sm"><Icon name="bell" size={12}/></span>
            <div style={{ flex: 1 }}><div className="t">WhatsApp Business</div><div className="s">Solo solicitudes urgentes</div></div>
            <label className="toggle"><input type="checkbox" defaultChecked/><span/></label>
          </div>
        </div>
      </div>
    </div>

    <div className="drawer-foot">
      <button className="btn" onClick={onClose}>Cerrar</button>
      <button className="btn btn-primary" onClick={onClose}>Guardar preferencias</button>
    </div>
  </>
);

window.ApprovalsScreen = ApprovalsScreen;
