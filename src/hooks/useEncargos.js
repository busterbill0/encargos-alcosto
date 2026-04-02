import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

export function useEncargos() {
  const [encargos, setEncargos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = collection(db, 'encargos')
    const unsub = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs
        .map(d => ({ _docId: d.id, ...d.data() }))
        .sort((a, b) => {
          const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0)
          const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0)
          return tb - ta
        })
      setEncargos(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return { encargos, loading }
}
