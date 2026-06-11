/* Sartén & Pasión — datos plausibles */
const fmtMXNNum = (n) => '$ ' + n.toLocaleString('es-MX');
const RESTAURANT = {
  name: 'Sartén & Pasión',
  subtitle: 'Cocina mexicana · Tijuana',
  fiscal: 'SYP-2306',
  currency: 'MXN',
};

const KPIS = {
  today: {
    sales: 84320,
    salesDelta: 12.4,
    foodCost: 31.8,
    foodTarget: 30.0,
    laborCost: 24.6,
    laborTarget: 26.0,
    margin: 18.4,
    marginDelta: -1.2,
    covers: 142,
    coversDelta: 8.3,
    ticket: 593,
    ticketDelta: 3.9,
    cash: 412580,
    runway: 47,
  },
  month: {
    sales: 1842900,
    salesTarget: 2000000,
    foodCost: 30.9,
    laborCost: 25.1,
    margin: 19.2,
    ebitda: 354000,
  }
};

// Ventas últimos 14 días (MXN)
const SALES_TREND = [
  62300, 71200, 68900, 79400, 84100, 95200, 102300,
  64500, 73100, 70200, 81800, 86900, 97400, 84320
];

const CHANNELS_TODAY = [
  { id: 'dine', name: 'Salón',         icon: '⌂', amount: 48230, share: 57.2, delta: +8.1, color: '#D89757' },
  { id: 'togo', name: 'Para llevar',   icon: '◐', amount: 12410, share: 14.7, delta: +2.4, color: '#B07F86' },
  { id: 'rapp', name: 'Rappi',         icon: 'R', amount:  9820, share: 11.6, delta: -3.2, color: '#7E9C6E' },
  { id: 'uber', name: 'Uber Eats',     icon: 'U', amount:  7910, share:  9.4, delta: +5.6, color: '#6E8AAA' },
  { id: 'didi', name: 'DiDi Food',     icon: 'D', amount:  3520, share:  4.2, delta: +1.1, color: '#A88B5C' },
  { id: 'evt',  name: 'Eventos',       icon: '☆', amount:  2430, share:  2.9, delta:  0.0, color: '#9C7AB0' },
];

const TOP_DISHES = [
  { name: 'Risotto de huitlacoche',     sold: 28, price: 285, foodCost: 26.4, margin: 73.6, trend: +14 },
  { name: 'Tartar de res y tuétano',    sold: 22, price: 320, foodCost: 34.2, margin: 65.8, trend:  +6 },
  { name: 'Pulpo a las brasas',         sold: 19, price: 365, foodCost: 38.8, margin: 61.2, trend:  -3 },
  { name: 'Tacos de pesca del día',     sold: 34, price: 195, foodCost: 28.1, margin: 71.9, trend: +22 },
  { name: 'Sopa de tortilla y epazote', sold: 41, price: 145, foodCost: 19.4, margin: 80.6, trend:  +9 },
  { name: 'Tarta tibia de mole',        sold: 17, price: 165, foodCost: 22.8, margin: 77.2, trend:  +4 },
  { name: 'Aguachile de camarón',       sold: 25, price: 245, foodCost: 36.5, margin: 63.5, trend: +11 },
  { name: 'Costilla braseada 8h',       sold: 14, price: 395, foodCost: 31.9, margin: 68.1, trend:  +2 },
];

const INVENTORY = [
  { sku: 'CAR-001', name: 'Lomo de res Angus',        cat: 'Carnes',     unit: 'kg',  stock:  8.4, par: 18,  reorder: 12, cost: 480, expDays:  6 },
  { sku: 'CAR-002', name: 'Costilla short rib',       cat: 'Carnes',     unit: 'kg',  stock: 22.0, par: 25,  reorder: 15, cost: 380, expDays:  9 },
  { sku: 'PES-001', name: 'Robalo entero',            cat: 'Pescados',   unit: 'kg',  stock:  3.2, par: 12,  reorder:  8, cost: 320, expDays:  2 },
  { sku: 'PES-002', name: 'Camarón U-15',             cat: 'Pescados',   unit: 'kg',  stock:  4.8, par: 10,  reorder:  6, cost: 540, expDays:  3 },
  { sku: 'PES-003', name: 'Pulpo cocido',             cat: 'Pescados',   unit: 'kg',  stock:  6.1, par:  8,  reorder:  5, cost: 410, expDays:  4 },
  { sku: 'VEG-001', name: 'Huitlacoche fresco',       cat: 'Verduras',   unit: 'kg',  stock:  2.4, par:  6,  reorder:  4, cost: 280, expDays:  2 },
  { sku: 'VEG-002', name: 'Aguacate Hass',            cat: 'Verduras',   unit: 'kg',  stock: 14.8, par: 20,  reorder: 12, cost:  98, expDays:  5 },
  { sku: 'VEG-003', name: 'Tomate saladette',         cat: 'Verduras',   unit: 'kg',  stock: 18.2, par: 24,  reorder: 15, cost:  38, expDays:  7 },
  { sku: 'VEG-004', name: 'Epazote',                  cat: 'Verduras',   unit: 'manojo', stock: 6, par: 14, reorder: 8, cost:  18, expDays:  4 },
  { sku: 'LAC-001', name: 'Queso Oaxaca artesanal',   cat: 'Lácteos',    unit: 'kg',  stock:  3.8, par:  6,  reorder:  4, cost: 220, expDays:  8 },
  { sku: 'LAC-002', name: 'Crema La Esperanza',       cat: 'Lácteos',    unit: 'L',   stock:  4.0, par:  8,  reorder:  6, cost:  64, expDays:  3 },
  { sku: 'VIN-001', name: 'Vino tinto Monte Xanic',   cat: 'Vinos',      unit: 'bot', stock: 18,   par: 24,  reorder: 12, cost: 380, expDays: 720 },
  { sku: 'VIN-002', name: 'Vino blanco L.A. Cetto',   cat: 'Vinos',      unit: 'bot', stock:  9,   par: 18,  reorder: 12, cost: 290, expDays: 540 },
  { sku: 'SEC-001', name: 'Tortilla maíz nixtamal',   cat: 'Secos',      unit: 'kg',  stock: 12,   par: 20,  reorder: 14, cost:  32, expDays:  3 },
  { sku: 'SEC-002', name: 'Arroz arborio',            cat: 'Secos',      unit: 'kg',  stock:  6.4, par: 12,  reorder:  8, cost:  68, expDays: 240 },
];

const EXPIRING = [
  { item: 'Robalo entero',         sku: 'PES-001', qty: 3.2, unit: 'kg', when: 'Hoy',          severity: 'danger',  loc: 'Cámara fría 2' },
  { item: 'Huitlacoche fresco',    sku: 'VEG-001', qty: 2.4, unit: 'kg', when: 'Mañana',       severity: 'danger',  loc: 'Refri prep' },
  { item: 'Crema La Esperanza',    sku: 'LAC-002', qty: 4.0, unit: 'L',  when: 'En 3 días',     severity: 'warning', loc: 'Refri prep' },
  { item: 'Camarón U-15',          sku: 'PES-002', qty: 4.8, unit: 'kg', when: 'En 3 días',     severity: 'warning', loc: 'Cámara fría 1' },
  { item: 'Pulpo cocido',          sku: 'PES-003', qty: 6.1, unit: 'kg', when: 'En 4 días',     severity: 'warning', loc: 'Cámara fría 1' },
  { item: 'Tortilla nixtamal',     sku: 'SEC-001', qty: 12,  unit: 'kg', when: 'En 3 días',     severity: 'warning', loc: 'Despensa' },
  { item: 'Aguacate Hass',         sku: 'VEG-002', qty: 14.8,unit: 'kg', when: 'En 5 días',     severity: 'muted',   loc: 'Despensa' },
];

const WASTE_LOG = [
  { date: '21 May',  item: 'Huitlacoche',         qty: 0.4, unit: 'kg', cost:  112, reason: 'Caducidad',         by: 'Sous chef' },
  { date: '20 May',  item: 'Aguacate Hass',       qty: 1.2, unit: 'kg', cost:  118, reason: 'Maduración',         by: 'Garde manger' },
  { date: '20 May',  item: 'Robalo (porciones)',  qty: 0.6, unit: 'kg', cost:  192, reason: 'Devolución mesa 8',  by: 'Mesero' },
  { date: '19 May',  item: 'Tortilla nixtamal',   qty: 1.8, unit: 'kg', cost:   58, reason: 'Sobrante servicio',  by: 'Cocinero línea' },
  { date: '18 May',  item: 'Crema',               qty: 0.5, unit: 'L',  cost:   32, reason: 'Caducidad',           by: 'Pastelería' },
];

const SUPPLIERS = [
  { name: 'Carnes Premium Baja',    cat: 'Carnes',     terms: 'Crédito 30 días',  next: '24 May', amount: 38420, status: 'pending', last: '08 May', ytd: 287400 },
  { name: 'Pescados del Pacífico', cat: 'Pescados',   terms: 'Contado',           next: '23 May', amount: 22180, status: 'urgent',  last: '16 May', ytd: 198200 },
  { name: 'La Hoja Verde',         cat: 'Verduras',   terms: 'Crédito 15 días',  next: '22 May', amount:  9840, status: 'urgent',  last: '07 May', ytd:  84500 },
  { name: 'Vinos del Valle',       cat: 'Vinos',      terms: 'Crédito 45 días',  next: '28 May', amount: 64200, status: 'pending', last: '13 Apr', ytd: 412000 },
  { name: 'Lácteos La Esperanza',  cat: 'Lácteos',    terms: 'Crédito 15 días',  next: '20 May', amount:  6280, status: 'overdue', last: '05 May', ytd:  48900 },
  { name: 'Tortillería Don Memo',  cat: 'Secos',      terms: 'Contado',           next: '21 May', amount:  3420, status: 'paid',    last: '21 May', ytd:  61200 },
  { name: 'Café Cimarrón Tijuana',  cat: 'Bebidas',    terms: 'Crédito 30 días',  next: '02 Jun', amount: 11800, status: 'pending', last: '02 May', ytd:  72400 },
  { name: 'Limpieza Industrial MX',cat: 'Insumos',    terms: 'Crédito 30 días',  next: '30 May', amount:  4200, status: 'pending', last: '30 Apr', ytd:  28400 },
];

const BANK_LINES = [
  { date: '21 May', desc: 'Depósito tarjetas Banamex',  src: 'BANAMEX ····2308',  amt:  62410, dir: 'in',  status: 'matched',  match: '5 vouchers Clip' },
  { date: '21 May', desc: 'Transferencia recibida',     src: 'Banco Azteca SPEI', amt:   3420, dir: 'in',  status: 'matched',  match: 'Reserva privada — Familia Ruiz' },
  { date: '21 May', desc: 'Pago Tortillería Don Memo',  src: 'BBVA Empresarial',  amt:   3420, dir: 'out', status: 'matched',  match: 'OC-21052-A' },
  { date: '20 May', desc: 'Cargo CFE bimestral',        src: 'Domiciliación',     amt:  18400, dir: 'out', status: 'matched',  match: 'Servicios fijos' },
  { date: '20 May', desc: 'Depósito Rappi semana',      src: 'STP MIT',           amt:  41280, dir: 'in',  status: 'flagged',  match: 'Falta detalle por canal' },
  { date: '20 May', desc: 'Pago nómina quincena',       src: 'BBVA Empresarial',  amt:  98400, dir: 'out', status: 'matched',  match: 'Lote 09-MAY-2026' },
  { date: '19 May', desc: 'Pago La Hoja Verde',         src: 'BBVA Empresarial',  amt:   9840, dir: 'out', status: 'pending',  match: '—' },
  { date: '19 May', desc: 'Depósito Uber Eats',         src: 'STP',               amt:  28110, dir: 'in',  status: 'matched',  match: 'Conciliación auto' },
  { date: '18 May', desc: 'Comisión Clip mensual',      src: 'Cargo automático',  amt:   4280, dir: 'out', status: 'flagged',  match: 'Sobre tarifa contrato' },
];

