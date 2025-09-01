import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔍 Checking Apple Sign-In configuration...')

    if (!supabase) {
      return res.status(500).json({ error: 'Supabase client not available' })
    }

    // Prüfe Environment Variables für Apple
    const hasAppleConfig = !!process.env.APPLE_SERVICE_ID || !!process.env.APPLE_KEY_ID || !!process.env.APPLE_TEAM_ID || !!process.env.APPLE_PRIVATE_KEY

    console.log('📋 Apple Environment Variables:')
    console.log('- APPLE_SERVICE_ID:', !!process.env.APPLE_SERVICE_ID ? '✅ Present' : '❌ Missing')
    console.log('- APPLE_KEY_ID:', !!process.env.APPLE_KEY_ID ? '✅ Present' : '❌ Missing')
    console.log('- APPLE_TEAM_ID:', !!process.env.APPLE_TEAM_ID ? '✅ Present' : '❌ Missing')
    console.log('- APPLE_PRIVATE_KEY:', !!process.env.APPLE_PRIVATE_KEY ? '✅ Present' : '❌ Missing')

    // Prüfe Supabase URL-Konfiguration
    const siteUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSiteUrl = !!siteUrl

    // Teste Apple Sign-In Provider
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'https://cardl.io/auth/callback'
        }
      })
      
      if (error) {
        console.error('❌ Apple provider test error:', error)
        return res.status(200).json({
          status: 'error',
          message: 'Apple Sign-In provider not configured or has errors',
          error: error.message,
          details: {
            hasAppleConfig,
            environmentVariables: {
              appleServiceId: !!process.env.APPLE_SERVICE_ID,
              appleKeyId: !!process.env.APPLE_KEY_ID,
              appleTeamId: !!process.env.APPLE_TEAM_ID,
              applePrivateKey: !!process.env.APPLE_PRIVATE_KEY
            },
            supabase: {
              siteUrl: hasSiteUrl,
              url: siteUrl
            }
          },
          recommendations: {
            ifMissingAppleConfig: 'Configure Apple Sign-In in Supabase Dashboard → Authentication → Providers → Apple',
            ifProviderError: 'Check Apple Developer Console configuration and redirect URLs'
          }
        })
      }

      console.log('✅ Apple provider test successful')
      return res.status(200).json({
        status: 'success',
        message: 'Apple Sign-In provider is configured and working',
        details: {
          hasAppleConfig,
          environmentVariables: {
            appleServiceId: !!process.env.APPLE_SERVICE_ID,
            appleKeyId: !!process.env.APPLE_KEY_ID,
            appleTeamId: !!process.env.APPLE_TEAM_ID,
            applePrivateKey: !!process.env.APPLE_PRIVATE_KEY
          },
          supabase: {
            siteUrl: hasSiteUrl,
            url: siteUrl
          },
          appleTest: 'provider_working'
        }
      })
    } catch (error) {
      console.error('❌ Apple provider test failed:', error)
      return res.status(200).json({
        status: 'error',
        message: 'Apple Sign-In provider test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          hasAppleConfig,
          environmentVariables: {
            appleServiceId: !!process.env.APPLE_SERVICE_ID,
            appleKeyId: !!process.env.APPLE_KEY_ID,
            appleTeamId: !!process.env.APPLE_TEAM_ID,
            applePrivateKey: !!process.env.APPLE_PRIVATE_KEY
          },
          supabase: {
            siteUrl: hasSiteUrl,
            url: siteUrl
          },
          appleTest: 'test_failed'
        }
      })
    }

  } catch (error) {
    console.error('❌ Apple Sign-In check error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Apple Sign-In check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
