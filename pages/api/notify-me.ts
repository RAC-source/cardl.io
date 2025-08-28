import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, name, interests } = req.body

    if (!email) {
      return res.status(400).json({ 
        error: 'E-Mail-Adresse ist erforderlich' 
      })
    }

    // E-Mail-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Ungültige E-Mail-Adresse' 
      })
    }

    // Überprüfen ob Supabase verfügbar ist
    if (!supabase) {
      console.error('Supabase client not available')
      return res.status(500).json({ 
        error: 'Datenbankverbindung nicht verfügbar' 
      })
    }

    // In die Datenbank einfügen (notify_list Tabelle)
    const { data, error } = await supabase
      .from('notify_list')
      .insert([
        {
          email: email.toLowerCase().trim(),
          name: name || null,
          interests: interests || [],
          subscribed_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      // Wenn E-Mail bereits existiert
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ 
          error: 'Diese E-Mail-Adresse ist bereits registriert' 
        })
      }
      
      console.error('Database error:', error)
      return res.status(500).json({ 
        error: 'Fehler beim Speichern der E-Mail-Adresse',
        details: error.message
      })
    }

    // Erfolgreiche Antwort
    res.status(200).json({
      success: true,
      message: 'Sie wurden erfolgreich zur Benachrichtigungsliste hinzugefügt!',
      data: data[0]
    })

  } catch (error) {
    console.error('Notify me error:', error)
    res.status(500).json({ 
      error: 'Ein unerwarteter Fehler ist aufgetreten',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    })
  }
}