const STAFF = [
  { initials: 'RC', name: 'Rodrigo Cárdenas',  role: 'Chef ejecutivo',    shift: '10:00 — 23:00', hrsWk: 52, status: 'in',   pay: 'Quincenal', salary: 38500, color: '#A02C24' },
  { initials: 'LV', name: 'Luisa Vázquez',     role: 'Sous chef',         shift: '11:00 — 22:00', hrsWk: 48, status: 'in',   pay: 'Quincenal', salary: 24800, color: '#B07F86' },
  { initials: 'JR', name: 'Jorge Ramírez',     role: 'Garde manger',      shift: '13:00 — 23:00', hrsWk: 44, status: 'in',   pay: 'Quincenal', salary: 14200, color: '#6E8AAA' },
  { initials: 'AS', name: 'Adriana Solís',     role: 'Pastelería',        shift: '08:00 — 16:00', hrsWk: 40, status: 'out',  pay: 'Quincenal', salary: 16400, color: '#A88B5C' },
  { initials: 'MC', name: 'Mariana Castro',    role: 'Gerente de piso',   shift: '12:00 — 23:30', hrsWk: 52, status: 'in',   pay: 'Mensual',   salary: 32000, color: '#9C7AB0' },
  { initials: 'DF', name: 'Diego Figueroa',    role: 'Bartender',         shift: '17:00 — 01:00', hrsWk: 40, status: 'in',   pay: 'Quincenal', salary: 18600, color: '#E8902A' },
  { initials: 'PN', name: 'Paola Nieves',      role: 'Mesera',            shift: '12:00 — 22:00', hrsWk: 44, status: 'in',   pay: 'Quincenal + propina', salary: 9800, color: '#7E9C6E' },
  { initials: 'RG', name: 'Ricardo Gómez',     role: 'Mesero',            shift: '17:00 — 23:30', hrsWk: 36, status: 'late', pay: 'Quincenal + propina', salary: 9800, color: '#B07F86' },
  { initials: 'KT', name: 'Karla Torres',      role: 'Hostess',           shift: '13:00 — 22:00', hrsWk: 40, status: 'in',   pay: 'Quincenal', salary: 11200, color: '#6E8AAA' },
];

const ACTIVITY = [
  { when: '14:38', t: 'Mariana Castro cerró arqueo de turno matutino',  s: '$ 32,180 en efectivo · 41 vouchers',  who: 'piso' },
  { when: '14:12', t: 'Alerta: Robalo entero caduca hoy',                s: '3.2 kg en Cámara fría 2 · $ 1,024 costo',  who: 'inventario' },
  { when: '13:55', t: 'Rodrigo Cárdenas ajustó receta "Tacos de pesca"', s: 'Food cost: 28.1% → 26.4% · Nueva porción 110 g',  who: 'cocina' },
  { when: '12:40', t: 'Pago Tortillería Don Memo procesado',             s: '$ 3,420 desde BBVA Empresarial · OC-21052-A',  who: 'finanzas' },
  { when: '11:30', t: 'Recepción de mercancía — Pescados del Pacífico',  s: '22.4 kg · 3 SKUs · 2 desviaciones registradas',  who: 'inventario' },
  { when: '10:15', t: 'Merma registrada: 0.4 kg huitlacoche',            s: 'Costo $ 112 · Razón: caducidad',  who: 'inventario' },
  { when: '09:00', t: 'Conciliación automática — 12 movimientos',         s: '2 marcados para revisión manual',  who: 'finanzas' },
];

const PARTNERS = [
  { name: 'Rodrigo Cárdenas', initials: 'RC', share: 45, role: 'Chef · Operador en sitio', dist: 159300 },
  { name: 'Andrea Solano',    initials: 'AS', share: 35, role: 'Socia inversora',          dist: 123900 },
  { name: 'Tomás Beltrán',    initials: 'TB', share: 20, role: 'Socio inversor',           dist:  70800 },
];

const MONTHLY_TREND = [
  { m: 'Dic', sales: 1620000, costs: 1280000 },
  { m: 'Ene', sales: 1420000, costs: 1180000 },
  { m: 'Feb', sales: 1480000, costs: 1190000 },
  { m: 'Mar', sales: 1680000, costs: 1340000 },
  { m: 'Abr', sales: 1780000, costs: 1410000 },
  { m: 'May', sales: 1842900, costs: 1488900 },
];

const PL_ROWS = [
  { label: 'Ventas brutas',               value:  1842900,  pct: 100, kind: 'sum' },
  { label: 'Devoluciones y descuentos',   value:   -42300,  pct:   2.3 },
  { label: 'Ventas netas',                value:  1800600,  pct:  97.7, kind: 'sub' },
  { label: 'Costo de alimentos',          value:  -556400,  pct:  30.9 },
  { label: 'Costo de mano de obra',       value:  -452100,  pct:  25.1 },
  { label: 'Margen bruto',                value:   792100,  pct:  44.1, kind: 'sub' },
  { label: 'Renta y servicios',           value:  -180000,  pct:  10.0 },
  { label: 'Marketing y comisiones',      value:   -94300,  pct:   5.2 },
  { label: 'Gastos administrativos',      value:  -163800,  pct:   9.1 },
  { label: 'EBITDA',                      value:   354000,  pct:  19.7, kind: 'highlight' },
];

/* ============================================================
   CATÁLOGO DE MERCANCÍAS — base maestra de SKUs
   (la fuente única para inventario, recibir compra y recetas)
   ============================================================ */
const CATALOG = [
  { sku: 'CAR-001', name: 'Lomo de res Angus',        cat: 'Carnes',   unit: 'kg',     pack: 'Bolsa al vacío 1.5 kg', supplier: 'Carnes Premium Baja',   altSupplier: 'La Hoja Verde',       cost: 480, lastCost: 472, taxRate: 0.16, shelfLife: 6,   storage: 'Cámara fría 1',  status: 'active',  created: '12 mar 24', updated: '14 may 26', usedIn: ['Tartar de res', 'Costilla braseada'],   barcode: '7501045 28110 4' },
  { sku: 'CAR-002', name: 'Costilla short rib',       cat: 'Carnes',   unit: 'kg',     pack: 'Pieza 2-3 kg',          supplier: 'Carnes Premium Baja',   altSupplier: '—',                   cost: 380, lastCost: 380, taxRate: 0.16, shelfLife: 9,   storage: 'Cámara fría 1',  status: 'active',  created: '12 mar 24', updated: '02 abr 26', usedIn: ['Costilla braseada 8h'],                 barcode: '7501045 28215 6' },
  { sku: 'CAR-003', name: 'Tuétano de res',           cat: 'Carnes',   unit: 'kg',     pack: 'Caja 4 piezas',         supplier: 'Carnes Premium Baja',   altSupplier: '—',                   cost: 220, lastCost: 210, taxRate: 0.16, shelfLife: 4,   storage: 'Cámara fría 1',  status: 'active',  created: '18 ago 24', updated: '14 may 26', usedIn: ['Tartar de res y tuétano'],              barcode: '7501045 28301 6' },
  { sku: 'PES-001', name: 'Robalo entero',            cat: 'Pescados', unit: 'kg',     pack: 'Pieza 2-4 kg',          supplier: 'Pescados del Pacífico', altSupplier: '—',                  cost: 320, lastCost: 305, taxRate: 0.16, shelfLife: 3,   storage: 'Cámara fría 2',  status: 'active',  created: '06 jun 24', updated: '21 may 26', usedIn: ['Robalo a la sal'],                       barcode: '7501028 11445 0' },
  { sku: 'PES-002', name: 'Camarón U-15',             cat: 'Pescados', unit: 'kg',     pack: 'Caja 1 kg congelado',   supplier: 'Pescados del Pacífico', altSupplier: '—',                  cost: 540, lastCost: 520, taxRate: 0.16, shelfLife: 4,   storage: 'Congelador',     status: 'active',  created: '06 jun 24', updated: '21 may 26', usedIn: ['Aguachile', 'Pasta del mar'],            barcode: '7501028 11512 9' },
  { sku: 'PES-003', name: 'Pulpo cocido',             cat: 'Pescados', unit: 'kg',     pack: 'Bolsa 500 g',           supplier: 'Pescados del Pacífico', altSupplier: '—',                  cost: 410, lastCost: 398, taxRate: 0.16, shelfLife: 6,   storage: 'Cámara fría 1',  status: 'active',  created: '06 jun 24', updated: '21 may 26', usedIn: ['Pulpo a las brasas'],                   barcode: '7501028 11602 7' },
  { sku: 'PES-004', name: 'Atún aleta amarilla',      cat: 'Pescados', unit: 'kg',     pack: 'Lomo 800 g',            supplier: 'Pescados del Pacífico', altSupplier: '—',                  cost: 620, lastCost: 620, taxRate: 0.16, shelfLife: 3,   storage: 'Cámara fría 2',  status: 'blocked', blockReason: 'Veda temporal · SAGARPA · revisar en jun-26', created: '11 jul 24', updated: '02 may 26', usedIn: ['Tartar de atún (suspendido)'], barcode: '7501028 11704 8' },
  { sku: 'VEG-001', name: 'Huitlacoche fresco',       cat: 'Verduras', unit: 'kg',     pack: 'Bolsa 500 g',           supplier: 'La Hoja Verde',         altSupplier: 'Mercado Hidalgo', cost: 280, lastCost: 240, taxRate: 0.0,  shelfLife: 2,   storage: 'Refri prep',     status: 'active',  created: '08 jul 24', updated: '21 may 26', usedIn: ['Risotto de huitlacoche'],                barcode: '—' },
  { sku: 'VEG-002', name: 'Aguacate Hass',            cat: 'Verduras', unit: 'kg',     pack: 'Reja 10 kg',            supplier: 'La Hoja Verde',         altSupplier: 'Frutas Selectas SA',  cost:  98, lastCost: 102, taxRate: 0.0,  shelfLife: 5,   storage: 'Despensa fría',  status: 'active',  created: '08 jul 24', updated: '14 may 26', usedIn: ['Guacamole', 'Tacos de pesca'],          barcode: '—' },
  { sku: 'VEG-003', name: 'Tomate saladette',         cat: 'Verduras', unit: 'kg',     pack: 'Reja 20 kg',            supplier: 'La Hoja Verde',         altSupplier: '—',                   cost:  38, lastCost:  42, taxRate: 0.0,  shelfLife: 7,   storage: 'Despensa fría',  status: 'active',  created: '08 jul 24', updated: '07 may 26', usedIn: ['Salsa molcajete', 'Sopa de tortilla'],  barcode: '—' },
  { sku: 'VEG-004', name: 'Epazote',                  cat: 'Verduras', unit: 'manojo', pack: 'Manojo 80 g',           supplier: 'La Hoja Verde',         altSupplier: '—',                   cost:  18, lastCost:  18, taxRate: 0.0,  shelfLife: 4,   storage: 'Refri prep',     status: 'active',  created: '08 jul 24', updated: '07 may 26', usedIn: ['Sopa de tortilla y epazote'],           barcode: '—' },
  { sku: 'VEG-005', name: 'Chile guajillo seco',      cat: 'Secos',    unit: 'kg',     pack: 'Saco 5 kg',             supplier: 'La Hoja Verde',         altSupplier: '—',                   cost: 145, lastCost: 145, taxRate: 0.0,  shelfLife: 365, storage: 'Despensa seca',  status: 'active',  created: '11 sep 24', updated: '02 ene 26', usedIn: ['Mole', 'Salsa borracha'],               barcode: '—' },
  { sku: 'LAC-001', name: 'Queso Oaxaca artesanal',   cat: 'Lácteos',  unit: 'kg',     pack: 'Bola 500 g',            supplier: 'Lácteos La Esperanza',  altSupplier: '—',                   cost: 220, lastCost: 220, taxRate: 0.16, shelfLife: 8,   storage: 'Refri prep',     status: 'active',  created: '14 sep 24', updated: '14 may 26', usedIn: ['Quesadilla', 'Risotto'],                barcode: '7503009 41122 0' },
  { sku: 'LAC-002', name: 'Crema La Esperanza',       cat: 'Lácteos',  unit: 'L',      pack: 'Garrafa 4 L',           supplier: 'Lácteos La Esperanza',  altSupplier: '—',                   cost:  64, lastCost:  60, taxRate: 0.16, shelfLife: 7,   storage: 'Refri prep',     status: 'active',  created: '14 sep 24', updated: '14 may 26', usedIn: ['Sopa de tortilla', 'Postres'],          barcode: '7503009 41201 2' },
  { sku: 'VIN-001', name: 'Vino tinto Monte Xanic',   cat: 'Vinos',    unit: 'bot',    pack: 'Caja 6 bot · 750 mL',   supplier: 'Vinos del Valle',       altSupplier: '—',                   cost: 380, lastCost: 380, taxRate: 0.16, shelfLife: 720, storage: 'Cava',           status: 'active',  created: '03 oct 24', updated: '13 abr 26', usedIn: ['Carta de vinos'],                       barcode: '7501027 88102 4' },
  { sku: 'VIN-002', name: 'Vino blanco L.A. Cetto',   cat: 'Vinos',    unit: 'bot',    pack: 'Caja 6 bot · 750 mL',   supplier: 'Vinos del Valle',       altSupplier: '—',                   cost: 290, lastCost: 290, taxRate: 0.16, shelfLife: 540, storage: 'Cava',           status: 'active',  created: '03 oct 24', updated: '13 abr 26', usedIn: ['Carta de vinos'],                       barcode: '7501027 88210 6' },
  { sku: 'VIN-003', name: 'Mezcal Origen Raíz',       cat: 'Vinos',    unit: 'bot',    pack: 'Caja 6 bot · 700 mL',   supplier: 'Vinos del Valle',       altSupplier: '—',                   cost: 520, lastCost: 480, taxRate: 0.16, shelfLife: 1800,storage: 'Barra',          status: 'discontinued', blockReason: 'Reemplazado por Mezcal Cuish · jun-26', created: '18 feb 25', updated: '01 may 26', usedIn: ['—'],                                    barcode: '7506022 11005 9' },
  { sku: 'SEC-001', name: 'Tortilla maíz nixtamal',   cat: 'Secos',    unit: 'kg',     pack: 'Bolsa 1 kg',            supplier: 'Tortillería Don Memo',  altSupplier: '—',                   cost:  32, lastCost:  32, taxRate: 0.0,  shelfLife: 3,   storage: 'Despensa',       status: 'active',  created: '01 abr 24', updated: '21 may 26', usedIn: ['Tacos de pesca', 'Chilaquiles'],        barcode: '—' },
  { sku: 'SEC-002', name: 'Arroz arborio',            cat: 'Secos',    unit: 'kg',     pack: 'Bolsa 5 kg',            supplier: 'Tortillería Don Memo',  altSupplier: 'Café Cimarrón Tijuana',cost:  68, lastCost:  68, taxRate: 0.0,  shelfLife: 240, storage: 'Despensa seca',  status: 'active',  created: '01 abr 24', updated: '13 abr 26', usedIn: ['Risotto de huitlacoche'],                barcode: '8001234 56123 0' },
  { sku: 'BEB-001', name: 'Café Cimarrón tueste medio', cat: 'Bebidas',  unit: 'kg',     pack: 'Bolsa 1 kg molido',     supplier: 'Café Cimarrón Tijuana',  altSupplier: '—',                   cost: 380, lastCost: 360, taxRate: 0.16, shelfLife: 90,  storage: 'Despensa seca',  status: 'active',  created: '22 nov 24', updated: '02 may 26', usedIn: ['Carta de café'],                        barcode: '7503015 22018 4' },
  { sku: 'INS-001', name: 'Desengrasante industrial', cat: 'Insumos',  unit: 'L',      pack: 'Garrafa 20 L',          supplier: 'Limpieza Industrial MX',altSupplier: '—',                   cost: 180, lastCost: 175, taxRate: 0.16, shelfLife: 365, storage: 'Bodega químicos',status: 'active',  created: '05 dic 24', updated: '30 abr 26', usedIn: ['Limpieza cocina'],                       barcode: '7501089 33401 9' },
];

