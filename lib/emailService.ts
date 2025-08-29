import nodemailer from 'nodemailer'

// Resend API-basierte E-Mail-Integration
const sendViaResend = async (email: string, name?: string, isTest: boolean = false) => {
  try {
    const displayName = name || email.split('@')[0]
    const subject = isTest ? '🧪 cardl.io E-Mail-Service Test' : 'Willkommen bei cardl.io! 🎉'
    
    const emailData = {
      from: 'cardl.io <noreply@cardl.io>',
      to: email,
      subject: subject,
      html: isTest ? `
        <h2>E-Mail-Service Test erfolgreich! 🎉</h2>
        <p>Der Resend-API-Service funktioniert korrekt.</p>
        <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString('de-DE')}</p>
        <p><strong>Service:</strong> Resend API</p>
      ` : `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Willkommen bei cardl.io</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb, #16a34a); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">cardl.io</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Der Ausweiskarten-Druckdienst</p>
          </div>
          
          <h2 style="color: #2563eb; margin-top: 0;">Hallo ${displayName}! 👋</h2>
          
          <p>Vielen Dank, dass Sie sich für cardl.io interessieren!</p>
          
          <p>Sie wurden erfolgreich zu unserer Benachrichtigungsliste hinzugefügt. Wir werden Sie informieren, sobald:</p>
          
          <ul style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <li>🎨 Unser Karten-Editor verfügbar ist</li>
            <li>💳 Das Bestellsystem online geht</li>
            <li>🚀 cardl.io offiziell startet</li>
          </ul>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border: 1px solid #16a34a; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">Was Sie erwartet:</h3>
            <p style="margin-bottom: 10px;"><strong>• ID-1 Format:</strong> 85,60 × 53,98 mm</p>
            <p style="margin-bottom: 10px;"><strong>• Ein- & zweiseitiger Druck</p>
            <p style="margin-bottom: 0;"><strong>• Editor & PNG-Upload</strong></p>
          </div>
          
          <p>Wir arbeiten hart daran, Ihnen den besten Ausweiskarten-Druckdienst zu bieten!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cardl.io" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">cardl.io besuchen</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #666; text-align: center;">
            Sie erhalten diese E-Mail, weil Sie sich bei cardl.io angemeldet haben.<br>
            <a href="mailto:hello@cardl.io" style="color: #2563eb;">Kontakt</a> | 
            <a href="https://cardl.io/impressum" style="color: #2563eb;">Impressum</a> | 
            <a href="https://cardl.io/datenschutz" style="color: #2563eb;">Datenschutz</a>
          </p>
        </body>
        </html>
      `,
      text: isTest ? `
        E-Mail-Service Test erfolgreich! Der Resend-API-Service funktioniert korrekt.
        Zeitstempel: ${new Date().toLocaleString('de-DE')}
        Service: Resend API
      ` : `
        Willkommen bei cardl.io! 🎉
        
        Hallo ${displayName}!
        
        Vielen Dank, dass Sie sich für cardl.io interessieren!
        
        Sie wurden erfolgreich zu unserer Benachrichtigungsliste hinzugefügt. 
        Wir werden Sie informieren, sobald cardl.io verfügbar ist.
        
        Was Sie erwartet:
        • ID-1 Format: 85,60 × 53,98 mm
        • Ein- & zweiseitiger Druck
        • Editor & PNG-Upload
        
        Besuchen Sie uns: https://cardl.io
        
        Kontakt: hello@cardl.io
      `
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Resend API error: ${errorData.message || response.statusText}`)
    }

    const result = await response.json()
    console.log('Resend API response:', result)
    
    return { 
      success: true, 
      messageId: result.id,
      provider: 'resend'
    }

  } catch (error) {
    console.error('Resend API failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      provider: 'resend'
    }
  }
}

// Fastmail SMTP-Fallback (für den Fall, dass Resend nicht verfügbar ist)
const sendViaFastmail = async (email: string, name?: string, isTest: boolean = false) => {
  try {
    if (!process.env.FASTMAIL_USER || !process.env.FASTMAIL_PASSWORD) {
      throw new Error('Fastmail credentials not configured')
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.fastmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.FASTMAIL_USER,
        pass: process.env.FASTMAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    })

    const displayName = name || email.split('@')[0]
    const subject = isTest ? '🧪 cardl.io E-Mail-Service Test' : 'Willkommen bei cardl.io! 🎉'
    
    const mailOptions = {
      from: `"cardl.io" <${process.env.FASTMAIL_USER}>`,
      to: email,
      subject: subject,
      html: isTest ? `
        <h2>E-Mail-Service Test erfolgreich! 🎉</h2>
        <p>Der Fastmail-Service funktioniert korrekt.</p>
        <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString('de-DE')}</p>
        <p><strong>Service:</strong> Fastmail SMTP</p>
      ` : `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Willkommen bei cardl.io</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb, #16a34a); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">cardl.io</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Der Ausweiskarten-Druckdienst</p>
          </div>
          
          <h2 style="color: #2563eb; margin-top: 0;">Hallo ${displayName}! 👋</h2>
          
          <p>Vielen Dank, dass Sie sich für cardl.io interessieren!</p>
          
          <p>Sie wurden erfolgreich zu unserer Benachrichtigungsliste hinzugefügt. Wir werden Sie informieren, sobald:</p>
          
          <ul style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <li>🎨 Unser Karten-Editor verfügbar ist</li>
            <li>💳 Das Bestellsystem online geht</li>
            <li>🚀 cardl.io offiziell startet</li>
          </ul>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border: 1px solid #16a34a; margin: 20px 0;">
            <h3 style="color: #16a34a; margin-top: 0;">Was Sie erwartet:</h3>
            <p style="margin-bottom: 10px;"><strong>• ID-1 Format:</strong> 85,60 × 53,98 mm</p>
            <p style="margin-bottom: 10px;"><strong>• Ein- & zweiseitiger Druck</p>
            <p style="margin-bottom: 0;"><strong>• Editor & PNG-Upload</strong></p>
          </div>
          
          <p>Wir arbeiten hart daran, Ihnen den besten Ausweiskarten-Druckdienst zu bieten!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cardl.io" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">cardl.io besuchen</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #666; text-align: center;">
            Sie erhalten diese E-Mail, weil Sie sich bei cardl.io angemeldet haben.<br>
            <a href="mailto:hello@cardl.io" style="color: #2563eb;">Kontakt</a> | 
            <a href="https://cardl.io/impressum" style="color: #2563eb;">Impressum</a> | 
            <a href="https://cardl.io/datenschutz" style="color: #2563eb;">Datenschutz</a>
          </p>
        </body>
        </html>
      `,
      text: isTest ? `
        E-Mail-Service Test erfolgreich! Der Fastmail-Service funktioniert korrekt.
        Zeitstempel: ${new Date().toLocaleString('de-DE')}
        Service: Fastmail SMTP
      ` : `
        Willkommen bei cardl.io! 🎉
        
        Hallo ${displayName}!
        
        Vielen Dank, dass Sie sich für cardl.io interessieren!
        
        Sie wurden erfolgreich zu unserer Benachrichtigungsliste hinzugefügt. 
        Wir werden Sie informieren, sobald cardl.io verfügbar ist.
        
        Was Sie erwartet:
        • ID-1 Format: 85,60 × 53,98 mm
        • Ein- & zweiseitiger Druck
        • Editor & PNG-Upload
        
        Besuchen Sie uns: https://cardl.io
        
        Kontakt: hello@cardl.io
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Fastmail email sent successfully:', info.messageId)
    
    return { 
      success: true, 
      messageId: info.messageId,
      provider: 'fastmail'
    }

  } catch (error) {
    console.error('Fastmail email failed:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      provider: 'fastmail'
    }
  }
}

