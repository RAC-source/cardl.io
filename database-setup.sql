-- Notify List Tabelle für Coming-Soon E-Mail-Registrierungen
CREATE TABLE IF NOT EXISTS notify_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  interests TEXT[] DEFAULT '{}',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'coming-soon' -- woher die Registrierung kam
);

-- Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_notify_list_email ON notify_list(email);
CREATE INDEX IF NOT EXISTS idx_notify_list_active ON notify_list(is_active);

-- RLS aktivieren (optional, da öffentlich zugänglich)
ALTER TABLE notify_list ENABLE ROW LEVEL SECURITY;

-- Öffentliche Policy für Einfügungen
CREATE POLICY "Anyone can subscribe to notify list" ON notify_list
  FOR INSERT WITH CHECK (true);

-- Nur Admins können alle Einträge sehen (später)
CREATE POLICY "Only admins can view all notify list entries" ON notify_list
  FOR SELECT USING (false); -- Später durch echte Admin-Check ersetzen

-- Sample-Daten (optional)
-- INSERT INTO notify_list (email, name, interests) VALUES
-- ('test@example.com', 'Test User', ARRAY['cards', 'posters']);
