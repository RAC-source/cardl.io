# cardl.io Database Setup

## 🗄️ Datenbankeinrichtung

### Option 1: Vollständige Neuinstallation (Empfohlen für Entwicklung)

Führen Sie `database/schema.sql` in Supabase aus:

1. **Gehen Sie zu:** Supabase Dashboard → SQL Editor
2. **Kopieren Sie den Inhalt** von `database/schema.sql`
3. **Führen Sie das Script aus**

**⚠️ Achtung:** Dies löscht alle bestehenden Daten in der `user_profiles` Tabelle!

### Option 2: Sichere Installation (Empfohlen für Produktion)

Führen Sie `database/schema-safe.sql` in Supabase aus:

1. **Gehen Sie zu:** Supabase Dashboard → SQL Editor
2. **Kopieren Sie den Inhalt** von `database/schema-safe.sql`
3. **Führen Sie das Script aus**

**✅ Vorteil:** Bestehende Daten bleiben erhalten, fehlende Spalten werden hinzugefügt.

### Option 3: Cleanup + Neuinstallation (Bei "already exists" Fehlern)

Wenn Sie Fehler wie "trigger already exists" bekommen:

1. **Führen Sie zuerst** `database/cleanup.sql` aus
2. **Dann führen Sie** `database/schema.sql` aus

**🔧 Lösung:** Dies löscht alle Trigger/Funktionen und erstellt sie neu.

## 🔧 Nach der Einrichtung

### 1. RLS-Policies prüfen

Stellen Sie sicher, dass Row Level Security aktiviert ist:

```sql
-- Prüfen Sie die Policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

### 2. Trigger prüfen

Prüfen Sie, ob der automatische Profil-Trigger funktioniert:

```sql
-- Prüfen Sie die Trigger
SELECT * FROM pg_triggers WHERE tgname = 'on_auth_user_created';
```

### 3. Testen

1. **Neuen Benutzer anmelden** (Google OAuth)
2. **Prüfen Sie die Datenbank:**
   ```sql
   SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 5;
   ```

## 🚨 Fehlerbehebung

### "column user_id does not exist"

**Lösung:** Verwenden Sie `database/schema-safe.sql` oder löschen Sie die Tabelle manuell:

```sql
DROP TABLE IF EXISTS user_profiles CASCADE;
```

Dann führen Sie `database/schema.sql` aus.

### "trigger already exists"

**Lösung:** Verwenden Sie das Cleanup-Script:

1. **Führen Sie** `database/cleanup.sql` aus
2. **Dann führen Sie** `database/schema.sql` aus

### "function create_user_profile() does not exist"

**Lösung:** Das Schema wurde nicht vollständig ausgeführt. Führen Sie das komplette Schema erneut aus.

### "permission denied"

**Lösung:** Stellen Sie sicher, dass Sie die richtigen Berechtigungen haben. Verwenden Sie den Service Role Key für administrative Operationen.

## 📊 Überprüfung

Nach erfolgreicher Einrichtung sollten Sie folgende Struktur haben:

```sql
-- Tabelle prüfen
\d user_profiles

-- Policies prüfen
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Trigger prüfen
SELECT * FROM pg_triggers WHERE tgname = 'on_auth_user_created';
```

## 🎯 Nächste Schritte

1. **Testen Sie die OAuth-Anmeldung**
2. **Prüfen Sie das Dashboard** für echte Benutzerdaten
3. **Konfigurieren Sie Magic Link E-Mails** (optional)
4. **Erweitern Sie die Benutzerprofile** (optional)
