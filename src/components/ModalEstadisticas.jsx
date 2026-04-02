import { useState } from 'react'
import { TIENDAS } from '../lib/constants'

function calcEuros(enc) {
  const prods = enc.productos?.length > 0
    ? enc.productos
    : [{ unidades: enc.unidades, precio: enc.precio, total: enc.total }]
  return prods.reduce((sum, p) => {
    const t = p.total ? parseFloat(p.total.replace(',', '.')) : 0
    const u = parseFloat(p.unidades) || 1
    const pr = parseFloat((p.precio || '0').replace(',', '.'))
    return sum + (t > 0 ? t : u * pr)
  }, 0)
}

export default function ModalEstadisticas({ encargos, onClose }) {
  const [tienda, setTienda] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [result, setResult] = useState(null)

  function calcular() {
    if (!tienda) return
    const desdeTs = desde ? new Date(desde).getTime() : 0
    const hastaTs = hasta ? new Date(hasta + 'T23:59:59').getTime() : Date.now()
    const filtrados = encargos.filter(e => {
      const ts = e.createdAt?.toMillis ? e.createdAt.toMillis() : (e.createdAt || 0)
      return ts >= desdeTs && ts <= hastaTs
    })
    const enviados = filtrados.filter(e => (e.origen || '').toLowerCase() === tienda.toLowerCase())
    const recibidos = filtrados.filter(e => (e.destino || '').toLowerCase() === tienda.toLowerCase())
    const euroEnviado = enviados.reduce((s, e) => s + calcEuros(e), 0)
    const euroRecibido = recibidos.reduce((s, e) => s + calcEuros(e), 0)
    setResult({
      enviados: enviados.length, recibidos: recibidos.length,
      total: enviados.length + recibidos.length,
      euroEnviado, euroRecibido, euroTotal: euroEnviado + euroRecibido,
    })
  }

  function fmt(n) { return n.toFixed(2).replace('.', ',') + ' €' }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.title}>📊 Estadísticas por <span style={{ color: 'var(--accent)' }}>Tienda</span></div>
        <div style={styles.body}>
          <div style={styles.group}>
            <label style={styles.label}>Tienda</label>
            <select value={tienda} onChange={e => { setTienda(e.target.value); setResult(null) }}>
              <option value="">Seleccionar tienda...</option>
              {TIENDAS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={styles.dateGrid}>
            <div style={styles.group}>
              <label style={styles.label}>Desde</label>
              <input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Hasta</label>
              <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
            </div>
          </div>
          <button style={styles.btnPrimary} onClick={calcular} disabled={!tienda}>
            Ver estadísticas
          </button>

          {result && (
            <div style={styles.resultGrid}>
              <StatBox label="📤 Enviados" value={result.enviados} />
              <StatBox label="📥 Recibidos" value={result.recibidos} />
              <StatBox label="📦 Total encargos" value={result.total} span2 />
              <StatBox label="💸 € Enviado" value={fmt(result.euroEnviado)} small />
              <StatBox label="💰 € Recibido" value={fmt(result.euroRecibido)} small />
              <StatBox label="🏦 € Total movido" value={fmt(result.euroTotal)} span2 small />
            </div>
          )}
        </div>
        <div style={styles.actions}>
          <button style={styles.btnSecondary} onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, span2, small }) {
  return (
    <div style={{ ...styles.statBox, gridColumn: span2 ? 'span 2' : undefined }}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statNum, fontSize: small ? '1.4rem' : '2rem' }}>{value}</div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, width: 500, maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  title: { fontSize: '1.1rem', fontWeight: 800, padding: '24px 28px 0', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  body: { overflowY: 'auto', padding: '16px 28px', flex: 1 },
  actions: { display: 'flex', gap: 10, padding: '16px 28px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', flexShrink: 0 },
  group: { marginBottom: 14 },
  label: { display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 7 },
  dateGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  btnPrimary: { width: '100%', background: 'var(--accent)', border: 'none', borderRadius: 8, color: '#0f0f11', padding: '10px 22px', fontSize: '0.82rem', fontWeight: 700, marginBottom: 18 },
  btnSecondary: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 20px', fontSize: '0.82rem', fontWeight: 600 },
  resultGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  statBox: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 16, textAlign: 'center' },
  statLabel: { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 },
  statNum: { fontWeight: 800, color: 'var(--accent)' },
}
