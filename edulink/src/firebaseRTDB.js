import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  update,
  push,
  child,
} from "firebase/database";
import { firebaseConfig } from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Create or update user profile
export async function createUserProfile(uid, profile) {
  const userRef = ref(db, "users/" + uid);
  await set(userRef, profile);
}

export async function getUserProfile(uid) {
  const snap = await get(ref(db, "users/" + uid));
  return snap.exists() ? snap.val() : null;
}

export async function registerWithEmail(email, password, profile) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await createUserProfile(cred.user.uid, profile);
  return cred;
}

export async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return signOut(auth);
}

export { onAuthStateChanged, ref, onValue, set, get, update, push, child };
