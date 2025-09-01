import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, full_name } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    console.log('🆕 Processing registration for:', email)
    console.log('🔑 Using Magic Link only for registration')
    console.log('📧 Email:', email)
    console.log('👤 Full Name:', full_name || email.split('@')[0])

    // Erstelle normalen Supabase Client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    if (!supabase) {
      console.error('❌ Supabase client not available')
      return res.status(500).json({ error: 'Supabase client not available' })
    }

    // Verwende nur Magic Link für Registrierung (umgeht Datenbankprobleme)
    try {
      const redirectUrl = process.env.NODE_ENV === 'production' 
        ? 'https://cardl.io/auth/callback'
        : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`

      console.log('📧 Sending Magic Link for registration...')

      const { data: magicData, error: magicError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: full_name || email.split('@')[0],
            provider: 'email',
            is_registration: true,
            password: password // Speichere Passwort in Metadata für späteren Gebrauch
          }
        }
      })

      if (magicError) {
        console.error('❌ Magic Link failed:', magicError.message)
        return res.status(500).json({ 
          error: 'Failed to send Magic Link',
          details: magicError.message
        })
      }

      console.log('✅ Magic Link sent successfully')

      return res.status(200).json({
        success: true,
        message: 'Magic Link sent for registration. Please check your email.',
        method: 'magicLink',
        email: email,
        note: 'User will be created when they click the Magic Link'
      })

    } catch (magicError) {
      console.error('❌ Magic Link failed:', magicError)
      return res.status(500).json({ 
        error: 'Magic Link registration failed',
        details: magicError instanceof Error ? magicError.message : 'Unknown error'
      })
    }

  } catch (error) {
    console.error('❌ Error in register API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
