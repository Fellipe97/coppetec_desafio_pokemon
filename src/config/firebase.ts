import { initializeApp } from "firebase/app";

import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";



// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC1FYESKpPhEkAuQ6QLZhlSmot3XuUO_9A",
  authDomain: "ufrj-coppetec-pokemon.firebaseapp.com",
  projectId: "ufrj-coppetec-pokemon",
  storageBucket: "ufrj-coppetec-pokemon.appspot.com",
  messagingSenderId: "555735919180",
  appId: "1:555735919180:web:d7d192cbc2cb3dca7a62e9",
  measurementId: "G-H569BBV71M"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app)
export const db = getFirestore(app);
export const firebase = app;