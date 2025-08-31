# OAuth Setup für cardl.io

Diese Anleitung erklärt, wie Sie Google und Apple OAuth für die cardl.io Authentifizierung einrichten.

## 🚀 Übersicht

Die Authentifizierung verwendet Supabase mit folgenden OAuth-Providern:
- **Google OAuth** - Für Google-Konten
- **Apple Sign-In** - Für Apple-Konten  
- **Magic Link** - Für E-Mail-Login

## 📋 Voraussetzungen

1. **Supabase Projekt** (bereits eingerichtet)
2. **Google Cloud Console** Account
3. **Apple Developer Account** (für Apple Sign-In)
4. **Domain** (cardl.io)

## 🔧 Google OAuth Setup

### 1. Google Cloud Console

1. **Gehen Sie zu:** [Google Cloud Console](https://console.cloud.google.com/)
2. **Erstellen Sie ein neues Projekt** oder wählen Sie ein bestehendes
3. **Aktivieren Sie die Google+ API:**
   - APIs & Services → Library
   - Suchen Sie nach "Google+ API"
   - Klicken Sie auf "Enable"

### 2. OAuth 2.0 Credentials erstellen

1. **Gehen Sie zu:** APIs & Services → Credentials
2. **Klicken Sie auf:** "Create Credentials" → "OAuth 2.0 Client IDs"
3. **Wählen Sie:** "Web application"
4. **Konfigurieren Sie:**

```
Name: cardl.io OAuth
Authorized JavaScript origins:
- https://cardl.io
- http://localhost:3000 (für Entwicklung)

Authorized redirect URIs:
- https://cardl.io/auth/callback
- http://localhost:3000/auth/callback (für Entwicklung)
```

5. **Notieren Sie sich:**
   - Client ID
   - Client Secret

### 3. Supabase konfigurieren

1. **Gehen Sie zu:** Supabase Dashboard → Authentication → Providers
2. **Aktivieren Sie Google:**
   - Toggle "Enable"
   - Client ID: Ihre Google Client ID
   - Client Secret: Ihr Google Client Secret
   - Redirect URL: `https://cardl.io/auth/callback`

## 🍎 Apple Sign-In Setup

### 1. Apple Developer Console

1. **Gehen Sie zu:** [Apple Developer](https://developer.apple.com/)
2. **Erstellen Sie eine App ID:**
   - Certificates, Identifiers & Profiles
   - Identifiers → App IDs
   - "+" → "App"
   - Bundle ID: `io.cardl.web`

### 2. Sign-In with Apple aktivieren

1. **Wählen Sie Ihre App ID**
2. **Aktivieren Sie:** "Sign In with Apple"
3. **Konfigurieren Sie:**
   - Primary App ID: `io.cardl.web`
   - Website URLs: `https://cardl.io`

### 3. Service ID erstellen

1. **Identifiers → Services IDs**
2. **"+ New Service ID"**
3. **Konfigurieren Sie:**
   - Description: `cardl.io Sign In`
   - Identifier: `io.cardl.web.signin`
   - Domains: `cardl.io`
   - Return URLs: `https://cardl.io/auth/callback`

### 4. Private Key erstellen

1. **Keys → All**
2. **"+ New Key"**
3. **Aktivieren Sie:** "Sign In with Apple"
4. **Downloaden Sie:** Die .p8 Datei
5. **Notieren Sie sich:** Key ID

### 5. Supabase konfigurieren

1. **Supabase Dashboard → Authentication → Providers**
2. **Aktivieren Sie Apple:**
   - Toggle "Enable"
   - Service ID: `io.cardl.web.signin`
   - Key ID: Ihre Key ID
   - Private Key: Inhalt der .p8 Datei
   - Team ID: Ihre Apple Team ID
   - Redirect URL: `https://cardl.io/auth/callback`

## 📧 E-Mail Magic Link

### Supabase E-Mail konfigurieren

1. **Supabase Dashboard → Authentication → Email Templates**
2. **Konfigurieren Sie:**
   - Confirm signup
   - Magic Link
   - Change email address
   - Reset password

### E-Mail Provider (Resend)

1. **Gehen Sie zu:** [Resend](https://resend.com/)
2. **Erstellen Sie ein Konto**
3. **Verifizieren Sie Ihre Domain:** cardl.io
4. **API Key generieren**

### Supabase SMTP konfigurieren

1. **Supabase Dashboard → Settings → Auth**
2. **SMTP Settings:**
   - Host: `smtp.resend.com`
   - Port: `587`
   - User: `resend`
   - Password: Ihr Resend API Key
   - Sender Name: `cardl.io`
   - Sender Email: `noreply@cardl.io`

## 🔐 Environment Variables

Fügen Sie diese Variablen zu Ihrer `.env.local` hinzu:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://myphyujlfjvmgcthpecn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OAuth (optional, für zusätzliche Sicherheit)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
APPLE_SERVICE_ID=io.cardl.web.signin
APPLE_KEY_ID=your_apple_key_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_PRIVATE_KEY=your_apple_private_key

# E-Mail
RESEND_API_KEY=your_resend_api_key
```

## 🧪 Testing

### Lokale Entwicklung

1. **Starten Sie den Dev-Server:**
   ```bash
   npm run dev
   ```

2. **Testen Sie die OAuth-Flows:**
   - Google Sign-In: `http://localhost:3000/auth/login`
   - Apple Sign-In: `http://localhost:3000/auth/login`
   - Magic Link: `http://localhost:3000/auth/login`

### Produktion

1. **Deployen Sie zu Vercel:**
   ```bash
   git push origin main
   ```

2. **Testen Sie auf cardl.io:**
   - Beta-Zugang: `demo123` + `CARDL2025`
   - Login-Seite: `/auth/login`
   - OAuth-Flows testen

## 🛡️ Sicherheit

### Best Practices

1. **HTTPS erforderlich** für OAuth in Produktion
2. **Redirect URLs** exakt konfigurieren
3. **Client Secrets** sicher aufbewahren
4. **Rate Limiting** aktivieren
5. **Session Management** konfigurieren

### Supabase RLS Policies

```sql
-- Beispiel für user_profiles Tabelle
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

## 🔍 Troubleshooting

### Häufige Probleme

1. **"Invalid redirect URI"**
   - Prüfen Sie die Redirect URLs in Google/Apple Console
   - Stellen Sie sicher, dass HTTPS verwendet wird

2. **"Client ID not found"**
   - Prüfen Sie die Client ID in Supabase
   - Stellen Sie sicher, dass Google+ API aktiviert ist

3. **"Apple Sign-In not working"**
   - Prüfen Sie die Service ID Konfiguration
   - Stellen Sie sicher, dass die Domain verifiziert ist

4. **"Magic Link not sending"**
   - Prüfen Sie die SMTP-Konfiguration
   - Stellen Sie sicher, dass die Domain verifiziert ist

### Debugging

1. **Browser Console** prüfen für JavaScript-Fehler
2. **Supabase Logs** prüfen für Backend-Fehler
3. **Network Tab** prüfen für HTTP-Fehler
4. **OAuth Provider Logs** prüfen

## 📚 Ressourcen

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign-In Documentation](https://developer.apple.com/documentation/sign_in_with_apple)
- [Resend Documentation](https://resend.com/docs)

## 🎯 Nächste Schritte

Nach der OAuth-Konfiguration:

1. **Testen Sie alle Login-Methoden**
2. **Konfigurieren Sie User Profiles**
3. **Implementieren Sie Logout-Funktionalität**
4. **Fügen Sie Email-Verifikation hinzu**
5. **Implementieren Sie Password Reset**

---

**Hinweis:** Diese Konfiguration ist für die Beta-Phase von cardl.io. Für die Produktion sollten zusätzliche Sicherheitsmaßnahmen implementiert werden.
