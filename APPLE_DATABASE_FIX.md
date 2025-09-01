# Apple Sign-In Database Fix

## 🚨 Problem: "Database error saving new user"

Apple Sign-In funktioniert jetzt (JWT-Problem gelöst), aber es gibt einen Datenbank-Fehler beim Speichern neuer Benutzer.

## 🔧 Lösung: Datenbank-Schema korrigieren

### **Schritt 1: Korrigiertes Schema ausführen**

1. **Gehen Sie zu:** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Wählen Sie Ihr Projekt:** `cardl.io`
3. **Gehen Sie zu:** SQL Editor
4. **Kopieren Sie den Inhalt** von `database/schema-apple-fix.sql`
5. **Führen Sie das Script aus**

### **Schritt 2: Was wurde korrigiert**

#### **Problem:**
- RLS-Policies verhinderten automatische Profil-Erstellung
- Trigger `create_user_profile()` konnte keine Profile erstellen

#### **Lösung:**
```sql
-- Temporär RLS deaktivieren für Profil-Erstellung
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Profil erstellen...

-- RLS wieder aktivieren
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
```

### **Schritt 3: Testen**

#### **1. Datenbank-Status prüfen:**
```
https://cardl.io/api/check-db
```

#### **2. Apple Sign-In testen:**
- **Gehen Sie zu:** `/auth/login`
- **Klicken Sie auf:** "Apple"
- **Erwarten Sie:** Erfolgreiche Anmeldung und Weiterleitung

#### **3. Dashboard prüfen:**
- **Gehen Sie zu:** `/dashboard`
- **Erwarten Sie:** Willkommensnachricht für Apple-Benutzer

## 🎯 Erwartete Logs nach der Korrektur:

```
🔍 OAuth callback detected with parameters
🍎 Apple Sign-In with code parameter detected
🔍 User data: {id: 'uuid', provider: 'apple', ...}
🔍 Provider: apple
✅ Profile created/updated
🎉 Apple-Anmeldung erfolgreich! Sie werden zum Dashboard weitergeleitet...
```

## 🚀 Status:

- ✅ **JWT-Problem:** Gelöst
- ✅ **Apple Sign-In:** Startet erfolgreich
- 🔄 **Datenbank-Fehler:** Wartet auf Schema-Korrektur
- 🔄 **Vollständige Integration:** Nach Schema-Korrektur

**Nach der Schema-Korrektur sollte Apple Sign-In vollständig funktionieren!** 🍎
