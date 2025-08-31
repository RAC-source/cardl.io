import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Prüfe Login-Status
    const isLoggedIn = localStorage.getItem('cardl-login') === 'true'
    if (!isLoggedIn) {
      router.push('/auth/login')
      return
    }

    // Simuliere User-Daten laden
    setTimeout(() => {
      setUserData({
        name: 'Beta Tester',
        email: 'tester@cardl.io',
        joinDate: '2025-01-15',
        status: 'active'
      })
      setIsLoading(false)
    }, 1000)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('cardl-login')
    router.push('/')
  }

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Dashboard - cardl.io</title>
          <meta name="description" content="cardl.io Dashboard - Ihr persönlicher Bereich" />
        </Head>
        <div className="wrap">
          <div className="card" style={{ textAlign: 'center', padding: '60px 32px' }}>
            <div style={{ fontSize: '24px', color: '#16a34a', marginBottom: '16px' }}>
              🔄 Lade Dashboard...
            </div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>
              Ihre Daten werden geladen
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard - cardl.io</title>
        <meta name="description" content="cardl.io Dashboard - Ihr persönlicher Bereich" />
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
            width:min(1200px, 100%);
            background:var(--card);
            backdrop-filter: blur(8px);
            border:1px solid rgba(255,255,255,.08);
            border-radius:24px;
            padding:32px;
            box-shadow: 0 10px 40px rgba(0,0,0,.35);
          }
          .top{
            display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:32px
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
          .hero{padding:16px 0 24px}
          h1{margin:12px 0 8px;font-size: clamp(28px, 5vw, 44px)}
          h2{margin:24px 0 16px;font-size: clamp(20px, 3vw, 28px);color:var(--primary)}
          h3{margin:20px 0 12px;font-size: clamp(18px, 2.5vw, 24px);color:var(--accent)}
          p{margin:0 0 16px;color:var(--muted);line-height:1.6}
          .content{text-align:left}
          .section{margin-bottom:32px}
          .grid{display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
          .stats-grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
          .stat-card{
            background:rgba(255,255,255,.05);
            border:1px solid rgba(255,255,255,.1);
            border-radius:16px;
            padding:20px;
            text-align:center
          }
          .stat-number{font-size:32px;font-weight:800;color:var(--accent);margin-bottom:8px}
          .stat-label{font-size:14px;color:var(--muted)}
          .feature-card{
            background:rgba(255,255,255,.05);
            border:1px solid rgba(255,255,255,.1);
            border-radius:16px;
            padding:20px;
            transition:all 0.2s ease
          }
          .feature-card:hover{
            background:rgba(255,255,255,.08);
            border-color:rgba(255,255,255,.2);
            transform:translateY(-2px)
          }
          .feature-icon{font-size:24px;margin-bottom:12px}
          .footer{margin-top:26px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;color:var(--muted);font-size:14px}
          .social{display:flex;gap:10px}
          .social a{border:1px solid rgba(255,255,255,.14);padding:8px 10px;border-radius:10px;text-decoration:none}
          .btn{
            display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border-radius:12px;
            text-decoration:none;font-weight:600;transition:all 0.2s ease
          }
          .btn-primary{
            background:linear-gradient(135deg,var(--primary),#1d4ed8);
            color:white;border:none
          }
          .btn-secondary{
            background:rgba(255,255,255,.1);
            color:var(--fg);border:1px solid rgba(255,255,255,.2)
          }
          .btn-danger{
            background:rgba(239,68,68,.1);
            color:#ef4444;border:1px solid rgba(239,68,68,.2)
          }
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
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                Willkommen, {userData?.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ cursor: 'pointer' }}
              >
                🚪 Ausloggen
              </button>
            </div>
          </div>

          <section className="hero">
            <h1 id="title">Dashboard</h1>
            <p>Ihr persönlicher Bereich für cardl.io - Hier können Sie Ihre Projekte verwalten und neue Karten erstellen.</p>
          </section>

          <div className="content">
            {/* Statistiken */}
            <div className="section">
              <h2>📊 Übersicht</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Erstellte Karten</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">0</div>
                  <div className="stat-label">Bestellungen</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">20%</div>
                  <div className="stat-label">Beta-Rabatt</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">∞</div>
                  <div className="stat-label">Entwürfe</div>
                </div>
              </div>
            </div>

            {/* Hauptfunktionen */}
            <div className="section">
              <h2>🚀 Schnellstart</h2>
              <div className="grid">
                <div className="feature-card">
                  <div className="feature-icon">🎨</div>
                  <h3>Karten-Editor</h3>
                  <p>Erstellen Sie Ihre eigenen personalisierten Ausweiskarten mit unserem intuitiven Editor.</p>
                  <a href="/editor" className="btn btn-primary" style={{ marginTop: '16px' }}>
                    Editor öffnen →
                  </a>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">📋</div>
                  <h3>Meine Projekte</h3>
                  <p>Verwalten Sie Ihre gespeicherten Entwürfe und Bestellungen an einem Ort.</p>
                  <a href="/projects" className="btn btn-secondary" style={{ marginTop: '16px' }}>
                    Projekte anzeigen →
                  </a>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">🛒</div>
                  <h3>Bestellungen</h3>
                  <p>Verfolgen Sie den Status Ihrer Bestellungen und laden Sie Ihre Karten herunter.</p>
                  <a href="/orders" className="btn btn-secondary" style={{ marginTop: '16px' }}>
                    Bestellungen →
                  </a>
                </div>
              </div>
            </div>

            {/* Beta-Features */}
            <div className="section">
              <h2>🧪 Beta-Features</h2>
              <div className="grid">
                <div className="feature-card">
                  <div className="feature-icon">🔧</div>
                  <h3>API-Zugang</h3>
                  <p>Testen Sie unsere API für automatisierte Karten-Erstellung und Bulk-Orders.</p>
                  <a href="/api/docs" className="btn btn-secondary" style={{ marginTop: '16px' }}>
                    API-Docs →
                  </a>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">📱</div>
                  <h3>Mobile App</h3>
                  <p>Erste Einblicke in unsere mobile App für iOS und Android (Coming Soon).</p>
                  <a href="/mobile" className="btn btn-secondary" style={{ marginTop: '16px' }}>
                    Mobile Preview →
                  </a>
                </div>
                
                <div className="feature-card">
                  <div className="feature-icon">🎯</div>
                  <h3>Feedback</h3>
                  <p>Teilen Sie uns Ihre Erfahrungen mit und helfen Sie uns, cardl.io zu verbessern.</p>
                  <a href="/feedback" className="btn btn-secondary" style={{ marginTop: '16px' }}>
                    Feedback geben →
                  </a>
                </div>
              </div>
            </div>

            {/* Entwicklungsstatus */}
            <div className="section">
              <h2>📈 Entwicklungsstatus</h2>
              <div style={{ 
                background: 'rgba(22,163,74,.1)', 
                border: '1px solid rgba(22,163,74,.2)', 
                borderRadius: '16px', 
                padding: '20px' 
              }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#16a34a' }}>
                  🎉 Beta-Phase aktiv
                </h3>
                <p style={{ margin: '0 0 16px 0' }}>
                  Sie sind einer der ersten Nutzer von cardl.io! Als Beta-Tester haben Sie exklusiven Zugang zu neuen Features und erhalten 20% Rabatt auf Ihre erste Bestellung.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a href="/api/test-db" className="btn btn-secondary">
                    🗄️ DB Test
                  </a>
                  <a href="/api/test-email" className="btn btn-secondary">
                    📧 Email Test
                  </a>
                  <a href="/api/stripe/create-checkout" className="btn btn-secondary">
                    💳 Stripe Test
                  </a>
                </div>
              </div>
            </div>
          </div>

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
