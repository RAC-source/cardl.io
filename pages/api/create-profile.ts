import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'
import { UserService } from '../../lib/userService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { user_id, email, full_name, provider } = req.body

    if (!user_id || !email) {
      return res.status(400).json({ error: 'user_id and email are required' })
    }

    console.log('🆕 Creating profile for existing user:', { user_id, email, full_name, provider })

    // Prüfe ob Profil bereits existiert
    const existingProfile = await UserService.getUserProfile(user_id)
    if (existingProfile) {
      console.log('✅ Profile already exists:', existingProfile)
      return res.status(200).json({ 
        success: true, 
        profile: existingProfile,
        message: 'Profile already exists' 
      })
    }

    // Erstelle neues Profil
    const profile = await UserService.createUserProfile({
      user_id,
      email,
      full_name,
      provider: provider || 'email'
    })

    if (profile) {
      console.log('✅ Profile created successfully:', profile)
      return res.status(200).json({ 
        success: true, 
        profile: profile 
      })
    } else {
      console.log('❌ Failed to create profile')
      return res.status(500).json({ error: 'Failed to create profile' })
    }

  } catch (error) {
    console.error('❌ Error in create-profile API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
