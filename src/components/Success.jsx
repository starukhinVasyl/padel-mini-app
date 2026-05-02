function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function Success({ booking }) {
  return (
    <div className="success">
      <div className="success-icon">✅</div>
      <h2 className="success-title">Booking Created!</h2>
      <p className="success-subtitle">Your court has been reserved</p>

      <div className="success-card">
        <div className="success-row">
          <span className="success-label">Date</span>
          <span className="success-value">{formatDate(booking.date)}</span>
        </div>
        <div className="success-row">
          <span className="success-label">Time</span>
          <span className="success-value">{booking.time}</span>
        </div>
        <div className="success-row">
          <span className="success-label">Court</span>
          <span className="success-value">Court {booking.court}</span>
        </div>
      </div>

      <p className="success-note">The booking has been posted to the group 🎾</p>
    </div>
  )
}
