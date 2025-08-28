# Lokale Entwicklung Setup

## 1. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env.local` Datei im Projektroot:

```bash
cp env.example .env.local
```

Die `.env.local` sollte folgende Werte enthalten:

```env
NEXT_PUBLIC_SUPABASE_URL=https://myphyujlfjvmgcthpecn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cGh5dWpsZmp2bWdjdGhwZWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzOTA5NDksImV4cCI6MjA3MTk2Njk0OX0.llZEJq1LS7qro3mRkBDhezsV6IxJ4jBh1GDp_TLlbbg
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## 2. Entwicklungsserver starten

```bash
npm run dev
```

Der Server läuft dann auf `http://localhost:3000`

## 3. Verfügbare Routen

- **Homepage**: `http://localhost:3000/`
- **Health Check**: `http://localhost:3000/api/health`
- **Impressum**: `http://localhost:3000/impressum`
- **Datenschutz**: `http://localhost:3000/datenschutz`

## 4. Supabase Dashboard

- **URL**: https://supabase.com/dashboard/project/myphyujlfjvmgcthpecn
- **Datenbank**: PostgreSQL mit Row Level Security
- **Auth**: Magic Link, Google, Apple (noch zu konfigurieren)

## 5. Nächste Schritte

1. **Service Role Key** aus Supabase Dashboard kopieren
2. **Stripe Keys** für Test-Modus konfigurieren
3. **Datenbank-Schema** für Orders erstellen
4. **Auth-Provider** einrichten

## Troubleshooting

### Build-Fehler
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Dependencies neu installieren
```bash
rm -rf node_modules package-lock.json
npm install
```
