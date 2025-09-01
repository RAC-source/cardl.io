import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { UserService } from '../../lib/userService'

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
    console.log('🔑 Using normal signUp (not admin) for registration')
    console.log('📧 Email:', email)
    console.log('👤 Full Name:', full_name || email.split('@')[0])

    // Erstelle normalen Supabase Client (nicht admin)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    if (!supabase) {
      console.error('❌ Supabase client not available')
      return res.status(500).json({ error: 'Supabase client not available' })
    }

    // Verwende normale signUp statt admin.createUser
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: password, // Verwende das echte Passwort
      options: {
        data: {
          full_name: full_name || email.split('@')[0],
          provider: 'email'
        }
      }
    })

    if (authError) {
      console.error('❌ Error creating user:', authError)
      return res.status(500).json({ 
        error: 'Failed to create user',
        details: authError.message 
      })
    }

    if (!authData.user) {
      console.error('❌ No user data returned')
      return res.status(500).json({ error: 'No user data returned' })
    }

    console.log('✅ User created successfully:', authData.user.id)

    // Erstelle Benutzer-Profil
    try {
      const profile = await UserService.createUserProfile({
        user_id: authData.user.id,
        email: authData.user.email || '',
        full_name: full_name || email.split('@')[0],
        provider: 'email'
      })

      console.log('✅ User profile created:', profile)

      return res.status(200).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          profile
        }
      })

    } catch (profileError) {
      console.error('❌ Error creating profile:', profileError)
      
      // Trotzdem erfolgreich, da Benutzer erstellt wurde
      return res.status(200).json({
        success: true,
        message: 'User registered successfully (profile creation failed)',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          profile: null
        },
        warning: 'Profile creation failed'
      })
    }

  } catch (error) {
    console.error('❌ Error in register API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
