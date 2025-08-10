import { initializeApp, type FirebaseOptions } from 'firebase/app'

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyChZacyE4HGjTMQTSJjojsk_-d5vWUoK-Y',
  authDomain: 'ts-learn-ec8b7.firebaseapp.com',
  projectId: 'ts-learn-ec8b7',
  storageBucket: 'ts-learn-ec8b7.firebasestorage.app',
  messagingSenderId: '1072265791914',
  appId: '1:1072265791914:web:4e3e861e7ed9af2c1ec3d3',
}

export const firebaseApp = initializeApp(firebaseConfig)
