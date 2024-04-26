/*import { auth, db } from '../config/firebase';
import { getDoc, getDocs, doc, collection, addDoc, serverTimestamp, query, where, Timestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { DocumentSnapshot } from 'firebase/firestore'; */
import axios from 'axios'
import { auth, db } from '../config/firebase';
import firebase from 'firebase/app';


import { getDoc, doc, setDoc, collection, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail, createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';



const POKEAPI = 'https://pokeapi.co/api/v2';


//fazer um para firebase e outro para o pokemon
const Api = {
    //API POKEAPI
    getAllPokemon: async () => {
        const res = await axios.get(`${POKEAPI}/pokedex/1`, {});
        return res.data
    },
    typePokemon: async (id: number) => {
        const res = await axios.get(`${POKEAPI}/pokemon/${id}`, {
        });
        return res.data
    },


    //APIFIREBASE
    favoritePokemon: async (userId: string, favorites: number[]) => {
        try {
            const userRef = doc(db, "users", userId);
    
            await updateDoc(userRef, {
                favorites: favorites
            });
            return true; 
        } catch (error) {
            console.error('Error adding favorite:', error);
            return false; 
        }
    },
    
    unfavoritePokemon: async (userId: string, favorites: number[]) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                favorites: favorites
            });
            return true; 
        } catch (error) {
            console.error('Error removing favorite:', error);
            return false; 
        }
    }
    
}


export default () => Api
