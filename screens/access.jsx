/* Perfiles y permisos (RBAC) — administración de acceso por perfil.
   La matriz es EDITABLE y en vivo: lo que enciendas/apagues aquí cambia
   lo que cada perfil ve en la navegación (perms se levanta al App).
   El perfil "Dueño" tiene acceso total y está bloqueado.
*/
const AccessScreen = ({ perms, setPerms, profileId: activeProfileId }) => {
  const groups = window.NAV_GROUPS || [];
  const profiles = ACCESS_PROFILES;
  const [focus, setFocus] = useState(null); // perfil resaltado en la matriz

  const toggle = (pid, mid) => {
    if (pid === 'owner') return; // dueño bloqueado
    setPerms(prev => {
      const cur = new Set(prev[pid] || []);
      cur.has(mid) ? cur.delete(mid) : cur.add(mid);
      return { ...prev, [pid]: [...cur] };
    });
  };

  const countFor = (pid) => {
    if (pid === 'owner') return groups.reduce((s, g) => s + g.items.length, 0);
    return (perms[pid] || []).length;
  };
  const totalModules = groups.reduce((s, g) => s + g.items.length, 0);

  return (
    <div className="content access-content">
      <PageHead
        eyebrow="Sistema · control de acceso"
        title="Perfiles y permisos"
        sub="Define qué módulos ve y administra cada perfil. Los cambios se aplican de inmediato a la navegación."
        actions={<>
          <button className="btn"><Icon name="team" size={14}/> Invitar colaborador</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> Nuevo perfil</button>
        </>}
      />

      {/* TARJETAS DE PERFIL */}
      <div className="profile-cards">
        {profiles.map(p => {
          const n = countFor(p.id);
          const members = (PROFILE_MEMBERS[p.id] || []);
          return (
            <button
              key={p.id}
              className={'profile-card ' + (focus === p.id ? 'on' : '') + (activeProfileId === p.id ? ' current' : '')}
              onClick={() => setFocus(focus === p.id ? null : p.id)}
            >
              <div className="pc-top">
                <span className="pc-avatar" style={{ background: p.color }}>{p.initials}</span>
                <div className="pc-id">
                  <div className="pc-name">{p.name}</div>
                  <div className="pc-title">{p.title}</div>
                </div>
                {activeProfileId === p.id && <span className="pc-you">Tú</span>}
              </div>
              <div className="pc-desc">{p.desc}</div>
              <div className="pc-foot">
                <span className={'pill ' + (p.role === 'partner' ? 'accent' : 'neutral')}>
                  <span className="dot"/>{p.role === 'partner' ? 'Ve finanzas' : 'Operación'}
                </span>
                <span className="pc-meta">
                  {p.id === 'owner' ? 'Todos los módulos' : <><b className="num">{n}</b>/{totalModules} módulos</>}
                  {' · '}<span className="num">{members.length}</span> {members.length === 1 ? 'persona' : 'personas'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* MATRIZ DE PERMISOS */}
      <div className="card matrix-card" style={{ padding: 0 }}>
        <div className="card-head" style={{ padding: '18px 20px 14px' }}>
          <div>
            <div className="card-title">Matriz de permisos</div>
            <div className="card-meta">Toca una celda para conceder o revocar acceso · el Dueño está bloqueado</div>
          </div>
        </div>
        <div className="matrix-scroll">
          <table className="matrix">
            <thead>
              <tr>
                <th className="matrix-mod-h">Módulo</th>
                {profiles.map(p => (
                  <th key={p.id} className={'matrix-prof-h ' + (focus && focus !== p.id ? 'fade' : '')}>
                    <span className="mh-avatar" style={{ background: p.color }}>{p.initials}</span>
                    <span className="mh-name">{p.title}</span>
                    {p.id === 'owner' && <Icon name="lock" size={11}/>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((g, gi) => (
                <React.Fragment key={gi}>
                  <tr className="matrix-group">
                    <td colSpan={profiles.length + 1}>{g.label}</td>
                  </tr>
                  {g.items.map(it => (
                    <tr key={it.id}>
                      <td className="matrix-mod">
                        <Icon name={it.icon} size={15}/>
                        <span>{it.label}</span>
                      </td>
                      {profiles.map(p => {
                        const on = p.id === 'owner' ? true : (perms[p.id] || []).includes(it.id);
                        const locked = p.id === 'owner';
                        return (
                          <td key={p.id} className={'matrix-cell ' + (focus && focus !== p.id ? 'fade' : '')}>
                            <button
                              className={'perm ' + (on ? 'on' : 'off') + (locked ? ' locked' : '')}
                              onClick={() => toggle(p.id, it.id)}
                              title={locked ? 'Acceso total (bloqueado)' : on ? 'Revocar acceso' : 'Conceder acceso'}
                              disabled={locked}
                            >
                              {on ? <Icon name={locked ? 'lock' : 'check'} size={13}/> : <span className="perm-dash"/>}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="matrix-foot">
          <span><span className="perm on inline"><Icon name="check" size={11}/></span> Con acceso</span>
          <span><span className="perm off inline"><span className="perm-dash"/></span> Sin acceso</span>
          <span><span className="perm locked inline"><Icon name="lock" size={11}/></span> Bloqueado (Dueño)</span>
          <span style={{ marginLeft: 'auto' }}>Cambios guardados automáticamente en esta sesión</span>
        </div>
      </div>
    </div>
  );
};
window.AccessScreen = AccessScreen;
