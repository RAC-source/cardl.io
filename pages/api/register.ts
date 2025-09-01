import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'
import { UserService } from '../../lib/userService'

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

    if (!supabase) {
      console.error('❌ Supabase client not available')
      return res.status(500).json({ error: 'Database not available' })
    }

    // Erstelle neuen Benutzer mit Supabase
    const { data, error } = await supabase.auth.admin.createUser({
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
