/* Facturación / CFDI 4.0 — comprobantes emitidos, timbrado y cancelaciones */
const CFDI_STATUS = {
  timbrada:  { label: 'Timbrada',   cls: 'positive' },
  borrador:  { label: 'Borrador',   cls: 'neutral' },
  proceso:   { label: 'En proceso', cls: 'warning' },
  cancelada: { label: 'Cancelada',  cls: 'danger' },
};

const InvoicingScreen = ({ role }) => {
  const [filter, setFilter] = useState('all');
  const s = CFDI_SUMMARY;

  const counts = CFDI_INVOICES.reduce((a, inv) => { a[inv.status] = (a[inv.status] || 0) + 1; return a; }, {});
  const rows = filter === 'all' ? CFDI_INVOICES : CFDI_INVOICES.filter(i => i.status === filter);

  const tabs = [
    { value: 'all',       label: 'Todas',      count: CFDI_INVOICES.length },
    { value: 'timbrada',  label: 'Timbradas',  count: counts.timbrada || 0 },
    { value: 'borrador',  label: 'Borradores', count: counts.borrador || 0 },
    { value: 'proceso',   label: 'En proceso', count: counts.proceso || 0 },
    { value: 'cancelada', label: 'Canceladas', count: counts.cancelada || 0 },
  ];

  const pacPct = Math.min(100, (s.pacBalance / 2000) * 100);

  return (
    <div className="content">
      <PageHead
        eyebrow="Finanzas · facturación electrónica"
        title="Facturación / CFDI"
        sub="Comprobantes 4.0 timbrados ante el SAT, factura global del día y cancelaciones"
        actions={<>
          <button className="btn"><Icon name="download" size={14}/> Descargar XML + PDF</button>
          <button className="btn btn-primary"><Icon name="plus" size={14}/> Emitir CFDI</button>
        </>}
      />

      {/* KPIs */}
      <div className="row cols-4">
        <div className="card kpi lift">
          <div className="kpi-label">Timbradas hoy</div>
          <div className="kpi-value num">{s.stampedToday}</div>
          <div className="kpi-target">{fmtMXN(s.stampedAmount)} facturado</div>
        </div>
        <div className="card kpi lift">
          <div className="kpi-label">IVA trasladado · hoy</div>
          <div className="kpi-value"><span className="currency">$</span>{(s.ivaToday/1000).toFixed(1)}k</div>
          <div className="kpi-target">16% · base {fmtMXN(s.stampedAmount - s.ivaToday, { short: true })}</div>
        </div>
        <div className="card kpi lift">
          <div className="kpi-label">Pendientes por timbrar</div>
          <div className="kpi-value num" style={{ color: s.pending > 0 ? 'var(--warning)' : 'var(--ink)' }}>{s.pending}</div>
          <div className="kpi-target">{fmtMXN(s.pendingAmount)} · borradores y PPD</div>
        </div>
        <div className="card kpi lift">
          <div className="kpi-label">Saldo de timbres · PAC</div>
          <div className="kpi-value num">{s.pacBalance.toLocaleString('es-MX')}</div>
          <div className="bar thin" style={{ marginTop: 10 }}><span style={{ width: pacPct + '%', background: pacPct < 20 ? 'var(--danger)' : 'var(--accent)' }}/></div>
        </div>
      </div>

      <div className="row" style={{ gridTemplateColumns: '1.7fr 1fr', marginTop: 16 }}>
        {/* INVOICES TABLE */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '8px 16px 0' }}>
            <Tabs value={filter} onChange={setFilter} tabs={tabs}/>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ paddingLeft: 20 }}>Folio · UUID</th>
                <th>Receptor</th>
                <th>Uso / Forma</th>
                <th className="right">Subtotal</th>
                <th className="right">IVA</th>
                <th className="right">Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((inv, i) => {
                const st = CFDI_STATUS[inv.status];
                return (
                  <tr key={i} style={{ cursor: 'pointer' }}>
                    <td style={{ paddingLeft: 20 }}>
                      <div className="num">{inv.folio}</div>
                      <div className="sub mono">{inv.uuid}</div>
                    </td>
                    <td>
                      <div>{inv.receptor}</div>
                      <div className="sub mono">{inv.rfc}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>{inv.uso.split(' · ')[0]}</div>
                      <div className="sub">{inv.metodo} · {inv.forma.split(' · ')[1] || inv.forma}</div>
                    </td>
                    <td className="right num muted">{fmtMXN(inv.subtotal)}</td>
                    <td className="right num muted">{fmtMXN(inv.iva)}</td>
                    <td className="right num serif" style={{ fontSize: 16 }}>{fmtMXN(inv.total)}</td>
                    <td><span className={'pill ' + st.cls}><span className="dot"/>{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 18, fontSize: 12, color: 'var(--muted)' }}>
            <span><Icon name="info" size={12}/> Cancelaciones requieren acuse del receptor (CFDI 4.0)</span>
            <span style={{ marginLeft: 'auto' }}>Corte fiscal al cierre · 23:59 · zona horaria Pacífico</span>
          </div>
        </div>

        {/* SIDE COLUMN */}
        <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
          <div className="card">
            <div className="card-head">
              <div>
                <div className="card-title">Factura global del día</div>
                <div className="card-meta">Tickets sin factura · público en general</div>
              </div>
            </div>
            <div className="cfdi-global">
              <div className="cfdi-global-amt serif">{fmtMXN(38420)}</div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 14 }}>61 tickets · 22.4% del día · se timbra al corte</div>
              <div className="meter">
                <div className="label">Avance del corte</div>
                <div className="vals">61 / 78 tickets</div>
                <div className="barwrap"><div className="fill" style={{ width: '78%' }}/></div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                <Icon name="doc" size={14}/> Generar global ahora
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title">Por revisar</div>
            </div>
            <div className="activity">
              <div className="activity-row">
                <div className="dot" style={{ background: 'var(--warning)' }}/>
                <div>
                  <div className="t">2 facturas PPD sin complemento de pago</div>
                  <div className="s">Tech Nearshore Tijuana · vence en 3 días</div>
                </div>
              </div>
              <div className="activity-row">
                <div className="dot" style={{ background: 'var(--danger)' }}/>
                <div>
                  <div className="t">1 cancelación pendiente de acuse</div>
                  <div className="s">A-2409 · esperando aceptación del receptor</div>
                </div>
              </div>
              <div className="activity-row">
                <div className="dot" style={{ background: 'var(--accent)' }}/>
                <div>
                  <div className="t">Saldo de timbres bajo</div>
                  <div className="s">{s.pacBalance} restantes · recargar paquete con el PAC</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
window.InvoicingScreen = InvoicingScreen;
