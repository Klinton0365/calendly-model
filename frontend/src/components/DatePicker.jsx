import axios from "axios";
import { format } from "date-fns";

const API_BASE = "http://localhost:8000/api";

export default function DatePicker({
  selectedDate,
  onDateChange,
  onSlotsLoaded,
  setError,
  setLoading,
}) {
  const handleChange = async (e) => {
    const date = e.target.value; // yyyy-mm-dd
    onDateChange(date);
    if (!date) return;

    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${API_BASE}/availability`, {
        params: { date },
      });
      onSlotsLoaded(res.data.slots || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load availability. Please try again.");
      onSlotsLoaded([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="field">
      <label>Select a date</label>
      <input
        type="date"
        value={selectedDate || ""}
        onChange={handleChange}
      />
    </div>
  );
}
