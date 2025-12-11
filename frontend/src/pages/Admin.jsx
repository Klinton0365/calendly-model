import React, { useEffect, useState } from "react";
import api from "../api";
import "./admin.css"; // separate CSS file for neat UI

export default function Admin() {
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = ["S","M","T","W","T","F","S"];

  useEffect(() => {
    fetchWeeklyAvailability();
  }, []);

  async function fetchWeeklyAvailability() {
    try {
      const res = await api.get("/admin/weekly");
      setWeekly(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  function addInterval(dayIndex) {
    setWeekly(prev => [
      ...prev,
      {
        id: null,
        day_of_week: dayIndex,
        start_time: "09:00",
        end_time: "17:00",
      }
    ]);
  }

  function deleteInterval(id) {
    setWeekly(prev => prev.filter(w => w.id !== id));
    if (id) api.delete(`/admin/weekly/${id}`);
  }

  function duplicateInterval(entry) {
    const newEntry = {
      id: null,
      day_of_week: entry.day_of_week,
      start_time: entry.start_time,
      end_time: entry.end_time,
    };
    setWeekly(prev => [...prev, newEntry]);
  }

  function updateEntry(id, field, value) {
    setWeekly(prev =>
      prev.map(w =>
        w.id === id ? { ...w, [field]: value } : w
      )
    );
  }

  async function saveAll() {
    await api.post("/admin/weekly/save", { weekly });
    fetchWeeklyAvailability();
    alert("Availability saved!");
  }

  return (
    <div className="container-admin">
      <h2>Availability</h2>

      <div className="tabs">
        <button className="active">Schedules</button>
        <button>Calendar settings</button>
        <button>Advanced settings</button>
      </div>

      {loading ? <p>Loading…</p> : null}

      <div className="weekly-hours-section">
        <h3>Weekly hours</h3>
        <p className="desc">Set when you are typically available for meetings</p>

        <div className="weekly-list">
          {days.map((d, idx) => {
            const intervals = weekly.filter(w => w.day_of_week === idx);

            return (
              <div key={idx} className="weekly-row">
                <div className="day-badge">{d}</div>

                <div className="intervals">
                  {intervals.map((item) => (
                    <div key={item.id ?? Math.random()} className="interval-row">
                      
                      <input
                        type="time"
                        value={item.start_time}
                        onChange={(e) =>
                          updateEntry(item.id, "start_time", e.target.value)
                        }
                      />

                      <span> - </span>

                      <input
                        type="time"
                        value={item.end_time}
                        onChange={(e) =>
                          updateEntry(item.id, "end_time", e.target.value)
                        }
                      />

                      <button className="icon-btn delete" onClick={() => deleteInterval(item.id)}>
                        ✕
                      </button>
                      <button className="icon-btn" onClick={() => addInterval(idx)}>
                        ＋
                      </button>
                      <button className="icon-btn" onClick={() => duplicateInterval(item)}>
                        📄
                      </button>
                    </div>
                  ))}

                  {intervals.length === 0 && (
                    <button className="add-btn" onClick={() => addInterval(idx)}>
                      + Add hours
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="primary" onClick={saveAll}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
