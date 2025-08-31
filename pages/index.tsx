// File: pages/index.tsx (Next.js – Pages Router)
// -----------------------------------------------------------------------------
// ✅ How to use
// 1) In your Vercel/Next.js project, create the file at: pages/index.tsx
// 2) Commit & push – Vercel will auto-deploy. This page is static and SSR-free.
// 3) Customize: brand colors, links, and the newsletter action (see TODO below).
// -----------------------------------------------------------------------------

import Head from 'next/head'
import { useEffect, useState } from 'react'
import NotifyMe from '../components/NotifyMe'
import LoginForm from '../components/LoginForm'

export default function ComingSoon() {
  // --- Simple countdown to an arbitrary launch date (edit as needed) ---
  const target = new Date('2025-10-15T08:00:00+02:00').getTime() // TODO: set your real launch date
  const [remaining, setRemaining] = useState<number>(target - Date.now())

  useEffect(() => {
    const id = setInterval(() => setRemaining(target - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])

  const { d, h, m, s } = (() => {
    const total = Math.max(0, remaining)
    const d = Math.floor(total / (1000 * 60 * 60 * 24))
    const h = Math.floor((total / (1000 * 60 * 60)) % 24)
    const m = Math.floor((total / (1000 * 60)) % 60)
    const s = Math.floor((total / 1000) % 60)
    return { d, h, m, s }
  })()

  return (
    <>
      <Head>
        <title>cardl.io – Coming Soon</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="cardl.io – Der Ausweiskarten‑Druckdienst. Design. Tap. Done." />
        <meta property="og:title" content="cardl.io – Coming Soon" />
        <meta property="og:description" content="Der Ausweiskarten‑Druckdienst. Design. Tap. Done." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cardl.io" />
        <meta property="og:image" content="https://cardl.io/og.png" />
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          :root{
            --bg: #0b1220;
            --fg: #e5e7eb;
            --muted: #9ca3af;
            --primary: #2563eb; /* blue */
            --accent: #16a34a;  /* green */
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
          .cta a{display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.14)}
          .hero{padding:16px 0 8px}
          h1{margin:12px 0 8px;font-size: clamp(28px, 5vw, 44px)}
          p{margin:0;color:var(--muted);line-height:1.6}
          .timer{display:flex;gap:12px;margin:22px 0 26px;flex-wrap:wrap}
          .tbox{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:14px 18px;text-align:center;min-width:86px}
          .tn{font-size:28px;font-weight:800}
          .tl{font-size:12px;color:var(--muted)}
          .newsletter{display:flex;gap:10px;flex-wrap:wrap}
          input[type="email"]{
            flex:1;min-width:240px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.18);
            color:var(--fg);border-radius:12px;padding:14px 16px;outline:none
          }
          input[type="email"]:focus{box-shadow:0 0 0 6px var(--ring);border-color:var(--primary)}
          button{
            background:linear-gradient(135deg,var(--primary),#1d4ed8);
            color:white;border:none;border-radius:12px;padding:14px 18px;font-weight:700;cursor:pointer
          }
          .meta{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:16px}
          .pill{font-size:12px;color:var(--muted);border:1px dashed rgba(255,255,255,.18);padding:6px 10px;border-radius:999px}
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
            <div className="cta">
              <a href="mailto:hello@cardl.io" aria-label="Kontakt per E‑Mail">Contact</a>
            </div>
          </div>

          <section className="hero">
            <h1 id="title">We're printing something great.</h1>
            <p>Der Ausweiskarten‑Druckdienst. Design. Tap. Done. Bald hier auf <strong>cardl.io</strong>.</p>

            <div className="timer" aria-label="Countdown bis zum Start">
              <TimeBox n={d} label="Tage" />
              <TimeBox n={h} label="Stunden" />
              <TimeBox n={m} label="Minuten" />
              <TimeBox n={s} label="Sekunden" />
            </div>

            <div className="newsletter">
              <NotifyMe />
            </div>

            {/* Login-Bereich */}
            <LoginForm />

            <div className="meta">
              <span className="pill">ID‑1 Format • 85,60 × 53,98 mm</span>
              <span className="pill">Ein- & zweiseitiger Druck</span>
              <span className="pill">Editor & PNG‑Upload</span>
            </div>
          </section>

          <div className="footer">
            <div>© {new Date().getFullYear()} cardl.io • All rights reserved</div>
            <div className="social" aria-label="Social Links">
              <a href="https://twitter.com/cardl_io" target="_blank" rel="noreferrer">Twitter/X</a>
              <a href="https://instagram.com/cardl.io" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
      `}</style>
    </>
  )
}

function TimeBox({ n, label }: { n: number; label: string }) {
  return (
    <div className="tbox" role="group" aria-label={label}>
      <div className="tn" aria-live="polite" aria-atomic="true">{String(n).padStart(2, '0')}</div>
      <div className="tl">{label}</div>
    </div>
  )
}
