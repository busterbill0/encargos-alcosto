import { useState } from 'react'
import { TIENDAS, ESTADOS, formatDate } from '../lib/constants'

export default function Sidebar({ encargos, selectedId, onSelect, onNew, onStats }) {
  const [filterEstado, setFilterEstado] = useState('')
  const [filterOrigen, setFilterOrigen] = useState('')
  const [filterDestino, setFilterDestino] = useState('')

  let filtered = [...encargos]
  if (filterEstado !== '') {
    filtered = filtered.filter(e => e.estado === parseInt(filterEstado))
  } else {
    filtered = filtered.filter(e => e.estado < 3)
  }
  if (filterOrigen) filtered = filtered.filter(e => (e.origen || '').toLowerCase() === filterOrigen.toLowerCase())
  if (filterDestino) filtered = filtered.filter(e => (e.destino || '').toLowerCase() === filterDestino.toLowerCase())

  return (
    <div style={styles.sidebar}>
      {/* Header sidebar */}
      <div style={styles.sidebarHeader}>
        <h2 style={styles.sidebarTitle}>Encargos activos</h2>
        <button style={styles.btnNew} onClick={onNew}>＋ Nuevo encargo</button>
      </div>

      {/* Filtros */}
      <div style={styles.filters}>
        <div>
          <div style={styles.filterLabel}>Filtrar por estado</div>
          <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="0">Recogido por repartidor</option>
            <option value="1">Depositado en casillero</option>
            <option value="2">Recogido del casillero</option>
            <option value="3">Entregado en tienda</option>
          </select>
        </div>
        <div>
          <div style={styles.filterLabel}>Filtrar por tienda origen</div>
          <select value={filterOrigen} onChange={e => setFilterOrigen(e.target.value)}>
            <option value="">Todas</option>
            {TIENDAS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <div style={styles.filterLabel}>Filtrar por tienda destino</div>
          <select value={filterDestino} onChange={e => setFilterDestino(e.target.value)}>
            <option value="">Todas</option>
            {TIENDAS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Lista */}
      <div style={styles.list}>
        {filtered.length === 0 ? (
          <div style={styles.empty}><div style={{ fontSize: '2rem' }}>📭</div><p>No hay encargos</p></div>
        ) : (
          filtered.map(enc => (
            <EncargoCard
              key={enc._docId}
              enc={enc}
              active={selectedId === enc.id}
              onClick={() => onSelect(enc.id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <button style={styles.btnStats} onClick={onStats}>📊 Estadísticas por tienda</button>
      </div>
    </div>
  )
}

function EncargoCard({ enc, active, onClick }) {
  const estado = Math.max(enc.estado, 0)
  const estadoColors = ['var(--s0)', 'var(--s1)', 'var(--s2)', 'var(--s3)']
  const badgeBg = [
    'rgba(59,130,246,0.15)', 'rgba(245,158,11,0.15)',
    'rgba(139,92,246,0.15)', 'rgba(16,185,129,0.15)'
  ]
  const badgeBorder = [
    'rgba(59,130,246,0.3)', 'rgba(245,158,11,0.3)',
    'rgba(139,92,246,0.3)', 'rgba(16,185,129,0.3)'
  ]

  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        borderColor: active ? 'var(--accent)' : 'var(--border)',
        background: active ? '#1f1f25' : 'var(--surface2)',
        '--bar-color': estadoColors[estado],
      }}
    >
      <div style={{ ...styles.bar, background: estadoColors[estado] }} />
      <div style={styles.cardTop}>
        <span style={styles.cardId}>{enc.id}</span>
        <span style={{
          ...styles.badge,
          background: badgeBg[estado],
          color: estadoColors[estado],
          border: `1px solid ${badgeBorder[estado]}`,
        }}>
          {enc.estado === -1 ? '⏳ Pendiente' : `${ESTADOS[estado].icon} ${ESTADOS[estado].label.split(' ').slice(0, 2).join(' ')}`}
        </span>
      </div>
      <div style={styles.cardRoute}>
        <span>{enc.origen}</span>
        <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>→</span>
        <span>{enc.destino}</span>
      </div>
      <div style={styles.cardDesc}>{enc.codigo ? `📦 ${enc.codigo}` : 'Sin código'}</div>
      <div style={styles.cardDate}>🕐 {formatDate(enc.createdAt)}</div>
    </div>
  )
}

const styles = {
  sidebar: {
    background: 'var(--surface)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  sidebarHeader: { padding: '20px 20px 14px', borderBottom: '1px solid var(--border)' },
  sidebarTitle: {
    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em',
    textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12,
  },
  btnNew: {
    width: '100%', background: 'var(--yellow)', color: '#0f0f11',
    border: 'none', borderRadius: 'var(--r)', padding: '11px 16px',
    fontSize: '0.85rem', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  filters: {
    padding: '14px 20px', display: 'flex', flexDirection: 'column',
    gap: 8, borderBottom: '1px solid var(--border)',
  },
  filterLabel: {
    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2,
  },
  list: { flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 },
  empty: { textAlign: 'center', padding: '40px 20px', color: 'var(--muted)', fontSize: '0.82rem' },
  footer: { padding: 12, borderTop: '1px solid var(--border)' },
  btnStats: {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 'var(--r)', color: 'var(--text)',
    fontSize: '0.82rem', fontWeight: 600, padding: '10px 16px',
  },
  card: {
    position: 'relative', borderRadius: 'var(--r)',
    border: '1px solid var(--border)', padding: '14px 14px 14px 18px',
    cursor: 'pointer', overflow: 'visible',
  },
  bar: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 4, borderRadius: '10px 0 0 10px',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 },
  cardId: { fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: 'var(--muted)' },
  badge: { fontSize: '0.65rem', fontWeight: 700, padding: '3px 9px', borderRadius: 99, textTransform: 'uppercase' },
  cardRoute: { display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.9rem', fontWeight: 700, marginBottom: 6 },
  cardDesc: { fontSize: '0.76rem', color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardDate: { fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: 'var(--muted)', marginTop: 8 },
}
