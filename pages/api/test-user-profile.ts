import { NextApiRequest, NextApiResponse } from 'next'
import { UserService } from '../../lib/userService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { user_id, email, full_name, avatar_url, provider } = req.body

    if (!user_id || !email) {
      return res.status(400).json({ error: 'user_id and email are required' })
    }

    console.log('🆕 Creating test user profile:', { user_id, email, full_name, provider })

    const profile = await UserService.createUserProfile({
      user_id,
      email,
      full_name,
      avatar_url,
      provider
    })

    if (profile) {
      console.log('✅ Test profile created successfully:', profile)
      return res.status(200).json({ success: true, profile })
    } else {
      console.log('❌ Failed to create test profile')
      return res.status(500).json({ error: 'Failed to create profile' })
    }
  } catch (error) {
    console.error('❌ Error in test-user-profile:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
