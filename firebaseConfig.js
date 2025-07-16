import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAaduAavCCwknw0P-0nbjjFGHY7TEpnGqo",
  authDomain: "parkdevblog.firebaseapp.com",
  databaseURL: "https://parkdevblog-default-rtdb.firebaseio.com",
  projectId: "parkdevblog",
  storageBucket: "parkdevblog.firebasestorage.app",
  messagingSenderId: "624615678260",
  appId: "1:624615678260:web:bb36fe75e98d73bc9e0561",
  measurementId: "G-RQ3LNFLW9S"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);