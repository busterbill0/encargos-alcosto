import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ msg: '', visible: false })

  const showToast = useCallback((msg) => {
    setToast({ msg, visible: true })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '13px 20px',
        fontSize: '0.82rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 300,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        transform: toast.visible ? 'translateY(0)' : 'translateY(80px)',
        opacity: toast.visible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        pointerEvents: 'none',
      }}>
        {toast.msg}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
