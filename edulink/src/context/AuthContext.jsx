import React, { createContext, useEffect, useState, useContext } from 'react'
import { auth, onAuthStateChanged, getUserProfile } from "../firebaseRTDB";

const AuthContext = createContext()
export function useAuth(){ return useContext(AuthContext) }


export function AuthProvider({ children }){
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)


useEffect(()=>{
const unsub = onAuthStateChanged(auth, async (u)=>{
if(u){
const profile = await getUserProfile(u.uid)
setUser({ uid: u.uid, email: u.email, ...profile })
} else {
setUser(null)
}
setLoading(false)
})
return ()=>unsub()
},[])


return (
<AuthContext.Provider value={{ user, setUser }}>
{!loading && children}
</AuthContext.Provider>
)
}