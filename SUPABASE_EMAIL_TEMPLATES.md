# Supabase E-Mail-Templates für cardl.io

## 🎨 Design-System
- **Farbe:** Modern, dunkel mit Akzenten
- **Logo:** cardl.io Branding
- **Tone:** Professionell, freundlich, deutsch
- **Call-to-Action:** Klar und prominent

---

## 📧 Confirm Signup (E-Mail-Bestätigung)

### Betreff
```
Willkommen bei cardl.io - Bestätigen Sie Ihre E-Mail-Adresse
```

### HTML-Template
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Willkommen bei cardl.io</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0f172a; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: bold; color: white; margin-bottom: 10px; }
        .tagline { color: rgba(255,255,255,0.9); font-size: 16px; }
        .content { padding: 40px 20px; color: #e2e8f0; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #f8fafc; }
        .text { font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 14px; }
        .divider { height: 1px; background: #334155; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">cardl.io</div>
            <div class="tagline">Ihre digitale Visitenkarte</div>
        </div>
        
        <div class="content">
            <div class="title">Willkommen bei cardl.io! 🎉</div>
            
            <div class="text">
                Vielen Dank für Ihre Registrierung! Um Ihr Konto zu aktivieren und Ihre digitale Visitenkarte zu erstellen, bestätigen Sie bitte Ihre E-Mail-Adresse.
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    E-Mail-Adresse bestätigen
                </a>
            </div>
            
            <div class="text">
                <strong>Was erwartet Sie?</strong><br>
                • Erstellen Sie Ihre persönliche digitale Visitenkarte<br>
                • Teilen Sie sie einfach per Link oder QR-Code<br>
                • Verwalten Sie Ihre Kontaktdaten zentral
            </div>
            
            <div class="divider"></div>
            
            <div style="font-size: 14px; color: #94a3b8;">
                <strong>Falls der Button nicht funktioniert:</strong><br>
                Kopieren Sie diesen Link in Ihren Browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #60a5fa; word-break: break-all;">{{ .ConfirmationURL }}</a>
            </div>
        </div>
        
        <div class="footer">
            <p>Sie haben sich nicht bei cardl.io registriert? Ignorieren Sie diese E-Mail.</p>
            <p>© 2024 cardl.io - Alle Rechte vorbehalten</p>
        </div>
    </div>
</body>
</html>
```

---

## 🔗 Magic Link (Anmeldung)

### Betreff
```
Ihr Anmeldelink für cardl.io
```

### HTML-Template
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anmeldung bei cardl.io</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0f172a; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: bold; color: white; margin-bottom: 10px; }
        .tagline { color: rgba(255,255,255,0.9); font-size: 16px; }
        .content { padding: 40px 20px; color: #e2e8f0; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #f8fafc; }
        .text { font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 14px; }
        .divider { height: 1px; background: #334155; margin: 30px 0; }
        .security { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">cardl.io</div>
            <div class="tagline">Ihre digitale Visitenkarte</div>
        </div>
        
        <div class="content">
            <div class="title">Anmeldung bei cardl.io 🔐</div>
            
            <div class="text">
                Sie haben sich für eine Anmeldung bei cardl.io entschieden. Klicken Sie auf den Button unten, um sich sicher anzumelden.
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{ .TokenHash }}" class="button">
                    Jetzt anmelden
                </a>
            </div>
            
            <div class="security">
                <strong>🔒 Sicherheitshinweise:</strong><br>
                • Dieser Link ist nur 1 Stunde gültig<br>
                • Teilen Sie diesen Link nicht mit anderen<br>
                • Falls Sie diese E-Mail nicht angefordert haben, ignorieren Sie sie
            </div>
            
            <div class="divider"></div>
            
            <div style="font-size: 14px; color: #94a3b8;">
                <strong>Falls der Button nicht funktioniert:</strong><br>
                Kopieren Sie diesen Link in Ihren Browser:<br>
                <a href="{{ .TokenHash }}" style="color: #60a5fa; word-break: break-all;">{{ .TokenHash }}</a>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 cardl.io - Alle Rechte vorbehalten</p>
        </div>
    </div>
</body>
</html>
```

---

## 👥 User Invite (Einladung)

### Betreff
```
Sie wurden zu cardl.io eingeladen
```

### HTML-Template
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Einladung zu cardl.io</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0f172a; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: bold; color: white; margin-bottom: 10px; }
        .tagline { color: rgba(255,255,255,0.9); font-size: 16px; }
        .content { padding: 40px 20px; color: #e2e8f0; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #f8fafc; }
        .text { font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 14px; }
        .divider { height: 1px; background: #334155; margin: 30px 0; }
        .invite { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">cardl.io</div>
            <div class="tagline">Ihre digitale Visitenkarte</div>
        </div>
        
        <div class="content">
            <div class="title">Sie wurden eingeladen! 🎉</div>
            
            <div class="text">
                Sie wurden zu cardl.io eingeladen, um Ihre eigene digitale Visitenkarte zu erstellen und zu verwalten.
            </div>
            
            <div class="invite">
                <strong>Einladung von:</strong> {{ .InvitedBy }}<br>
                <strong>E-Mail:</strong> {{ .Email }}
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    Einladung annehmen
                </a>
            </div>
            
            <div class="text">
                <strong>Was erwartet Sie?</strong><br>
                • Erstellen Sie Ihre persönliche digitale Visitenkarte<br>
                • Teilen Sie sie einfach per Link oder QR-Code<br>
                • Verwalten Sie Ihre Kontaktdaten zentral
            </div>
            
            <div class="divider"></div>
            
            <div style="font-size: 14px; color: #94a3b8;">
                <strong>Falls der Button nicht funktioniert:</strong><br>
                Kopieren Sie diesen Link in Ihren Browser:<br>
                <a href="{{ .ConfirmationURL }}" style="color: #60a5fa; word-break: break-all;">{{ .ConfirmationURL }}</a>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 cardl.io - Alle Rechte vorbehalten</p>
        </div>
    </div>
</body>
</html>
```

---

## 📧 Change Email (E-Mail ändern)

### Betreff
```
Bestätigen Sie Ihre neue E-Mail-Adresse bei cardl.io
```

### HTML-Template
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Mail-Adresse ändern</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0f172a; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: bold; color: white; margin-bottom: 10px; }
        .tagline { color: rgba(255,255,255,0.9); font-size: 16px; }
        .content { padding: 40px 20px; color: #e2e8f0; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #f8fafc; }
        .text { font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 14px; }
        .divider { height: 1px; background: #334155; margin: 30px 0; }
        .change { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">cardl.io</div>
            <div class="tagline">Ihre digitale Visitenkarte</div>
        </div>
        
        <div class="content">
            <div class="title">E-Mail-Adresse ändern 📧</div>
            
            <div class="text">
                Sie haben eine Änderung Ihrer E-Mail-Adresse bei cardl.io angefordert. Bestätigen Sie bitte Ihre neue E-Mail-Adresse.
            </div>
            
            <div class="change">
                <strong>Neue E-Mail-Adresse:</strong> {{ .Email }}<br>
                <strong>Bestätigung erforderlich bis:</strong> {{ .TokenHash }}
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{ .TokenHash }}" class="button">
                    Neue E-Mail-Adresse bestätigen
                </a>
            </div>
            
            <div class="divider"></div>
            
            <div style="font-size: 14px; color: #94a3b8;">
                <strong>Falls der Button nicht funktioniert:</strong><br>
                Kopieren Sie diesen Link in Ihren Browser:<br>
                <a href="{{ .TokenHash }}" style="color: #60a5fa; word-break: break-all;">{{ .TokenHash }}</a>
            </div>
            
            <div style="font-size: 14px; color: #94a3b8; margin-top: 20px;">
                <strong>⚠️ Sicherheitshinweis:</strong><br>
                Falls Sie diese Änderung nicht angefordert haben, ignorieren Sie diese E-Mail und kontaktieren Sie uns umgehend.
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 cardl.io - Alle Rechte vorbehalten</p>
        </div>
    </div>
</body>
</html>
```

---

## 🔑 Reset Password (Passwort zurücksetzen)

### Betreff
```
Passwort zurücksetzen - cardl.io
```

### HTML-Template
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Passwort zurücksetzen</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0f172a; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: bold; color: white; margin-bottom: 10px; }
        .tagline { color: rgba(255,255,255,0.9); font-size: 16px; }
        .content { padding: 40px 20px; color: #e2e8f0; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #f8fafc; }
        .text { font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 14px; }
        .divider { height: 1px; background: #334155; margin: 30px 0; }
        .security { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">cardl.io</div>
            <div class="tagline">Ihre digitale Visitenkarte</div>
        </div>
        
        <div class="content">
            <div class="title">Passwort zurücksetzen 🔑</div>
            
            <div class="text">
                Sie haben eine Zurücksetzung Ihres Passworts bei cardl.io angefordert. Klicken Sie auf den Button unten, um ein neues Passwort zu erstellen.
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{ .TokenHash }}" class="button">
                    Neues Passwort erstellen
                </a>
            </div>
            
            <div class="security">
                <strong>🔒 Sicherheitshinweise:</strong><br>
                • Dieser Link ist nur 1 Stunde gültig<br>
                • Teilen Sie diesen Link nicht mit anderen<br>
                • Wählen Sie ein sicheres Passwort mit mindestens 8 Zeichen
            </div>
            
            <div class="divider"></div>
            
            <div style="font-size: 14px; color: #94a3b8;">
                <strong>Falls der Button nicht funktioniert:</strong><br>
                Kopieren Sie diesen Link in Ihren Browser:<br>
                <a href="{{ .TokenHash }}" style="color: #60a5fa; word-break: break-all;">{{ .TokenHash }}</a>
            </div>
            
            <div style="font-size: 14px; color: #94a3b8; margin-top: 20px;">
                <strong>⚠️ Wichtig:</strong><br>
                Falls Sie diese Zurücksetzung nicht angefordert haben, ignorieren Sie diese E-Mail. Ihr Passwort bleibt unverändert.
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 cardl.io - Alle Rechte vorbehalten</p>
        </div>
    </div>
</body>
</html>
```

---

## 🔐 Reauthentication (Erneute Authentifizierung)

### Betreff
```
Erneute Anmeldung erforderlich - cardl.io
```

### HTML-Template
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Erneute Anmeldung</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0f172a; }
        .container { max-width: 600px; margin: 0 auto; background: #1e293b; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
        .logo { font-size: 32px; font-weight: bold; color: white; margin-bottom: 10px; }
        .tagline { color: rgba(255,255,255,0.9); font-size: 16px; }
        .content { padding: 40px 20px; color: #e2e8f0; }
        .title { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #f8fafc; }
        .text { font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 14px; }
        .divider { height: 1px; background: #334155; margin: 30px 0; }
        .security { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">cardl.io</div>
            <div class="tagline">Ihre digitale Visitenkarte</div>
        </div>
        
        <div class="content">
            <div class="title">Erneute Anmeldung erforderlich 🔐</div>
            
            <div class="text">
                Für diese Aktion ist eine erneute Anmeldung erforderlich. Dies ist eine Sicherheitsmaßnahme zum Schutz Ihres Kontos.
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="{{ .TokenHash }}" class="button">
                    Jetzt anmelden
                </a>
            </div>
            
            <div class="security">
                <strong>🔒 Warum ist eine erneute Anmeldung erforderlich?</strong><br>
                • Änderung sensibler Kontodaten<br>
                • Sicherheitsmaßnahme nach längerer Inaktivität<br>
                • Schutz vor unbefugtem Zugriff
            </div>
            
            <div class="divider"></div>
            
            <div style="font-size: 14px; color: #94a3b8;">
                <strong>Falls der Button nicht funktioniert:</strong><br>
                Kopieren Sie diesen Link in Ihren Browser:<br>
                <a href="{{ .TokenHash }}" style="color: #60a5fa; word-break: break-all;">{{ .TokenHash }}</a>
            </div>
            
            <div style="font-size: 14px; color: #94a3b8; margin-top: 20px;">
                <strong>⚠️ Sicherheitshinweis:</strong><br>
                Falls Sie diese Anmeldung nicht angefordert haben, ignorieren Sie diese E-Mail und kontaktieren Sie uns umgehend.
            </div>
        </div>
        
        <div class="footer">
            <p>© 2024 cardl.io - Alle Rechte vorbehalten</p>
        </div>
    </div>
</body>
</html>
```

---

## 📋 Implementierung in Supabase

### Schritte:
1. **Supabase Dashboard öffnen**
2. **Authentication → Email Templates**
3. **Jedes Template auswählen und HTML ersetzen**
4. **Betreff-Zeile anpassen**
5. **Speichern**

### Variablen-Referenz:
- `{{ .ConfirmationURL }}` - Bestätigungs-URL
- `{{ .TokenHash }}` - Token/Link
- `{{ .Email }}` - E-Mail-Adresse
- `{{ .InvitedBy }}` - Einladender Benutzer

### Design-Features:
- ✅ **Responsive Design** - Funktioniert auf allen Geräten
- ✅ **Dark Theme** - Passt zu cardl.io Design
- ✅ **Gradient Header** - Moderner Look
- ✅ **Klare Call-to-Actions** - Prominente Buttons
- ✅ **Sicherheitshinweise** - Wichtige Informationen
- ✅ **Fallback-Links** - Falls Buttons nicht funktionieren
- ✅ **Professioneller Ton** - Freundlich und deutsch
