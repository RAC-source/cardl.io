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
    console.log('🔑 Using Magic Link fallback for registration')
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

    // Versuche zuerst normale signUp
    try {
      console.log('🧪 Attempting normal signUp...')
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: password,
        options: {
          data: {
            full_name: full_name || email.split('@')[0],
            provider: 'email'
          }
        }
      })

      if (authError) {
        console.error('❌ Normal signUp failed:', authError.message)
        throw authError
      }

      if (!authData.user) {
        console.error('❌ No user data returned from signUp')
        throw new Error('No user data returned')
      }

      console.log('✅ User created successfully via signUp:', authData.user.id)

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
          method: 'signUp',
          user: {
            id: authData.user.id,
            email: authData.user.email,
            profile
          }
        })

      } catch (profileError) {
        console.error('❌ Error creating profile:', profileError)
        
        return res.status(200).json({
          success: true,
          message: 'User registered successfully (profile creation failed)',
          method: 'signUp',
          user: {
            id: authData.user.id,
            email: authData.user.email,
            profile: null
          },
          warning: 'Profile creation failed'
        })
      }

    } catch (signUpError) {
      console.log('🔄 signUp failed, trying Magic Link fallback...')
      
      // Fallback: Verwende Magic Link für Registrierung
      try {
        const redirectUrl = process.env.NODE_ENV === 'production' 
          ? 'https://cardl.io/auth/callback'
          : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`

        const { data: magicData, error: magicError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: full_name || email.split('@')[0],
              provider: 'email',
              is_registration: true
            }
          }
        })

        if (magicError) {
          console.error('❌ Magic Link failed:', magicError.message)
          return res.status(500).json({ 
            error: 'Both signUp and Magic Link failed',
            details: {
              signUpError: signUpError instanceof Error ? signUpError.message : 'Unknown error',
              magicError: magicError.message
            }
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
        console.error('❌ Magic Link fallback failed:', magicError)
        return res.status(500).json({ 
          error: 'All registration methods failed',
          details: {
            signUpError: signUpError instanceof Error ? signUpError.message : 'Unknown error',
            magicError: magicError instanceof Error ? magicError.message : 'Unknown error'
          }
        })
      }
    }

  } catch (error) {
    console.error('❌ Error in register API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
