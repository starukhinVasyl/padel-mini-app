import { useState } from 'react'

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function Calendar({ onSelect, selectedDate }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    d.setDate(1)
    return d
  })

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Monday-based week offset
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const days = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1)
    const now = new Date()
    now.setDate(1)
    now.setHours(0, 0, 0, 0)
    if (d >= now) setViewDate(d)
  }

  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const handleDay = (day) => {
    if (!day) return
    const date = new Date(year, month, day)
    if (date < today) return
    const iso = date.toISOString().split('T')[0]
    onSelect(iso)
  }

  const isSelected = (day) => {
    if (!day || !selectedDate) return false
    const date = new Date(year, month, day)
    return date.toISOString().split('T')[0] === selectedDate
  }

  const isToday = (day) => {
    if (!day) return false
    const date = new Date(year, month, day)
    return date.getTime() === today.getTime()
  }

  const isPast = (day) => {
    if (!day) return false
    const date = new Date(year, month, day)
    return date < today
  }

  const isPrevDisabled = () => {
    const prev = new Date(year, month - 1, 1)
    const now = new Date()
    now.setDate(1)
    now.setHours(0, 0, 0, 0)
    return prev < now
  }

  return (
    <div className="section">
      <div className="section-title">Select a date</div>

      <div className="calendar">
        <div className="cal-nav">
          <button
            className="cal-nav-btn"
            onClick={prevMonth}
            disabled={isPrevDisabled()}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="cal-month">{MONTHS[month]} {year}</span>
          <button className="cal-nav-btn" onClick={nextMonth}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="cal-grid">
          {DAYS.map(d => (
            <div key={d} className="cal-day-name">{d}</div>
          ))}
          {days.map((day, i) => (
            <button
              key={i}
              className={[
                'cal-day',
                !day ? 'empty' : '',
                isPast(day) ? 'past' : '',
                isToday(day) ? 'today' : '',
                isSelected(day) ? 'selected' : '',
              ].join(' ')}
              onClick={() => handleDay(day)}
              disabled={!day || isPast(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
