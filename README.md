# cardl.io

Eine moderne Plattform für die Erstellung und den Verkauf von Karten und Druckerzeugnissen.

## Tech Stack

- **Frontend**: Next.js 14.2.5, React 18.3.1
- **Backend**: Next.js API Routes
- **Datenbank**: Supabase (PostgreSQL)
- **Zahlungen**: Stripe
- **Deployment**: Vercel
- **Sprache**: TypeScript

## Voraussetzungen

- Node.js 18+ (siehe `.nvmrc`)
- npm oder yarn

## Setup

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd cardl.io
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   cp env.example .env.local
   # Bearbeiten Sie .env.local mit Ihren Werten
   ```

4. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

5. **Build testen**
   ```bash
   npm run build
   ```

## Umgebungsvariablen

### Supabase Konfiguration ✅
- **URL**: `https://myphyujlfjvmgcthpecn.supabase.co`
- **Anon Key**: Konfiguriert in `env.example`
- **Service Role Key**: Noch zu setzen (für Admin-Funktionen)

### Lokale Entwicklung (.env.local)
Alle Variablen aus `env.example` müssen gesetzt werden.

### Vercel Deployment
Setzen Sie alle Umgebungsvariablen in Ihren Vercel-Projekteinstellungen.

## Verfügbare Endpunkte

- **`/api/health`** - Health-Check für Monitoring
- **`/api/stripe/webhook`** - Stripe Webhook für Zahlungsverarbeitung

## Roadmap / To-Do

### Phase 1: Grundlagen ✅
- [x] Next.js Projekt-Setup
- [x] API-Stubs (Health, Stripe Webhook)
- [x] Supabase-Client Integration
- [x] Legal-Pages (Impressum, Datenschutz)

### Phase 2: Backend & Auth
- [x] Supabase Projekt (EU) anlegen, Keys setzen
- [x] Auth (E-Mail Magic Link, Google, Apple) vorbereiten
- [x] Order-Schema & Warenkorb-Skeleton

### Phase 3: Zahlungen & Checkout
- [ ] Stripe Checkout (Testmode), Success/Cancel Routes
- [ ] Webhook: payment_intent.succeeded → Order paid

### Phase 4: Core Features
- [ ] Editor v1: Text/Bild, PNG-Export (300 dpi inkl. Bleed)
- [ ] Admin v1: Auftragsliste + Status

### Phase 5: Rechtliches & Polish
- [ ] Rechtstexte ausformulieren
- [ ] Performance-Optimierung
- [ ] Testing & QA

## Scripts

- `npm run dev` - Entwicklungsserver starten
- `npm run build` - Produktionsbuild erstellen
- `npm run start` - Produktionsserver starten
- `npm run lint` - ESLint ausführen
- `npm run vercel-build` - Vercel-spezifischer Build

## Lizenz

Privat - Alle Rechte vorbehalten.
