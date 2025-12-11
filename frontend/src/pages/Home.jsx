import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  function goSchedule() {
    navigate("/schedule/1"); // eventId=1 for now
  }

  return (
    <div className="container">
      <h2>Scheduling</h2>

      <div style={{marginTop:16}} className="event-card">
        <div className="event-left"></div>

        <div className="event-main">
          <h3 className="event-title">30 Minute Meeting</h3>
          <p className="event-meta">30 min • One-on-One • Weekdays, 9 am - 5 pm</p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button className="primary" onClick={goSchedule}>Schedule</button>
          <button style={{padding:"8px 10px", borderRadius:8, border:"1px solid var(--border)", background:"#fff"}} onClick={() => navigator.clipboard?.writeText(window.location.href)}>Copy link</button>
        </div>
      </div>

      <p style={{marginTop:18}} className="note">Click <strong>Schedule</strong> to pick date & time.</p>
    </div>
  );
}
