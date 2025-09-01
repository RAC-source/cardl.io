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
    const { user_id, email, full_name, avatar_url, provider } = req.body

    if (!user_id || !email) {
      return res.status(400).json({ error: 'user_id and email are required' })
    }

    console.log('🆕 Creating user profile manually:', { user_id, email, provider })

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Service Role Key not available')
      return res.status(500).json({ error: 'Service Role Key not configured' })
    }

    // Prüfe ob Profil bereits existiert
    const existingProfile = await UserService.getUserProfile(user_id)
    
    if (existingProfile) {
      console.log('✅ Profile already exists:', existingProfile)
      return res.status(200).json({ 
        success: true, 
        message: 'Profile already exists',
        profile: existingProfile 
      })
    }

    // Erstelle Profil direkt in der Datenbank (umgeht RLS-Probleme)
    const { data: profileData, error } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        user_id,
        email,
        full_name: full_name || email.split('@')[0],
        avatar_url,
        provider: provider || 'apple',
        beta_access: true,
        beta_access_granted_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('❌ Profile creation error:', error)
      return res.status(500).json({ 
        error: 'Failed to create profile',
        details: error.message 
      })
    }

    console.log('✅ Profile created successfully:', profileData)
    return res.status(200).json({ 
      success: true, 
      message: 'Profile created successfully',
      profile: profileData[0] 
    })

  } catch (error) {
    console.error('❌ Error in create-profile API:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
