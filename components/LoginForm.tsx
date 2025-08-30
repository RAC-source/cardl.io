import { useState } from 'react'

interface LoginFormProps {
  onLoginSuccess: () => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [password, setPassword] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Auth Code festlegen (kann später in env vars verschoben werden)
  const VALID_AUTH_CODE = 'CARDL2025'
  const VALID_PASSWORD = 'demo123'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simuliere API-Call
    await new Promise(resolve => setTimeout(resolve, 800))

    if (password === VALID_PASSWORD && authCode === VALID_AUTH_CODE) {
      // Erfolgreicher Login
      localStorage.setItem('cardl-login', 'true')
      onLoginSuccess()
    } else {
      setError('Ungültige Anmeldedaten oder Auth Code')
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('cardl-login')
    setShowForm(false)
    setPassword('')
    setAuthCode('')
    setError('')
  }

  // Prüfe ob bereits eingeloggt
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('cardl-login') === 'true'

  if (isLoggedIn) {
    return (
      <div style={{
        background: 'rgba(22,163,74,.1)',
        border: '1px solid rgba(22,163,74,.2)',
        borderRadius: '12px',
        padding: '16px',
        margin: '20px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <strong style={{ color: '#16a34a' }}>✅ Eingeloggt</strong>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239,68,68,.1)',
              border: '1px solid rgba(239,68,68,.2)',
              color: '#ef4444',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Ausloggen
          </button>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>
          Sie haben Zugriff auf den geschützten Bereich.
        </p>
      </div>
    )
  }

  if (!showForm) {
    return (
      <div style={{ margin: '20px 0' }}>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 20px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔐 Geschützten Bereich öffnen
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(37,99,235,.1)',
      border: '1px solid rgba(37,99,235,.2)',
      borderRadius: '16px',
      padding: '24px',
      margin: '20px 0'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#2563eb', fontSize: '18px' }}>
          🔐 Geschützter Bereich
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>
          Geben Sie Ihr Passwort und den Auth Code ein, um Zugang zu erhalten.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#e5e7eb' }}>
            Passwort
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.18)',
              color: '#e5e7eb',
              borderRadius: '12px',
              padding: '12px 16px',
              outline: 'none',
              fontSize: '14px'
            }}
            placeholder="Ihr Passwort"
          />
        </div>

        <div>
          <label htmlFor="authCode" style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#e5e7eb' }}>
            Auth Code
          </label>
          <input
            id="authCode"
            type="text"
            value={authCode}
            onChange={(e) => setAuthCode(e.target.value)}
            required
            style={{
              width: '100%',
              background: 'rgba(255,255,255,.08)',
              border: '1px solid rgba(255,255,255,.18)',
              color: '#e5e7eb',
              borderRadius: '12px',
              padding: '12px 16px',
              outline: 'none',
              fontSize: '14px'
            }}
            placeholder="Auth Code eingeben"
          />
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,.1)',
            border: '1px solid rgba(239,68,68,.2)',
            color: '#ef4444',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? '🔐 Prüfe...' : '🔐 Anmelden'}
          </button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,.2)',
              color: '#9ca3af',
              borderRadius: '12px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Abbrechen
          </button>
        </div>
      </form>

      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,.05)', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
          <strong>Demo-Zugang:</strong> Passwort: demo123 | Auth Code: CARDL2025
        </p>
      </div>
    </div>
  )
}
