import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import { UserService } from '../../lib/userService'
import Head from 'next/head'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [provider, setProvider] = useState<string>('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!supabase) {
          setStatus('error')
          setMessage('Authentifizierung ist derzeit nicht verfügbar.')
          return
        }

        // Prüfe Hash-Parameter für OAuth-Callback (Google, Apple)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        // Apple-spezifische Parameter
        const idToken = hashParams.get('id_token')
        const state = hashParams.get('state')

        console.log('🔍 Hash parameters found:')
        console.log('- access_token:', !!accessToken)
        console.log('- refresh_token:', !!refreshToken)
        console.log('- id_token:', !!idToken)
        console.log('- state:', !!state)

        if (accessToken || idToken) {
          console.log('🔍 OAuth callback detected with hash parameters')
          
          // OAuth-Callback mit Hash-Parametern
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken || '',
            refresh_token: refreshToken || ''
          })

          if (error) {
            console.error('❌ OAuth session error:', error)
            setStatus('error')
            setMessage('OAuth-Authentifizierung fehlgeschlagen: ' + error.message)
            return
          }

          if (data.session) {
            await handleSuccessfulAuth(data.session)
            return
          }
        }

        // Fallback: Prüfe bestehende Session (Magic Link, etc.)
        console.log('🔍 Checking existing session...')
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Session error:', error)
          setStatus('error')
          setMessage('Authentifizierung fehlgeschlagen: ' + error.message)
          return
        }

        if (data.session) {
          await handleSuccessfulAuth(data.session)
          return
        }

        // Keine Session gefunden - möglicherweise Apple OAuth Problem
        console.error('❌ No session found')
        
        // Prüfe URL-Parameter für Apple-spezifische Fehler
        const urlParams = new URLSearchParams(window.location.search)
        const errorParam = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        
        if (errorParam) {
          console.error('❌ Apple OAuth error:', errorParam, errorDescription)
          setStatus('error')
          setMessage(`Apple Sign-In Fehler: ${errorDescription || errorParam}`)
          return
        }
        
        setStatus('error')
        setMessage('Keine gültige Sitzung gefunden. Bitte versuchen Sie es erneut.')

      } catch (error) {
        console.error('❌ Auth callback error:', error)
        setStatus('error')
        setMessage('Ein unerwarteter Fehler ist aufgetreten.')
      }
    }

    const handleSuccessfulAuth = async (session: any) => {
      try {
        // Setze Login-Status für Dashboard-Zugriff
        localStorage.setItem('cardl-login', 'true')
        
        const user = session.user
        const providerType = user.app_metadata?.provider || 'unknown'
        
        console.log('🔍 User data:', user)
        console.log('🔍 Provider:', providerType)
        
        setProvider(providerType)
        
        // Erstelle oder aktualisiere Benutzerprofil
        try {
          const existingProfile = await UserService.getUserProfile(user.id)
          console.log('🔍 Existing profile:', existingProfile)
          
          if (!existingProfile) {
            console.log('🆕 Creating new user profile...')
            // Erstelle neues Benutzerprofil
            const newProfile = await UserService.createUserProfile({
              user_id: user.id,
              email: user.email || '',
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
              avatar_url: user.user_metadata?.avatar_url,
              provider: providerType as 'google' | 'apple' | 'email'
            })
            console.log('✅ New profile created:', newProfile)
          } else {
            console.log('✅ Profile already exists:', existingProfile)
          }
        } catch (error) {
          console.error('❌ Error creating user profile:', error)
          // Trotzdem weiterleiten, auch wenn Profil-Erstellung fehlschlägt
        }
        
        setStatus('success')
        setMessage(`🎉 ${providerType === 'google' ? 'Google' : providerType === 'apple' ? 'Apple' : 'E-Mail'}-Anmeldung erfolgreich! Sie werden zum Dashboard weitergeleitet...`)
        
        // Nach 2 Sekunden zum Dashboard weiterleiten
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
        
      } catch (error) {
        console.error('❌ Error in successful auth:', error)
        setStatus('error')
        setMessage('Fehler beim Verarbeiten der Anmeldung.')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <>
      <Head>
        <title>Anmeldung - cardl.io</title>
      </Head>
      
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          background: 'rgba(255,255,255,.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,.2)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%'
        }}>
          {status === 'loading' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
              <h2 style={{ color: '#e5e7eb', marginBottom: '10px' }}>Anmeldung läuft...</h2>
              <p style={{ color: '#d1d5db' }}>Bitte warten Sie, während wir Sie anmelden.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
              <h2 style={{ color: '#e5e7eb', marginBottom: '10px' }}>
                {provider === 'google' ? 'Google' : provider === 'apple' ? 'Apple' : 'E-Mail'}-Anmeldung erfolgreich!
              </h2>
              <p style={{ color: '#d1d5db' }}>{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
              <h2 style={{ color: '#e5e7eb', marginBottom: '10px' }}>Anmeldung fehlgeschlagen</h2>
              <p style={{ color: '#d1d5db', marginBottom: '20px' }}>{message}</p>
              <button
                onClick={() => router.push('/auth/login')}
                style={{
                  background: 'rgba(37,99,235,.8)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Zurück zum Login
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
