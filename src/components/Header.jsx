import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../lib/firebase'

export default function Header({ userName, counts }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const pills = [
    { label: 'En ruta', color: 'var(--s0)', count: counts[0] },
    { label: 'En casillero', color: 'var(--s1)', count: counts[1] },
    { label: 'Recogidos', color: 'var(--s2)', count: counts[2] },
    { label: 'Entregados', color: 'var(--s3)', count: counts[3] },
  ]

  return (
    <>
      <header style={styles.header}>
        <div style={styles.logo}>
          ALCOSTO NEVADA <span style={{ color: 'var(--text)' }}>·</span>{' '}
          <em style={{ color: 'var(--yellow)', fontStyle: 'normal' }}>Encargos</em>
        </div>

        {/* Botón menú móvil */}
        <button style={styles.menuBtn} onClick={() => setMenuOpen(o => !o)} className="menu-movil">
          ☰
        </button>

        {/* Stats desktop */}
        <div style={styles.statsRow} className="header-stats">
          <div style={{ ...styles.pill, gap: 12 }}>
            <span style={{ fontWeight: 600 }}>Hola, {userName}</span>
            <button style={styles.salirBtn} onClick={() => signOut(auth)}>Salir</button>
          </div>
          {pills.map(p => (
            <div key={p.label} style={styles.pill}>
              <span style={{ ...styles.dot, background: p.color }} />
              {p.label}: <strong style={{ color: 'var(--text)', fontFamily: 'DM Mono, monospace' }}>{p.count}</strong>
            </div>
          ))}
        </div>
      </header>

      {/* Panel desplegable móvil */}
      {menuOpen && (
        <div style={styles.mobilePanel}>
          <div style={styles.mobilePanelTop}>
            <span style={styles.mobileHello}>¡Hola, {userName}!</span>
            <button style={styles.salirBtn} onClick={() => signOut(auth)}>Salir</button>
          </div>
          <div style={styles.mobileGrid}>
            {pills.map(p => (
              <div key={p.label} style={styles.mobileCounter}>
                <span style={{ ...styles.dot, width: 8, height: 8, background: p.color }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{p.label}:</span>
                <strong style={{ fontFamily: 'DM Mono, monospace' }}>{p.count}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .menu-movil { display: none !important; }
        .header-stats { display: flex; }
        @media (max-width: 768px) {
          .menu-movil { display: flex !important; }
          .header-stats { display: none !important; }
        }
      `}</style>
    </>
  )
}

const styles = {
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 28px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  logo: {
    fontSize: '1.1rem', fontWeight: 800,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'var(--accent)',
  },
  statsRow: { gap: 20 },
  pill: {
    display: 'flex', alignItems: 'center', gap: 7,
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 99, padding: '5px 14px',
    fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted)',
  },
  dot: { width: 7, height: 7, borderRadius: '50%', display: 'inline-block' },
  salirBtn: {
    background: 'transparent', border: '1px solid var(--border)',
    borderRadius: 6, color: 'var(--muted)',
    fontSize: '0.72rem', padding: '3px 10px',
  },
  menuBtn: {
    background: 'transparent', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text)',
    fontSize: '1.2rem', width: 38, height: 38,
    alignItems: 'center', justifyContent: 'center',
  },
  mobilePanel: {
    background: 'var(--surface)', borderBottom: '1px solid var(--border)',
    padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10,
  },
  mobilePanelTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  mobileHello: { fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' },
  mobileGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 },
  mobileCounter: {
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 8, padding: 10,
    display: 'flex', alignItems: 'center', gap: 8,
  },
}
