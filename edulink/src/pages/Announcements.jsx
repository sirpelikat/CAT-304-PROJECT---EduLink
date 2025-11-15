import React, { useEffect, useState } from "react";
import { db, ref, onValue } from "../firebaseRTDB";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const annRef = ref(db, "announcements");
    const unsub = onValue(annRef, (snap) => {
      const data = snap.val() || {};
      setAnnouncements(Object.entries(data).map(([id, val]) => ({ id, ...val })));
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <h2>Announcements</h2>
      {announcements.map((a) => (
        <div key={a.id}>
          <h4>{a.title}</h4>
          <p>{a.body}</p>
          <small>{a.date}</small>
        </div>
      ))}
    </div>
  );
}
