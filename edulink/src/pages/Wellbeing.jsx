import React, { useEffect, useState } from 'react'
import { db, collection, onSnapshot } from '../firebase'


export default function Wellbeing(){
const [alerts, setAlerts] = useState([])
useEffect(()=>{
const unsub = onSnapshot(collection(db,'students'), snap=>{
const list = snap.docs.map(d=>({id:d.id,...d.data()}))
setAlerts(list.filter(s=>s.attendance<75||s.grade<50))
})
return ()=>unsub()
},[])
return (
<div>
<h2 className="text-xl font-semibold mb-4">Student Well-being</h2>
{alerts.map(s=>(
<div key={s.id} className="bg-white p-4 rounded shadow mb-2">
<strong>{s.name}</strong> — Attendance {s.attendance}% — Grade {s.grade}%
<div className="text-yellow-700 text-sm">Needs attention</div>
</div>
))}
</div>
)
}