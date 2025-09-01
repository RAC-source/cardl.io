# Supabase Database Error Diagnose

## 🚨 Problem: "Database error saving new user"

Der Fehler kommt von **Supabase selbst**, bevor unsere Callback-Seite erreicht wird. Das bedeutet, dass Supabase den neuen Benutzer nicht in der `auth.users` Tabelle speichern kann.

## 🔍 **Mögliche Ursachen:**

### **1. Datenbank-Berechtigungen**
- Supabase hat keine Schreibrechte auf die `auth.users` Tabelle
- RLS-Policies blockieren Benutzer-Erstellung

### **2. Datenbank-Schema-Probleme**
- `auth.users` Tabelle ist beschädigt
- Fehlende Spalten oder Constraints

### **3. Supabase-Konfiguration**
- Falsche Datenbank-URL
- Service Role Key Probleme

## 🛠️ **Diagnose-Schritte:**

### **Schritt 1: Supabase Dashboard prüfen**
1. **Gehen Sie zu:** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Wählen Sie Ihr Projekt:** `cardl.io`
3. **Gehen Sie zu:** Settings → Database
4. **Prüfen Sie:** Database Status ist "Healthy"

### **Schritt 2: Auth Settings prüfen**
1. **Gehen Sie zu:** Authentication → Settings
2. **Prüfen Sie:** Site URL ist `https://cardl.io`
3. **Prüfen Sie:** Redirect URLs enthalten `https://cardl.io/auth/callback`

### **Schritt 3: Database Logs prüfen**
1. **Gehen Sie zu:** Logs → Database
2. **Suchen Sie nach:** Fehlermeldungen bei Benutzer-Erstellung
3. **Prüfen Sie:** Zeitstempel der Fehler

### **Schritt 4: SQL Editor Test**
```sql
-- Teste Datenbank-Zugriff
SELECT COUNT(*) FROM auth.users;

-- Teste Benutzer-Erstellung (falls möglich)
-- Dies sollte nur mit Service Role Key funktionieren
```

## 🚨 **Sofortige Lösungen:**

### **Option 1: Supabase neu starten**
1. **Gehen Sie zu:** Supabase Dashboard → Settings → General
2. **Klicken Sie auf:** "Restart" (falls verfügbar)

### **Option 2: Datenbank zurücksetzen**
1. **Gehen Sie zu:** Supabase Dashboard → Settings → Database
2. **Klicken Sie auf:** "Reset Database" (VORSICHT: Löscht alle Daten!)

### **Option 3: Neues Supabase-Projekt**
1. **Erstellen Sie ein neues Supabase-Projekt**
2. **Konfigurieren Sie OAuth-Provider neu**
3. **Migrieren Sie Daten** (falls möglich)

## 🎯 **Nächste Schritte:**

1. **Prüfen Sie:** Supabase Dashboard → Settings → Database
2. **Prüfen Sie:** Authentication → Settings
3. **Prüfen Sie:** Logs → Database für Fehlermeldungen
4. **Teilen Sie:** Spezifische Fehlermeldungen aus den Logs

**Das Problem liegt auf Supabase-Seite, nicht in unserem Code!** 🔧
