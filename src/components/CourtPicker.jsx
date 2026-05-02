function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function CourtPicker({ onSelect, booking }) {
  return (
    <div className="section">
      <div className="section-title">Select a court</div>

      <div className="booking-summary">
        <div className="summary-row">
          <span className="summary-icon">📅</span>
          <span>{formatDate(booking.date)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-icon">🕐</span>
          <span>{booking.time}</span>
        </div>
      </div>

      <div className="court-grid">
        {[1, 2].map(court => (
          <button
            key={court}
            className={`court-card ${booking.court === court ? 'selected' : ''}`}
            onClick={() => onSelect(court)}
          >
            <div className="court-icon">🏟</div>
            <div className="court-name">Court {court}</div>
            <div className="court-spots">4 spots</div>
          </button>
        ))}
      </div>
    </div>
  )
}
