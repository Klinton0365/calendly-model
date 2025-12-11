import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { format } from "date-fns";
import BookingForm from "../components/BookingForm";

export default function Schedule() {
  const { eventId } = useParams();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSlots(date);
  }, [date]);

  async function fetchSlots(d) {
    setMessage(null);
    setLoadingSlots(true);
    try {
      const res = await api.get("/availability", { params: { date: d } });
      // backend returns slots: [{start_time,end_time,status}]
      setSlots(res.data.slots || []);
    } catch (err) {
      console.error(err);
      setSlots([]);
      setMessage({ type: "error", text: "Could not load slots. Make sure backend is running." });
    } finally {
      setLoadingSlots(false);
      setSelected(null);
    }
  }

  return (
    <div className="container">
      <h2>30 Minute Meeting</h2>
      <div className="schedule-grid">
        <div className="panel">
          <div>
            <div style={{fontSize:13,color:"#374151"}}>Select a date</div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{marginTop:8}}
            />
          </div>

          <div style={{marginTop:16}}>
            <div style={{fontSize:13,color:"#374151"}}>Available slots</div>

            {loadingSlots ? <p className="note">Loading slots…</p> : null}
            {!loadingSlots && slots.length === 0 && <p className="note">No slots available on this date.</p>}

            <div className="slots-grid" style={{marginTop:8}}>
              {slots.map((s) => {
                const isBooked = s.status === "booked";
                const isSelected = selected && selected.start_time === s.start_time;
                return (
                  <div
                    key={s.start_time}
                    className={`slot ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                    onClick={() => !isBooked && setSelected(s)}
                  >
                    {s.start_time} – {s.end_time} {isBooked ? " (Booked)" : ""}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="panel">
          {!selected && <p className="note">Pick a time slot to continue</p>}
          {selected && (
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:13,color:"#374151"}}>You're booking</div>
                  <div style={{fontWeight:600}}>{format(new Date(date), "PPPP")} • {selected.start_time}</div>
                </div>
              </div>

              <BookingForm
                date={date}
                slot={selected}
                onBooked={(result) => {
                  if (result.success) {
                    setMessage({type: "success", text: result.message});
                    // refresh slots to show booked state
                    fetchSlots(date);
                    setSelected(null);
                  } else {
                    setMessage({type: "error", text: result.message});
                  }
                }}
              />
            </>
          )}

          {message && (
            <div style={{marginTop:12, padding:10, borderRadius:8, background: message.type === "success" ? "#ecfdf5" : "#fff5f5", border: message.type === "success" ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
              <strong>{message.type === "success" ? "Success" : "Error"}</strong>
              <div style={{marginTop:6}}>{message.text}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
