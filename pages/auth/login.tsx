import AuthForm from '../../components/AuthForm'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasBetaAccess, setHasBetaAccess] = useState(false)

  useEffect(() => {
    // Prüfe Beta-Zugang
    const betaAccess = localStorage.getItem('cardl-beta-access')
    if (betaAccess !== 'true') {
      // Kein Beta-Zugang - zurück zur Startseite
      router.push('/')
      return
    }
    setHasBetaAccess(true)

    // Prüfe Login-Status
    const loginStatus = localStorage.getItem('cardl-login')
    if (loginStatus === 'true') {
      setIsLoggedIn(true)
      // Automatische Weiterleitung zum Dashboard nach 2 Sekunden
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  }, [router])

  if (!hasBetaAccess) {
    return (
      <>
        <Head>
          <title>Zugriff verweigert - cardl.io</title>
          <meta name="description" content="cardl.io - Beta-Zugang erforderlich" />
        </Head>
        <div className="wrap">
          <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
            <div style={{ fontSize: '24px', color: '#ef4444', marginBottom: '16px' }}>
              🚫 Zugriff verweigert
            </div>
            <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
              Sie benötigen Beta-Zugang, um diese Seite zu besuchen.
            </div>
            <a 
              href="/" 
              style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: 'white',
                textDecoration: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                display: 'inline-block'
              }}
            >
              Zurück zur Startseite
            </a>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Anmelden - cardl.io</title>
        <meta name="description" content="Melden Sie sich bei cardl.io an" />
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
          }
          .top{
            display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:24px
          }
          .brand{display:flex;align-items:center;gap:12px;text-decoration:none}
          .logo{
            width:40px;height:40px;border-radius:12px;display:grid;place-items:center;
            background:linear-gradient(135deg, var(--primary), var(--accent));
            box-shadow: inset 0 0 0 1px rgba(255,255,255,.2);
            font-weight:800
          }
          .wordmark{font-weight:800;letter-spacing:.2px;font-size:20px}
          .chip{width:14px;height:10px;border:2px solid #fff;border-radius:2px;opacity:.9}
          .hero{padding:16px 0 8px;text-align:center}
          h1{margin:12px 0 8px;font-size: clamp(28px, 5vw, 44px)}
          p{margin:0;color:var(--muted);line-height:1.6}
          .footer{margin-top:26px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;color:var(--muted);font-size:14px}
          .social{display:flex;gap:10px}
          .social a{border:1px solid rgba(255,255,255,.14);padding:8px 10px;border-radius:10px;text-decoration:none}
        `}</style>
      </Head>

      <div className="wrap">
        <main className="card" role="main" aria-labelledby="title">
          <div className="top">
            <a className="brand" href="/" aria-label="cardl.io home">
              <div className="logo" aria-hidden>
                <div className="chip" />
              </div>
              <span className="wordmark">cardl.io</span>
            </a>
            <div>
              <a href="/" style={{padding:'10px 14px',borderRadius:'12px',border:'1px solid rgba(255,255,255,.14)',textDecoration:'none'}}>
                Zurück zur Startseite
              </a>
            </div>
          </div>

          <section className="hero">
            <h1 id="title">Anmelden</h1>
            <p>Erstellen Sie Ihre eigenen Karten und Druckerzeugnisse</p>
          </section>

          {isLoggedIn ? (
            <div style={{
              background: 'rgba(22,163,74,.1)',
              border: '1px solid rgba(22,163,74,.2)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              margin: '20px 0'
            }}>
              <div style={{ fontSize: '24px', color: '#16a34a', marginBottom: '16px' }}>
                ✅ Anmeldung erfolgreich!
              </div>
              <p style={{ margin: '0 0 20px 0', color: '#9ca3af' }}>
                Sie werden automatisch zum Dashboard weitergeleitet...
              </p>
              <a 
                href="/dashboard" 
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'inline-block'
                }}
              >
                🚀 Jetzt zum Dashboard →
              </a>
            </div>
          ) : (
            <AuthForm />
          )}

          <div className="footer">
            <div>© {new Date().getFullYear()} cardl.io • Beta Version</div>
            <div className="social" aria-label="Social Links">
              <a href="https://twitter.com/cardl_io" target="_blank" rel="noreferrer">Twitter/X</a>
              <a href="https://instagram.com/cardl.io" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
