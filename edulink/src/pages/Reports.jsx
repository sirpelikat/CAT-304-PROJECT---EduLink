import React, { useEffect, useState } from "react";
import { db, ref, onValue, update } from "../firebaseRTDB";
import { useAuth } from "../context/AuthContext";

export default function Reports() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const studentsRef = ref(db, "students");
    const unsub = onValue(studentsRef, (snap) => {
      const data = snap.val() || {};
      setStudents(Object.entries(data).map(([id, val]) => ({ id, ...val })));
    });
    return () => unsub();
  }, []);

  async function signReport(id) {
    if (!user) return;
    const studentRef = ref(db, `students/${id}`);
    await update(studentRef, {
      signedBy: user.uid,
      signedAt: new Date().toISOString(),
    });
  }

  return (
    <div>
      <h2>Reports</h2>
      {students.map((s) => (
        <div key={s.id}>
          <strong>{s.name}</strong> — {s.grade}% grade, {s.attendance}% attendance
          {s.signedBy ? (
            <span> ✅ Signed</span>
          ) : (
            <button onClick={() => signReport(s.id)}>Sign</button>
          )}
        </div>
      ))}
    </div>
  );
}
