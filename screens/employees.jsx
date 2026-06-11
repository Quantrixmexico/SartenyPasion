/* Colaboradores — alta, baja, edición */
const EmployeesScreen = ({ role }) => {
  const [filter, setFilter] = useState('active');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('new');   // 'new' | 'edit'
  const [selected, setSelected] = useState(null);

  // form state
  const [form, setForm] = useState({
    name: '', role: '', email: '', phone: '', rfc: '', curp: '', nss: '',
    address: '', emergency: '', startDate: '2026-05-22', contract: 'indefinido',
    schedule: 'tiempo_completo', pay: 'quincenal', salary: '', area: 'cocina',
    bank: 'BBVA', account: '', notes: ''
  });

  const set = (k, v) => setForm({ ...form, [k]: v });
  const openNew = () => {
    setDrawerMode('new');
    setForm({
      name: '', role: '', email: '', phone: '', rfc: '', curp: '', nss: '',
      address: '', emergency: '', startDate: '2026-05-22', contract: 'indefinido',
      schedule: 'tiempo_completo', pay: 'quincenal', salary: '', area: 'cocina',
      bank: 'BBVA', account: '', notes: ''
    });
    setDrawerOpen(true);
  };
  const openEdit = (s) => {
    setDrawerMode('edit');
    setSelected(s);
    setForm({
      name: s.name, role: s.role, email: `${s.initials.toLowerCase()}@sartenypasion.mx`, phone: '+52 664 ····',
      rfc: 'XXXX800101XXX', curp: 'XXXX800101XXXX01', nss: '12345678901',
      address: 'Zona Río, Tijuana, BC', emergency: '+52 664 555 0000',
      startDate: '2024-08-15', contract: 'indefinido',
      schedule: 'tiempo_completo', pay: s.pay.split(' ')[0].toLowerCase(), salary: String(s.salary),
      area: s.role.toLowerCase().includes('chef') ? 'cocina' : s.role.toLowerCase().includes('mese') ? 'piso' : 'cocina',
      bank: 'BBVA', account: '012180····8421', notes: ''
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => { setDrawerOpen(false); setSelected(null); };

  const counts = {
    active: STAFF.length,
    pending: 1,
    blocked: STAFF_BLOCKED.length,
    inactive: 3,
  };

  return (
    <div className="content">
      <PageHead
        eyebrow="Equipo · base de datos"
        title="Colaboradores"
        sub={`${STAFF.length} activos · 3 inactivos · 1 candidato pendiente de alta`}
        actions={<>
          <button className="btn"><Icon name="download" size={14}/> Exportar IMSS</button>
          <button className="btn btn-primary" onClick={openNew}>
            <Icon name="plus" size={14}/> Nuevo colaborador
          </button>
        </>}
      />

      <Tabs value={filter} onChange={setFilter} tabs={[
        { value: 'active',   label: 'Activos',   count: counts.active },
        { value: 'pending',  label: 'En proceso de alta', count: counts.pending },
        { value: 'blocked',  label: 'Bloqueados / suspendidos', count: counts.blocked },
        { value: 'inactive', label: 'Bajas',     count: counts.inactive },
      ]}/>

      {filter === 'active' && (
        <div className="emp-list">
          <div className="emp-row" style={{ background: 'var(--surface-2)', cursor: 'default', padding: '10px 18px' }}>
            <div></div>
            <div className="eyebrow">Nombre / Puesto</div>
            <div className="eyebrow">Email</div>
            <div className="eyebrow">Ingreso</div>
            <div className="eyebrow">Salario</div>
            <div className="eyebrow">Estado</div>
            <div></div>
          </div>
          {STAFF.map((s, i) => (
            <div key={i} className="emp-row" onClick={() => openEdit(s)}>
              <div className="av" style={{ background: s.color }}>{s.initials}</div>
              <div>
                <div className="nm">{s.name}</div>
                <div className="role">{s.role}</div>
              </div>
              <div className="muted" style={{ fontSize: 12 }}>{s.initials.toLowerCase()}@sartenypasion.mx</div>
              <div>
                <div className="m">{['15 ago 24','03 mar 25','22 jun 23','11 nov 24','07 ene 25','19 feb 26','04 abr 25','12 may 26','28 jul 24'][i]}</div>
                <div className="m sub">{['1.8 años','1.3 años','2.9 años','1.5 años','1.4 años','3 meses','1.1 años','1 semana','1.8 años'][i]}</div>
              </div>
              <div>
                <div className="m">{fmtMXN(s.salary)}</div>
                <div className="m sub">{s.pay}</div>
              </div>
              <div>
                {s.status === 'in' && <span className="pill positive"><span className="dot"/>En turno</span>}
                {s.status === 'late' && <span className="pill warning"><span className="dot"/>Retraso</span>}
                {s.status === 'out' && <span className="pill neutral"><span className="dot"/>Día libre</span>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <Icon name="arrow_rt" size={14}/>
              </div>
            </div>
          ))}
        </div>
      )}

      {filter === 'pending' && (
        <div className="emp-list">
          <div className="emp-row">
            <div className="av" style={{ background: '#5C6F7E' }}>SA</div>
            <div>
              <div className="nm">Sandra Avilés <span className="pill warning" style={{ marginLeft: 8 }}><span className="dot"/>Falta IMSS</span></div>
              <div className="role">Mesera · candidata</div>
            </div>
            <div className="muted" style={{ fontSize: 12 }}>sandra.aviles@gmail.com</div>
            <div>
              <div className="m">23 may 26</div>
              <div className="m sub">en 2 días</div>
            </div>
            <div>
              <div className="m">{fmtMXN(9800)}</div>
              <div className="m sub">Quincenal + propina</div>
            </div>
            <div><span className="pill warning"><span className="dot"/>Pendiente</span></div>
            <div style={{ textAlign: 'right' }}><Icon name="arrow_rt" size={14}/></div>
          </div>
        </div>
      )}

      {filter === 'blocked' && (
        <div className="emp-list">
          {STAFF_BLOCKED.map((s, i) => (
            <div key={i} className="emp-row" style={{ background: 'linear-gradient(90deg, var(--warning-soft), transparent 50%)' }}>
              <div className="av" style={{ background: s.color, position: 'relative' }}>
                {s.initials}
                <span style={{
                  position: 'absolute', bottom: -2, right: -2,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'var(--warning)', color: 'var(--bg)',
                  display: 'grid', placeItems: 'center',
                  border: '2px solid var(--bg-2)'
                }}>
                  <Icon name="lock" size={8}/>
                </span>
              </div>
              <div>
                <div className="nm">{s.name}</div>
                <div className="role">{s.role} · {s.kind === 'medical' ? 'Incapacidad médica' : 'Suspensión disciplinaria'}</div>
              </div>
              <div className="muted" style={{ fontSize: 12 }}>{s.reason}</div>
              <div>
                <div className="m">Desde {s.since}</div>
                <div className="m sub">Reanuda: {s.resumes}</div>
              </div>
              <div className="m sub">—</div>
              <div>
                {s.kind === 'medical'
                  ? <span className="pill accent"><span className="dot"/>Incapacidad</span>
                  : <span className="pill warning"><span className="dot"/>Suspendido</span>}
              </div>
              <div style={{ textAlign: 'right' }}><Icon name="arrow_rt" size={14}/></div>
            </div>
          ))}
          <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)' }}>
            <Icon name="info" size={12}/> Los bloqueos suspenden acceso a punto de venta, nómina y horarios. Para reanudar, abre el expediente y confirma reincorporación.
          </div>
        </div>
      )}

      {filter === 'inactive' && (
        <div className="emp-list">
          {[
            { initials: 'GR', name: 'Gerardo Romo',    role: 'Cocinero línea',  out: '08 mar 26', reason: 'Renuncia voluntaria',     tenure: '1.8 años', color: '#7E5C8E' },
            { initials: 'MT', name: 'María Tovar',     role: 'Hostess',          out: '15 dic 25', reason: 'Fin de contrato temporal', tenure: '6 meses',  color: '#7E9C6E' },
            { initials: 'RL', name: 'Raúl López',      role: 'Lavaloza',         out: '02 oct 25', reason: 'Reubicación geográfica',   tenure: '11 meses', color: '#A88B5C' },
          ].map((s, i) => (
            <div key={i} className="emp-row" style={{ opacity: 0.7 }}>
              <div className="av" style={{ background: s.color }}>{s.initials}</div>
              <div>
                <div className="nm">{s.name}</div>
                <div className="role">{s.role}</div>
              </div>
              <div className="muted" style={{ fontSize: 12 }}>{s.reason}</div>
              <div>
                <div className="m">{s.out}</div>
                <div className="m sub">{s.tenure}</div>
              </div>
              <div className="m sub">—</div>
              <div><span className="pill neutral"><span className="dot"/>Baja</span></div>
              <div style={{ textAlign: 'right' }}><Icon name="arrow_rt" size={14}/></div>
            </div>
          ))}
        </div>
      )}

      {/* DRAWER */}
      <div className={'drawer-backdrop ' + (drawerOpen ? 'open' : '')} onClick={closeDrawer}/>
      <div className={'drawer ' + (drawerOpen ? 'open' : '')}>
        <div className="drawer-head">
          <div>
            <div className="page-eyebrow">{drawerMode === 'new' ? 'Alta de colaborador' : 'Editar colaborador'}</div>
            <div className="t">{drawerMode === 'new' ? 'Nuevo colaborador' : form.name || 'Editar'}</div>
            <div className="s">{drawerMode === 'new' ? 'Completa la información personal, fiscal y laboral' : 'Modifica datos · todos los cambios quedan en bitácora'}</div>
          </div>
          <button className="btn btn-ghost" onClick={closeDrawer} style={{ padding: 6 }}>
            <Icon name="x" size={14}/>
          </button>
        </div>

        <div className="drawer-body">
          <div className="form-section">
            <div className="legend">Datos personales</div>
            <div className="form-grid c2">
              <div className="field" style={{ gridColumn: 'span 2' }}>
                <span className="field-label">Nombre completo</span>
                <input className="input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Nombre(s) y apellidos"/>
              </div>
              <div className="field">
                <span className="field-label">Email</span>
                <input className="input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="nombre@sartenypasion.mx"/>
              </div>
              <div className="field">
                <span className="field-label">Teléfono</span>
                <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+52 664 ····"/>
              </div>
              <div className="field" style={{ gridColumn: 'span 2' }}>
                <span className="field-label">Dirección</span>
                <input className="input" value={form.address} onChange={e => set('address', e.target.value)}/>
              </div>
              <div className="field" style={{ gridColumn: 'span 2' }}>
                <span className="field-label">Contacto de emergencia</span>
                <input className="input" value={form.emergency} onChange={e => set('emergency', e.target.value)} placeholder="Nombre + teléfono"/>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="legend">Datos fiscales</div>
            <div className="form-grid c2">
              <div className="field">
                <span className="field-label">RFC</span>
                <input className="input mono" value={form.rfc} onChange={e => set('rfc', e.target.value)} placeholder="XXXX800101XXX"/>
              </div>
              <div className="field">
                <span className="field-label">CURP</span>
                <input className="input mono" value={form.curp} onChange={e => set('curp', e.target.value)}/>
              </div>
              <div className="field">
                <span className="field-label">NSS · IMSS</span>
                <input className="input mono" value={form.nss} onChange={e => set('nss', e.target.value)} placeholder="11 dígitos"/>
              </div>
              <div className="field">
                <span className="field-label">Régimen</span>
                <select className="select" defaultValue="asalariado">
                  <option value="asalariado">Asimilado a salarios</option>
                  <option value="honorarios">Honorarios</option>
                  <option value="sueldos">Sueldos y salarios</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="legend">Puesto y contrato</div>
            <div className="form-grid c2">
              <div className="field">
                <span className="field-label">Puesto</span>
                <input className="input" value={form.role} onChange={e => set('role', e.target.value)} placeholder="ej. Cocinero línea"/>
              </div>
              <div className="field">
                <span className="field-label">Área</span>
                <select className="select" value={form.area} onChange={e => set('area', e.target.value)}>
                  <option value="cocina">Cocina</option>
                  <option value="piso">Piso</option>
                  <option value="bar">Bar</option>
                  <option value="gerencia">Gerencia</option>
                  <option value="limpieza">Limpieza</option>
                </select>
              </div>
              <div className="field">
                <span className="field-label">Tipo de contrato</span>
                <select className="select" value={form.contract} onChange={e => set('contract', e.target.value)}>
                  <option value="indefinido">Indefinido</option>
                  <option value="prueba">A prueba (90 días)</option>
                  <option value="temporal">Temporal</option>
                  <option value="evento">Por evento</option>
                </select>
              </div>
              <div className="field">
                <span className="field-label">Jornada</span>
                <select className="select" value={form.schedule} onChange={e => set('schedule', e.target.value)}>
                  <option value="tiempo_completo">Tiempo completo</option>
                  <option value="medio_tiempo">Medio tiempo</option>
                  <option value="por_hora">Por hora</option>
                </select>
              </div>
              <div className="field">
                <span className="field-label">Fecha de ingreso</span>
                <input className="input" type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)}/>
              </div>
              <div className="field">
                <span className="field-label">Periodicidad de pago</span>
                <select className="select" value={form.pay} onChange={e => set('pay', e.target.value)}>
                  <option value="quincenal">Quincenal</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>
              <div className="field" style={{ gridColumn: 'span 2' }}>
                <span className="field-label">Salario base ({form.pay})</span>
                <div className="input-prefix">
                  <span className="prefix">$</span>
                  <input className="input num" value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="0.00"/>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="legend">Cuenta bancaria · dispersión</div>
            <div className="form-grid c2">
              <div className="field">
                <span className="field-label">Banco</span>
                <select className="select" value={form.bank} onChange={e => set('bank', e.target.value)}>
                  <option>BBVA</option><option>Banamex</option><option>Santander</option>
                  <option>Banorte</option><option>HSBC</option><option>Mercado Pago</option>
                </select>
              </div>
              <div className="field">
                <span className="field-label">CLABE interbancaria</span>
                <input className="input mono" value={form.account} onChange={e => set('account', e.target.value)} placeholder="18 dígitos"/>
              </div>
            </div>
          </div>

          {drawerMode === 'edit' && (
            <div className="form-section">
              <div className="legend">Bitácora del expediente</div>
              <div className="activity">
                <div className="activity-row">
                  <div className="dot" style={{ background: 'var(--positive)' }}/>
                  <div>
                    <div className="t">Aumento de sueldo aprobado</div>
                    <div className="s">$ 22,400 → $ 24,800 · revisión semestral</div>
                  </div>
                  <div className="when">12 Mar 26</div>
                </div>
                <div className="activity-row">
                  <div className="dot" style={{ background: 'var(--accent)' }}/>
                  <div>
                    <div className="t">Curso de manejo higiénico de alimentos</div>
                    <div className="s">Certificación NOM-251 · vigencia 1 año</div>
                  </div>
                  <div className="when">18 Ene 26</div>
                </div>
                <div className="activity-row">
                  <div className="dot"/>
                  <div>
                    <div className="t">Alta IMSS</div>
                    <div className="s">Registro patronal · SUA</div>
                  </div>
                  <div className="when">{form.startDate}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="drawer-foot">
          {drawerMode === 'edit' && (
            <div style={{ marginRight: 'auto', display: 'flex', gap: 8 }}>
              <button className="btn" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }}>
                <Icon name="lock" size={13}/> Suspender / bloquear
              </button>
              <button className="btn btn-danger">Dar de baja</button>
            </div>
          )}
          <button className="btn" onClick={closeDrawer}>Cancelar</button>
          <button className="btn btn-primary" onClick={closeDrawer}>
            {drawerMode === 'new' ? 'Crear colaborador' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};
window.EmployeesScreen = EmployeesScreen;
