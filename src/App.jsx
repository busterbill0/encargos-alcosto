import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { useEncargos } from './hooks/useEncargos'
import LoginScreen from './components/LoginScreen'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import DetalleEncargo from './components/DetalleEncargo'
import ModalNuevoEncargo from './components/ModalNuevoEncargo'
import ModalEstadisticas from './components/ModalEstadisticas'

export default function App() {
  const { user, userName, loading: authLoading } = useAuth()
  const { encargos, loading: encargosLoading } = useEncargos()
  const [selectedId, setSelectedId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showStats, setShowStats] = useState(false)

  // Mostrar login si no hay usuario
  if (authLoading) return null
  if (!user) return <LoginScreen />

  const selectedEnc = encargos.find(e => e.id === selectedId)
  const counts = [0, 1, 2, 3].map(i => encargos.filter(e => e.estado === i).length)

  function handleSelect(id) {
    setSelectedId(id)
  }

  function handleVolver() {
    setSelectedId(null)
  }

  function handleDeleted() {
    setSelectedId(null)
  }

  return (
    <>
      <Header userName={userName} counts={counts} />

      <div className={`app-grid${selectedId ? ' detail-open' : ''}`}>

        <div className="sidebar-wrapper">
          <Sidebar
            encargos={encargos}
            selectedId={selectedId}
            onSelect={handleSelect}
            onNew={() => setShowModal(true)}
            onStats={() => setShowStats(true)}
          />
        </div>

        <div className="main-wrapper" style={styles.main}>
          {selectedEnc ? (
            <DetalleEncargo
              enc={selectedEnc}
              onVolver={handleVolver}
              onDeleted={handleDeleted}
            />
          ) : (
            <div style={styles.noSelection}>
              <div style={{ fontSize: '3.5rem', opacity: 0.3 }}>📦</div>
              <p style={{ fontSize: '0.9rem' }}>Selecciona un encargo para ver el detalle</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ModalNuevoEncargo
          onClose={() => setShowModal(false)}
          onCreated={() => {}}
        />
      )}

      {showStats && (
        <ModalEstadisticas
          encargos={encargos}
          onClose={() => setShowStats(false)}
        />
      )}

      <style>{`
        .app-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          height: calc(100vh - 61px);
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .app-grid { grid-template-columns: 1fr; }
          .main-wrapper { display: none; }
          .detail-open .sidebar-wrapper { display: none; }
          .detail-open .main-wrapper { display: flex; }
        }
      `}</style>
    </>
  )
}

const styles = {
  main: {
    overflowY: 'auto',
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
  },
  noSelection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--muted)',
    gap: 12,
  },
}
