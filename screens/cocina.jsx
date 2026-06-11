/* Cocina / KDS — tablero de comandas en tiempo real
   Estaciones, tiempos, prioridades. Tocar un platillo avanza su estado
   (en cola → cocinando → listo). "Despachar" retira la comanda del tablero.
*/
const PRIORITY = {
  normal: { label: 'En tiempo', cls: 'normal' },
  rush:   { label: 'Apurar',    cls: 'rush' },
  vip:    { label: 'VIP',       cls: 'vip' },
  late:   { label: 'Demorada',  cls: 'late' },
};
const ITEM_FLOW = ['queued', 'cooking', 'ready'];
const ITEM_LABEL = { queued: 'En cola', cooking: 'Cocinando', ready: 'Listo' };

const CocinaScreen = ({ role }) => {
  const [tickets, setTickets] = useState(() => KDS_TICKETS.map(t => ({ ...t, items: t.items.map(i => ({ ...i })) })));
  const [bumped, setBumped] = useState(0);
  const [station, setStation] = useState('Todas');

  const advanceItem = (ti, ii) => {
    setTickets(ts => ts.map((t, x) => x !== ti ? t : {
      ...t,
      items: t.items.map((it, y) => {
        if (y !== ii) return it;
        const next = ITEM_FLOW[Math.min(ITEM_FLOW.indexOf(it.status) + 1, 2)];
        return { ...it, status: next };
      })
    }));
  };

  const bump = (ti) => {
    setTickets(ts => ts.filter((_, x) => x !== ti));
    setBumped(b => b + 1);
  };

  const elapsedCls = (m) => m >= 20 ? 'danger' : m >= 14 ? 'warning' : 'ok';

  return (
    <div className="content">
      <PageHead
        eyebrow="Cocina · servicio de cena en curso · 21:05"
        title="Cocina / KDS"
        sub="Comandas en vivo por estación, tiempos de preparación y prioridades de pase"
        actions={<>
          <button className="btn"><Icon name="timer" size={14}/> SLA pase ≤ 15 min</button>
          <button className="btn btn-ghost" onClick={() => { setTickets(KDS_TICKETS.map(t => ({ ...t, items: t.items.map(i => ({ ...i })) }))); setBumped(0); }}>
            <Icon name="archive" size={14}/> Reabrir turno
          </button>
        </>}
      />

      {/* STATION LOAD */}
      <div className="kds-stations">
        {KDS_STATIONS.map(s => (
          <button
            key={s.id}
            className={'kds-stat ' + (station === s.id ? 'on' : '')}
            onClick={() => setStation(station === s.id ? 'Todas' : s.id)}
          >
            <span className="kds-stat-dot" style={{ background: s.color }}/>
            <div className="kds-stat-body">
              <div className="kds-stat-name">{s.label}</div>
              <div className="kds-stat-meta">
                <span className="num">{s.active}</span> activos · prom <span className="num">{s.avg}</span>′
              </div>
            </div>
            <div className={'kds-stat-old num ' + elapsedCls(s.oldest)}>{s.oldest}′</div>
          </button>
        ))}
        <div className="kds-stat summary">
          <div className="kds-stat-body">
            <div className="kds-stat-name">Despachadas</div>
            <div className="kds-stat-meta"><span className="num">{bumped}</span> esta consulta</div>
          </div>
          <Icon name="check" size={18}/>
        </div>
      </div>

      {/* BOARD */}
      {tickets.length === 0 ? (
        <div className="kds-empty">
          <div className="ic"><Icon name="check" size={26}/></div>
          <div className="t">Cocina al día</div>
          <div className="s">No hay comandas pendientes. {bumped} despachadas en esta sesión.</div>
        </div>
      ) : (
        <div className="kds-board">
          {tickets.map((t, ti) => {
            const total = t.items.length;
            const ready = t.items.filter(i => i.status === 'ready').length;
            const allReady = ready === total;
            const p = PRIORITY[t.priority];
            return (
              <div key={t.id} className={'kds-ticket pr-' + p.cls + (allReady ? ' done' : '')}>
                <div className="kds-tkt-head">
                  <div>
                    <div className="kds-tkt-table">
                      Mesa {t.table}
                      <span className="kds-tkt-zone">{t.zone} · {t.pax} pax</span>
                    </div>
                    <div className="kds-tkt-sub">{t.id} · {t.server} · {t.course}</div>
                  </div>
                  <div className="kds-tkt-time">
                    <span className={'kds-elapsed num ' + elapsedCls(t.elapsed)}>{t.elapsed}′</span>
                    <span className={'kds-pri ' + p.cls}>{p.label}</span>
                  </div>
                </div>

                <div className="kds-items">
                  {t.items.map((it, ii) => {
                    const dim = station !== 'Todas' && it.station !== station;
                    const st = KDS_STATIONS.find(s => s.id === it.station);
                    return (
                      <button
                        key={ii}
                        className={'kds-item st-' + it.status + (dim ? ' dim' : '')}
                        onClick={() => advanceItem(ti, ii)}
                        title={'Avanzar a ' + (ITEM_LABEL[ITEM_FLOW[Math.min(ITEM_FLOW.indexOf(it.status)+1,2)]])}
                      >
                        <span className="kds-check">
                          {it.status === 'ready' ? <Icon name="check" size={13}/> :
                           it.status === 'cooking' ? <span className="kds-cooking"/> : null}
                        </span>
                        <span className="kds-qty num">{it.qty}×</span>
                        <span className="kds-item-body">
                          <span className="kds-item-name">{it.name}</span>
                          {it.mods.length > 0 && <span className="kds-item-mods">{it.mods.join(' · ')}</span>}
                        </span>
                        <span className="kds-item-st" style={{ color: st ? st.color : 'var(--muted)' }}>{it.station}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="kds-tkt-foot">
                  <span className="kds-progress">
                    <span className="num">{ready}</span>/{total} listos
                  </span>
                  <button
                    className={'btn ' + (allReady ? 'btn-primary' : 'btn-ghost')}
                    onClick={() => bump(ti)}
                  >
                    <Icon name="arrow_rt" size={13}/> {allReady ? 'Despachar' : 'Forzar pase'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
window.CocinaScreen = CocinaScreen;