/* ============================================================
   DIRECTORIO DE PROVEEDORES — datos maestros + lifecycle
   ============================================================ */
const SUPPLIER_DIR = [
  { name: 'Carnes Premium Baja',     cat: 'Carnes',     rfc: 'CPG940512AB7', contact: 'Javier Estrada',  phone: '+52 686 568 2210', email: 'pedidos@carnespremiumbaja.mx',  address: 'Carr. a San Felipe km 4, Mexicali, BC', terms: 'Crédito 30 días',  dpoTarget: 30, since: 'Mar 2023', status: 'active',  bank: 'BBVA',      clabe: '012180····8421', skus: 3,  rating: 4.8, blockReason: null },
  { name: 'Pescados del Pacífico', cat: 'Pescados',   rfc: 'PPA180322ZK4', contact: 'Lourdes Mejía',    phone: '+52 646 145 8800', email: 'ventas@pescadospacifico.mx',   address: 'Mercado Negro, Ensenada, BC',              terms: 'Contado',           dpoTarget: 0,  since: 'Ago 2023', status: 'active',  bank: 'Banorte',   clabe: '072180····5512', skus: 4,  rating: 4.5, blockReason: null },
  { name: 'La Hoja Verde',         cat: 'Verduras',   rfc: 'LHV160901QM2', contact: 'Andrés Ocampo',   phone: '+52 646 689 4012', email: 'andres@lahojaverde.mx',         address: 'Valle de Maneadero, Ensenada, BC',               terms: 'Crédito 15 días',  dpoTarget: 15, since: 'Ene 2024', status: 'active',  bank: 'Banamex',   clabe: '002180····2104', skus: 5,  rating: 4.7, blockReason: null },
  { name: 'Vinos del Valle',       cat: 'Vinos',      rfc: 'VDV121108RT8', contact: 'Sofía Romero',     phone: '+52 646 178 3322', email: 'sofia@vinosdelvalle.com.mx',    address: 'Carr. Tecate-Ensenada km 88, BC',      terms: 'Crédito 45 días',  dpoTarget: 45, since: 'Sep 2023', status: 'active',  bank: 'Santander', clabe: '014180····7732', skus: 3,  rating: 4.9, blockReason: null },
  { name: 'Lácteos La Esperanza',  cat: 'Lácteos',    rfc: 'LLE150607QE1', contact: 'Pedro Aranda',     phone: '+52 646 220 1145', email: 'pedidos@lacteosesperanza.mx',  address: 'Ojos Negros, Ensenada, BC',       terms: 'Crédito 15 días',  dpoTarget: 15, since: 'Oct 2023', status: 'active',  bank: 'BBVA',      clabe: '012180····3380', skus: 2,  rating: 4.2, blockReason: null },
  { name: 'Tortillería Don Memo',  cat: 'Secos',      rfc: 'TDM880412KL5', contact: 'Guillermo López', phone: '+52 664 512 7788', email: 'donmemo@gmail.com',             address: 'Av. Negrete 1410, Centro, Tijuana, BC',     terms: 'Contado',           dpoTarget: 0,  since: 'Mar 2023', status: 'active',  bank: 'BBVA',      clabe: '012180····0021', skus: 2,  rating: 5.0, blockReason: null },
  { name: 'Café Cimarrón Tijuana',  cat: 'Bebidas',    rfc: 'CAV200314UF9', contact: 'Patricia Núñez',   phone: '+52 664 819 6633', email: 'patricia@cafecimarron.mx',        address: 'Tostaduría · Col. Cacho, Tijuana, BC',          terms: 'Crédito 30 días',  dpoTarget: 30, since: 'Nov 2024', status: 'active',  bank: 'Santander', clabe: '014180····9908', skus: 1,  rating: 4.6, blockReason: null },
  { name: 'Limpieza Industrial MX',cat: 'Insumos',    rfc: 'LIM160403PR3', contact: 'Octavio Rivas',    phone: '+52 664 512 9912', email: 'ventas@limpiezamx.com',         address: 'Cd. Industrial Otay, Tijuana, BC',                   terms: 'Crédito 30 días',  dpoTarget: 30, since: 'Dic 2024', status: 'active',  bank: 'Banamex',   clabe: '002180····5511', skus: 1,  rating: 4.4, blockReason: null },
  { name: 'Mariscos Popotla',    cat: 'Pescados',   rfc: 'MDG170815BV8', contact: 'Rosa Camacho',     phone: '+52 661 932 4411', email: 'rosa@mariscospopotla.mx',         address: 'Puerto de Popotla, Rosarito, BC',                       terms: 'Contado',           dpoTarget: 0,  since: 'May 2024', status: 'blocked', bank: 'Banorte', clabe: '072180····3398', skus: 0, rating: 2.4, blockReason: 'Calidad reiterada · 3 devoluciones en 60 días' },
  { name: 'Quesos Real del Castillo',      cat: 'Lácteos',    rfc: 'QDB210602YK6', contact: 'Mauro Salinas',    phone: '+52 646 220 5500', email: 'm.salinas@quesosrealdelcastillo.mx',      address: 'Real del Castillo, Ensenada, BC',                terms: 'Crédito 30 días',  dpoTarget: 30, since: 'Jul 2024', status: 'blocked', bank: 'BBVA',    clabe: '012180····7740', skus: 0, rating: 3.1, blockReason: 'Sin facturación CFDI 4.0 · pendiente actualizar régimen' },
  { name: 'Embutidos La Suprema',  cat: 'Carnes',     rfc: 'ELS990912FT2', contact: 'Iván Cervantes',   phone: '+52 665 622 8800', email: 'ventas@suprema.mx',             address: 'Parque Industrial, Tecate, BC',                        terms: 'Crédito 30 días',  dpoTarget: 30, since: 'Feb 2024', status: 'inactive', bank: 'Banamex', clabe: '002180····8821', skus: 0, rating: 3.8, blockReason: 'Baja voluntaria · 14 dic 25 · sin movimientos > 90 días' },
];

/* ============================================================
   ANTIGÜEDAD DE SALDOS — aging por proveedor (cuentas por pagar)
   buckets: 0-30, 31-60, 61-90, 90+
   ============================================================ */
const AGING = [
  { supplier: 'Carnes Premium Baja',    b030: 38420, b3160:     0, b6190:    0, b90:     0, lastPay: '08 may 26', oldest: '24 abr 26' },
  { supplier: 'Pescados del Pacífico', b030: 22180, b3160:     0, b6190:    0, b90:     0, lastPay: '16 may 26', oldest: '12 may 26' },
  { supplier: 'La Hoja Verde',         b030:  9840, b3160:     0, b6190:    0, b90:     0, lastPay: '07 may 26', oldest: '07 may 26' },
  { supplier: 'Vinos del Valle',       b030: 28200, b3160: 36000, b6190:    0, b90:     0, lastPay: '13 abr 26', oldest: '04 abr 26' },
  { supplier: 'Lácteos La Esperanza',  b030:     0, b3160:  6280, b6190:    0, b90:     0, lastPay: '05 may 26', oldest: '04 abr 26' },
  { supplier: 'Café Cimarrón Tijuana',  b030: 11800, b3160:     0, b6190:    0, b90:     0, lastPay: '02 may 26', oldest: '02 may 26' },
  { supplier: 'Limpieza Industrial MX',b030:  4200, b3160:     0, b6190: 2100, b90:     0, lastPay: '15 feb 26', oldest: '28 feb 26' },
  { supplier: 'Tortillería Don Memo',  b030:     0, b3160:     0, b6190:    0, b90:     0, lastPay: '21 may 26', oldest: '—' },
];

