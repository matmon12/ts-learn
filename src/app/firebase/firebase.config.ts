import { initializeApp, type FirebaseOptions } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_API_KEY_FIREBASE,
  authDomain: 'ts-learn-ec8b7.firebaseapp.com',
  projectId: 'ts-learn-ec8b7',
  storageBucket: 'ts-learn-ec8b7.firebasestorage.app',
  messagingSenderId: '1072265791914',
  appId: '1:1072265791914:web:4e3e861e7ed9af2c1ec3d3',
}

export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)
