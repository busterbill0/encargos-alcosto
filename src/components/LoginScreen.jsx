import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'

const ERROR_MSGS = {
  'auth/invalid-credential': 'Email o contraseña incorrectos',
  'auth/user-not-found': 'Usuario no encontrado',
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/invalid-email': 'Email no válido',
  'auth/too-many-requests': 'Demasiados intentos, espera un momento',
  'auth/network-request-failed': 'Error de red',
}

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
    } catch (e) {
      setError(ERROR_MSGS[e.code] || `Error: ${e.code}`)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div style={styles.screen}>
      <div style={styles.brand}>
        <div style={styles.brandTitle}>
          ALCOSTO NEVADA <span style={{ color: 'var(--text)' }}>·</span>{' '}
          <span style={{ color: 'var(--yellow)' }}>Encargos</span>
        </div>
        <div style={styles.brandSub}>Acceso privado</div>
      </div>

      <div style={styles.card}>
        <div>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label style={styles.label}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <button style={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  screen: {
    position: 'fixed', inset: 0,
    background: 'var(--bg)',
    zIndex: 500,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 24,
  },
  brand: { textAlign: 'center', marginBottom: 8 },
  brandTitle: {
    fontSize: '1.4rem', fontWeight: 800,
    letterSpacing: '0.12em', color: 'var(--accent)',
  },
  brandSub: { fontSize: '0.8rem', color: 'var(--muted)', marginTop: 6 },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: 28, width: 320, maxWidth: '90vw',
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  label: {
    display: 'block', fontSize: '0.72rem', fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase',
    color: 'var(--muted)', marginBottom: 7,
  },
  error: { color: 'var(--danger)', fontSize: '0.78rem', textAlign: 'center' },
  btn: {
    background: 'var(--yellow)', color: '#0f0f11',
    border: 'none', borderRadius: 'var(--r)',
    padding: 12, fontSize: '0.9rem', fontWeight: 700,
    marginTop: 4, opacity: 1,
  },
}
