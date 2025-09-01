# Apple Sign-In JWT Generator Anleitung

## 🚨 WICHTIG: Apple Secret Key muss JWT-Format sein!

Supabase erwartet den Apple Secret Key im **JWT-Format**, nicht als Raw Private Key.

## 🔧 **Schritt-für-Schritt Anleitung:**

### **Schritt 1: Apple Developer Console Daten sammeln**

1. **Gehen Sie zu:** [Apple Developer Console](https://developer.apple.com/account/)
2. **Sammeln Sie:**
   - **Team ID:** Aus dem oberen rechten Bereich
   - **Service ID:** Aus Certificates, Identifiers & Profiles → Identifiers
   - **Key ID:** Aus Certificates, Identifiers & Profiles → Keys
   - **Private Key (.p8):** Aus Certificates, Identifiers & Profiles → Keys

### **Schritt 2: JWT generieren**

#### **Option A: Online JWT Generator (Einfach)**
1. **Gehen Sie zu:** [jwt.io](https://jwt.io/)
2. **Erstellen Sie JWT mit:**
   ```json
   {
     "iss": "YOUR_TEAM_ID",
     "iat": 1640995200,
     "exp": 1640998800,
     "aud": "https://appleid.apple.com",
     "sub": "YOUR_SERVICE_ID"
   }
   ```

#### **Option B: Node.js Script (Empfohlen)**
1. **Installieren Sie:** `npm install jsonwebtoken`
2. **Aktualisieren Sie:** `generate-apple-jwt.js` mit Ihren Daten
3. **Führen Sie aus:** `node generate-apple-jwt.js`

### **Schritt 3: JWT in Supabase einfügen**

1. **Gehen Sie zu:** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Wählen Sie Ihr Projekt:** `cardl.io`
3. **Gehen Sie zu:** Authentication → Providers → Apple
4. **Fügen Sie ein:**
   - **Client ID:** Ihre Apple Service ID
   - **Secret:** Den generierten JWT (nicht den Raw Private Key!)
   - **Redirect URL:** `https://cardl.io/auth/callback`
5. **Speichern Sie die Konfiguration**

## 📋 **JWT-Beispiel:**

```bash
# FALSCH (Raw Private Key):
-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
-----END PRIVATE KEY-----

# KORREKT (JWT):
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyMzQ1Njc4OTAifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLnlvdXJhcHAuc2lnbmluIiwiZXhwIjoxNjM0NTY3ODkwLCJpYXQiOjE2MzQ1NjQyOTAsInN1YiI6IjEyMzQ1Njc4OTAifQ.signature
```

## 🎯 **Nächste Schritte:**

1. **Generieren Sie den JWT** mit Ihren Apple-Daten
2. **Fügen Sie den JWT in Supabase** ein
3. **Testen Sie:** `/api/test-apple-config`
4. **Testen Sie:** Apple Sign-In erneut

## 🚨 **Häufige Fehler:**

- **"Secret key should be a JWT"** → Verwenden Sie JWT, nicht Raw Private Key
- **"Invalid signature"** → JWT ist abgelaufen oder falsch generiert
- **"Invalid client"** → Service ID stimmt nicht überein

**Nach der JWT-Korrektur sollte Apple Sign-In funktionieren!** 🍎
