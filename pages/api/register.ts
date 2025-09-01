import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { UserService } from '../../lib/userService'

// Erstelle Supabase Client mit Service Role Key für Admin-Operationen
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, full_name } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    console.log('🆕 Processing registration for:', email)

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Service Role Key not available')
      return res.status(500).json({ 
        error: 'Service Role Key not configured',
        hint: 'Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables'
      })
    }

    console.log('🔑 Using Service Role Key for registration')
    console.log('📧 Email:', email)
    console.log('👤 Full Name:', full_name)

    // Erstelle neuen Benutzer mit Service Role Key
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: 'temporary-password-' + Math.random().toString(36).substr(2, 9),
      email_confirm: true, // E-Mail automatisch bestätigen
      user_metadata: {
        full_name: full_name || '',
        provider: 'email'
      },
      app_metadata: {
        provider: 'email'
      }
    })

    if (error) {
      console.error('❌ Error creating user:', error)
      return res.status(400).json({ error: error.message })
    }

    if (!data.user) {
      console.error('❌ No user created')
      return res.status(500).json({ error: 'Failed to create user' })
    }

    console.log('✅ User created:', data.user.id)

    // Erstelle Benutzerprofil manuell
    const profile = await UserService.createUserProfile({
      user_id: data.user.id,
      email: data.user.email || '',
      full_name: full_name || '',
      provider: 'email'
    })

    if (profile) {
      console.log('✅ Profile created:', profile)
      return res.status(200).json({ 
        success: true, 
        user: data.user,
        profile: profile 
      })
    } else {
      console.error('❌ Failed to create profile')
      return res.status(500).json({ error: 'Failed to create profile' })
    }

  } catch (error) {
    console.error('❌ Error in registration API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
