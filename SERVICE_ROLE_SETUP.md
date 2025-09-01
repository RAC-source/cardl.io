# cardl.io Service Role Key Setup

## 🚨 WICHTIG: Service Role Key für Registrierung erforderlich!

Die Email-Registrierung benötigt den **Service Role Key** von Supabase, um neue Benutzer zu erstellen.

## 🔑 Service Role Key konfigurieren

### 1. Supabase Dashboard
1. **Gehen Sie zu:** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Wählen Sie Ihr Projekt:** `cardl.io`
3. **Gehen Sie zu:** Settings → API
4. **Kopieren Sie den Service Role Key**

### 2. Environment Variables

#### Lokale Entwicklung (`.env.local`):
```bash
# Bestehende Variablen...
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# NEUE Variable hinzufügen:
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Produktion (Vercel):
1. **Gehen Sie zu:** Vercel Dashboard → cardl.io → Settings → Environment Variables
2. **Fügen Sie hinzu:**
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Ihr Service Role Key
   - **Environment:** Production (und Preview)

### 3. Sicherheit

**⚠️ WICHTIG:** Der Service Role Key hat **volle Admin-Rechte**!
- ✅ **Nur in Server-Side Code verwenden** (API Routes)
- ❌ **NIEMALS im Client-Side Code verwenden**
- ✅ **Nur für Admin-Operationen verwenden** (createUser, etc.)

## 🔍 Testen

### 1. Lokale Entwicklung
```bash
# .env.local prüfen
cat .env.local | grep SUPABASE
```

### 2. API-Test
```
POST /api/register
{
  "email": "test@example.com",
  "full_name": "Test User"
}
```

### 3. Erwartete Antwort
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "test@example.com"
  },
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "email": "test@example.com"
  }
}
```

## 🚨 Fehlerbehebung

### "Service Role Key not configured"
**Lösung:** Service Role Key in `.env.local` hinzufügen

### "User not allowed"
**Lösung:** Service Role Key verwenden statt Anon Key

### "Invalid API key"
**Lösung:** Service Role Key überprüfen (nicht Anon Key)

## 📋 Checkliste

- [ ] Service Role Key aus Supabase kopiert
- [ ] `.env.local` aktualisiert
- [ ] Vercel Environment Variables gesetzt
- [ ] API-Test erfolgreich
- [ ] Email-Registrierung funktioniert
