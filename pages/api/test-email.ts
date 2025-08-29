import type { NextApiRequest, NextApiResponse } from 'next'
import { testEmailService, sendTestEmail } from '../../lib/emailService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { action, testEmail } = req.body

    if (action === 'test-connection') {
      // Teste nur die Verbindung
      const isReady = await testEmailService()
      
      return res.status(200).json({
        success: isReady,
        message: isReady ? 'E-Mail-Service ist bereit' : 'E-Mail-Service ist nicht verfügbar',
        action: 'connection-test'
      })
    }

    if (action === 'send-test-email') {
      if (!testEmail) {
        return res.status(400).json({ 
          error: 'testEmail ist erforderlich für send-test-email' 
        })
      }

      // Sende eine Test-E-Mail
      const result = await sendTestEmail(testEmail)
      
      return res.status(200).json({
        success: result.success,
        message: result.success ? 'Test-E-Mail gesendet' : 'Test-E-Mail fehlgeschlagen',
        data: result,
        action: 'test-email-sent'
      })
    }

    return res.status(400).json({ 
      error: 'Ungültige Aktion. Verwenden Sie "test-connection" oder "send-test-email"' 
    })

  } catch (error) {
    console.error('Test email API error:', error)
    res.status(500).json({ 
      error: 'Ein unerwarteter Fehler ist aufgetreten',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    })
  }
}
