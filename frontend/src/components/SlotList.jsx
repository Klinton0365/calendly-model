export default function SlotList({ slots, selectedSlot, onSelectSlot }) {
  if (!slots.length) {
    return <p>No slots for this date.</p>;
  }

  return (
    <div className="field">
      <label>Available time slots</label>
      <div className="slots-grid">
        {slots.map((slot) => {
          const disabled = slot.status === "booked";
          const isSelected =
            selectedSlot &&
            selectedSlot.start_time === slot.start_time &&
            selectedSlot.date === slot.date;

          return (
            <button
              key={slot.start_time}
              disabled={disabled}
              className={`slot-btn ${
                isSelected ? "selected" : ""
              } ${disabled ? "booked" : "open"}`}
              onClick={() =>
                !disabled &&
                onSelectSlot({
                  ...slot,
                  date: slot.date, // add date if you want
                })
              }
            >
              {slot.start_time} – {slot.end_time}
              {disabled && " (Booked)"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
