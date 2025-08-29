import Head from 'next/head'

export default function DatenschutzPage() {
  return (
    <>
      <Head>
        <title>Datenschutzerklärung - cardl.io</title>
        <meta name="description" content="Datenschutzerklärung von cardl.io - Informationen zur Verarbeitung Ihrer personenbezogenen Daten" />
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
          .highlight{background:rgba(37,99,235,.1);border:1px solid rgba(37,99,235,.2);border-radius:12px;padding:16px;margin:16px 0}
          .warning{background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);border-radius:12px;padding:16px;margin:16px 0}
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
            <h1 id="title">Datenschutzerklärung</h1>
            <p>Informationen zur Verarbeitung Ihrer personenbezogenen Daten bei cardl.io</p>
          </section>

          <div className="content">
            <div className="section">
              <h2>1. Verantwortlicher für die Datenverarbeitung</h2>
              <p>
                <strong>r-projects UG (haftungsbeschränkt)</strong><br />
                Am Bahnhof 6<br />
                21357 Bardowick<br />
                Deutschland
              </p>
              <p>
                <strong>Kontakt:</strong><br />
                E-Mail: info@r-projects.eu<br />
                Telefon: +49 (0) 123 456789
              </p>
            </div>

            <div className="section">
              <h2>2. Allgemeine Informationen zur Datenverarbeitung</h2>
              <p>
                Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung informiert Sie 
                über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten auf unserer Website cardl.io.
              </p>
              <p>
                Die Verarbeitung Ihrer personenbezogenen Daten erfolgt stets im Einklang mit der 
                Datenschutz-Grundverordnung (DSGVO) und den für r-projects UG geltenden datenschutzrechtlichen Bestimmungen.
              </p>
            </div>

            <div className="section">
              <h2>3. Erhebung und Verarbeitung personenbezogener Daten</h2>
              
              <h3>3.1 Automatisch erfasste Daten</h3>
              <p>
                Bei Ihrem Besuch auf unserer Website werden automatisch folgende Informationen erfasst:
              </p>
              <ul style={{margin:'0 0 16px 20px',color:'var(--muted)'}}>
                <li>IP-Adresse des anfragenden Rechners</li>
                <li>Datum und Uhrzeit des Zugriffs</li>
                <li>Name und URL der abgerufenen Datei</li>
                <li>Website, von der aus der Zugriff erfolgt (Referrer)</li>
                <li>Verwendeter Browser und Betriebssystem</li>
                <li>Name Ihres Internet-Zugangsanbieters</li>
              </ul>

              <h3>3.2 Daten, die Sie uns mitteilen</h3>
              <p>
                Bei der Nutzung unserer Dienste können Sie uns folgende Daten zur Verfügung stellen:
              </p>
              <ul style={{margin:'0 0 16px 20px',color:'var(--muted)'}}>
                <li>Name und Kontaktdaten (E-Mail, Telefon)</li>
                <li>Rechnungs- und Lieferadressen</li>
                <li>Zahlungsinformationen (über sichere Zahlungsdienstleister)</li>
                <li>Bestelldaten und Produktpräferenzen</li>
              </ul>
            </div>

            <div className="section">
              <h2>4. Besondere Verarbeitung: Uploads und Bildverarbeitung</h2>
              
              <div className="highlight">
                <h3>4.1 Hochgeladene Dateien und Bilder</h3>
                <p>
                  Bei der Nutzung unseres Karten-Designers können Sie Bilder, Texte und andere Dateien hochladen. 
                  Diese werden für die Erstellung Ihrer personalisierten Produkte benötigt.
                </p>
              </div>

              <h3>4.2 Verarbeitungszweck</h3>
              <p>
                Ihre hochgeladenen Dateien werden ausschließlich für folgende Zwecke verarbeitet:
              </p>
              <ul style={{margin:'0 0 16px 20px',color:'var(--muted)'}}>
                <li>Erstellung und Vorschau Ihres personalisierten Designs</li>
                <li>Produktion der bestellten Artikel</li>
                <li>Qualitätskontrolle und Druckvorbereitung</li>
                <li>Kundenservice und Support bei Problemen</li>
              </ul>

              <h3>4.3 Speicherdauer hochgeladener Dateien</h3>
              <div className="warning">
                <p>
                  <strong>Wichtiger Hinweis zur Speicherdauer:</strong><br />
                  Ihre hochgeladenen Dateien und Bilder werden nach Abschluss der Bestellung 
                  <strong>maximal 90 Tage</strong> gespeichert, um:
                </p>
                <ul style={{margin:'8px 0 0 20px',color:'var(--muted)'}}>
                  <li>Nachbestellungen zu ermöglichen</li>
                  <li>Qualitätsprobleme zu bearbeiten</li>
                  <li>Kundenservice-Anfragen zu bearbeiten</li>
                </ul>
                <p style={{margin:'12px 0 0 0',fontSize:'14px'}}>
                  Nach Ablauf der 90 Tage werden alle hochgeladenen Dateien automatisch und unwiderruflich gelöscht.
                </p>
              </div>

              <h3>4.4 Datensicherheit bei Uploads</h3>
              <p>
                Alle hochgeladenen Dateien werden:
              </p>
              <ul style={{margin:'0 0 16px 20px',color:'var(--muted)'}}>
                <li>Verschlüsselt übertragen (HTTPS/TLS)</li>
                <li>In sicheren, verschlüsselten Speichersystemen abgelegt</li>
                <li>Nur autorisierten Mitarbeitern für Produktionszwecke zugänglich gemacht</li>
                <li>Nicht an Dritte weitergegeben (außer für Produktionszwecke)</li>
              </ul>
            </div>

            <div className="section">
              <h2>5. Rechtsgrundlagen der Datenverarbeitung</h2>
              <p>
                Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf folgenden Rechtsgrundlagen:
              </p>
              <ul style={{margin:'0 0 16px 20px',color:'var(--muted)'}}>
                <li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Zur Erfüllung des Kaufvertrags</li>
                <li><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Aufgrund Ihrer Einwilligung (z.B. Newsletter)</li>
                <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Zur Wahrung unserer berechtigten Interessen</li>
                <li><strong>Art. 6 Abs. 1 lit. c DSGVO:</strong> Zur Erfüllung rechtlicher Verpflichtungen</li>
              </ul>
            </div>

            <div className="section">
              <h2>6. Weitergabe von Daten an Dritte</h2>
              <p>
                Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nur in folgenden Fällen:
              </p>
              <ul style={{margin:'0 0 16px 20px',color:'var(--muted)'}}>
                <li><strong>Zahlungsdienstleister:</strong> Für die Abwicklung von Zahlungen (Stripe)</li>
                <li><strong>Druckereien/Produktionspartner:</strong> Für die Herstellung Ihrer bestellten Artikel</li>
                <li><strong>Versanddienstleister:</strong> Für den Versand Ihrer Bestellung</li>
                <li><strong>IT-Dienstleister:</strong> Für technische Unterstützung und Wartung</li>
                <li><strong>Behörden:</strong> Bei gesetzlicher Verpflichtung oder gerichtlicher Anordnung</li>
              </ul>
              <p>
                Alle Dienstleister sind vertraglich zur Einhaltung der DSGVO verpflichtet.
              </p>
            </div>

            <div className="section">
              <h2>7. Ihre Rechte als Betroffener</h2>
              <p>
                Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
              </p>
              <ul style={{margin:'0 0 16px 20px',color:'var(--muted)'}}>
                <li><strong>Auskunftsrecht:</strong> Über die zu Ihrer Person gespeicherten Daten</li>
                <li><strong>Berichtigungsrecht:</strong> Bei unrichtigen oder unvollständigen Daten</li>
                <li><strong>Löschungsrecht:</strong> Bei unrechtmäßiger Verarbeitung</li>
                <li><strong>Einschränkungsrecht:</strong> Bei bestimmten Bedingungen</li>
                <li><strong>Datenübertragbarkeitsrecht:</strong> Für Ihre Daten in strukturierter Form</li>
                <li><strong>Widerspruchsrecht:</strong> Gegen die Verarbeitung Ihrer Daten</li>
                <li><strong>Widerrufsrecht:</strong> Bei Einwilligungen</li>
              </ul>
            </div>

            <div className="section">
              <h2>8. Cookies und Tracking</h2>
              <p>
                Wir verwenden Cookies und ähnliche Technologien für:
              </p>
              <ul style={{margin:'0 0 16px 20px',color:'var(--muted)'}}>
                <li>Technisch notwendige Funktionen (Session-Management, Warenkorb)</li>
                <li>Analyse der Website-Nutzung (Google Analytics)</li>
                <li>Marketing und Personalisierung</li>
              </ul>
              <p>
                Sie können Cookies in Ihren Browser-Einstellungen verwalten und löschen.
              </p>
            </div>

            <div className="section">
              <h2>9. Datensicherheit</h2>
              <p>
                Wir setzen umfassende technische und organisatorische Maßnahmen ein, um Ihre Daten zu schützen:
              </p>
              <ul style={{margin:'0 0 16px 20px',color:'var(--muted)'}}>
                <li>Verschlüsselte Datenübertragung (HTTPS/TLS)</li>
                <li>Verschlüsselte Datenspeicherung</li>
                <li>Regelmäßige Sicherheitsupdates</li>
                <li>Zugriffskontrollen und Authentifizierung</li>
                <li>Regelmäßige Datensicherungen</li>
              </ul>
            </div>

            <div className="section">
              <h2>10. Kontakt und Beschwerden</h2>
              <div className="contact-info">
                <p>
                  <strong>Bei Fragen zum Datenschutz:</strong><br />
                  E-Mail: datenschutz@r-projects.eu<br />
                  Telefon: +49 (0) 123 456789
                </p>
                <p>
                  <strong>Beschwerderecht:</strong><br />
                  Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren:
                </p>
                <p>
                  <strong>Niedersächsischer Landesbeauftragter für den Datenschutz</strong><br />
                  Prinzenstraße 5<br />
                  30159 Hannover<br />
                  E-Mail: poststelle@lfd.niedersachsen.de
                </p>
              </div>
            </div>

            <div className="section">
              <h2>11. Änderungen dieser Datenschutzerklärung</h2>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an aktuelle 
                rechtliche Anforderungen oder Änderungen unserer Dienste anzupassen. 
                Die jeweils aktuelle Version ist auf dieser Seite verfügbar.
              </p>
              <p>
                Stand: {new Date().toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>

          <div className="footer">
            <div>© {new Date().getFullYear()} r-projects UG • All rights reserved</div>
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