/* ============================================================
   ESTADOS ADICIONALES DE COLABORADORES — bloqueos / suspensiones
   ============================================================ */
const STAFF_BLOCKED = [
  { initials: 'EM', name: 'Eduardo Mendoza',  role: 'Mesero',          since: '12 may 26', reason: 'Falta injustificada 3 días · acta administrativa',  resumes: '— por definir',     color: '#7E5C8E', kind: 'suspension' },
  { initials: 'GC', name: 'Gabriela Cerón',   role: 'Lavaloza',         since: '18 may 26', reason: 'Incapacidad médica · IMSS · fractura tobillo',      resumes: '02 jun 26',         color: '#A88B5C', kind: 'medical' },
];

/* ============================================================
   FLUJO DE APROBACIONES — bandeja con hilos de comentarios
   Tipos: purchase (compra), payment (pago a proveedor), payroll (nómina),
          supplier_new (alta proveedor), inventory_adj (ajuste inventario),
          price_change (cambio de precio), staff_action (alta/baja/bloqueo)
   Estados: pending | approved | rejected | changes_requested
   ============================================================ */
const APPROVALS = [
  {
    id: 'APR-2026-0142',
    type: 'payment', icon: 'bank',
    title: 'Pago a Vinos del Valle',
    summary: 'Lote de 2 facturas vencidas a 31-60 días',
    amount: 36000, currency: 'MXN',
    requester: { name: 'Rodrigo Cárdenas', initials: 'RC', role: 'Chef · Operador' },
    approver:  { name: 'Andrea Solano',    initials: 'AS', role: 'Socia inversora' },
    requested: '22 may 26 · 10:14',
    sla: 'Vence en 6 h',
    slaUrgent: true,
    status: 'pending',
    priority: 'high',
    fields: [
      { l: 'Proveedor',    v: 'Vinos del Valle' },
      { l: 'Facturas',     v: 'F-22014 · F-22118' },
      { l: 'Bucket',       v: '31-60 días vencido' },
      { l: 'Método',       v: 'SPEI · BBVA Empresarial' },
      { l: 'Fecha pago',   v: '23 may 26' },
      { l: 'Referencia',   v: 'VDV-2605-LOTE' },
    ],
    thread: [
      { who: 'requester', name: 'Rodrigo Cárdenas', when: '22 may 26 · 10:14',
        text: 'Solicito autorización del pago al lote vencido de Vinos del Valle. Sofía amenazó con suspender despachos si no liquidamos esta semana.' },
      { who: 'approver',  name: 'Andrea Solano',     when: '22 may 26 · 11:02',
        text: '¿Por qué no se incluyó la nota de crédito por la caja rota del envío del 12 de mayo? Eran $1,800.' },
      { who: 'requester', name: 'Rodrigo Cárdenas', when: '22 may 26 · 11:24',
        text: 'Tienes razón, no la apliqué. ¿Quieres que actualice el lote o procedo y compenso en el próximo pago?' },
    ],
  },
  {
    id: 'APR-2026-0141',
    type: 'purchase', icon: 'box',
    title: 'Compra urgente · Pescados del Pacífico',
    summary: 'Camarón U-15 (12 kg) + Robalo entero (8 kg) fuera del programa semanal',
    amount: 9040, currency: 'MXN',
    requester: { name: 'Carlos Bernal', initials: 'CB', role: 'Sous chef' },
    approver:  { name: 'Rodrigo Cárdenas', initials: 'RC', role: 'Chef · Operador' },
    requested: '22 may 26 · 09:48',
    sla: 'Vence en 2 h',
    slaUrgent: true,
    status: 'pending',
    priority: 'urgent',
    fields: [
      { l: 'Proveedor',    v: 'Pescados del Pacífico' },
      { l: 'SKUs',         v: 'PES-002 · PES-001' },
      { l: 'Motivo',       v: 'Reservación de 40 pax · aniversario corporativo' },
      { l: 'Fecha entrega',v: '23 may 26 · antes 11:00' },
      { l: 'Costo unit.',  v: '$540/kg · $320/kg' },
      { l: 'Excede par',   v: '+38% sobre semanal' },
    ],
    thread: [
      { who: 'requester', name: 'Carlos Bernal', when: '22 may 26 · 09:48',
        text: 'Confirmaron 40 pax para sábado, necesitamos reforzar stock de mariscos. Cotizado vs Mariscos Popotla pero está bloqueado.' },
    ],
  },
  {
    id: 'APR-2026-0140',
    type: 'supplier_new', icon: 'partners',
    title: 'Alta · Rancho Orgánico Maneadero',
    summary: 'Nuevo proveedor de huevo de libre pastoreo',
    amount: null,
    requester: { name: 'Adriana Solís', initials: 'AS', role: 'Pastelería' },
    approver:  { name: 'Rodrigo Cárdenas', initials: 'RC', role: 'Chef · Operador' },
    requested: '21 may 26 · 16:30',
    sla: '3 días restantes',
    status: 'pending',
    priority: 'medium',
    fields: [
      { l: 'Razón social', v: 'Rancho Orgánico Maneadero SPR' },
      { l: 'RFC',          v: 'ROM220314MX2' },
      { l: 'Categoría',    v: 'Insumos · Proteína' },
      { l: 'Condiciones',  v: 'Crédito 15 días' },
      { l: '69-B SAT',     v: 'No listado · vigente' },
      { l: 'Constancia',   v: 'Adjunta · jul 2025' },
    ],
    thread: [
      { who: 'requester', name: 'Adriana Solís', when: '21 may 26 · 16:30',
        text: 'El proveedor actual subió 18% el huevo. Maneadero maneja libre pastoreo certificado a precio competitivo y ya tienen relación con La Hoja Verde.' },
    ],
  },
  {
    id: 'APR-2026-0139',
    type: 'price_change', icon: 'tag',
    title: 'Ajuste de costo · Lomo Angus',
    summary: 'Alza de costo +1.7% por proveedor preferido',
    amount: null,
    requester: { name: 'Rodrigo Cárdenas', initials: 'RC', role: 'Chef · Operador' },
    approver:  { name: 'Andrea Solano', initials: 'AS', role: 'Socia inversora' },
    requested: '21 may 26 · 14:08',
    sla: '5 días restantes',
    status: 'changes_requested',
    priority: 'low',
    fields: [
      { l: 'SKU',          v: 'CAR-001 · Lomo Angus' },
      { l: 'Costo actual', v: '$ 472/kg' },
      { l: 'Costo nuevo',  v: '$ 480/kg' },
      { l: 'Impacto food cost', v: '+0.4 pp en Tartar' },
      { l: 'Proveedor',    v: 'Carnes Premium Baja' },
      { l: 'Vigencia',     v: 'Desde 1 jun 26' },
    ],
    thread: [
      { who: 'requester', name: 'Rodrigo Cárdenas', when: '21 may 26 · 14:08',
        text: 'Javier nos avisa alza por costo del flete refrigerado. Sugiero actualizar costo estándar y revisar precio del Tartar.' },
      { who: 'approver',  name: 'Andrea Solano', when: '21 may 26 · 18:22',
        text: 'Antes de aprobar, ¿podrías cotizar con La Hoja Verde como alterno? Si la diferencia es mayor a 5% sí pasamos el alza al menú.', kind: 'changes' },
    ],
  },
  {
    id: 'APR-2026-0138',
    type: 'inventory_adj', icon: 'inventory',
    title: 'Merma · Robalo entero',
    summary: 'Ajuste por caducidad · 3.2 kg',
    amount: 1024, currency: 'MXN',
    requester: { name: 'Carlos Bernal', initials: 'CB', role: 'Sous chef' },
    approver:  { name: 'Rodrigo Cárdenas', initials: 'RC', role: 'Chef · Operador' },
    requested: '21 may 26 · 11:15',
    sla: '24 h restantes',
    status: 'rejected',
    priority: 'medium',
    fields: [
      { l: 'SKU',          v: 'PES-001 · Robalo entero' },
      { l: 'Cantidad',     v: '3.2 kg' },
      { l: 'Costo',        v: '$ 1,024' },
      { l: 'Motivo',       v: 'Caducidad alcanzada' },
      { l: 'Destino',      v: 'Merma · disposición sanitaria' },
    ],
    thread: [
      { who: 'requester', name: 'Carlos Bernal', when: '21 may 26 · 11:15',
        text: 'Robalo del lote L-12305 ya cumplió 5 días, propongo registrar merma y notificar a sanidad.' },
      { who: 'approver', name: 'Rodrigo Cárdenas', when: '21 may 26 · 11:42',
        text: 'No procedemos a merma todavía. Hay 4 reservas para esta noche que pueden moverse a especial del día. Cotiza con Mariana un menú con robalo a la sal y avísame el corte exacto antes de 13:00.', kind: 'reject' },
      { who: 'requester', name: 'Carlos Bernal', when: '21 may 26 · 13:12',
        text: 'Hablé con Mariana, va el especial. Cancelo la solicitud de merma; ajustaré sobre lo no vendido al cierre.' },
    ],
    decidedAt: '21 may 26 · 11:42',
  },
  {
    id: 'APR-2026-0137',
    type: 'payroll', icon: 'payroll',
    title: 'Nómina Quincena 10 · Mayo 2026',
    summary: '12 colaboradores · neto + propinas',
    amount: 184260, currency: 'MXN',
    requester: { name: 'Mariana Castro', initials: 'MC', role: 'Gerente de piso' },
    approver:  { name: 'Rodrigo Cárdenas', initials: 'RC', role: 'Chef · Operador' },
    requested: '20 may 26 · 17:00',
    sla: 'Aprobado',
    status: 'approved',
    priority: 'high',
    fields: [
      { l: 'Periodo',       v: '06 — 20 may 26' },
      { l: 'Colaboradores', v: '12 activos · 1 suspendido' },
      { l: 'Sueldo neto',   v: fmtMXNNum(165840) },
      { l: 'Propinas',      v: fmtMXNNum(18420) },
      { l: 'CFDI 4.0',      v: 'Generado · sellado' },
    ],
    thread: [
      { who: 'requester', name: 'Mariana Castro', when: '20 may 26 · 17:00',
        text: 'Quincena lista. Eduardo Mendoza fuera por suspensión (3 días).' },
      { who: 'approver', name: 'Rodrigo Cárdenas', when: '20 may 26 · 18:20',
        text: 'Aprobado. Dispersar mañana 21 may 06:00.', kind: 'approve' },
    ],
    decidedAt: '20 may 26 · 18:20',
  },
  {
    id: 'APR-2026-0136',
    type: 'staff_action', icon: 'team',
    title: 'Suspensión · Eduardo Mendoza',
    summary: 'Falta injustificada 3 días · acta administrativa',
    amount: null,
    requester: { name: 'Mariana Castro', initials: 'MC', role: 'Gerente de piso' },
    approver:  { name: 'Rodrigo Cárdenas', initials: 'RC', role: 'Chef · Operador' },
    requested: '12 may 26 · 09:30',
    sla: 'Aprobado',
    status: 'approved',
    priority: 'high',
    fields: [
      { l: 'Colaborador',  v: 'Eduardo Mendoza · Mesero' },
      { l: 'Tipo',         v: 'Suspensión disciplinaria' },
      { l: 'Causal',       v: 'Art. 47, frac. X · LFT' },
      { l: 'Duración',     v: 'Indefinida · revisión 02 jun' },
      { l: 'Bloqueo POS',  v: 'Inmediato al aprobar' },
    ],
    thread: [
      { who: 'requester', name: 'Mariana Castro', when: '12 may 26 · 09:30',
        text: 'Tercer día consecutivo sin presentarse y sin reportar. Adjunto reportes de turno.' },
      { who: 'approver', name: 'Rodrigo Cárdenas', when: '12 may 26 · 10:05',
        text: 'Procedemos. Levanta acta con dos testigos y bloquea acceso POS de inmediato.', kind: 'approve' },
    ],
    decidedAt: '12 may 26 · 10:05',
  },
];

