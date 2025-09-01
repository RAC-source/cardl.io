-- cardl.io Database Schema (Alternative - ohne Datenverlust)
-- User Management für Beta-Zugang

-- Prüfe ob Tabelle existiert und füge fehlende Spalten hinzu
DO $$ 
BEGIN
  -- Erstelle Tabelle falls sie nicht existiert
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
    CREATE TABLE user_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      provider TEXT,
      beta_access BOOLEAN DEFAULT false,
      beta_access_granted_at TIMESTAMP WITH TIME ZONE,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    -- Füge fehlende Spalten hinzu falls Tabelle existiert
    BEGIN
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS provider TEXT;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS beta_access BOOLEAN DEFAULT false;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS beta_access_granted_at TIMESTAMP WITH TIME ZONE;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
      ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
  END IF;
END $$;
