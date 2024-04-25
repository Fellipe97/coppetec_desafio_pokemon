/*import { auth, db } from '../config/firebase';
import { getDoc, getDocs, doc, collection, addDoc, serverTimestamp, query, where, Timestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { DocumentSnapshot } from 'firebase/firestore'; */
import axios from 'axios'


const POKEAPI = ' https://pokeapi.co/api/v2';


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
}


export default () => Api