/* ============================================================
   MENÚ Y RECETAS — platillos vinculados al catálogo de mercancías
   Cada platillo tiene receta (lista de SKUs + cantidad) que costea
   automáticamente y descuenta de inventario al venderse.
   ============================================================ */
const DISH_CATEGORIES = ['Entradas', 'Pescados', 'Carnes', 'Pastas y arroces', 'Postres', 'Bebidas', 'Vinos'];

const MENU_DISHES = [
  {
    id: 'D-001', name: 'Risotto de huitlacoche', cat: 'Pastas y arroces',
    price: 285, sold: 28, photoTone: '#3a2818',
    station: 'Caliente', prepTime: 18, allergens: ['Lácteos', 'Gluten'],
    schedules: ['Comida', 'Cena'],
    status: 'active', featured: true,
    description: 'Arborio cremoso con huitlacoche fresco, queso oaxaca y aceite de epazote.',
    recipe: [
      { sku: 'SEC-002', qty: 0.110, unit: 'kg' },     // arroz arborio
      { sku: 'VEG-001', qty: 0.120, unit: 'kg' },     // huitlacoche
      { sku: 'LAC-001', qty: 0.040, unit: 'kg' },     // queso oaxaca
      { sku: 'LAC-002', qty: 0.060, unit: 'L'  },     // crema
      { sku: 'VEG-004', qty: 1,     unit: 'manojo' },
    ],
    modifiers: ['+ Trufa negra · $85', '+ Pollo de granja · $65', 'Sin lácteos'],
  },
  {
    id: 'D-002', name: 'Tartar de res y tuétano', cat: 'Entradas',
    price: 320, sold: 22, photoTone: '#5a2418',
    station: 'Fría', prepTime: 12, allergens: ['Huevo'],
    schedules: ['Comida', 'Cena'],
    status: 'active', featured: true,
    description: 'Lomo Angus picado a cuchillo, yema curada, tuétano asado y crostini de pan campesino.',
    recipe: [
      { sku: 'CAR-001', qty: 0.140, unit: 'kg' },     // lomo angus
      { sku: 'CAR-003', qty: 0.120, unit: 'kg' },     // tuétano
    ],
    modifiers: ['Doble porción · $150', 'Sin tuétano'],
  },
  {
    id: 'D-003', name: 'Pulpo a las brasas', cat: 'Pescados',
    price: 365, sold: 19, photoTone: '#2a3848',
    station: 'Parrilla', prepTime: 22, allergens: ['Moluscos'],
    schedules: ['Comida', 'Cena'],
    status: 'active', featured: false,
    description: 'Tentáculo cocido y braseado, papas cambray, alioli ahumado y polvo de chile guajillo.',
    recipe: [
      { sku: 'PES-003', qty: 0.220, unit: 'kg' },
      { sku: 'VEG-005', qty: 0.005, unit: 'kg' },
    ],
    modifiers: ['Acompañamiento extra · $45'],
  },
  {
    id: 'D-004', name: 'Tacos de pesca del día', cat: 'Pescados',
    price: 195, sold: 34, photoTone: '#2c4438',
    station: 'Caliente', prepTime: 14, allergens: ['Pescado', 'Gluten'],
    schedules: ['Comida'],
    status: 'active', featured: false,
    description: 'Tres tacos de robalo capeado en tortilla de maíz, mayonesa de chipotle y pico tradicional.',
    recipe: [
      { sku: 'PES-001', qty: 0.140, unit: 'kg' },
      { sku: 'SEC-001', qty: 0.090, unit: 'kg' },
      { sku: 'VEG-002', qty: 0.060, unit: 'kg' },
      { sku: 'VEG-003', qty: 0.080, unit: 'kg' },
    ],
    modifiers: ['+ Aguacate extra · $25', 'Tortilla de harina'],
  },
  {
    id: 'D-005', name: 'Sopa de tortilla y epazote', cat: 'Entradas',
    price: 145, sold: 41, photoTone: '#4a2818',
    station: 'Caliente', prepTime: 10, allergens: ['Lácteos'],
    schedules: ['Comida', 'Cena'],
    status: 'active', featured: false,
    description: 'Caldo de tomate rostizado con tortilla frita, aguacate, queso fresco y aceite de epazote.',
    recipe: [
      { sku: 'VEG-003', qty: 0.180, unit: 'kg' },
      { sku: 'SEC-001', qty: 0.060, unit: 'kg' },
      { sku: 'VEG-002', qty: 0.040, unit: 'kg' },
      { sku: 'VEG-004', qty: 1,     unit: 'manojo' },
      { sku: 'LAC-002', qty: 0.030, unit: 'L' },
    ],
    modifiers: ['Sin lácteos', '+ Pollo deshebrado · $35'],
  },
  {
    id: 'D-006', name: 'Tarta tibia de mole', cat: 'Postres',
    price: 165, sold: 17, photoTone: '#3a1c1a',
    station: 'Postres', prepTime: 8, allergens: ['Gluten', 'Lácteos', 'Frutos secos'],
    schedules: ['Comida', 'Cena'],
    status: 'active', featured: false,
    description: 'Bizcocho tibio de mole negro, helado de queso de cabra y crocante de cacao.',
    recipe: [
      { sku: 'VEG-005', qty: 0.020, unit: 'kg' },
      { sku: 'LAC-001', qty: 0.035, unit: 'kg' },
      { sku: 'LAC-002', qty: 0.040, unit: 'L' },
    ],
    modifiers: ['+ Helado extra · $25'],
  },
  {
    id: 'D-007', name: 'Aguachile de camarón', cat: 'Entradas',
    price: 245, sold: 25, photoTone: '#2e4848',
    station: 'Fría', prepTime: 10, allergens: ['Crustáceos'],
    schedules: ['Comida'],
    status: 'active', featured: false,
    description: 'Camarón U-15 curado en limón, chile serrano, pepino y cebolla morada.',
    recipe: [
      { sku: 'PES-002', qty: 0.180, unit: 'kg' },
      { sku: 'VEG-002', qty: 0.050, unit: 'kg' },
    ],
    modifiers: ['Picante medio', 'Picante alto'],
  },
  {
    id: 'D-008', name: 'Costilla braseada 8h', cat: 'Carnes',
    price: 395, sold: 14, photoTone: '#3a1c12',
    station: 'Caliente', prepTime: 12, allergens: [],
    schedules: ['Cena'],
    status: 'active', featured: true,
    description: 'Short rib braseado en vino tinto, puré rústico de papa y zanahoria glaseada.',
    recipe: [
      { sku: 'CAR-002', qty: 0.260, unit: 'kg' },
      { sku: 'VIN-001', qty: 0.060, unit: 'bot' },
    ],
    modifiers: ['+ Salsa de vino tinto · $35'],
  },
  {
    id: 'D-009', name: 'Robalo a la sal', cat: 'Pescados',
    price: 480, sold: 8, photoTone: '#2c4858',
    station: 'Parrilla', prepTime: 35, allergens: ['Pescado'],
    schedules: ['Cena'],
    status: 'active', featured: false,
    description: 'Pieza entera horneada en costra de sal, papas confitadas y salsa verde mexicana.',
    recipe: [
      { sku: 'PES-001', qty: 0.450, unit: 'kg' },
      { sku: 'VEG-003', qty: 0.080, unit: 'kg' },
    ],
    modifiers: ['Servicio para 2 · +$320'],
  },
  {
    id: 'D-010', name: 'Quesadilla de huitlacoche', cat: 'Entradas',
    price: 135, sold: 23, photoTone: '#3a2c18',
    station: 'Caliente', prepTime: 8, allergens: ['Lácteos', 'Gluten'],
    schedules: ['Comida'],
    status: 'active', featured: false,
    description: 'Tortilla de maíz azul, huitlacoche, queso oaxaca y salsa verde tatemada.',
    recipe: [
      { sku: 'SEC-001', qty: 0.090, unit: 'kg' },
      { sku: 'VEG-001', qty: 0.060, unit: 'kg' },
      { sku: 'LAC-001', qty: 0.050, unit: 'kg' },
    ],
    modifiers: ['+ Aguacate · $25'],
  },
  {
    id: 'D-011', name: 'Tartar de atún (suspendido)', cat: 'Entradas',
    price: 310, sold: 0, photoTone: '#332828',
    station: 'Fría', prepTime: 12, allergens: ['Pescado', 'Soya'],
    schedules: ['Comida', 'Cena'],
    status: 'inactive', featured: false,
    statusReason: 'Ingrediente bloqueado · veda SAGARPA',
    description: 'Atún aleta amarilla en cubos, aguacate y vinagreta de soya.',
    recipe: [
      { sku: 'PES-004', qty: 0.140, unit: 'kg' },
      { sku: 'VEG-002', qty: 0.060, unit: 'kg' },
    ],
    modifiers: [],
  },
  {
    id: 'D-012', name: 'Carta de vinos · copeo', cat: 'Vinos',
    price: 220, sold: 47, photoTone: '#3a1c2a',
    station: 'Bar', prepTime: 3, allergens: ['Sulfitos'],
    schedules: ['Comida', 'Cena'],
    status: 'active', featured: false,
    description: 'Copa de 175 mL · selección rotativa Monte Xanic o L.A. Cetto.',
    recipe: [
      { sku: 'VIN-001', qty: 0.233, unit: 'bot' },
    ],
    modifiers: ['Tinto reserva', 'Blanco fresco'],
  },
];

const MENU_SERVICES = [
  { id: 'breakfast', label: 'Desayuno', hours: '08:00 — 12:00', active: false, dishes: 0  },
  { id: 'lunch',     label: 'Comida',   hours: '13:30 — 17:30', active: true,  dishes: 9  },
  { id: 'happy',     label: 'Happy hour', hours: '17:30 — 19:30', active: true, dishes: 6 },
  { id: 'dinner',    label: 'Cena',     hours: '19:30 — 23:30', active: true,  dishes: 11 },
];

/* ============================================================
   HORARIOS Y TURNOS — asignación semanal
   ============================================================ */
const SCHEDULE_WEEK = {
  weekOf: '18 — 24 may 26',
  days: ['Lun 18', 'Mar 19', 'Mié 20', 'Jue 21', 'Vie 22', 'Sáb 23', 'Dom 24'],
};