// Hauptfunktion: Versucht zuerst Resend, dann Fastmail
export const sendWelcomeEmail = async (email: string, name?: string) => {
  console.log('Attempting to send welcome email via Resend...')
  
  // Versuche zuerst Resend
  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend(email, name)
    if (resendResult.success) {
      console.log('✅ Email sent successfully via Resend')
      return resendResult
    }
    console.log('❌ Resend failed, trying Fastmail...')
  }

  // Fallback auf Fastmail
  if (process.env.FASTMAIL_USER && process.env.FASTMAIL_PASSWORD) {
    console.log('Attempting to send welcome email via Fastmail...')
    const fastmailResult = await sendViaFastmail(email, name)
    if (fastmailResult.success) {
      console.log('✅ Email sent successfully via Fastmail')
      return fastmailResult
    }
    console.log('❌ Fastmail also failed')
  }

  // Beide Provider fehlgeschlagen
  console.error('All email providers failed')
  return { 
    success: false, 
    error: 'No email provider available',
    provider: 'none'
  }
}

// Test-E-Mail senden
export const sendTestEmail = async (testEmail: string) => {
  console.log('Attempting to send test email via Resend...')
  
  // Versuche zuerst Resend
  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend(testEmail, undefined, true)
    if (resendResult.success) {
      console.log('✅ Test email sent successfully via Resend')
      return resendResult
    }
    console.log('❌ Resend test failed, trying Fastmail...')
  }

  // Fallback auf Fastmail
  if (process.env.FASTMAIL_USER && process.env.FASTMAIL_PASSWORD) {
    console.log('Attempting to send test email via Fastmail...')
    const fastmailResult = await sendViaFastmail(testEmail, undefined, true)
    if (fastmailResult.success) {
      console.log('✅ Test email sent successfully via Fastmail')
      return fastmailResult
    }
    console.log('❌ Fastmail test also failed')
  }

  // Beide Provider fehlgeschlagen
  console.error('All email providers failed for test email')
  return { 
    success: false, 
    error: 'No email provider available',
    provider: 'none'
  }
}

// E-Mail-Service testen
export const testEmailService = async () => {
  try {
    if (process.env.RESEND_API_KEY) {
      console.log('Resend API key available')
      return true
    }
    
    if (process.env.FASTMAIL_USER && process.env.FASTMAIL_PASSWORD) {
      console.log('Fastmail credentials available')
      return true
    }
    
    console.log('No email provider configured')
    return false
  } catch (error) {
    console.error('Email service test failed:', error)
    return false
  }
}
