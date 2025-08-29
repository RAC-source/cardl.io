import nodemailer from 'nodemailer'

// E-Mail-Provider-Konfiguration
const createTransporter = () => {
  // Priorität: 1. Resend (schnell), 2. Fastmail (langsam)
  if (process.env.RESEND_API_KEY) {
    console.log('Using Resend email service (fast)')
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 587,
      secure: false,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
      }
    })
  }
  
  if (process.env.FASTMAIL_USER && process.env.FASTMAIL_PASSWORD) {
    console.log('Using Fastmail email service (slow)')
    return nodemailer.createTransport({
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
  }
  
  throw new Error('No email provider configured')
}

// E-Mail-Template für Willkommensnachricht
const createWelcomeEmail = (email: string, name?: string) => {
  const displayName = name || email.split('@')[0]
  
  return {
    subject: 'Willkommen bei cardl.io! 🎉',
    html: `
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
    text: `
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
}

// E-Mail senden
export const sendWelcomeEmail = async (email: string, name?: string) => {
  try {
    const transporter = createTransporter()
    const mailOptions = createWelcomeEmail(email, name)
    
    const info = await transporter.sendMail({
      from: `"cardl.io" <${process.env.FASTMAIL_USER}>`,
      to: email,
      ...mailOptions
    })
    
    console.log('Welcome email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
    
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// E-Mail-Service testen
export const testEmailService = async () => {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('Email service is ready')
    return true
  } catch (error) {
    console.error('Email service test failed:', error)
    return false
  }
}

// Test-E-Mail senden (für Debugging)
export const sendTestEmail = async (testEmail: string) => {
  try {
    const transporter = createTransporter()
    
    const testMailOptions = {
      from: `"cardl.io Test" <${process.env.FASTMAIL_USER}>`,
      to: testEmail,
      subject: '🧪 cardl.io E-Mail-Service Test',
      html: `
        <h2>E-Mail-Service Test erfolgreich! 🎉</h2>
        <p>Der Fastmail-Service funktioniert korrekt.</p>
        <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString('de-DE')}</p>
        <p><strong>Service:</strong> Fastmail SMTP</p>
      `,
      text: `E-Mail-Service Test erfolgreich! Der Fastmail-Service funktioniert korrekt.`
    }
    
    const info = await transporter.sendMail(testMailOptions)
    console.log('Test email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
    
  } catch (error) {
    console.error('Test email failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