// each row: per-day shift, '' = libre, '?' = vacante a cubrir
const SHIFTS = [
  { name: 'Rodrigo Cárdenas', role: 'Chef ejecutivo', area: 'cocina', initials: 'RC', color: '#A02C24',
    shifts: ['10—23','10—23','','10—23','10—00','10—00','12—22'], hours: 64, ot: 4 },
  { name: 'Luisa Vázquez',    role: 'Sous chef',     area: 'cocina', initials: 'LV', color: '#B07F86',
    shifts: ['11—22','','11—22','11—22','11—00','11—00','12—22'], hours: 56, ot: 2 },
  { name: 'Jorge Ramírez',    role: 'Garde manger',   area: 'cocina', initials: 'JR', color: '#6E8AAA',
    shifts: ['13—23','13—23','','13—23','13—00','13—00',''],     hours: 52, ot: 0 },
  { name: 'Adriana Solís',    role: 'Pastelería',    area: 'cocina', initials: 'AS', color: '#A88B5C',
    shifts: ['08—16','08—16','08—16','08—16','08—16','',''],    hours: 40, ot: 0 },
  { name: 'Mariana Castro',   role: 'Gerente piso',  area: 'piso',   initials: 'MC', color: '#9C7AB0',
    shifts: ['12—23','12—23','12—23','12—23','12—00','12—00','12—22'], hours: 68, ot: 8 },
  { name: 'Diego Figueroa',   role: 'Bartender',     area: 'bar',    initials: 'DF', color: '#E8902A',
    shifts: ['17—01','','17—01','17—01','17—02','17—02','15—22'], hours: 48, ot: 2 },
  { name: 'Paola Nieves',     role: 'Mesera',        area: 'piso',   initials: 'PN', color: '#7E9C6E',
    shifts: ['12—22','12—22','12—22','','12—00','12—00','12—22'], hours: 52, ot: 4 },
  { name: 'Ricardo Gómez',    role: 'Mesero',        area: 'piso',   initials: 'RG', color: '#B07F86',
    shifts: ['','17—23','17—23','17—23','17—00','17—00',''],    hours: 36, ot: 0 },
  { name: 'Karla Torres',     role: 'Hostess',       area: 'piso',   initials: 'KT', color: '#6E8AAA',
    shifts: ['13—22','13—22','','13—22','13—00','13—00','13—22'], hours: 56, ot: 4 },
  { name: 'Eduardo Mendoza',  role: 'Mesero',        area: 'piso',   initials: 'EM', color: '#7E5C8E',
    shifts: ['—','—','—','—','—','—','—'],                       hours: 0, ot: 0, blocked: true,
    blockNote: 'Suspendido · acta administrativa desde 12 may' },
  { name: 'Gabriela Cerón',   role: 'Lavaloza',      area: 'cocina', initials: 'GC', color: '#A88B5C',
    shifts: ['—','—','—','—','—','—','—'],                       hours: 0, ot: 0, blocked: true,
    blockNote: 'Incapacidad IMSS hasta 02 jun' },
  { name: '— Vacante —',      role: 'Lavaloza cubierta', area: 'cocina', initials: '?', color: '#5C6F7E',
    shifts: ['?','?','?','?','?','?','?'], hours: 0, ot: 0, vacancy: true },
];

const SHIFT_INCIDENTS = [
  { who: 'Ricardo Gómez', when: '21 may · 17:12', kind: 'late',    detail: 'Retraso 12 min en entrada de turno' },
  { who: 'Paola Nieves',  when: '20 may · 21:40', kind: 'overtime', detail: 'Hora extra autorizada por reservaciones tardías' },
  { who: 'Diego Figueroa',when: '18 may',        kind: 'swap',     detail: 'Intercambio de turno aprobado con Mariana' },
  { who: 'Adriana Solís', when: '19 may',        kind: 'absent',   detail: 'Falta justificada · cita médica con comprobante' },
];

/* ============================================================
   REPORTES GRANULARES — por hora, mesero, producto, food cost trend
   ============================================================ */
