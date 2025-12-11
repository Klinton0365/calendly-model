import React, { useState } from "react";
import api from "../api";

export default function BookingForm({ date, slot, onBooked }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        visitor_name: name,
        visitor_email: email,
      };
      const res = await api.post("/bookings", payload);
      onBooked({ success: true, message: res.data.message || "Booking confirmed", booking: res.data.booking });
      setName(""); setEmail("");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Could not complete booking.";
      onBooked({ success: false, message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="form-row">
      <label>Name</label>
      <input required type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your full name" />

      <label>Email</label>
      <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />

      <button className="primary" type="submit" disabled={loading}>{loading ? "Booking..." : "Confirm booking"}</button>
    </form>
  );
}
