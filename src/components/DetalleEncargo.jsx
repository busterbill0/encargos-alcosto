import { updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db, auth } from '../lib/firebase'
import { ESTADOS, USUARIOS, formatDate, calcularTotalProducto } from '../lib/constants'

export default function DetalleEncargo({ enc, onVolver, onDeleted }) {
  async function advance() {
    if (!enc || enc.estado >= 3) return
    const user = auth.currentUser
    const nombre = USUARIOS[user?.email] || user?.email?.split('@')[0] || ''
    const nuevoEstado = enc.estado + 1
    await updateDoc(doc(db, 'encargos', enc._docId), {
      estado: nuevoEstado,
      timestamps: { ...(enc.timestamps || {}), [nuevoEstado]: Date.now() },
      repartidoresPasos: { ...(enc.repartidoresPasos || {}), [nuevoEstado]: nombre },
      updatedAt: Date.now(),
    })
  }

  async function handleDelete() {
    if (!confirm('¿Eliminar este encargo?')) return
    await deleteDoc(doc(db, 'encargos', enc._docId))
    onDeleted()
  }

  const prods = enc.productos?.length > 0
    ? enc.productos
    : [{ codigo: enc.codigo, unidades: enc.unidades, precio: enc.precio, total: enc.total }]

  return (
    <div style={styles.container}>
      {/* Header detalle */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={styles.btnIcon} onClick={onVolver}>‹</button>
          <div>
            <div style={styles.detailId}>{enc.id}</div>
            <div style={styles.detailRoute}>
              {enc.origen} <span style={{ color: 'var(--accent)' }}>→</span> {enc.destino}
            </div>
          </div>
        </div>
        <button style={{ ...styles.btnIcon, color: 'var(--danger)' }} onClick={handleDelete}>🗑️</button>
      </div>

      {/* Timeline */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Estado del encargo</div>
        <div style={styles.timeline}>
          {ESTADOS.map((s, i) => {
            const done = i <= enc.estado
            const current = i === enc.estado + 1
            const isLast = i === ESTADOS.length - 1
            const ts = enc.timestamps?.[i]
            return (
              <div key={i} style={styles.step}>
                <div style={styles.stepLeft}>
                  <div style={{
                    ...styles.stepCircle,
                    background: done ? 'var(--success)' : 'var(--surface2)',
                    borderColor: done ? 'var(--success)' : current ? 'var(--accent)' : 'var(--border)',
                    color: done ? '#0f0f11' : current ? 'var(--accent)' : 'var(--muted)',
                  }}>
                    {done ? '✓' : s.icon}
                  </div>
                  {!isLast && <div style={{ ...styles.stepLine, background: done ? 'var(--success)' : 'var(--border)' }} />}
                </div>
                <div style={styles.stepContent}>
                  <div style={{
                    ...styles.stepTitle,
                    color: done ? 'var(--success)' : current ? 'var(--accent)' : 'var(--muted)',
                  }}>{s.label}</div>
                  {ts && (
                    <div style={styles.stepTime}>
                      {formatDate(ts)}
                      {enc.repartidoresPasos?.[i] && <> · <strong>{enc.repartidoresPasos[i]}</strong></>}
                    </div>
                  )}
                  {current && (
                    <button style={styles.btnAdvance} onClick={advance}>
                      Marcar este paso ✓
                    </button>
                  )}
                  {enc.estado === 3 && i === 3 && (
                    <div style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.8rem' }}>✅ Completado</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Productos */}
      <div style={styles.infoBlock}>
        <div style={styles.infoLabel}>Productos</div>
        {prods.map((p, i) => (
          <div key={i} style={styles.productoRow}>
            <div><div style={styles.colLabel}>Código</div><div style={styles.mono}>{p.codigo || '—'}</div></div>
            <div><div style={styles.colLabel}>Uds</div><div style={styles.mono}>{p.unidades || '—'}</div></div>
            <div><div style={styles.colLabel}>Precio</div><div style={styles.mono}>{p.precio ? p.precio + '€' : '—'}</div></div>
            <div><div style={styles.colLabel}>Total</div><div style={{ ...styles.mono, color: 'var(--yellow)', fontWeight: 700 }}>{calcularTotalProducto(p)}</div></div>
          </div>
        ))}
      </div>

      {/* Notas y fechas */}
      <div style={styles.grid2}>
        <div style={{ ...styles.infoBlock, gridColumn: 'span 2' }}>
          <div style={styles.infoLabel}>Notas</div>
          <div>{enc.notas || '—'}</div>
        </div>
        <div style={styles.infoBlock}>
          <div style={styles.infoLabel}>Creado</div>
          <div style={styles.mono}>{formatDate(enc.createdAt)}</div>
        </div>
        <div style={styles.infoBlock}>
          <div style={styles.infoLabel}>Última actualización</div>
          <div style={styles.mono}>{enc.updatedAt ? formatDate(enc.updatedAt) : '—'}</div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 },
  btnIcon: {
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--muted)',
    width: 38, height: 38, fontSize: '1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  detailId: { fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 6 },
  detailRoute: { fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12 },
  section: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: 24 },
  sectionTitle: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20 },
  timeline: { display: 'flex', flexDirection: 'column' },
  step: { display: 'flex', gap: 16, alignItems: 'flex-start' },
  stepLeft: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 },
  stepCircle: { width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: '2px solid', flexShrink: 0, zIndex: 1 },
  stepLine: { width: 2, flex: 1, minHeight: 28, margin: '4px 0', transition: 'background 0.3s' },
  stepContent: { flex: 1, paddingBottom: 24 },
  stepTitle: { fontSize: '0.9rem', fontWeight: 700, marginBottom: 3 },
  stepTime: { fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: 'var(--muted)' },
  btnAdvance: {
    marginTop: 10, background: 'var(--accent)', color: '#0f0f11',
    border: 'none', borderRadius: 8, padding: '9px 18px',
    fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7,
  },
  infoBlock: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px 18px' },
  infoLabel: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 },
  productoRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, marginTop: 8, padding: 8, background: 'var(--bg)', borderRadius: 6, border: '1px solid var(--border)' },
  colLabel: { fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 2 },
  mono: { fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
}
