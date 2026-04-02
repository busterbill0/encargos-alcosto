import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBq3M4P4HxdWP4CTcCI2vgvUAzyKFkuWpY",
  authDomain: "alcosto-nevada-encargos.firebaseapp.com",
  projectId: "alcosto-nevada-encargos",
  storageBucket: "alcosto-nevada-encargos.firebasestorage.app",
  messagingSenderId: "122169162202",
  appId: "1:122169162202:web:9ddf8756a7508c46e868e3"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
