import React, { useEffect, useState } from "react";
import { db, ref, onValue } from "../firebaseRTDB";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const studentsRef = ref(db, "students");
    const unsub = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStudents(Object.entries(data).map(([id, value]) => ({ id, ...value })));
      } else setStudents([]);
    });
    return () => unsub();
  }, []);

  if (!user) return <p>Please sign in.</p>;

  const lowAttendance = students.filter((s) => s.attendance < 75);
  const atRisk = students.filter((s) => s.grade < 50 || s.attendance < 60);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user.email}</p>
      <p>Students: {students.length}</p>
      <p>Low Attendance: {lowAttendance.length}</p>
      <p>At-Risk: {atRisk.length}</p>
      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.name}: {s.attendance}% attendance, {s.grade}% grade
          </li>
        ))}
      </ul>
    </div>
  );
}
