import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

type ElementType = 'text' | 'rect' | 'circle' | 'image'

interface BaseElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  fill: string
  stroke: string
  strokeWidth: number
}

interface TextElement extends BaseElement {
  type: 'text'
  text: string
  fontSize: number
  fontFamily: string
  align: 'left' | 'center' | 'right'
}

interface ImageElement extends BaseElement {
  type: 'image'
  src: string
}

interface RectElement extends BaseElement {
  type: 'rect'
  radius: number
}

interface CircleElement extends BaseElement {
  type: 'circle'
}

type EditorElement = TextElement | ImageElement | RectElement | CircleElement

// Zusätzliche vereinheitlichte Update-Typen für unionsspezifische Felder
type ElementUpdate = Partial<BaseElement> & {
  text?: string
  fontSize?: number
  fontFamily?: string
  align?: 'left' | 'center' | 'right'
  radius?: number
  src?: string
}

interface BackgroundConfig {
  colorTop: string
  colorBottom: string
  splitRatio: number
}

export default function EditorProPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDraggingRef = useRef(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const selectedIdRef = useRef<string | null>(null)
  const imagesCacheRef = useRef<Map<string, HTMLImageElement>>(new Map())

  // ID-1 im Hochformat (53.98 x 85.6) – höher aufgelöst zeichnen
  const scale = 5
  const CARD_WIDTH = Math.round(53.98 * scale)
  const CARD_HEIGHT = Math.round(85.6 * scale)

  const [background, setBackground] = useState<BackgroundConfig>({
    colorTop: '#0f172a',
    colorBottom: '#1e293b',
    splitRatio: 0.45,
  })

  // Start-Elemente: Portrait-Platzhalter mittig, darunter drei Textfelder
  const [elements, setElements] = useState<EditorElement[]>([
    {
      id: 'img_placeholder',
      type: 'image',
      x: Math.round((CARD_WIDTH - 140) / 2),
      y: 80,
      width: 140,
      height: 180,
      rotation: 0,
      opacity: 1,
      fill: '#00000000',
      stroke: '#ffffff44',
      strokeWidth: 1,
      src: '',
    } as ImageElement,
    {
      id: 'txt_1',
      type: 'text',
      x: 24,
      y: 280,
      width: CARD_WIDTH - 48,
      height: 30,
      rotation: 0,
      opacity: 1,
      fill: '#ffffff',
      stroke: '#00000000',
      strokeWidth: 0,
      text: 'Textfeld 1',
      fontSize: 18,
      fontFamily: 'Inter',
      align: 'left',
    } as TextElement,
    {
      id: 'txt_2',
      type: 'text',
      x: 24,
      y: 312,
      width: CARD_WIDTH - 48,
      height: 30,
      rotation: 0,
      opacity: 1,
      fill: '#e5e7eb',
      stroke: '#00000000',
      strokeWidth: 0,
      text: 'Textfeld 2',
      fontSize: 16,
      fontFamily: 'Inter',
      align: 'left',
    } as TextElement,
    {
      id: 'txt_3',
      type: 'text',
      x: 24,
      y: 342,
      width: CARD_WIDTH - 48,
      height: 30,
      rotation: 0,
      opacity: 1,
      fill: '#cbd5e1',
      stroke: '#00000000',
      strokeWidth: 0,
      text: 'Textfeld 3',
      fontSize: 14,
      fontFamily: 'Inter',
      align: 'left',
    } as TextElement,
  ])

  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Login-Gate (nur Client)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('cardl-login')
      if (!isLoggedIn) router.push('/auth/login')
    }
  }, [router])

  // Render-Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = CARD_WIDTH
    canvas.height = CARD_HEIGHT

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const topHeight = Math.max(0.05, Math.min(0.95, background.splitRatio)) * canvas.height

    ctx.fillStyle = background.colorTop
    ctx.fillRect(0, 0, canvas.width, topHeight)

    ctx.fillStyle = background.colorBottom
    ctx.fillRect(0, topHeight, canvas.width, canvas.height - topHeight)

    const gloss = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gloss.addColorStop(0, 'rgba(255,255,255,0.03)')
    gloss.addColorStop(1, 'rgba(0,0,0,0.05)')
    ctx.fillStyle = gloss
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const drawElement = (el: EditorElement) => {
      const savedAlpha = ctx.globalAlpha
      ctx.save()
      ctx.globalAlpha = Math.max(0, Math.min(1, el.opacity))
      const cx = el.x + el.width / 2
      const cy = el.y + el.height / 2
      ctx.translate(cx, cy)
      ctx.rotate((el.rotation * Math.PI) / 180)
      ctx.translate(-cx, -cy)

      if (el.type === 'rect') {
        const r = (el as RectElement).radius
        const rr = Math.min(r, Math.min(el.width, el.height) / 2)
        const x = el.x, y = el.y, w = el.width, h = el.height
        ctx.beginPath()
        ctx.moveTo(x + rr, y)
        ctx.lineTo(x + w - rr, y)
        ctx.quadraticCurveTo(x + w, y, x + w, y + rr)
        ctx.lineTo(x + w, y + h - rr)
        ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
        ctx.lineTo(x + rr, y + h)
        ctx.quadraticCurveTo(x, y + h, x, y + h - rr)
        ctx.lineTo(x, y + rr)
        ctx.quadraticCurveTo(x, y, x + rr, y)
        ctx.closePath()
        ctx.fillStyle = el.fill
        ctx.fill()
        if (el.strokeWidth > 0) { ctx.lineWidth = el.strokeWidth; ctx.strokeStyle = el.stroke; ctx.stroke() }
      } else if (el.type === 'circle') {
        const radius = Math.min(el.width, el.height) / 2
        ctx.beginPath()
        ctx.arc(el.x + el.width / 2, el.y + el.height / 2, radius, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fillStyle = el.fill
        ctx.fill()
        if (el.strokeWidth > 0) { ctx.lineWidth = el.strokeWidth; ctx.strokeStyle = el.stroke; ctx.stroke() }
      } else if (el.type === 'text') {
        const t = el as TextElement
        ctx.fillStyle = t.fill
        ctx.font = `${t.fontSize}px ${t.fontFamily}`
        ctx.textBaseline = 'top'
        if (t.align === 'center') ctx.textAlign = 'center'
        else if (t.align === 'right') ctx.textAlign = 'right'
        else ctx.textAlign = 'left'
        const tx = t.align === 'center' ? el.x + el.width / 2 : t.align === 'right' ? el.x + el.width : el.x
        ctx.fillText(t.text, tx, el.y, el.width)
        if (el.strokeWidth > 0) { ctx.lineWidth = el.strokeWidth; ctx.strokeStyle = el.stroke; ctx.strokeText(t.text, tx, el.y, el.width) }
      } else if (el.type === 'image') {
        const imgEl = el as ImageElement
        let img = imagesCacheRef.current.get(el.id)
        if (!img) {
          img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = imgEl.src
          imagesCacheRef.current.set(el.id, img)
          img.onload = () => setElements((s) => [...s])
        }
        if (img && img.complete && imgEl.src) {
          ctx.drawImage(img, el.x, el.y, el.width, el.height)
          if (el.strokeWidth > 0) { ctx.lineWidth = el.strokeWidth; ctx.strokeStyle = el.stroke; ctx.strokeRect(el.x, el.y, el.width, el.height) }
        } else {
          ctx.fillStyle = '#ffffff22'
          ctx.fillRect(el.x, el.y, el.width, el.height)
          ctx.strokeStyle = '#ffffff88'
          ctx.lineWidth = 1
          ctx.strokeRect(el.x, el.y, el.width, el.height)
          ctx.fillStyle = '#e5e7eb'
          ctx.font = '12px Inter'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('Bild hier platzieren', el.x + el.width / 2, el.y + el.height / 2)
        }
      }

      if (selectedIdRef.current === el.id) {
        ctx.setLineDash([6, 4])
        ctx.lineWidth = 1
        ctx.strokeStyle = '#60a5fa'
        ctx.strokeRect(el.x, el.y, el.width, el.height)
        ctx.setLineDash([])
      }

      ctx.restore()
      ctx.globalAlpha = savedAlpha
    }

    elements.forEach(drawElement)
  }, [elements, background])

  // Hit-Test
  const hitTest = (x: number, y: number): EditorElement | null => {
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i]
      if (el.type === 'circle') {
        const cx = el.x + el.width / 2
        const cy = el.y + el.height / 2
        const r = Math.min(el.width, el.height) / 2
        const dx = x - cx, dy = y - cy
        if (dx * dx + dy * dy <= r * r) return el
      } else {
        if (x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height) return el
      }
    }
    return null
  }

  // Maus-/Touch-Events: Auswahl & Dragging
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const getPos = (evt: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect()
      let clientX = 0, clientY = 0
      if (evt instanceof TouchEvent) { clientX = evt.touches[0]?.clientX ?? 0; clientY = evt.touches[0]?.clientY ?? 0 }
      else { clientX = (evt as MouseEvent).clientX; clientY = (evt as MouseEvent).clientY }
      const x = ((clientX - rect.left) / rect.width) * canvas.width
      const y = ((clientY - rect.top) / rect.height) * canvas.height
      return { x, y }
    }

    const onDown = (evt: MouseEvent | TouchEvent) => {
      evt.preventDefault()
      const { x, y } = getPos(evt)
      const el = hitTest(x, y)
      if (el) {
        setSelectedId(el.id)
        selectedIdRef.current = el.id
        isDraggingRef.current = true
        dragOffsetRef.current = { x: x - el.x, y: y - el.y }
      } else {
        setSelectedId(null)
        selectedIdRef.current = null
      }
    }
    const onMove = (evt: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !selectedIdRef.current) return
      const { x, y } = getPos(evt)
      setElements((els) => els.map((el) => el.id === selectedIdRef.current ? { ...el, x: Math.round(x - dragOffsetRef.current.x), y: Math.round(y - dragOffsetRef.current.y) } : el))
    }
    const onUp = () => { isDraggingRef.current = false }

    canvas.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    canvas.addEventListener('touchstart', onDown, { passive: false })
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)

    return () => {
      canvas.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      canvas.removeEventListener('touchstart', onDown)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [elements])

  // Toolbar: Elemente hinzufügen
  const addElement = (type: ElementType) => {
    const id = `el_${Date.now()}_${Math.random().toString(36).slice(2,7)}`
    const cx = CARD_WIDTH / 2
    const cy = CARD_HEIGHT / 2
    let el: EditorElement
    if (type === 'text') {
      el = { id, type: 'text', x: Math.round(cx - 100), y: Math.round(cy - 20), width: 200, height: 40, rotation: 0, opacity: 1, fill: '#ffffff', stroke: '#00000000', strokeWidth: 0, text: 'Neuer Text', fontSize: 18, fontFamily: 'Inter', align: 'left' }
    } else if (type === 'rect') {
      el = { id, type: 'rect', x: Math.round(cx - 80), y: Math.round(cy - 50), width: 160, height: 100, rotation: 0, opacity: 1, fill: '#10b981', stroke: '#ffffff88', strokeWidth: 0, radius: 8 } as RectElement
    } else if (type === 'circle') {
      el = { id, type: 'circle', x: Math.round(cx - 50), y: Math.round(cy - 50), width: 100, height: 100, rotation: 0, opacity: 1, fill: '#2563eb', stroke: '#ffffff88', strokeWidth: 0 } as CircleElement
    } else {
      el = { id, type: 'image', x: Math.round(cx - 60), y: Math.round(cy - 80), width: 120, height: 160, rotation: 0, opacity: 1, fill: '#00000000', stroke: '#ffffff88', strokeWidth: 0, src: '' } as ImageElement
    }
    setElements((s) => [...s, el])
    setSelectedId(id)
    selectedIdRef.current = id
  }

  const deleteSelected = () => {
    if (!selectedId) return
    setElements((s) => s.filter((el) => el.id !== selectedId))
    setSelectedId(null)
    selectedIdRef.current = null
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const triggerImageUpload = () => { addElement('image'); setTimeout(() => fileInputRef.current?.click(), 0) }
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setElements((els) => els.map((el) => el.id === selectedIdRef.current && el.type === 'image' ? { ...(el as ImageElement), src: dataUrl } : el))
    }
    reader.readAsDataURL(file)
  }

  // Vereinfachte Update-Funktion für selektiertes Element
  const updateSelected = (partial: ElementUpdate) => {
    if (!selectedId) return
    setElements((els) => els.map((el) => (el.id === selectedId ? ({ ...el, ...(partial as any) } as EditorElement) : el)))
  }

  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'cardl-editor-pro.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleOrder = () => { router.push('/checkout?type=card') }

  return (
    <>
      <Head>
        <title>Karten-Editor Pro – cardl.io</title>
        <meta name="description" content="Frei positionierbarer Karten-Editor: Text, Formen, Bilder, Drag & Drop." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          :root{--bg:#0b1220;--fg:#e5e7eb;--muted:#9ca3af;--card:rgba(255,255,255,.06);--ring:rgba(37,99,235,.45);--primary:#2563eb;--accent:#16a34a}
          *{box-sizing:border-box}
          html,body,#__next{height:100%}
          body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji;color:var(--fg);background:radial-gradient(1200px 600px at 70% -10%, rgba(37,99,235,.25), transparent 60%),radial-gradient(1000px 600px at -10% 110%, rgba(22,163,74,.2), transparent 60%),var(--bg)}
          a{color:inherit}
          .editor{min-height:100vh;display:flex;flex-direction:column}
          .header{background:var(--card);backdrop-filter:blur(8px);border-bottom:1px solid rgba(255,255,255,.08);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px}
          .brand{display:flex;align-items:center;gap:10px;text-decoration:none}
          .logo{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:linear-gradient(135deg,var(--primary),var(--accent));box-shadow:inset 0 0 0 1px rgba(255,255,255,.2);font-weight:800;font-size:12px}
          .chip{width:10px;height:8px;border:1.5px solid #fff;border-radius:1.5px;opacity:.9}
          .wordmark{font-weight:800;letter-spacing:.2px;font-size:15px}
          .actions{display:flex;gap:10px;align-items:center}
          .btn{padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:var(--fg);cursor:pointer;font-weight:600}
          .btn-primary{background:linear-gradient(135deg,var(--primary),#1d4ed8);color:#fff;border:none}
          .main{flex:1;display:grid;grid-template-columns:320px 1fr 320px;gap:16px;padding:16px;max-width:1400px;margin:0 auto;width:100%}
          .panel{background:var(--card);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;height:fit-content;position:sticky;top:16px}
          .panel h3{margin:0 0 10px 0;font-size:14px}
          .row{display:flex;gap:8px;align-items:center;margin:8px 0}
          .row label{font-size:12px;color:var(--muted);min-width:80px}
          .row input,.row select{flex:1;min-width:0;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);color:var(--fg);border-radius:8px;padding:8px 10px;outline:none;font-size:13px}
          .row input[type="color"]{padding:0;height:34px}
          .canvasWrap{display:flex;justify-content:center;align-items:center}
          .canvasWrap canvas{border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.35);background:#0f172a;touch-action:none}
          .toolRow{display:flex;gap:8px;flex-wrap:wrap}
          .toolRow .btn{background:rgba(255,255,255,.08)}
          @media (max-width: 1024px){.main{grid-template-columns:1fr;}.panel{position:static}}
        `}</style>
      </Head>

      <div className="editor">
        <header className="header">
          <a className="brand" href="/dashboard">
            <div className="logo"><div className="chip" /></div>
            <span className="wordmark">cardl.io</span>
          </a>
          <div className="actions">
            <button className="btn" onClick={() => router.push('/dashboard')}>← Dashboard</button>
            <button className="btn btn-primary" onClick={handleSave}>💾 Speichern</button>
            <button className="btn btn-primary" onClick={handleOrder}>🛒 Bestellen</button>
          </div>
        </header>

        <main className="main">
          <aside className="panel">
            <h3>🎨 Hintergrund</h3>
            <div className="row"><label>Obere Farbe</label><input type="color" value={background.colorTop} onChange={(e) => setBackground({ ...background, colorTop: e.target.value })} /></div>
            <div className="row"><label>Untere Farbe</label><input type="color" value={background.colorBottom} onChange={(e) => setBackground({ ...background, colorBottom: e.target.value })} /></div>
            <div className="row"><label>Teilung</label><input type="range" min={0.1} max={0.9} step={0.01} value={background.splitRatio} onChange={(e) => setBackground({ ...background, splitRatio: parseFloat(e.target.value) })} /></div>

            <h3 style={{ marginTop: 16 }}>🧰 Werkzeuge</h3>
            <div className="toolRow">
              <button className="btn" onClick={() => addElement('text')}>Text</button>
              <button className="btn" onClick={() => addElement('rect')}>Rechteck</button>
              <button className="btn" onClick={() => addElement('circle')}>Kreis</button>
              <button className="btn" onClick={triggerImageUpload}>Bild</button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
            </div>
          </aside>

          <section className="canvasWrap">
            <canvas ref={canvasRef} style={{ width: CARD_WIDTH, height: CARD_HEIGHT }} />
          </section>

          <aside className="panel">
            <h3>⚙️ Eigenschaften</h3>
            {!selectedId && <div style={{ color: 'var(--muted)', fontSize: 13 }}>Kein Element ausgewählt</div>}
            {selectedId && (() => {
              const el = elements.find((e) => e.id === selectedId)
              if (!el) return <div style={{ color: 'var(--muted)', fontSize: 13 }}>Kein Element ausgewählt</div>
              return (
                <div>
                  <div className="row"><label>Typ</label><input value={el.type} readOnly /></div>
                  <div className="row"><label>X</label><input type="number" value={el.x} onChange={(e) => updateSelected({ x: parseInt(e.target.value || '0', 10) })} /></div>
                  <div className="row"><label>Y</label><input type="number" value={el.y} onChange={(e) => updateSelected({ y: parseInt(e.target.value || '0', 10) })} /></div>
                  <div className="row"><label>Breite</label><input type="number" value={el.width} onChange={(e) => updateSelected({ width: Math.max(1, parseInt(e.target.value || '1', 10)) })} /></div>
                  <div className="row"><label>Höhe</label><input type="number" value={el.height} onChange={(e) => updateSelected({ height: Math.max(1, parseInt(e.target.value || '1', 10)) })} /></div>
                  <div className="row"><label>Drehung</label><input type="number" value={el.rotation} onChange={(e) => updateSelected({ rotation: parseInt(e.target.value || '0', 10) })} /></div>
                  <div className="row"><label>Deckkraft</label><input type="range" min={0} max={1} step={0.01} value={el.opacity} onChange={(e) => updateSelected({ opacity: parseFloat(e.target.value) })} /></div>
                  {el.type !== 'image' && (<div className="row"><label>Füllfarbe</label><input type="color" value={el.fill} onChange={(e) => updateSelected({ fill: e.target.value })} /></div>)}
                  <div className="row"><label>Linienfarbe</label><input type="color" value={el.stroke} onChange={(e) => updateSelected({ stroke: e.target.value })} /></div>
                  <div className="row"><label>Linienstärke</label><input type="number" value={el.strokeWidth} onChange={(e) => updateSelected({ strokeWidth: Math.max(0, parseInt(e.target.value || '0', 10)) })} /></div>
                  {el.type === 'rect' && (<div className="row"><label>Radius</label><input type="number" value={(el as RectElement).radius} onChange={(e) => updateSelected({ radius: Math.max(0, parseInt(e.target.value || '0', 10)) })} /></div>)}
                  {el.type === 'text' && (<>
                    <div className="row"><label>Text</label><input value={(el as TextElement).text} onChange={(e) => updateSelected({ text: e.target.value })} /></div>
                    <div className="row"><label>Schrift</label>
                      <select value={(el as TextElement).fontFamily} onChange={(e) => updateSelected({ fontFamily: e.target.value })}>
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Open Sans">Open Sans</option>
                        <option value="Lato">Lato</option>
                        <option value="Poppins">Poppins</option>
                      </select>
                    </div>
                    <div className="row"><label>Größe</label><input type="number" value={(el as TextElement).fontSize} onChange={(e) => updateSelected({ fontSize: Math.max(6, parseInt(e.target.value || '6', 10)) })} /></div>
                    <div className="row"><label>Ausrichtung</label>
                      <select value={(el as TextElement).align} onChange={(e) => updateSelected({ align: e.target.value as TextElement['align'] })}>
                        <option value="left">Links</option>
                        <option value="center">Zentriert</option>
                        <option value="right">Rechts</option>
                      </select>
                    </div>
                  </>)}
                  {el.type === 'image' && (<div className="row"><label>Bild</label><button className="btn" onClick={() => fileInputRef.current?.click()}>Datei wählen…</button></div>)}
                  <div className="row"><button className="btn" style={{ width: '100%', borderColor: '#ef444444', color: '#ef4444' }} onClick={deleteSelected}>Löschen</button></div>
                </div>
              )
            })()}
          </aside>
        </main>
      </div>
    </>
  )
}
