import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

interface CardData {
  name: string
  title: string
  company: string
  email: string
  phone: string
  website: string
  address: string
  logo?: string
  backgroundColor: string
  textColor: string
  fontFamily: string
}

export default function EditorPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cardData, setCardData] = useState<CardData>({
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    backgroundColor: '#1e293b',
    textColor: '#ffffff',
    fontFamily: 'Inter'
  })
  const [isEditing, setIsEditing] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'design' | 'content' | 'preview'>('content')

  // Prüfe Login-Status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('cardl-login')
      if (!isLoggedIn) {
        router.push('/auth/login')
      }
    }
  }, [router])

  // Zeichne Karte auf Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Canvas-Größe (ID-1 Format: 85,60 × 53,98 mm)
    const scale = 4 // Für bessere Qualität
    canvas.width = 85.6 * scale
    canvas.height = 53.98 * scale

    // Hintergrund
    ctx.fillStyle = cardData.backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Gradient-Overlay
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.1)')
    gradient.addColorStop(1, 'rgba(22, 163, 74, 0.1)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Logo (falls vorhanden)
    if (cardData.logo) {
      const logo = new Image()
      logo.onload = () => {
        const logoSize = 40 * scale
        const logoX = 20 * scale
        const logoY = 20 * scale
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)
        drawText()
      }
      logo.src = cardData.logo
    } else {
      drawText()
    }

    function drawText() {
      if (!ctx) return
      
      ctx.textBaseline = 'top'
      
      // Berechne verfügbaren Platz
      const padding = 20 * scale
      const maxWidth = canvas!.width - (padding * 2)
      const qrSize = 60 * scale
      const qrX = canvas!.width - qrSize - padding
      const qrY = canvas!.height - qrSize - padding
      const textAreaWidth = qrX - (padding * 2)
      
      // Hilfsfunktion für Text-Wrapping
      function wrapText(text: string, maxWidth: number, fontSize: number, fontFamily: string) {
        ctx!.font = `${fontSize}px ${fontFamily}`
        const words = text.split(' ')
        const lines: string[] = []
        let currentLine = words[0]
        
        for (let i = 1; i < words.length; i++) {
          const word = words[i]
          const width = ctx!.measureText(currentLine + ' ' + word).width
          if (width < maxWidth) {
            currentLine += ' ' + word
          } else {
            lines.push(currentLine)
            currentLine = word
          }
        }
        lines.push(currentLine)
        return lines
      }
      
      // Name
      if (cardData.name) {
        const nameFontSize = 20 * scale
        const nameLines = wrapText(cardData.name, textAreaWidth, nameFontSize, cardData.fontFamily)
        ctx.font = `bold ${nameFontSize}px ${cardData.fontFamily}`
        ctx.fillStyle = cardData.textColor
        
        nameLines.forEach((line, index) => {
          ctx.fillText(line, padding, padding + (index * (nameFontSize + 4)))
        })
      }
      
      // Titel
      if (cardData.title) {
        const titleFontSize = 14 * scale
        const titleLines = wrapText(cardData.title, textAreaWidth, titleFontSize, cardData.fontFamily)
        ctx.font = `${titleFontSize}px ${cardData.fontFamily}`
        ctx.fillStyle = cardData.textColor + 'CC'
        
        const nameHeight = cardData.name ? (wrapText(cardData.name, textAreaWidth, 20 * scale, cardData.fontFamily).length * (20 * scale + 4)) : 0
        const titleY = padding + nameHeight + (10 * scale)
        
        titleLines.forEach((line, index) => {
          ctx.fillText(line, padding, titleY + (index * (titleFontSize + 2)))
        })
      }
      
      // Firma
      if (cardData.company) {
        const companyFontSize = 16 * scale
        const companyLines = wrapText(cardData.company, textAreaWidth, companyFontSize, cardData.fontFamily)
        ctx.font = `bold ${companyFontSize}px ${cardData.fontFamily}`
        ctx.fillStyle = cardData.textColor
        
        const nameHeight = cardData.name ? (wrapText(cardData.name, textAreaWidth, 20 * scale, cardData.fontFamily).length * (20 * scale + 4)) : 0
        const titleHeight = cardData.title ? (wrapText(cardData.title, textAreaWidth, 14 * scale, cardData.fontFamily).length * (14 * scale + 2)) : 0
        const companyY = padding + nameHeight + titleHeight + (20 * scale)
        
        companyLines.forEach((line, index) => {
          ctx.fillText(line, padding, companyY + (index * (companyFontSize + 2)))
        })
      }
      
      // Kontaktdaten
      const contactFontSize = 12 * scale
      ctx.font = `${contactFontSize}px ${cardData.fontFamily}`
      ctx.fillStyle = cardData.textColor + 'CC'
      
      // Berechne Y-Position für Kontaktdaten
      let contactY = padding
      if (cardData.name) {
        contactY += wrapText(cardData.name, textAreaWidth, 20 * scale, cardData.fontFamily).length * (20 * scale + 4)
      }
      if (cardData.title) {
        contactY += wrapText(cardData.title, textAreaWidth, 14 * scale, cardData.fontFamily).length * (14 * scale + 2) + 10 * scale
      }
      if (cardData.company) {
        contactY += wrapText(cardData.company, textAreaWidth, 16 * scale, cardData.fontFamily).length * (16 * scale + 2) + 10 * scale
      }
      contactY += 20 * scale
      
      // Kontaktdaten mit Icons
      const contactItems = []
      if (cardData.email) contactItems.push(`📧 ${cardData.email}`)
      if (cardData.phone) contactItems.push(`📞 ${cardData.phone}`)
      if (cardData.website) contactItems.push(`🌐 ${cardData.website}`)
      if (cardData.address) contactItems.push(`📍 ${cardData.address}`)
      
      contactItems.forEach((item, index) => {
        const lines = wrapText(item, textAreaWidth, contactFontSize, cardData.fontFamily)
        lines.forEach((line, lineIndex) => {
          ctx.fillText(line, padding, contactY + (index * (contactFontSize + 8)) + (lineIndex * (contactFontSize + 2)))
        })
      })
      
      // QR-Code Platzhalter (rechts)
      ctx.fillStyle = cardData.textColor + '20'
      ctx.fillRect(qrX, qrY, qrSize, qrSize)
      ctx.strokeStyle = cardData.textColor + '40'
      ctx.lineWidth = 2 * scale
      ctx.strokeRect(qrX, qrY, qrSize, qrSize)
      
      ctx.font = `${8 * scale}px ${cardData.fontFamily}`
      ctx.fillStyle = cardData.textColor + '60'
      ctx.fillText('QR', qrX + qrSize/2 - 8 * scale, qrY + qrSize/2 - 4 * scale)
    }
  }, [cardData])

  const handleSave = async () => {
    try {
      const canvas = canvasRef.current
      if (!canvas) return

      // Konvertiere zu PNG
      const dataUrl = canvas.toDataURL('image/png')
      
      // Speichere in Supabase (später implementieren)
      console.log('Saving card data:', cardData)
      console.log('Card image:', dataUrl)

      // Für jetzt: Lokaler Download
      const link = document.createElement('a')
      link.download = `${cardData.name || 'card'}-cardl.png`
      link.href = dataUrl
      link.click()

    } catch (error) {
      console.error('Error saving card:', error)
    }
  }

  const handleOrder = () => {
    // Weiterleitung zum Bestellsystem
    router.push('/checkout?type=card')
  }

  if (typeof window === 'undefined' || !localStorage.getItem('cardl-login')) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Karten-Editor - cardl.io</title>
        <meta name="description" content="Erstellen Sie Ihre digitale Visitenkarte mit dem cardl.io Editor" />
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
          .editor{
            min-height:100vh;
            display:flex;
            flex-direction:column;
          }
          .header{
            background:var(--card);
            backdrop-filter: blur(8px);
            border-bottom:1px solid rgba(255,255,255,.08);
            padding:16px 24px;
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:16px;
          }
          .brand{display:flex;align-items:center;gap:12px;text-decoration:none}
          .logo{
            width:32px;height:32px;border-radius:8px;display:grid;place-items:center;
            background:linear-gradient(135deg, var(--primary), var(--accent));
            box-shadow: inset 0 0 0 1px rgba(255,255,255,.2);
            font-weight:800;font-size:14px
          }
          .wordmark{font-weight:800;letter-spacing:.2px;font-size:16px}
          .chip{width:12px;height:8px;border:1.5px solid #fff;border-radius:1.5px;opacity:.9}
          .actions{display:flex;gap:12px;align-items:center}
          .btn{
            padding:8px 16px;border-radius:8px;border:none;font-weight:600;cursor:pointer;font-size:14px;
            transition:all 0.2s ease
          }
          .btn-primary{
            background:linear-gradient(135deg,var(--primary),#1d4ed8);
            color:white
          }
          .btn-secondary{
            background:rgba(255,255,255,.1);
            color:var(--fg);
            border:1px solid rgba(255,255,255,.2)
          }
          .btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.2)}
          .main{
            flex:1;
            display:flex;
            gap:24px;
            padding:24px;
            max-width:1400px;
            margin:0 auto;
            width:100%
          }
          .sidebar{
            width:320px;
            background:var(--card);
            backdrop-filter: blur(8px);
            border:1px solid rgba(255,255,255,.08);
            border-radius:16px;
            padding:24px;
            height:fit-content;
            position:sticky;
            top:24px
          }
          .tabs{
            display:flex;
            gap:4px;
            margin-bottom:24px;
            background:rgba(255,255,255,.06);
            border-radius:8px;
            padding:4px
          }
          .tab{
            flex:1;
            padding:8px 12px;
            border-radius:6px;
            border:none;
            background:transparent;
            color:var(--muted);
            cursor:pointer;
            font-size:14px;
            font-weight:500;
            transition:all 0.2s ease
          }
          .tab.active{
            background:rgba(255,255,255,.1);
            color:var(--fg)
          }
          .form-group{
            margin-bottom:20px
          }
          .form-group label{
            display:block;
            margin-bottom:8px;
            font-size:14px;
            font-weight:500;
            color:var(--fg)
          }
          .form-group input,
          .form-group select{
            width:100%;
            background:rgba(255,255,255,.08);
            border:1px solid rgba(255,255,255,.18);
            color:var(--fg);
            border-radius:8px;
            padding:10px 12px;
            outline:none;
            font-size:14px
          }
          .form-group input:focus,
          .form-group select:focus{
            box-shadow:0 0 0 3px var(--ring);
            border-color:var(--primary)
          }
          .color-picker{
            display:flex;
            gap:8px;
            align-items:center
          }
          .color-picker input[type="color"]{
            width:40px;
            height:40px;
            border:none;
            border-radius:8px;
            cursor:pointer
          }
          .preview-area{
            flex:1;
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:24px
          }
          .canvas-container{
            background:var(--card);
            backdrop-filter: blur(8px);
            border:1px solid rgba(255,255,255,.08);
            border-radius:16px;
            padding:24px;
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:16px
          }
          .canvas-container canvas{
            border-radius:8px;
            box-shadow:0 8px 32px rgba(0,0,0,.3);
            max-width:100%;
            height:auto
          }
          .canvas-info{
            text-align:center;
            color:var(--muted);
            font-size:14px
          }
          .preview-actions{
            display:flex;
            gap:12px;
            flex-wrap:wrap;
            justify-content:center
          }
          .btn-large{
            padding:12px 24px;
            font-size:16px
          }
          @media (max-width: 768px) {
            .main{flex-direction:column;padding:16px}
            .sidebar{width:100%;position:static}
            .header{padding:12px 16px}
            .actions{flex-wrap:wrap}
          }
        `}</style>
      </Head>

      <div className="editor">
        <header className="header">
          <a className="brand" href="/dashboard">
            <div className="logo">
              <div className="chip" />
            </div>
            <span className="wordmark">cardl.io</span>
          </a>
          
          <div className="actions">
            <button className="btn btn-secondary" onClick={() => router.push('/dashboard')}>
              ← Dashboard
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              💾 Speichern
            </button>
            <button className="btn btn-primary" onClick={handleOrder}>
              🛒 Bestellen
            </button>
          </div>
        </header>

        <main className="main">
          <aside className="sidebar">
            <div className="tabs">
              <button 
                className={`tab ${selectedTab === 'content' ? 'active' : ''}`}
                onClick={() => setSelectedTab('content')}
              >
                📝 Inhalt
              </button>
              <button 
                className={`tab ${selectedTab === 'design' ? 'active' : ''}`}
                onClick={() => setSelectedTab('design')}
              >
                🎨 Design
              </button>
              <button 
                className={`tab ${selectedTab === 'preview' ? 'active' : ''}`}
                onClick={() => setSelectedTab('preview')}
              >
                👁️ Vorschau
              </button>
            </div>

            {selectedTab === 'content' && (
              <div>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={cardData.name}
                    onChange={(e) => setCardData({...cardData, name: e.target.value})}
                    placeholder="Ihr vollständiger Name"
                  />
                </div>

                <div className="form-group">
                  <label>Berufsbezeichnung</label>
                  <input
                    type="text"
                    value={cardData.title}
                    onChange={(e) => setCardData({...cardData, title: e.target.value})}
                    placeholder="z.B. Senior Developer, CEO, etc."
                  />
                </div>

                <div className="form-group">
                  <label>Firma</label>
                  <input
                    type="text"
                    value={cardData.company}
                    onChange={(e) => setCardData({...cardData, company: e.target.value})}
                    placeholder="Firmenname"
                  />
                </div>

                <div className="form-group">
                  <label>E-Mail</label>
                  <input
                    type="email"
                    value={cardData.email}
                    onChange={(e) => setCardData({...cardData, email: e.target.value})}
                    placeholder="ihre@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Telefon</label>
                  <input
                    type="tel"
                    value={cardData.phone}
                    onChange={(e) => setCardData({...cardData, phone: e.target.value})}
                    placeholder="+49 123 456789"
                  />
                </div>

                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={cardData.website}
                    onChange={(e) => setCardData({...cardData, website: e.target.value})}
                    placeholder="https://ihre-website.de"
                  />
                </div>

                <div className="form-group">
                  <label>Adresse</label>
                  <input
                    type="text"
                    value={cardData.address}
                    onChange={(e) => setCardData({...cardData, address: e.target.value})}
                    placeholder="Straße, PLZ Ort"
                  />
                </div>
              </div>
            )}

            {selectedTab === 'design' && (
              <div>
                <div className="form-group">
                  <label>Hintergrundfarbe</label>
                  <div className="color-picker">
                    <input
                      type="color"
                      value={cardData.backgroundColor}
                      onChange={(e) => setCardData({...cardData, backgroundColor: e.target.value})}
                    />
                    <input
                      type="text"
                      value={cardData.backgroundColor}
                      onChange={(e) => setCardData({...cardData, backgroundColor: e.target.value})}
                      placeholder="#1e293b"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Textfarbe</label>
                  <div className="color-picker">
                    <input
                      type="color"
                      value={cardData.textColor}
                      onChange={(e) => setCardData({...cardData, textColor: e.target.value})}
                    />
                    <input
                      type="text"
                      value={cardData.textColor}
                      onChange={(e) => setCardData({...cardData, textColor: e.target.value})}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Schriftart</label>
                  <select
                    value={cardData.fontFamily}
                    onChange={(e) => setCardData({...cardData, fontFamily: e.target.value})}
                  >
                    <option value="Inter">Inter (Modern)</option>
                    <option value="Roboto">Roboto (Clean)</option>
                    <option value="Open Sans">Open Sans (Friendly)</option>
                    <option value="Lato">Lato (Professional)</option>
                    <option value="Poppins">Poppins (Elegant)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Logo hochladen</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          setCardData({...cardData, logo: e.target?.result as string})
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {selectedTab === 'preview' && (
              <div>
                <div className="form-group">
                  <label>Vorschau-Einstellungen</label>
                  <p style={{fontSize: '14px', color: 'var(--muted)', margin: '8px 0'}}>
                    Hier können Sie Ihre Karte in verschiedenen Formaten und Größen anzeigen.
                  </p>
                </div>

                <div className="form-group">
                  <label>Export-Format</label>
                  <select defaultValue="png">
                    <option value="png">PNG (Hochauflösend)</option>
                    <option value="jpg">JPG (Kleinere Datei)</option>
                    <option value="svg">SVG (Vektorgrafik)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Größe</label>
                  <select defaultValue="id1">
                    <option value="id1">ID-1 (85,60 × 53,98 mm)</option>
                    <option value="id2">ID-2 (105 × 74 mm)</option>
                    <option value="id3">ID-3 (125 × 88 mm)</option>
                  </select>
                </div>
              </div>
            )}
          </aside>

          <section className="preview-area">
            <div className="canvas-container">
              <canvas ref={canvasRef} />
              <div className="canvas-info">
                <strong>ID-1 Format</strong> • 85,60 × 53,98 mm • Hochauflösend
              </div>
            </div>

            <div className="preview-actions">
              <button className="btn btn-secondary btn-large" onClick={handleSave}>
                💾 Als PNG speichern
              </button>
              <button className="btn btn-primary btn-large" onClick={handleOrder}>
                🛒 Karte bestellen
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
