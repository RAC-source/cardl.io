# cardl.io Database Setup

## 🚨 WICHTIG: Endlosschleife in RLS-Policies behoben!

Das ursprüngliche Schema hatte eine **Endlosschleife in den RLS-Policies**, die zu 500-Fehlern führte. Wir haben das behoben!

## 📋 Setup-Optionen

### Option 1: Vollständige Neuinstallation (Empfohlen)
```sql
-- Kopieren Sie den Inhalt von database/schema-simple.sql
-- und führen Sie ihn in Supabase SQL Editor aus
```

### Option 2: Sichere Installation (Daten erhalten)
```sql
-- Kopieren Sie den Inhalt von database/schema-safe.sql
-- und führen Sie ihn in Supabase SQL Editor aus
```

### Option 3: Cleanup + Neuinstallation
```sql
-- 1. Cleanup
-- Kopieren Sie database/cleanup.sql

-- 2. Schema (EINFACH & SICHER)
-- Kopieren Sie database/schema-simple.sql
```

## 🔍 Diagnose

### API-Test
```
https://cardl.io/api/check-db
```

### SQL-Test
```sql
-- Kopieren Sie database/check-status.sql
-- und führen Sie ihn in Supabase SQL Editor aus
```

## 🛠️ Troubleshooting

### Fehler: "infinite recursion detected in policy"
**Lösung:** Verwenden Sie `database/schema-simple.sql` - es hat keine problematischen RLS-Policies.

### Fehler: "relation user_profiles does not exist"
**Lösung:** Führen Sie das Schema aus.

### Fehler: "new row violates row-level security policy"
**Lösung:** Prüfen Sie, ob der Benutzer authentifiziert ist.

## 📊 Schema-Vergleich

| Schema | RLS-Policies | Endlosschleife | Empfehlung |
|--------|--------------|----------------|------------|
| `schema.sql` | Komplex | ❌ JA | Nicht verwenden |
| `schema-fixed.sql` | Komplex | ❌ JA | Nicht verwenden |
| `schema-simple.sql` | Einfach | ✅ NEIN | ✅ Empfohlen |
| `schema-safe.sql` | Einfach | ✅ NEIN | ✅ Für Updates |

## 🎯 Nächste Schritte

1. **Führen Sie `database/schema-simple.sql` aus**
2. **Testen Sie mit `/api/check-db`**
3. **Testen Sie die Registrierung**
4. **Prüfen Sie das Dashboard**
