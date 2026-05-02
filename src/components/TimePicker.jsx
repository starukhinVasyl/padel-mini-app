const HOURS = []
for (let h = 7; h <= 21; h++) {
  HOURS.push(`${String(h).padStart(2, '0')}:00`)
}

function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function TimePicker({ onSelect, selectedTime, selectedDate }) {
  return (
    <div className="section">
      <div className="section-title">Select a time</div>
      {selectedDate && (
        <div className="section-subtitle">{formatDate(selectedDate)}</div>
      )}
      <div className="time-grid">
        {HOURS.map(time => (
          <button
            key={time}
            className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
            onClick={() => onSelect(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )
}