// 24×7 heatmap matrix (filas días, columnas horas; valores en MXN)
// horas 10..00 (mostramos 11–24)
const HOURLY_HEATMAP = {
  hours: ['11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
  days:  ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  data: [
    [   0,  420, 1830, 4820, 6240, 3210,  920, 1240, 2810, 5240, 6840, 4920, 1240],  // Lun
    [   0,  680, 2010, 4980, 6720, 3580, 1180, 1480, 3120, 5640, 7240, 5120, 1380],  // Mar
    [   0,  720, 2280, 5240, 7180, 3920, 1280, 1620, 3320, 5980, 7620, 5380, 1420],  // Mié
    [   0,  820, 2480, 5680, 7820, 4180, 1380, 1820, 3680, 6420, 8120, 5780, 1620],  // Jue
    [ 120, 1240, 3280, 6840, 9280, 5240, 1820, 2280, 4820, 8420,11240, 8240, 3240],  // Vie · pico noche
    [ 180, 1680, 4280, 7820,10620, 6480, 2480, 3120, 6240,10820,12640,10240, 4820],  // Sáb · pico
    [ 240, 2480, 6840, 9240, 8120, 4820, 1280, 1480, 2820, 4820, 5240, 2840,  680],  // Dom · brunch
  ],
};

const SERVER_PERFORMANCE = [
  { name: 'Paola Nieves',     initials: 'PN', color: '#7E9C6E', sales: 142800, tickets: 184, avgTicket: 776, tipPct: 14.8, voids: 1, comps: 320 },
  { name: 'Ricardo Gómez',    initials: 'RG', color: '#B07F86', sales: 98400,  tickets: 142, avgTicket: 693, tipPct: 12.4, voids: 3, comps: 480 },
  { name: 'Mariana Castro',   initials: 'MC', color: '#9C7AB0', sales: 87200,  tickets:  98, avgTicket: 890, tipPct: 16.2, voids: 0, comps: 0   },
  { name: 'Eduardo Mendoza',  initials: 'EM', color: '#7E5C8E', sales: 21800,  tickets:  34, avgTicket: 641, tipPct: 11.2, voids: 4, comps: 1240, flag: 'Suspendido' },
  { name: 'Karla Torres',     initials: 'KT', color: '#6E8AAA', sales: 12400,  tickets:  18, avgTicket: 689, tipPct:  0,   voids: 0, comps: 0,   note: 'Hostess · no opera POS' },
];

const PRODUCT_REPORT = [
  // top movers (high volume) + dogs (low margin/low velocity)
  { id: 'D-005', name: 'Sopa de tortilla',         cat: 'Entradas',  sold: 41, sales: 5945, foodCost: 19.4, margin: 80.6, velocity: 'top'  },
  { id: 'D-004', name: 'Tacos de pesca',           cat: 'Pescados',  sold: 34, sales: 6630, foodCost: 28.1, margin: 71.9, velocity: 'top'  },
  { id: 'D-001', name: 'Risotto huitlacoche',      cat: 'Pastas',    sold: 28, sales: 7980, foodCost: 26.4, margin: 73.6, velocity: 'top'  },
  { id: 'D-007', name: 'Aguachile camarón',         cat: 'Entradas',  sold: 25, sales: 6125, foodCost: 36.5, margin: 63.5, velocity: 'top'  },
  { id: 'D-010', name: 'Quesadilla huitlacoche',   cat: 'Entradas',  sold: 23, sales: 3105, foodCost: 31.8, margin: 68.2, velocity: 'mid'  },
  { id: 'D-002', name: 'Tartar de res y tuétano',  cat: 'Entradas',  sold: 22, sales: 7040, foodCost: 34.2, margin: 65.8, velocity: 'mid'  },
  { id: 'D-003', name: 'Pulpo a las brasas',       cat: 'Pescados',  sold: 19, sales: 6935, foodCost: 38.8, margin: 61.2, velocity: 'mid'  },
  { id: 'D-006', name: 'Tarta tibia de mole',      cat: 'Postres',   sold: 17, sales: 2805, foodCost: 22.8, margin: 77.2, velocity: 'mid'  },
  { id: 'D-008', name: 'Costilla braseada',        cat: 'Carnes',    sold: 14, sales: 5530, foodCost: 31.9, margin: 68.1, velocity: 'mid'  },
  { id: 'D-009', name: 'Robalo a la sal',          cat: 'Pescados',  sold:  8, sales: 3840, foodCost: 42.4, margin: 57.6, velocity: 'low'  },
];

// Food cost trend: últimas 12 semanas
const FOOD_COST_TREND = [
  { w: 'S08', pct: 32.4, target: 30 },
  { w: 'S09', pct: 31.8, target: 30 },
  { w: 'S10', pct: 33.1, target: 30 },
  { w: 'S11', pct: 32.6, target: 30 },
  { w: 'S12', pct: 31.2, target: 30 },
  { w: 'S13', pct: 30.4, target: 30 },
  { w: 'S14', pct: 29.8, target: 30 },
  { w: 'S15', pct: 30.6, target: 30 },
  { w: 'S16', pct: 31.4, target: 30 },
  { w: 'S17', pct: 30.9, target: 30 },
  { w: 'S18', pct: 30.2, target: 30 },
  { w: 'S19', pct: 31.8, target: 30 },
];

const FOOD_COST_BY_CAT = [
  { cat: 'Carnes',      pct: 34.2, vsTarget: +4.2, weight: 28 },
  { cat: 'Pescados',    pct: 38.1, vsTarget: +8.1, weight: 22 },
  { cat: 'Verduras',    pct: 18.4, vsTarget: -1.6, weight: 14 },
  { cat: 'Lácteos',     pct: 22.6, vsTarget: -7.4, weight: 12 },
  { cat: 'Secos',       pct: 15.2, vsTarget: -4.8, weight: 10 },
  { cat: 'Vinos',       pct: 28.4, vsTarget: -1.6, weight:  8 },
  { cat: 'Bebidas',     pct: 19.8, vsTarget: -0.2, weight:  6 },
];

/* ============================================================
   VENTAS POR CATEGORÍA — hoy (suma = ventas del día $84,320)
   ============================================================ */
const SALES_BY_CATEGORY = [
  { cat: 'Pescados',          amount: 19840, share: 23.5, delta: +6.2, color: '#6E8AAA' },
  { cat: 'Entradas',          amount: 16320, share: 19.4, delta: +9.4, color: '#D89757' },
  { cat: 'Carnes',            amount: 14210, share: 16.9, delta: +2.1, color: '#A02C24' },
  { cat: 'Vinos',             amount: 10800, share: 12.8, delta: +7.6, color: '#9C7AB0' },
  { cat: 'Pastas y arroces',  amount:  9180, share: 10.9, delta: +14.0, color: '#7E9C6E' },
  { cat: 'Bebidas',           amount:  8730, share: 10.4, delta: +1.8, color: '#A88B5C' },
  { cat: 'Postres',           amount:  5240, share:  6.2, delta: +3.1, color: '#B07F86' },
];

/* ============================================================
   KPIs DE OPERACIÓN — tiempo de cocina, rotación, ocupación
   ============================================================ */
const OPERATION_KPIS = {
  cookTime:   { value: 14.2, unit: 'min', target: 15.0, delta: -0.8, label: 'Tiempo promedio cocina',
                spark: [16.1, 15.4, 15.8, 14.9, 15.2, 14.6, 14.2], note: 'Ticket→pase · objetivo ≤ 15 min' },
  tableTurns: { value: 2.4,  unit: 'x',   target: 2.6,  delta: +0.2, label: 'Rotación de mesas',
                spark: [2.0, 2.1, 2.2, 2.1, 2.3, 2.3, 2.4], note: 'Vueltas por turno · meta 2.6x' },
  occupancy:  { value: 78,   unit: '%',   target: 85,   delta: +5,   label: 'Ocupación',
                spark: [62, 68, 71, 70, 74, 76, 78], note: 'Mesas ocupadas · pico 21:00' },
  dwellTime:  { value: 96,   unit: 'min', target: 90,   delta: +4,   label: 'Estancia promedio',
                spark: [88, 90, 92, 91, 94, 95, 96], note: 'Sentado→cuenta cerrada' },
};

/* ============================================================
   MAPA DE MESAS — salón en tiempo real (22 mesas)
   status: free | seated | bill | reserved | dirty
   ============================================================ */
const TABLE_ZONES = ['Salón', 'Terraza', 'Barra', 'Privado'];
const TABLES = [
  { id: 'S1', zone: 'Salón', seats: 2, status: 'seated',   pax: 2, server: 'PN', opened: 38, ticket: 1240, course: 'Plato fuerte' },
  { id: 'S2', zone: 'Salón', seats: 4, status: 'seated',   pax: 3, server: 'PN', opened: 22, ticket: 980,  course: 'Entradas' },
  { id: 'S3', zone: 'Salón', seats: 4, status: 'bill',     pax: 4, server: 'RG', opened: 84, ticket: 3120, course: 'Cuenta' },
  { id: 'S4', zone: 'Salón', seats: 2, status: 'free',     pax: 0, server: null, opened: 0,  ticket: 0,    course: null },
  { id: 'S5', zone: 'Salón', seats: 6, status: 'seated',   pax: 5, server: 'MC', opened: 51, ticket: 4280, course: 'Postres' },
  { id: 'S6', zone: 'Salón', seats: 4, status: 'reserved', pax: 0, server: null, opened: 0,  ticket: 0,    course: null, resv: '21:30 · Familia Ruiz' },
  { id: 'S7', zone: 'Salón', seats: 2, status: 'dirty',    pax: 0, server: null, opened: 0,  ticket: 0,    course: null },
  { id: 'S8', zone: 'Salón', seats: 4, status: 'seated',   pax: 4, server: 'RG', opened: 12, ticket: 540,  course: 'Bebidas' },
  { id: 'T1', zone: 'Terraza', seats: 4, status: 'seated', pax: 4, server: 'PN', opened: 64, ticket: 2890, course: 'Plato fuerte' },
  { id: 'T2', zone: 'Terraza', seats: 4, status: 'seated', pax: 2, server: 'PN', opened: 28, ticket: 1180, course: 'Entradas' },
  { id: 'T3', zone: 'Terraza', seats: 6, status: 'reserved', pax: 0, server: null, opened: 0, ticket: 0,   course: null, resv: '21:00 · 6 pax' },
  { id: 'T4', zone: 'Terraza', seats: 2, status: 'free',   pax: 0, server: null, opened: 0,  ticket: 0,    course: null },
  { id: 'T5', zone: 'Terraza', seats: 4, status: 'seated', pax: 3, server: 'RG', opened: 45, ticket: 2140, course: 'Plato fuerte' },
  { id: 'T6', zone: 'Terraza', seats: 2, status: 'bill',   pax: 2, server: 'MC', opened: 92, ticket: 1680, course: 'Cuenta' },
  { id: 'B1', zone: 'Barra', seats: 1, status: 'seated',   pax: 1, server: 'DF', opened: 18, ticket: 420,  course: 'Bebidas' },
  { id: 'B2', zone: 'Barra', seats: 1, status: 'seated',   pax: 1, server: 'DF', opened: 33, ticket: 680,  course: 'Bebidas' },
  { id: 'B3', zone: 'Barra', seats: 1, status: 'free',     pax: 0, server: null, opened: 0,  ticket: 0,    course: null },
  { id: 'B4', zone: 'Barra', seats: 1, status: 'seated',   pax: 1, server: 'DF', opened: 7,  ticket: 220,  course: 'Bebidas' },
  { id: 'P1', zone: 'Privado', seats: 8, status: 'seated', pax: 8, server: 'MC', opened: 58, ticket: 8420, course: 'Plato fuerte', tag: 'Corporativo' },
  { id: 'P2', zone: 'Privado', seats: 8, status: 'reserved', pax: 0, server: null, opened: 0, ticket: 0,   course: null, resv: '22:00 · Aniversario · 40 pax' },
  { id: 'P3', zone: 'Privado', seats: 4, status: 'bill',   pax: 4, server: 'PN', opened: 110, ticket: 5240, course: 'Cuenta' },
  { id: 'P4', zone: 'Privado', seats: 4, status: 'free',   pax: 0, server: null, opened: 0,  ticket: 0,    course: null },
];

/* ============================================================
   COCINA / KDS — estaciones + comandas en vivo
   item.status: queued | cooking | ready
   ticket.priority: normal | rush | vip | late
   ============================================================ */
const KDS_STATIONS = [
  { id: 'Caliente', label: 'Caliente', active: 5, avg: 13.4, oldest: 11, color: '#D8704F' },
  { id: 'Parrilla', label: 'Parrilla', active: 3, avg: 18.2, oldest: 16, color: '#A02C24' },
  { id: 'Fría',     label: 'Fría',     active: 2, avg: 8.6,  oldest: 6,  color: '#6E8AAA' },
  { id: 'Postres',  label: 'Postres',  active: 1, avg: 7.1,  oldest: 3,  color: '#B07F86' },
  { id: 'Bar',      label: 'Bar',      active: 4, avg: 4.2,  oldest: 5,  color: '#A88B5C' },
];

const KDS_TICKETS = [
  { id: '#1042', table: 'P1', zone: 'Privado', server: 'MC', pax: 8, fired: '20:48', elapsed: 17, priority: 'late', course: 'Plato fuerte',
    items: [
      { name: 'Costilla braseada 8h', qty: 2, station: 'Caliente', status: 'cooking', mods: [] },
      { name: 'Robalo a la sal',      qty: 1, station: 'Parrilla', status: 'cooking', mods: ['Para 2'] },
      { name: 'Pulpo a las brasas',   qty: 2, station: 'Parrilla', status: 'ready',   mods: [] },
      { name: 'Risotto de huitlacoche', qty: 3, station: 'Caliente', status: 'queued', mods: ['1 sin lácteos'] },
    ] },
  { id: '#1043', table: 'T1', zone: 'Terraza', server: 'PN', pax: 4, fired: '20:55', elapsed: 10, priority: 'normal', course: 'Plato fuerte',
    items: [
      { name: 'Tacos de pesca del día', qty: 2, station: 'Caliente', status: 'cooking', mods: ['1 tortilla harina'] },
      { name: 'Aguachile de camarón',   qty: 1, station: 'Fría',     status: 'ready',   mods: ['Picante alto'] },
      { name: 'Carta de vinos · copeo', qty: 2, station: 'Bar',      status: 'ready',   mods: ['Tinto reserva'] },
    ] },
  { id: '#1044', table: 'S5', zone: 'Salón', server: 'MC', pax: 5, fired: '21:01', elapsed: 4, priority: 'vip', course: 'Entradas',
    items: [
      { name: 'Tartar de res y tuétano', qty: 2, station: 'Fría',     status: 'cooking', mods: [] },
      { name: 'Sopa de tortilla y epazote', qty: 3, station: 'Caliente', status: 'queued', mods: [] },
      { name: 'Tarta tibia de mole',     qty: 1, station: 'Postres',  status: 'queued', mods: ['+ Helado extra'] },
    ] },
  { id: '#1045', table: 'S8', zone: 'Salón', server: 'RG', pax: 4, fired: '21:03', elapsed: 2, priority: 'rush', course: 'Entradas',
    items: [
      { name: 'Quesadilla de huitlacoche', qty: 2, station: 'Caliente', status: 'queued', mods: [] },
      { name: 'Aguachile de camarón',      qty: 1, station: 'Fría',     status: 'queued', mods: ['Picante medio'] },
    ] },
  { id: '#1046', table: 'B1', zone: 'Barra', server: 'DF', pax: 1, fired: '21:04', elapsed: 1, priority: 'normal', course: 'Bebidas',
    items: [
      { name: 'Carta de vinos · copeo', qty: 1, station: 'Bar', status: 'cooking', mods: ['Blanco fresco'] },
    ] },
  { id: '#1047', table: 'T5', zone: 'Terraza', server: 'RG', pax: 3, fired: '20:42', elapsed: 23, priority: 'late', course: 'Plato fuerte',
    items: [
      { name: 'Pulpo a las brasas', qty: 1, station: 'Parrilla', status: 'cooking', mods: [] },
      { name: 'Risotto de huitlacoche', qty: 2, station: 'Caliente', status: 'ready', mods: [] },
    ] },
];

/* ============================================================
   POS / ÓRDENES — captura de comanda + cuentas abiertas
   ============================================================ */
const POS_OPEN_ORDERS = [
  { id: '#1042', table: 'P1', zone: 'Privado', server: 'MC', items: 11, total: 8420, opened: '20:30', status: 'kitchen' },
  { id: '#1043', table: 'T1', zone: 'Terraza', server: 'PN', items: 5,  total: 2890, opened: '20:51', status: 'kitchen' },
  { id: '#1044', table: 'S5', zone: 'Salón',   server: 'MC', items: 6,  total: 4280, opened: '20:58', status: 'open' },
  { id: '#1045', table: 'S8', zone: 'Salón',   server: 'RG', items: 3,  total: 540,  opened: '21:01', status: 'open' },
  { id: '#1041', table: 'P3', zone: 'Privado', server: 'PN', items: 9,  total: 5240, opened: '19:20', status: 'bill' },
  { id: '#1040', table: 'T6', zone: 'Terraza', server: 'MC', items: 4,  total: 1680, opened: '19:42', status: 'bill' },
];

// borrador de comanda activa para la vista de captura (mesa S8)
const POS_DRAFT = {
  table: 'S8', zone: 'Salón', server: 'Ricardo Gómez', pax: 4, opened: '21:01',
  items: [
    { id: 'D-005', name: 'Sopa de tortilla y epazote', qty: 2, price: 145, mods: [] },
    { id: 'D-007', name: 'Aguachile de camarón',       qty: 1, price: 245, mods: ['Picante medio'] },
    { id: 'D-012', name: 'Carta de vinos · copeo',     qty: 1, price: 220, mods: ['Tinto reserva'] },
  ],
};

/* ============================================================
   FACTURACIÓN / CFDI 4.0 — comprobantes emitidos + resumen
   status: timbrada | borrador | proceso | cancelada
   ============================================================ */
const CFDI_SUMMARY = {
  stampedToday: 38,
  stampedAmount: 92480,
  ivaToday: 12755,
  pending: 6,
  pendingAmount: 14820,
  pacBalance: 1240,       // timbres disponibles
  canceledMonth: 3,
};

const CFDI_INVOICES = [
  { folio: 'A-2418', serie: 'A', uuid: '3F9A…D21C', receptor: 'Servicios Corp. Cetto SA de CV', rfc: 'SCC180412QX3', date: '21 may 26 · 21:48', subtotal: 7258.62, iva: 1161.38, total: 8420.00, uso: 'G03 · Gastos en general', metodo: 'PUE', forma: '04 · Tarjeta crédito', status: 'timbrada' },
  { folio: 'A-2417', serie: 'A', uuid: '7B12…9AE4', receptor: 'Público en general', rfc: 'XAXX010101000', date: '21 may 26 · 21:12', subtotal: 2491.38, iva: 398.62, total: 2890.00, uso: 'S01 · Sin efectos fiscales', metodo: 'PUE', forma: '01 · Efectivo', status: 'timbrada' },
  { folio: '—',      serie: 'A', uuid: '—',         receptor: 'Familia Ruiz', rfc: 'RUGA850612HN1', date: '21 may 26 · 22:05', subtotal: 4517.24, iva: 722.76, total: 5240.00, uso: 'D01 · Honorarios médicos', metodo: 'PUE', forma: '03 · Transferencia', status: 'borrador' },
  { folio: 'A-2416', serie: 'A', uuid: 'C4D8…1F77', receptor: 'Tech Nearshore Tijuana SC', rfc: 'TNT210903LM8', date: '21 may 26 · 20:30', subtotal: 7258.62, iva: 1161.38, total: 8420.00, uso: 'G03 · Gastos en general', metodo: 'PPD', forma: '99 · Por definir', status: 'proceso' },
  { folio: 'A-2415', serie: 'A', uuid: 'E2A1…8C30', receptor: 'Distribuidora Frontera SA', rfc: 'DFR160218PK2', date: '21 may 26 · 19:55', subtotal: 1448.28, iva: 231.72, total: 1680.00, uso: 'G03 · Gastos en general', metodo: 'PUE', forma: '28 · Tarjeta débito', status: 'timbrada' },
  { folio: 'A-2412', serie: 'A', uuid: '9D55…4B0A', receptor: 'Eventos Baja Wedding Co', rfc: 'EBW190711UA9', date: '20 may 26 · 23:40', subtotal: 24137.93, iva: 3862.07, total: 28000.00, uso: 'G03 · Gastos en general', metodo: 'PPD', forma: '03 · Transferencia', status: 'timbrada' },
  { folio: 'A-2409', serie: 'A', uuid: 'A77F…22E1', receptor: 'Público en general', rfc: 'XAXX010101000', date: '20 may 26 · 22:18', subtotal: 1017.24, iva: 162.76, total: 1180.00, uso: 'S01 · Sin efectos fiscales', metodo: 'PUE', forma: '01 · Efectivo', status: 'cancelada' },
];

window.SALES_BY_CATEGORY = SALES_BY_CATEGORY;
window.OPERATION_KPIS = OPERATION_KPIS;
window.TABLE_ZONES = TABLE_ZONES;
window.TABLES = TABLES;
window.KDS_STATIONS = KDS_STATIONS;
window.KDS_TICKETS = KDS_TICKETS;
window.POS_OPEN_ORDERS = POS_OPEN_ORDERS;
window.POS_DRAFT = POS_DRAFT;
window.CFDI_SUMMARY = CFDI_SUMMARY;
window.CFDI_INVOICES = CFDI_INVOICES;

window.MENU_DISHES = MENU_DISHES;
window.DISH_CATEGORIES = DISH_CATEGORIES;

/* ============================================================
   PERFILES Y PERMISOS (RBAC) — quién ve y administra qué
   access: '*' = todo · array = ids de módulos permitidos
   role: alimenta las pantallas existentes que distinguen
         'partner' (ve costos/finanzas) vs 'operator'
   ============================================================ */
const ACCESS_PROFILES = [
  { id: 'owner',   name: 'Rodrigo Cárdenas', title: 'Chef · socio mayoritario', initials: 'RC', color: '#A02C24', role: 'partner',  home: 'dashboard',
    desc: 'Acceso total. Único perfil que ve el reporte a socios y administra permisos.',
    access: '*' },
  { id: 'manager', name: 'Mariana Castro',   title: 'Gerente general',          initials: 'MC', color: '#9C7AB0', role: 'partner',  home: 'dashboard',
    desc: 'Opera el restaurante de punta a punta. No ve reparto a socios ni conciliación bancaria.',
    access: ['dashboard','reports','approvals','pos','tables','cocina','sales','costs','menu','catalog','inventory','expire','intake','pay','run','invoicing','suppliers','payroll','employees','schedules','access'] },
  { id: 'kitchen', name: 'Luisa Vázquez',    title: 'Jefa de cocina',           initials: 'LV', color: '#B07F86', role: 'operator', home: 'cocina',
    desc: 'Cocina y abasto: comandas, recetas, inventario, mermas y recepción de compra.',
    access: ['cocina','tables','menu','catalog','inventory','expire','costs','intake'] },
  { id: 'front',   name: 'Karla Torres',     title: 'Hostess · caja',           initials: 'KT', color: '#6E8AAA', role: 'operator', home: 'tables',
    desc: 'Recibe, asigna mesas, cobra y factura. Sin acceso a costos ni nómina.',
    access: ['tables','pos','invoicing'] },
  { id: 'server',  name: 'Ricardo Gómez',    title: 'Mesero',                   initials: 'RG', color: '#7E9C6E', role: 'operator', home: 'pos',
    desc: 'Toma comandas y gestiona sus mesas. Acceso mínimo de piso.',
    access: ['pos','tables'] },
  { id: 'finance', name: 'Diana Reyes',      title: 'Contadora',                initials: 'DR', color: '#A88B5C', role: 'partner',  home: 'bank',
    desc: 'Finanzas: conciliación, CFDI, proveedores y nómina. Sin operación de piso.',
    access: ['reports','bank','invoicing','suppliers','payroll','pay','run'] },
];

// asignación de colaboradores a cada perfil (para la vista admin)
const PROFILE_MEMBERS = {
  owner:   ['Rodrigo Cárdenas'],
  manager: ['Mariana Castro'],
  kitchen: ['Luisa Vázquez', 'Jorge Ramírez', 'Adriana Solís', 'Carlos Bernal'],
  front:   ['Karla Torres', 'Diego Figueroa'],
  server:  ['Ricardo Gómez', 'Paola Nieves'],
  finance: ['Diana Reyes'],
};

window.ACCESS_PROFILES = ACCESS_PROFILES;
window.PROFILE_MEMBERS = PROFILE_MEMBERS;
window.MENU_SERVICES = MENU_SERVICES;
window.SCHEDULE_WEEK = SCHEDULE_WEEK;
window.SHIFTS = SHIFTS;
window.SHIFT_INCIDENTS = SHIFT_INCIDENTS;
window.HOURLY_HEATMAP = HOURLY_HEATMAP;
window.SERVER_PERFORMANCE = SERVER_PERFORMANCE;
window.PRODUCT_REPORT = PRODUCT_REPORT;
window.FOOD_COST_TREND = FOOD_COST_TREND;
window.FOOD_COST_BY_CAT = FOOD_COST_BY_CAT;

window.APPROVALS = APPROVALS;
window.CATALOG = CATALOG;
window.SUPPLIER_DIR = SUPPLIER_DIR;
window.AGING = AGING;
window.STAFF_BLOCKED = STAFF_BLOCKED;

window.RESTAURANT = RESTAURANT;
window.KPIS = KPIS;
window.SALES_TREND = SALES_TREND;
window.CHANNELS_TODAY = CHANNELS_TODAY;
window.TOP_DISHES = TOP_DISHES;
window.INVENTORY = INVENTORY;
window.EXPIRING = EXPIRING;
window.WASTE_LOG = WASTE_LOG;
window.SUPPLIERS = SUPPLIERS;
window.BANK_LINES = BANK_LINES;
window.STAFF = STAFF;
window.ACTIVITY = ACTIVITY;
window.PARTNERS = PARTNERS;
window.MONTHLY_TREND = MONTHLY_TREND;
window.PL_ROWS = PL_ROWS;

/* ============================================================
   CAJA — turnos de cajero y cortes (X de lectura / Z de cierre)
   Denominaciones MXN para el arqueo de efectivo.
   expectedCash = fund + cashSales + payIns − payOuts − cashRefunds
   ============================================================ */
const CASH_DENOMS = [
  { v: 1000, kind: 'bill' }, { v: 500, kind: 'bill' }, { v: 200, kind: 'bill' },
  { v: 100, kind: 'bill' }, { v: 50, kind: 'bill' }, { v: 20, kind: 'bill' },
  { v: 10, kind: 'coin' }, { v: 5, kind: 'coin' }, { v: 2, kind: 'coin' },
  { v: 1, kind: 'coin' }, { v: 0.5, kind: 'coin' },
];

const CASH_REGISTERS = [
  {
    id: 'caja-1', name: 'Caja 1', area: 'Recepción',
    cashier: 'Daniela Ferrer', initials: 'DF', color: '#7E9C6E',
    status: 'open', shift: 'Cena', opened: '16:02', sessionId: 'T-2208',
    fund: 3000, cashSales: 18420, cardSales: 42180, transferSales: 6240,
    tips: 5840, cashRefunds: 320, payIns: 0, payOuts: 1500, txns: 87,
  },
  {
    id: 'caja-2', name: 'Caja 2', area: 'Salón',
    cashier: 'Ricardo Gómez', initials: 'RG', color: '#B07F86',
    status: 'open', shift: 'Cena', opened: '16:00', sessionId: 'T-2209',
    fund: 3000, cashSales: 12880, cardSales: 28640, transferSales: 1980,
    tips: 4120, cashRefunds: 0, payIns: 1000, payOuts: 600, txns: 64,
  },
  {
    id: 'barra', name: 'Barra', area: 'Barra',
    cashier: 'Mariana Castro', initials: 'MC', color: '#9C7AB0',
    status: 'open', shift: 'Cena', opened: '17:10', sessionId: 'T-2210',
    fund: 1500, cashSales: 7240, cardSales: 14920, transferSales: 0,
    tips: 2680, cashRefunds: 0, payIns: 0, payOuts: 0, txns: 51,
  },
  {
    id: 'caja-3', name: 'Caja 3', area: 'Para llevar',
    cashier: null, initials: '—', color: '#6E8AAA',
    status: 'closed', shift: '—', opened: null, sessionId: null,
    fund: 0, cashSales: 0, cardSales: 0, transferSales: 0,
    tips: 0, cashRefunds: 0, payIns: 0, payOuts: 0, txns: 0,
  },
];

const CASH_MOVEMENTS = [
  { time: '20:38', register: 'Caja 1', type: 'payout', concept: 'Pago a proveedor de hielo', amount: 800, by: 'DF', auth: 'Gerente' },
  { time: '20:05', register: 'Caja 2', type: 'payin',  concept: 'Fondo adicional de cambio',   amount: 1000, by: 'Gerente', auth: 'Gerente' },
  { time: '19:42', register: 'Caja 1', type: 'payout', concept: 'Compra de servilletas',        amount: 700, by: 'DF', auth: 'Gerente' },
  { time: '19:10', register: 'Caja 2', type: 'payout', concept: 'Propina repartida en efectivo', amount: 600, by: 'RG', auth: 'RG' },
  { time: '18:25', register: 'Caja 1', type: 'refund', concept: 'Devolución mesa T2 · platillo',  amount: 320, by: 'DF', auth: 'Gerente' },
];

const CASH_CUTS = [
  { id: 'Z-0418', register: 'Caja 1', cashier: 'Mauricio López', type: 'Z', closed: 'Ayer · 01:14', shift: 'Cena', expected: 21450, counted: 21380, sales: 84230, txns: 142 },
  { id: 'Z-0417', register: 'Caja 2', cashier: 'Karina Solís',   type: 'Z', closed: 'Ayer · 01:06', shift: 'Cena', expected: 16240, counted: 16240, sales: 61870, txns: 108 },
  { id: 'Z-0416', register: 'Barra',  cashier: 'Mariana Castro',  type: 'Z', closed: 'Ayer · 00:48', shift: 'Cena', expected: 9120,  counted: 9060,  sales: 34210, txns: 73 },
  { id: 'Z-0415', register: 'Caja 1', cashier: 'Daniela Ferrer',  type: 'Z', closed: '20 may · 16:00', shift: 'Comida', expected: 12880, counted: 12940, sales: 41320, txns: 86 },
  { id: 'Z-0414', register: 'Caja 2', cashier: 'Ricardo Gómez',   type: 'Z', closed: '20 may · 16:00', shift: 'Comida', expected: 10440, counted: 10440, sales: 33180, txns: 71 },
];

Object.assign(window, { CASH_DENOMS, CASH_REGISTERS, CASH_MOVEMENTS, CASH_CUTS });

window.fmtMXN = (n, opts = {}) => {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (opts.short && abs >= 1000) {
    if (abs >= 1000000) return `${sign}$${(abs/1000000).toFixed(1)}M`;
    return `${sign}$${(abs/1000).toFixed(1)}k`;
  }
  return `${sign}$${abs.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};
window.fmtPct = (n) => `${n.toFixed(1)}%`;
window.fmtDelta = (n) => `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
