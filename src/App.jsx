import { useState, useEffect } from 'react'
import Calendar from './components/Calendar'
import TimePicker from './components/TimePicker'
import CourtPicker from './components/CourtPicker'
import ParticipantPicker from './components/ParticipantPicker'
import Success from './components/Success'
import './App.css'

const STEPS = ['date', 'time', 'court', 'participants', 'success']

export default function App() {
  const [step, setStep] = useState('date')
  const [booking, setBooking] = useState({ date: null, time: null, court: null })
  const [tg, setTg] = useState(null)
  const [members, setMembers] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    const telegram = window.Telegram?.WebApp
    if (telegram) {
      telegram.ready()
      telegram.expand()
      setTg(telegram)

      const user = telegram.initDataUnsafe?.user
      if (user) setCurrentUserId(user.id)

      const startParam = telegram.initDataUnsafe?.start_param
      if (startParam) {
        try {
          const decoded = JSON.parse(atob(startParam))
          if (decoded.members) setMembers(decoded.members)
        } catch (e) {
          console.log('No members in startParam')
        }
      }
    }
  }, [])

  const handleDateSelect = (date) => {
    setBooking(b => ({ ...b, date }))
    setStep('time')
  }

  const handleTimeSelect = (time) => {
    setBooking(b => ({ ...b, time }))
    setStep('court')
  }

  const handleCourtSelect = (court) => {
    setBooking(b => ({ ...b, court }))
    setStep('participants')
  }

  const handleConfirm = (invited) => {
    const final = {
      ...booking,
      invited: invited.map(m => ({ user_id: m.user_id, username: m.username }))
    }
    if (tg) {
      tg.sendData(JSON.stringify({ type: 'create_booking', ...final }))
    } else {
      console.log('Booking:', final)
    }
    setStep('success')
  }

  const handleBack = () => {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          {step !== 'date' && step !== 'success' && (
            <button className="back-btn" onClick={handleBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <div className="header-title">
            <span className="header-emoji">🎾</span>
            <span>Padel Booking</span>
          </div>
        </div>
        <StepIndicator step={step} />
      </header>

      <main className="app-main">
        {step === 'date' && (
          <Calendar onSelect={handleDateSelect} selectedDate={booking.date} />
        )}
        {step === 'time' && (
          <TimePicker
            onSelect={handleTimeSelect}
            selectedTime={booking.time}
            selectedDate={booking.date}
          />
        )}
        {step === 'court' && (
          <CourtPicker
            onSelect={handleCourtSelect}
            booking={booking}
          />
        )}
        {step === 'participants' && (
          <ParticipantPicker
            members={members}
            currentUserId={currentUserId}
            onConfirm={handleConfirm}
            booking={booking}
          />
        )}
        {step === 'success' && (
          <Success booking={booking} />
        )}
      </main>
    </div>
  )
}

function StepIndicator({ step }) {
  const steps = [
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'court', label: 'Court' },
    { key: 'participants', label: 'Players' },
  ]
  const activeIdx = steps.findIndex(s => s.key === step)
  if (step === 'success') return null

  return (
    <div className="step-indicator">
      {steps.map((s, i) => (
        <div key={s.key} className={`step-item ${i <= activeIdx ? 'active' : ''}`}>
          <div className="step-dot" />
          <span className="step-label">{s.label}</span>
          {i < steps.length - 1 && <div className={`step-line ${i < activeIdx ? 'active' : ''}`} />}
        </div>
      ))}
    </div>
  )
}