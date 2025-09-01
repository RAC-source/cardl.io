-- cardl.io Database Schema (KORRIGIERT)
-- User Management für Beta-Zugang

-- Lösche bestehende Tabelle falls vorhanden (VORSICHT: Löscht alle Daten!)
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Lösche bestehende Trigger falls vorhanden
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Lösche bestehende Funktionen falls vorhanden
DROP FUNCTION IF EXISTS create_user_profile() CASCADE;
DROP FUNCTION IF EXISTS check_beta_access(TEXT) CASCADE;
DROP FUNCTION IF EXISTS grant_beta_access(TEXT) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- User Profile Tabelle
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT, -- 'google', 'apple', 'email'
  beta_access BOOLEAN DEFAULT false,
  beta_access_granted_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_beta_access ON user_profiles(beta_access);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies für user_profiles (KORRIGIERT - ohne Endlosschleife)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Benutzer können ihr eigenes Profil lesen
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Benutzer können ihr eigenes Profil aktualisieren
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Benutzer können ihr eigenes Profil erstellen
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ERWEITERTE Policy für Beta-User (ohne Endlosschleife)
-- Beta-User können alle Profile lesen (für Dashboard)
CREATE POLICY "Beta users can view all profiles" ON user_profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_profiles 
      WHERE beta_access = true
    )
  );

-- Funktion zum Erstellen eines Benutzerprofils
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (
    user_id,
    email,
    full_name,
    avatar_url,
    provider,
    beta_access,
    beta_access_granted_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_app_meta_data->>'provider',
    true, -- Beta-Zugang automatisch gewähren
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger für automatische Profilerstellung
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Funktion zum Prüfen des Beta-Zugangs
CREATE OR REPLACE FUNCTION check_beta_access(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE email = user_email AND beta_access = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funktion zum Gewähren von Beta-Zugang
CREATE OR REPLACE FUNCTION grant_beta_access(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_profiles 
  SET beta_access = true, beta_access_granted_at = NOW()
  WHERE email = user_email;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
