import type { NextApiRequest, NextApiResponse } from 'next'

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

    // Temporärer Fallback: Erfolgreiche Antwort ohne Datenbank
    // TODO: Später durch echte Supabase-Integration ersetzen
    console.log('Notify Me Request:', { email, name, interests })

    // Erfolgreiche Antwort
    res.status(200).json({
      success: true,
      message: 'Sie wurden erfolgreich zur Benachrichtigungsliste hinzugefügt!',
      data: {
        email: email.toLowerCase().trim(),
        name: name || null,
        interests: interests || [],
        subscribed_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Notify me error:', error)
    res.status(500).json({ 
      error: 'Ein unerwarteter Fehler ist aufgetreten',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    })
  }
}
