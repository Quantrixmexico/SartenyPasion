/* Sartén & Pasión — App shell */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "inkTone": "crema"
}/*EDITMODE-END*/;

// 4 tonos de tipografía — se mapean por tema para mantener legibilidad.
// { ink: color de texto principal, ink2: texto secundario }
const INK_TONES = {
  dark: {
    crema:     { ink: '#EDE5D6', ink2: '#C8BEAB' },
    arena:     { ink: '#E9D6AE', ink2: '#C7B388' },
    terracota: { ink: '#E9B79B', ink2: '#C89177' },
    contraste: { ink: '#FAF6EE', ink2: '#D6CEC0' },
  },
  light: {
    crema:     { ink: '#1A0E0A', ink2: '#3D2A22' },
    arena:     { ink: '#3E2C12', ink2: '#5C472A' },
    terracota: { ink: '#7A241C', ink2: '#9A4034' },
    contraste: { ink: '#0A0604', ink2: '#241612' },
  },
};
const INK_TONE_KEYS = ['crema', 'arena', 'terracota', 'contraste'];

const NAV_GROUPS = [
  {
    label: 'Ejecutivo',
    items: [
      { id: 'dashboard',  label: 'Dashboard',         icon: 'dashboard' },
      { id: 'reports',    label: 'Reportes ejecutivos', icon: 'chart' },
      { id: 'approvals',  label: 'Aprobaciones',      icon: 'inbox',    badge: '3', badgeDanger: true },
      { id: 'partners',   label: 'Reporte a socios',  icon: 'partners' },
    ]
  },
  {
    label: 'Operación',
    items: [
      { id: 'pos',        label: 'POS / órdenes',     icon: 'pos' },
      { id: 'tables',     label: 'Mapa de mesas',     icon: 'table' },
      { id: 'cash',       label: 'Cortes de caja',    icon: 'cost' },
      { id: 'cocina',     label: 'Cocina / KDS',      icon: 'flame',    badge: '6' },
      { id: 'sales',      label: 'Ventas por canal',  icon: 'sales' },
      { id: 'costs',      label: 'Control de costos', icon: 'cost' },
      { id: 'menu',       label: 'Menú y recetas',     icon: 'tag' },
      { id: 'catalog',    label: 'Catálogo de mercancías', icon: 'box' },
      { id: 'inventory',  label: 'Inventario',        icon: 'inventory', badge: '3' },
      { id: 'expire',     label: 'Caducidades',       icon: 'expire',    badge: '2', badgeDanger: true },
    ]
  },
  {
    label: 'Capturas diarias',
    items: [
      { id: 'intake',     label: 'Recibir compra',    icon: 'box' },
      { id: 'pay',        label: 'Pagar proveedor',   icon: 'receipt', badge: '5' },
      { id: 'run',        label: 'Correr nómina',     icon: 'payroll' },
    ]
  },
  {
    label: 'Finanzas',
    items: [
      { id: 'bank',       label: 'Conciliación',      icon: 'bank',     badge: '2' },
      { id: 'invoicing',  label: 'Facturación / CFDI', icon: 'doc',      badge: '6' },
      { id: 'suppliers',  label: 'Proveedores',       icon: 'suppliers' },
      { id: 'payroll',    label: 'Nómina',            icon: 'payroll' },
    ]
  },
  {
    label: 'Equipo',
    items: [
      { id: 'employees',  label: 'Colaboradores',     icon: 'partners' },
      { id: 'schedules',  label: 'Horarios y turnos', icon: 'cal' },
    ]
  },
  {
    label: 'Sistema',
    items: [
      { id: 'access',     label: 'Perfiles y permisos', icon: 'lock' },
    ]
  }
];

// expuesto para la pantalla de Perfiles y permisos
window.NAV_GROUPS = NAV_GROUPS;

const NAV_LABELS = {
  dashboard: 'Dashboard',
  reports: 'Reportes ejecutivos',
  approvals: 'Aprobaciones',
  partners: 'Reporte a socios',
  pos: 'POS / órdenes',
  tables: 'Mapa de mesas',
  cash: 'Cortes de caja y turnos',
  cocina: 'Cocina / KDS',
  sales: 'Ventas por canal',
  costs: 'Control de costos',
  menu: 'Menú y recetas',
  catalog: 'Catálogo de mercancías',
  inventory: 'Inventario',
  expire: 'Caducidades y mermas',
  intake: 'Recibir compra',
  pay: 'Pagar a proveedor',
  run: 'Correr nómina',
  bank: 'Conciliación bancaria',
  invoicing: 'Facturación / CFDI',
  suppliers: 'Proveedores',
  payroll: 'Nómina y asistencia',
  employees: 'Colaboradores',
  schedules: 'Horarios y turnos',
  access: 'Perfiles y permisos',
};

