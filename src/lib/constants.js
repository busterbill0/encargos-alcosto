export const TIENDAS = [
  "Albolote", "Antequera", "Atarfe", "Cabra",
  "Estepa", "Montilla 1", "Montilla 2", "Priego 1",
  "Priego 2", "Priego Maxi", "Puente Genil", "Rute",
  "Santa Fe", "Zaidín"
]

export const ESTADOS = [
  { label: "Recogido por repartidor", icon: "🚚" },
  { label: "Depositado en casillero", icon: "📫" },
  { label: "Recogido del casillero",  icon: "📬" },
  { label: "Entregado en tienda",     icon: "✅" }
]

export const USUARIOS = {
  "antonio@nevada.com": "Antonio",
  "paco@nevada.com":    "Paco",
  "celia@nevada.com":   "Celia",
  "eva@nevada.com":     "Eva"
}

export function genId() {
  return 'ENC-' + Date.now().toString(36).toUpperCase().slice(-6)
}

export function formatDate(ts) {
  if (!ts) return '—'
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }) +
    ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

export function calcularTotalProducto(p) {
  const t = p.total ? parseFloat(p.total.replace(',', '.')) : 0
  const u = parseFloat(p.unidades) || 1
  const pr = parseFloat((p.precio || '0').replace(',', '.'))
  const c = t > 0 ? t : u * pr
  return c > 0 ? c.toFixed(2).replace('.', ',') + ' €' : '—'
}
