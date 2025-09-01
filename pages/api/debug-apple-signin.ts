import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { action, data } = req.body

    if (!supabase) {
      return res.status(500).json({ error: 'Supabase client not available' })
    }

    console.log('🔍 Apple Sign-In Debug:', action, data)

    switch (action) {
      case 'start_signin':
        try {
          const { data: signInData, error } = await supabase.auth.signInWithOAuth({
            provider: 'apple',
            options: {
              redirectTo: 'https://cardl.io/auth/callback',
              queryParams: {
                // Apple-spezifische Parameter
                response_mode: 'form_post',
                response_type: 'code'
              }
            }
          })

          if (error) {
            console.error('❌ Apple Sign-In start error:', error)
            return res.status(200).json({
              status: 'error',
              message: 'Apple Sign-In start failed',
              error: error.message
            })
          }

          console.log('✅ Apple Sign-In started:', signInData)
          return res.status(200).json({
            status: 'success',
            message: 'Apple Sign-In started',
            data: signInData
          })
        } catch (error) {
          console.error('❌ Apple Sign-In start exception:', error)
          return res.status(200).json({
            status: 'error',
            message: 'Apple Sign-In start exception',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }

      case 'check_session':
        try {
          const { data: sessionData, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('❌ Session check error:', error)
            return res.status(200).json({
              status: 'error',
              message: 'Session check failed',
              error: error.message
            })
          }

          console.log('✅ Session check:', sessionData)
          return res.status(200).json({
            status: 'success',
            message: 'Session check completed',
            data: sessionData
          })
        } catch (error) {
          console.error('❌ Session check exception:', error)
          return res.status(200).json({
            status: 'error',
            message: 'Session check exception',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }

      case 'create_user_profile':
        try {
          const { user_id, email, full_name, provider } = data
          
          if (!user_id || !email) {
            return res.status(400).json({
              status: 'error',
              message: 'Missing required user data',
              required: ['user_id', 'email']
            })
          }

          // Erstelle User Profile direkt in der Datenbank
          const { data: profileData, error } = await supabase
            .from('user_profiles')
            .insert({
              user_id,
              email,
              full_name: full_name || email.split('@')[0],
              provider: provider || 'apple',
              beta_access: true,
              beta_access_granted_at: new Date().toISOString()
            })
            .select()

          if (error) {
            console.error('❌ Profile creation error:', error)
            return res.status(200).json({
              status: 'error',
              message: 'Profile creation failed',
              error: error.message
            })
          }

          console.log('✅ Profile created:', profileData)
          return res.status(200).json({
            status: 'success',
            message: 'Profile created successfully',
            data: profileData
          })
        } catch (error) {
          console.error('❌ Profile creation exception:', error)
          return res.status(200).json({
            status: 'error',
            message: 'Profile creation exception',
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }

      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid action',
          validActions: ['start_signin', 'check_session', 'create_user_profile']
        })
    }

  } catch (error) {
    console.error('❌ Apple debug API error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Apple debug API failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
