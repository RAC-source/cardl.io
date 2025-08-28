import { createClient } from '@supabase/supabase-js'

// Robuste Supabase-Client-Erstellung mit Fallback
function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Überprüfen ob alle erforderlichen Umgebungsvariablen gesetzt sind
  if (!url || !anon) {
    console.warn('Supabase environment variables not set, using fallback mode')
    return null
  }

  try {
    return createClient(url, anon)
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    return null
  }
}

export const supabase = createSupabaseClient()

// Hilfsfunktion um zu prüfen ob Supabase verfügbar ist
export const isSupabaseAvailable = () => supabase !== null
