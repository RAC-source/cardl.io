import Head from 'next/head'

export default function ImpressumPage() {
  return (
    <>
      <Head>
        <title>Impressum - cardl.io</title>
        <meta name="description" content="Impressum und rechtliche Informationen von cardl.io" />
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
            width:min(880px, 100%);
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
          .hero{padding:16px 0 8px}
          h1{margin:12px 0 8px;font-size: clamp(28px, 5vw, 44px)}
          h2{margin:24px 0 16px;font-size: clamp(20px, 3vw, 28px);color:var(--primary)}
          h3{margin:20px 0 12px;font-size: clamp(18px, 2.5vw, 24px);color:var(--accent)}
          p{margin:0 0 16px;color:var(--muted);line-height:1.6}
          .content{text-align:left}
          .section{margin-bottom:32px}
          .contact-info{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:20px;margin:20px 0}
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
            <h1 id="title">Impressum</h1>
            <p>Rechtliche Informationen und Kontaktdaten von cardl.io</p>
          </section>

          <div className="content">
            <div className="section">
              <h2>Angaben gemäß § 5 TMG</h2>
              <p>
                <strong>Betreiber der Website:</strong><br />
                cardl.io<br />
                [Ihr Name]<br />
                [Ihre Straße und Hausnummer]<br />
                [PLZ und Ort]
              </p>
            </div>

            <div className="section">
              <h2>Kontakt</h2>
              <div className="contact-info">
                <p><strong>E-Mail:</strong> hello@cardl.io</p>
                <p><strong>Website:</strong> https://cardl.io</p>
                <p><strong>Geschäftszeiten:</strong> Mo-Fr 9:00-18:00 Uhr</p>
              </div>
            </div>

            <div className="section">
              <h2>Unternehmen</h2>
              <p>
                <strong>Geschäftsführer:</strong> [Ihr Name]<br />
                <strong>Umsatzsteuer-ID:</strong> [Ihre USt-ID]<br />
                <strong>Handelsregister:</strong> [Register und Nummer]<br />
                <strong>Registergericht:</strong> [Gericht]
              </p>
            </div>

            <div className="section">
              <h2>Inhaltlich Verantwortlicher</h2>
              <p>
                <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br />
                [Ihr Name]<br />
                [Ihre Adresse]
              </p>
            </div>

            <div className="section">
              <h2>Haftungsausschluss</h2>
              <h3>Haftung für Inhalte</h3>
              <p>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
              </p>

              <h3>Haftung für Links</h3>
              <p>
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
              </p>

              <h3>Urheberrecht</h3>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>

            <div className="section">
              <h2>Datenschutz</h2>
              <p>
                Informationen zum Datenschutz finden Sie in unserer{' '}
                <a href="/datenschutz" style={{color:'var(--primary)',textDecoration:'underline'}}>
                  Datenschutzerklärung
                </a>.
              </p>
            </div>

            <div className="section">
              <h2>Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{color:'var(--primary)',textDecoration:'underline'}}>
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>
          </div>

          <div className="footer">
            <div>© {new Date().getFullYear()} cardl.io • All rights reserved</div>
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
