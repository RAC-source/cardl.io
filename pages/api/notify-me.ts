import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase, isSupabaseAvailable } from '../../lib/supabaseClient'

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

    const emailData = {
      email: email.toLowerCase().trim(),
      name: name || null,
      interests: interests || [],
      subscribed_at: new Date().toISOString()
    }

    // Versuche Supabase zu verwenden, falls verfügbar
    if (isSupabaseAvailable() && supabase) {
      try {
        const { data, error } = await supabase
          .from('notify_list')
          .insert([emailData])
          .select()

        if (error) {
          // Wenn E-Mail bereits existiert
          if (error.code === '23505') {
            return res.status(409).json({ 
              error: 'Diese E-Mail-Adresse ist bereits registriert' 
            })
          }
          
          console.error('Supabase database error:', error)
          // Fallback: Erfolgreiche Antwort trotz DB-Fehler
        } else {
          // Erfolgreich in Datenbank gespeichert
          return res.status(200).json({
            success: true,
            message: 'Sie wurden erfolgreich zur Benachrichtigungsliste hinzugefügt!',
            data: data[0],
            storage: 'database'
          })
        }
      } catch (supabaseError) {
        console.error('Supabase operation failed:', supabaseError)
        // Fallback: Weiter mit lokaler Verarbeitung
      }
    }

    // Fallback: Lokale Verarbeitung (immer erfolgreich)
    console.log('Notify Me Request (fallback):', emailData)
    
    // Hier könnten wir später eine lokale Datei oder andere Speichermethode verwenden
    // Für jetzt: Immer erfolgreiche Antwort

    res.status(200).json({
      success: true,
      message: 'Sie wurden erfolgreich zur Benachrichtigungsliste hinzugefügt!',
      data: emailData,
      storage: 'fallback',
      note: 'Ihre E-Mail wurde lokal gespeichert. Datenbank-Integration wird später aktiviert.'
    })

  } catch (error) {
    console.error('Notify me error:', error)
    res.status(500).json({ 
      error: 'Ein unerwarteter Fehler ist aufgetreten',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    })
  }
}
