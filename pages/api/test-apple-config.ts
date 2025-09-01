import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔍 Testing Apple Sign-In configuration...')

    // Erstelle Supabase Client mit Service Role Key
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

    // Teste Apple Provider-Konfiguration
    try {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1
      })

      if (error) {
        console.error('❌ Admin access error:', error)
        return res.status(200).json({
          status: 'error',
          message: 'Cannot access Supabase admin functions',
          error: error.message
        })
      }

      console.log('✅ Admin access successful')

      // Teste Apple Sign-In Konfiguration
      const appleTestResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=apple&redirect_to=${encodeURIComponent('https://cardl.io/auth/callback')}`, {
        method: 'GET',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
        }
      })

      console.log('🔍 Apple provider test response:', appleTestResponse.status, appleTestResponse.statusText)

      if (appleTestResponse.ok) {
        return res.status(200).json({
          status: 'success',
          message: 'Apple Sign-In provider is accessible',
          details: {
            adminAccess: true,
            appleProvider: 'accessible',
            responseStatus: appleTestResponse.status
          },
          recommendations: [
            'Apple provider is accessible',
            'Check Apple Developer Console configuration',
            'Verify redirect URLs match exactly'
          ]
        })
      } else {
        const errorText = await appleTestResponse.text()
        console.error('❌ Apple provider test failed:', errorText)
        
        return res.status(200).json({
          status: 'error',
          message: 'Apple Sign-In provider configuration error',
          details: {
            adminAccess: true,
            appleProvider: 'error',
            responseStatus: appleTestResponse.status,
            errorText: errorText
          },
          recommendations: [
            'Check Apple Service ID in Supabase',
            'Verify Apple Private Key format',
            'Ensure redirect URLs match exactly',
            'Check Apple Developer Console settings'
          ]
        })
      }

    } catch (error) {
      console.error('❌ Apple configuration test error:', error)
      return res.status(200).json({
        status: 'error',
        message: 'Apple configuration test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        recommendations: [
          'Check Supabase Apple provider configuration',
          'Verify Apple Developer Console settings',
          'Ensure all required fields are filled'
        ]
      })
    }

  } catch (error) {
    console.error('❌ Apple configuration check error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Apple configuration check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