const ALL_MODULE_IDS = NAV_GROUPS.flatMap(g => g.items.map(i => i.id));

const App = () => {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setViewRaw] = useState('dashboard');
  const [profileId, setProfileId] = useState('owner');
  const [profileMenu, setProfileMenu] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [navOpen, setNavOpen] = useState(false);

  // navegar y cerrar el cajón móvil de un golpe
  const setView = (id) => { setViewRaw(id); setNavOpen(false); };

  // permisos editables en vivo (la matriz de "Perfiles y permisos" los modifica)
  const [perms, setPerms] = useState(() => {
    const o = {};
    ACCESS_PROFILES.forEach(p => { o[p.id] = p.access === '*' ? [...ALL_MODULE_IDS] : [...p.access]; });
    return o;
  });

  const profile = ACCESS_PROFILES.find(p => p.id === profileId) || ACCESS_PROFILES[0];
  const role = profile.role;                       // 'partner' | 'operator' para pantallas existentes
  const allowed = profileId === 'owner' ? ALL_MODULE_IDS : (perms[profileId] || []);
  const canSee = (id) => allowed.includes(id);

  const switchProfile = (id) => {
    const p = ACCESS_PROFILES.find(x => x.id === id);
    setProfileId(id);
    setProfileMenu(false);
    if (p) setView(p.home);
  };

  // apply theme + tono de tipografía on document
  useEffect(() => {
    const theme = tweaks.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    const tone = (INK_TONES[theme] || INK_TONES.dark)[tweaks.inkTone] || INK_TONES[theme].crema;
    document.documentElement.style.setProperty('--ink', tone.ink);
    document.documentElement.style.setProperty('--ink-2', tone.ink2);
  }, [tweaks.theme, tweaks.inkTone]);

  // si el perfil pierde acceso a la vista actual, regresa a su inicio
  useEffect(() => {
    if (!canSee(view)) setView(profile.home);
  }, [profileId, perms]); // eslint-disable-line

  // global navigation so success states / deep CTAs can switch screens
  useEffect(() => {
    window.__navigate = (id) => setView(id);
  }, []);

  const screenProps = { role, navigate: setView, profileId, perms, setPerms };
  const safeView = canSee(view) ? view : profile.home;
  const Screen = {
    dashboard: DashboardScreen,
    reports:   ReportsScreen,
    approvals: ApprovalsScreen,
    partners:  PartnersScreen,
    pos:       PosScreen,
    tables:    TablesScreen,
    cash:      CashScreen,
    cocina:    CocinaScreen,
    sales:     SalesScreen,
    costs:     CostsScreen,
    menu:      MenuScreen,
    catalog:   CatalogScreen,
    inventory: InventoryScreen,
    expire:    ExpirationsScreen,
    intake:    PurchaseIntakeScreen,
    pay:       PaySupplierScreen,
    run:       PayrollRunScreen,
    bank:      ReconciliationScreen,
    invoicing: InvoicingScreen,
    suppliers: SuppliersScreen,
    payroll:   PayrollScreen,
    employees: EmployeesScreen,
    schedules: SchedulesScreen,
    access:    AccessScreen,
  }[safeView];

  return (
    <div className={'app' + (navOpen ? ' nav-open' : '')}>
      {/* SCRIM móvil */}
      <div className="nav-scrim" onClick={() => setNavOpen(false)}/>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <img src="logo.png" alt="Sartén & Pasión" className="brand-logo"/>
          <div>
            <div className="brand-name">Sartén & Pasión</div>
            <div className="brand-meta">Cocina mexicana · Tijuana</div>
          </div>
        </div>

        {NAV_GROUPS.map((g, i) => {
          const items = g.items.filter(it => canSee(it.id));
          if (items.length === 0) return null;
          return (
            <div key={i}>
              <div className="nav-section">{g.label}</div>
              {items.map(it => (
                <div
                  key={it.id}
                  className={'nav-item ' + (safeView === it.id ? 'active' : '')}
                  onClick={() => setView(it.id)}
                >
                  <Icon name={it.icon} className="icon"/>
                  <span>{it.label}</span>
                  {it.badge && (
                    <span className={'badge ' + (it.badgeDanger ? 'danger' : '')}>{it.badge}</span>
                  )}
                </div>
              ))}
            </div>
          );
        })}

        <div className="sidebar-foot">
          <div className="avatar" style={{ background: profile.color }}>{profile.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">{profile.name}</div>
            <div className="user-role">{profile.title}</div>
          </div>
          {canSee('access') && (
            <button className="btn btn-ghost" style={{ padding: 4 }} title="Perfiles y permisos" onClick={() => setView('access')}>
              <Icon name="settings" size={14}/>
            </button>
          )}
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <button className="nav-toggle" onClick={() => setNavOpen(o => !o)} aria-label="Menú">
            <Icon name={navOpen ? 'x' : 'menu'} size={18}/>
          </button>
          <div className="crumbs">
            <span>{NAV_GROUPS.find(g => g.items.some(i => i.id === safeView))?.label}</span>
            <span className="sep">/</span>
            <span className="here">{NAV_LABELS[safeView]}</span>
          </div>

          <div className="profile-switch">
            <button className="ps-trigger" onClick={() => setProfileMenu(o => !o)}>
              <span className="ps-avatar" style={{ background: profile.color }}>{profile.initials}</span>
              <span className="ps-id">
                <span className="ps-name">{profile.name}</span>
                <span className="ps-title">{profile.title}</span>
              </span>
              <Icon name="chevron" size={14}/>
            </button>
            {profileMenu && (
              <>
                <div className="ps-backdrop" onClick={() => setProfileMenu(false)}/>
                <div className="ps-menu">
                  <div className="ps-menu-head">Cambiar de perfil</div>
                  {ACCESS_PROFILES.map(p => {
                    const n = p.id === 'owner' ? ALL_MODULE_IDS.length : (perms[p.id] || []).length;
                    return (
                      <button
                        key={p.id}
                        className={'ps-opt ' + (p.id === profileId ? 'on' : '')}
                        onClick={() => switchProfile(p.id)}
                      >
                        <span className="ps-avatar sm" style={{ background: p.color }}>{p.initials}</span>
                        <span className="ps-id">
                          <span className="ps-name">{p.name}</span>
                          <span className="ps-title">{p.title} · {n} módulos</span>
                        </span>
                        {p.id === profileId && <Icon name="check" size={14}/>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="spacer"/>

          <div className="search">
            <Icon name="search" size={14}/>
            <input placeholder="Buscar platillo, SKU, proveedor…"/>
            <kbd>⌘K</kbd>
          </div>

          <button className="icon-btn" title="Aprobaciones pendientes" onClick={() => setView('approvals')}>
            <Icon name="bell" size={15}/>
            <span className="ping"/>
          </button>
        </div>

        {bannerVisible && (
          <div className="alert-banner">
            <span className="pip"/>
            <span className="b-title">Crítico:</span>
            <span className="b-meta">Robalo entero (3.2 kg · $ 1,024) caduca hoy — generar especial o registrar merma antes de cierre</span>
            <a className="b-cta" onClick={() => setView('expire')}>Ver detalle →</a>
            <button className="b-close" onClick={() => setBannerVisible(false)} aria-label="Cerrar">
              <Icon name="x" size={13}/>
            </button>
          </div>
        )}

        <Screen {...screenProps} />
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Apariencia">
          <TweakRadio
            label="Tema"
            value={tweaks.theme}
            options={[
              { value: 'dark',  label: 'Oscuro' },
              { value: 'light', label: 'Claro' }
            ]}
            onChange={v => setTweak('theme', v)}
          />
          <TweakColor
            label="Color de tipografía"
            value={INK_TONES[tweaks.theme || 'dark'][tweaks.inkTone || 'crema'].ink}
            options={INK_TONE_KEYS.map(k => INK_TONES[tweaks.theme || 'dark'][k].ink)}
            onChange={hex => {
              const swatches = INK_TONE_KEYS.map(k => INK_TONES[tweaks.theme || 'dark'][k].ink);
              const i = swatches.findIndex(s => s.toLowerCase() === String(hex).toLowerCase());
              setTweak('inkTone', INK_TONE_KEYS[i < 0 ? 0 : i]);
            }}
          />
        </TweakSection>
        <TweakSection label="Navegación rápida">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {Object.entries(NAV_LABELS).filter(([id]) => canSee(id)).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setView(id)}
                style={{
                  padding: '6px 8px',
                  background: safeView === id ? 'var(--accent-soft)' : 'var(--surface-2)',
                  color: safeView === id ? 'var(--accent)' : 'var(--ink-2)',
                  border: '1px solid ' + (safeView === id ? 'var(--accent-soft)' : 'var(--border)'),
                  borderRadius: 6, fontSize: 11.5, textAlign: 'left', cursor: 'pointer'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </TweakSection>
        <TweakSection label="Perfil activo">
          <TweakSelect
            label="Iniciar sesión como"
            value={profileId}
            options={ACCESS_PROFILES.map(p => ({ value: p.id, label: p.name + ' · ' + p.title }))}
            onChange={switchProfile}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
