import { useState } from 'react'
import { useRouter } from 'next/router'

interface LoginFormProps {
  onLoginSuccess?: () => void
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAccessProtectedArea = async () => {
    setIsLoading(true)
    
    // Simuliere kurze Verzögerung
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Direkte Weiterleitung zur Login-Seite
    router.push('/auth/login')
  }

  return (
    <div style={{ margin: '20px 0' }}>
      <button
        onClick={handleAccessProtectedArea}
        disabled={isLoading}
        style={{
          background: 'linear-gradient(135deg, #16a34a, #15803d)',
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
        {isLoading ? '🔄 Weiterleitung...' : '🔐 Geschützten Bereich öffnen'}
      </button>
      
      <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,.05)', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
          <strong>Beta-Zugang:</strong> Nur für eingeladene Tester verfügbar
        </p>
      </div>
    </div>
  )
}
