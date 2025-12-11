export default function EventCard({ title, duration, onClick }) {
  return (
    <div className="event-card" onClick={onClick}>
      <div className="event-left-border"></div>

      <div className="event-content">
        <h3>{title}</h3>
        <p>{duration}</p>
      </div>

      <button className="copy-btn">Copy link</button>
    </div>
  );
}
