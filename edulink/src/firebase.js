import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, onSnapshot, updateDoc, query, where, getDocs } from 'firebase/firestore'
import { firebaseConfig } from './firebaseConfig'


const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)


export async function createUserProfile(uid, profile){
const ref = doc(db, 'users', uid)
await setDoc(ref, profile, { merge: true })
}


export async function getUserProfile(uid){
const ref = doc(db, 'users', uid)
const snap = await getDoc(ref)
return snap.exists() ? snap.data() : null
}


export async function registerWithEmail(email, password, profile){
const cred = await createUserWithEmailAndPassword(auth, email, password)
await createUserProfile(cred.user.uid, profile)
return cred
}


export async function loginWithEmail(email, password){
return signInWithEmailAndPassword(auth, email, password)
}


export async function logout(){
return signOut(auth)
}


export { onAuthStateChanged, collection, addDoc, getDocs, onSnapshot, updateDoc, doc, query, where }