-- cardl.io Database Status Check
-- Führen Sie diese Abfragen in Supabase SQL Editor aus

-- 1. Prüfe ob Tabelle existiert
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
) as table_exists;

-- 2. Zeige Tabellenstruktur
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- 3. Prüfe RLS-Policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 4. Prüfe Trigger
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'user_profiles';

-- 5. Zähle Einträge
SELECT COUNT(*) as total_records FROM user_profiles;

-- 6. Zeige alle Einträge (falls vorhanden)
SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 10;

-- 7. Prüfe Funktionen
SELECT routine_name, routine_type
FROM information_schema.routines 
WHERE routine_name IN ('create_user_profile', 'check_beta_access', 'grant_beta_access', 'update_updated_at_column');
