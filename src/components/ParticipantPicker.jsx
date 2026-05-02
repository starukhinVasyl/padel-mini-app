import { useState } from 'react'

export default function ParticipantPicker({ members, currentUserId, onConfirm, booking }) {
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')

  const available = members.filter(m => m.user_id !== currentUserId)
  const filtered = available.filter(m =>
    m.full_name.toLowerCase().includes(search.toLowerCase()) ||
    m.username.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (member) => {
    const already = selected.find(s => s.user_id === member.user_id)
    if (already) {
      setSelected(selected.filter(s => s.user_id !== member.user_id))
    } else {
      if (selected.length >= 3) return
      setSelected([...selected, member])
    }
  }

  const isSelected = (member) => selected.some(s => s.user_id === member.user_id)

  function formatDate(iso) {
    if (!iso) return ''
    const [y, m, d] = iso.split('-')
    const date = new Date(y, m - 1, d)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="section">
      <div className="section-title">Invite players</div>
      <div className="section-subtitle">Optional · max 3 more</div>

      <div className="booking-summary">
        <div className="summary-row">
          <span className="summary-icon">📅</span>
          <span>{formatDate(booking.date)} at {booking.time}</span>
        </div>
        <div className="summary-row">
          <span className="summary-icon">🏟</span>
          <span>Court {booking.court}</span>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="selected-chips">
          {selected.map(m => (
            <div key={m.user_id} className="chip" onClick={() => toggle(m)}>
              <span>{m.full_name}</span>
              <span className="chip-remove">×</span>
            </div>
          ))}
        </div>
      )}

      <div className="search-box">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="search-icon">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="members-list">
        {filtered.length === 0 && (
          <div className="members-empty">
            {available.length === 0
              ? 'No other members found yet.\nThey need to send a message in the group first.'
              : 'No results found'}
          </div>
        )}
        {filtered.map(member => (
          <div
            key={member.user_id}
            className={`member-row ${isSelected(member) ? 'selected' : ''} ${selected.length >= 3 && !isSelected(member) ? 'disabled' : ''}`}
            onClick={() => toggle(member)}
          >
            <div className="member-avatar">
              {member.full_name[0].toUpperCase()}
            </div>
            <div className="member-info">
              <div className="member-name">{member.full_name}</div>
              <div className="member-username">{member.username}</div>
            </div>
            <div className="member-check">
              {isSelected(member) && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="var(--tg-accent)"/>
                  <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        className="confirm-btn"
        onClick={() => onConfirm(selected)}
      >
        {selected.length > 0 ? `Create booking with ${selected.length + 1} players` : 'Create booking'}
      </button>
    </div>
  )
}