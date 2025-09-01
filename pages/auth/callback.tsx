import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import { UserService } from '../../lib/userService'
import Head from 'next/head'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!supabase) {
          setStatus('error')
          setMessage('Authentifizierung ist derzeit nicht verfügbar.')
          return
        }

        // Prüfe Hash-Parameter für OAuth-Callback
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (accessToken) {
          // OAuth-Callback mit Hash-Parametern
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          })

          if (error) {
            setStatus('error')
            setMessage('OAuth-Authentifizierung fehlgeschlagen: ' + error.message)
            return
          }

                  if (data.session) {
          // Setze Login-Status für Dashboard-Zugriff
          localStorage.setItem('cardl-login', 'true')
          
          // Erstelle oder aktualisiere Benutzerprofil
          try {
            const user = data.session.user
            const existingProfile = await UserService.getUserProfile(user.id)
            
            if (!existingProfile) {
              // Erstelle neues Benutzerprofil
              await UserService.createUserProfile({
                user_id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || user.user_metadata?.name,
                avatar_url: user.user_metadata?.avatar_url,
                provider: user.app_metadata?.provider as 'google' | 'apple' | 'email'
              })
            }
          } catch (error) {
            console.error('Error creating user profile:', error)
            // Trotzdem weiterleiten, auch wenn Profil-Erstellung fehlschlägt
          }
          
          setStatus('success')
          setMessage('🎉 Google-Anmeldung erfolgreich! Sie werden zum Dashboard weitergeleitet...')
          
          // Nach 2 Sekunden zum Dashboard weiterleiten
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
          return
        }
        }

        // Fallback: Prüfe bestehende Session
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setStatus('error')
          setMessage('Authentifizierung fehlgeschlagen: ' + error.message)
          return
        }

        if (data.session) {
          // Setze Login-Status für Dashboard-Zugriff
          localStorage.setItem('cardl-login', 'true')
          
          // Erstelle oder aktualisiere Benutzerprofil
          try {
            const user = data.session.user
            const existingProfile = await UserService.getUserProfile(user.id)
            
            if (!existingProfile) {
              // Erstelle neues Benutzerprofil
              await UserService.createUserProfile({
                user_id: user.id,
                email: user.email || '',
                full_name: user.user_metadata?.full_name || user.user_metadata?.name,
                avatar_url: user.user_metadata?.avatar_url,
                provider: user.app_metadata?.provider as 'google' | 'apple' | 'email'
              })
            }
          } catch (error) {
            console.error('Error creating user profile:', error)
            // Trotzdem weiterleiten, auch wenn Profil-Erstellung fehlschlägt
          }
          
          setStatus('success')
          setMessage('✅ Anmeldung erfolgreich! Sie werden zum Dashboard weitergeleitet...')
          
          // Nach 2 Sekunden zum Dashboard weiterleiten
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('❌ Keine gültige Sitzung gefunden. Bitte versuchen Sie es erneut.')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('❌ Ein unerwarteter Fehler ist aufgetreten.')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <>
      <Head>
        <title>Anmeldung - cardl.io</title>
        <meta name="description" content="cardl.io Authentifizierung" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          :root{
            --bg: #0b1220;
            --fg: #e5e7eb;
            --muted: #9ca3af;
            --primary: #2563eb;
            --accent: #16a34a;
            --card: rgba(255,255,255,0.06);
            --ring: rgba(37, 99, 235, .45);
          }
          *{box-sizing:border-box}
          html,body,#__next{height:100%}
          body{
            margin:0;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji;
            color:var(--fg);
            background: radial-gradient(1200px 600px at 70% -10%, rgba(37,99,235,.25), transparent 60%),
                        radial-gradient(1000px 600px at -10% 110%, rgba(22,163,74,.2), transparent 60%),
                        var(--bg);
          }
          a{color:inherit}
          .wrap{
            min-height:100%;
            display:grid;
            place-items:center;
            padding:48px 20px;
          }
          .card{
            width:min(480px, 100%);
            background:var(--card);
            backdrop-filter: blur(8px);
            border:1px solid rgba(255,255,255,.08);
            border-radius:24px;
            padding:32px;
            box-shadow: 0 10px 40px rgba(0,0,0,.35);
            text-align: center;
          }
          .logo{
            width:40px;height:40px;border-radius:12px;display:grid;place-items:center;
            background:linear-gradient(135deg, var(--primary), var(--accent));
            box-shadow: inset 0 0 0 1px rgba(255,255,255,.2);
            font-weight:800;
            margin: 0 auto 20px auto;
          }
          .chip{width:14px;height:10px;border:2px solid #fff;border-radius:2px;opacity:.9}
          .spinner{
            width: 40px;
            height: 40px;
            border: 4px solid rgba(37,99,235,.2);
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          h1{margin:12px 0 8px;font-size: clamp(20px, 4vw, 28px);color:var(--fg)}
          p{margin:0;color:var(--muted);line-height:1.6;font-size:14px}
          .btn{
            background:linear-gradient(135deg,var(--primary),#1d4ed8);
            color:white;border:none;border-radius:12px;padding:12px 20px;font-weight:600;cursor:pointer;
            text-decoration:none;display:inline-block;margin-top:16px;font-size:14px
          }
        `}</style>
      </Head>

      <div className="wrap">
        <div className="card">
          <div className="logo">
            <div className="chip" />
          </div>

          {status === 'loading' && (
            <>
              <div className="spinner"></div>
              <h1>🔐 Authentifizierung läuft...</h1>
              <p>Bitte warten Sie, während wir Sie anmelden.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                ✅
              </div>
              <h1>Anmeldung erfolgreich!</h1>
              <p style={{ marginBottom: '16px' }}>{message}</p>
              <a href="/dashboard" className="btn">
                🚀 Jetzt zum Dashboard
              </a>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '16px',
                color: '#ef4444'
              }}>
                ❌
              </div>
              <h1>Anmeldung fehlgeschlagen</h1>
              <p style={{ marginBottom: '16px' }}>{message}</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/auth/login" className="btn">
                  🔄 Erneut versuchen
                </a>
                <a href="/" className="btn" style={{ 
                  background: 'rgba(255,255,255,.1)',
                  border: '1px solid rgba(255,255,255,.2)'
                }}>
                  🏠 Startseite
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
