-- cardl.io Database Cleanup Script
-- Nur Trigger und Funktionen löschen (ohne Datenverlust)

-- Lösche bestehende Trigger falls vorhanden
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Lösche bestehende Funktionen falls vorhanden
DROP FUNCTION IF EXISTS create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS check_beta_access(TEXT) CASCADE;
DROP FUNCTION IF EXISTS grant_beta_access(TEXT) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Lösche bestehende Policies falls vorhanden
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Lösche bestehende Trigger auf user_profiles falls vorhanden
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;

-- Lösche bestehende Indexe falls vorhanden
DROP INDEX IF EXISTS idx_user_profiles_user_id;
DROP INDEX IF EXISTS idx_user_profiles_email;
DROP INDEX IF EXISTS idx_user_profiles_beta_access;

-- Nach diesem Cleanup können Sie das vollständige Schema ausführen
-- ohne "already exists" Fehler zu bekommen
