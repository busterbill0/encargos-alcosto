import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { TIENDAS, genId } from '../lib/constants'

function ProductoRow({ id, onRemove, showRemove }) {
  const [codigo, setCodigo] = useState('')
  const [uds, setUds] = useState('')
  const [precio, setPrecio] = useState('')

  const total = (() => {
    const u = parseFloat(uds.replace(',', '.')) || 0
    const p = parseFloat(precio.replace(',', '.')) || 0
    const t = u * p
    return t > 0 ? t.toFixed(2).replace('.', ',') + ' €' : '—'
  })()

  return (
    <div style={styles.productoRow} data-id={id}>
      <div style={styles.productoGrid}>
        <div>
          <div style={styles.colLabel}>Código</div>
          <input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ej: 2600184" data-cod />
        </div>
        <div>
          <div style={styles.colLabel}>Uds</div>
          <input type="number" value={uds} onChange={e => setUds(e.target.value)} placeholder="1" min="1" data-uds />
        </div>
        <div>
          <div style={styles.colLabel}>Precio €</div>
          <input value={precio} onChange={e => setPrecio(e.target.value)} placeholder="0,00" data-pre />
        </div>
        <div>
          <div style={styles.colLabel}>Total</div>
          <div style={styles.totalDisplay}>{total}</div>
        </div>
        {showRemove
          ? <button style={styles.btnRemove} onClick={() => onRemove(id)}>✕</button>
          : <div />
        }
      </div>
    </div>
  )
}

export default function ModalNuevoEncargo({ onClose, onCreated }) {
  const [origen, setOrigen] = useState('')
  const [destino, setDestino] = useState('')
  const [notas, setNotas] = useState('')
  const [productos, setProductos] = useState([{ id: 1 }])
  const [nextId, setNextId] = useState(2)
  const [saving, setSaving] = useState(false)

  function addProducto() {
    setProductos(p => [...p, { id: nextId }])
    setNextId(n => n + 1)
  }

  function removeProducto(id) {
    setProductos(p => p.filter(x => x.id !== id))
  }

  function recogerProductos() {
    const rows = document.querySelectorAll('[data-id]')
    const result = []
    rows.forEach(row => {
      const cod = row.querySelector('[data-cod]')?.value.trim()
      const uds = row.querySelector('[data-uds]')?.value.trim()
      const pre = row.querySelector('[data-pre]')?.value.trim()
      const u = parseFloat(uds?.replace(',', '.')) || 1
      const p = parseFloat(pre?.replace(',', '.')) || 0
      const tot = u * p
      if (cod) result.push({ codigo: cod, unidades: uds, precio: pre, total: tot > 0 ? tot.toFixed(2).replace('.', ',') : '' })
    })
    return result
  }

  async function handleCrear() {
    if (!origen || !destino) { alert('Selecciona tiendas'); return }
    if (origen === destino) { alert('Origen y destino deben ser distintos'); return }
    const prods = recogerProductos()
    if (prods.length === 0) { alert('Añade al menos un producto con código'); return }
    setSaving(true)
    try {
      await addDoc(collection(db, 'encargos'), {
        id: genId(), origen, destino,
        codigo: prods[0].codigo, unidades: prods[0].unidades, precio: prods[0].precio,
        productos: prods, notas,
        estado: -1, timestamps: {},
        createdAt: Date.now(), updatedAt: null,
      })
      onCreated()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.title}>📦 Nuevo <span style={{ color: 'var(--accent)' }}>Encargo</span></div>
        <div style={styles.body}>
          <div style={styles.group}>
            <label style={styles.label}>Tienda origen</label>
            <select value={origen} onChange={e => setOrigen(e.target.value)}>
              <option value="">Seleccionar...</option>
              {TIENDAS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Tienda destino</label>
            <select value={destino} onChange={e => setDestino(e.target.value)}>
              <option value="">Seleccionar...</option>
              {TIENDAS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={styles.label}>Productos</div>
          {productos.map((p, i) => (
            <ProductoRow key={p.id} id={p.id} onRemove={removeProducto} showRemove={i > 0} />
          ))}
          <button style={styles.btnAdd} onClick={addProducto}>＋ Añadir producto</button>
          <div style={{ ...styles.group, marginTop: 14 }}>
            <label style={styles.label}>Notas</label>
            <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Ej: Frágil, entregar antes del viernes..." style={{ minHeight: 70, resize: 'vertical' }} />
          </div>
        </div>
        <div style={styles.actions}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button style={styles.btnPrimary} onClick={handleCrear} disabled={saving}>
            {saving ? 'Creando...' : 'Crear encargo'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, width: 480, maxWidth: '95vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  title: { fontSize: '1.1rem', fontWeight: 800, padding: '24px 28px 0', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 },
  body: { overflowY: 'auto', padding: '16px 28px', flex: 1 },
  actions: { display: 'flex', gap: 10, padding: '16px 28px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', flexShrink: 0 },
  group: { marginBottom: 16 },
  label: { display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 7 },
  productoRow: { background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: 10, marginBottom: 8 },
  productoGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'end' },
  colLabel: { fontSize: '0.65rem', color: 'var(--muted)', marginBottom: 4 },
  totalDisplay: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--yellow)', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', fontWeight: 700, padding: '7px 10px' },
  btnRemove: { background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--danger)', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' },
  btnAdd: { width: '100%', background: 'transparent', border: '1px dashed var(--border)', borderRadius: 8, color: 'var(--muted)', fontSize: '0.82rem', padding: 9, marginBottom: 4 },
  btnSecondary: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', padding: '10px 20px', fontSize: '0.82rem', fontWeight: 600 },
  btnPrimary: { background: 'var(--accent)', border: 'none', borderRadius: 8, color: '#0f0f11', padding: '10px 22px', fontSize: '0.82rem', fontWeight: 700 },
}
