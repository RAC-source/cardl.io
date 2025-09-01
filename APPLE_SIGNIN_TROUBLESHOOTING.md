# Apple Sign-In Troubleshooting Guide

## 🚨 Apple Sign-In Problem: "Anmeldung fehlgeschlagen, keine gültige Sitzung gefunden"

### 🔍 **Schritt 1: Supabase Apple-Konfiguration prüfen**

#### **1.1 Supabase Dashboard → Authentication → Providers**
1. **Gehen Sie zu:** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Wählen Sie Ihr Projekt:** `cardl.io`
3. **Gehen Sie zu:** Authentication → Providers
4. **Prüfen Sie:** Apple Sign-In ist **aktiviert**

#### **1.2 Apple Provider-Konfiguration**
```
✅ Enabled: Ja
✅ Client ID: [Ihre Apple Service ID]
✅ Secret: [Ihr Apple Private Key]
✅ Redirect URL: https://cardl.io/auth/callback
```

### 🔍 **Schritt 2: Apple Developer Console prüfen**

#### **2.1 Service ID Konfiguration**
1. **Gehen Sie zu:** [Apple Developer Console](https://developer.apple.com/account/)
2. **Gehen Sie zu:** Certificates, Identifiers & Profiles → Identifiers
3. **Wählen Sie Ihre Service ID**
4. **Prüfen Sie:** "Sign In with Apple" ist aktiviert

#### **2.2 Domain Verification**
```
✅ Primary App ID: [Ihre App ID]
✅ Domains and Subdomains: cardl.io
✅ Return URLs: https://cardl.io/auth/callback
```

### 🔍 **Schritt 3: Redirect URLs prüfen**

#### **3.1 Supabase Site URL**
```
Site URL: https://cardl.io
```

#### **3.2 Supabase Redirect URLs**
```
Additional Redirect URLs:
- https://cardl.io/auth/callback
- http://localhost:3000/auth/callback (für Entwicklung)
```

### 🔍 **Schritt 4: Apple Private Key prüfen**

#### **4.1 Key-Format**
```bash
# Der Private Key sollte so aussehen:
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
-----END PRIVATE KEY-----
```

#### **4.2 Key-Parameter**
```
Key ID: [Ihre Key ID]
Team ID: [Ihre Team ID]
Service ID: [Ihre Service ID]
```

### 🔍 **Schritt 5: Browser-Konsole prüfen**

#### **5.1 Erwartete Logs bei Apple Sign-In:**
```
🔍 OAuth callback detected with hash parameters
🔍 User data: {id: 'uuid', provider: 'apple', ...}
🔍 Provider: apple
✅ Profile created/updated
```

#### **5.2 Fehler-Logs:**
```
❌ Apple Sign-In Fehler: [Fehlermeldung]
❌ No session found
❌ OAuth session error: [Fehlermeldung]
```

### 🛠️ **Schritt 6: Debugging-Tools**

#### **6.1 Apple Sign-In Test**
```javascript
// In Browser-Konsole ausführen:
supabase.auth.signInWithOAuth({
  provider: 'apple',
  options: {
    redirectTo: 'https://cardl.io/auth/callback'
  }
}).then(console.log).catch(console.error)
```

#### **6.2 Service Role Key Test**
```
https://cardl.io/api/check-service-role
```

### 🚨 **Häufige Probleme & Lösungen**

#### **Problem 1: "Invalid client"**
**Lösung:** Apple Service ID in Supabase überprüfen

#### **Problem 2: "Invalid redirect_uri"**
**Lösung:** Redirect URLs in Apple Developer Console prüfen

#### **Problem 3: "Invalid signature"**
**Lösung:** Apple Private Key neu generieren

#### **Problem 4: "No session found"**
**Lösung:** Normal bei OAuth - Session wird später erstellt

### 📋 **Checkliste**

- [ ] Apple Sign-In in Supabase aktiviert
- [ ] Apple Service ID korrekt
- [ ] Apple Private Key korrekt
- [ ] Redirect URLs konfiguriert
- [ ] Domain verification in Apple Console
- [ ] Browser-Konsole ohne Fehler
- [ ] Service Role Key funktioniert

### 🎯 **Nächste Schritte**

1. **Prüfen Sie:** Supabase Dashboard → Authentication → Providers → Apple
2. **Prüfen Sie:** Apple Developer Console → Service ID
3. **Testen Sie:** Apple Sign-In erneut
4. **Prüfen Sie:** Browser-Konsole für Fehlermeldungen
5. **Falls Fehler:** Spezifische Fehlermeldung teilen
