import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔍 Checking Service Role Key configuration...')

    // Prüfe Environment Variables
    const hasServiceRoleKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL

    console.log('📋 Environment Variables:')
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', hasServiceRoleKey ? '✅ Present' : '❌ Missing')
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', hasAnonKey ? '✅ Present' : '❌ Missing')
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', hasUrl ? '✅ Present' : '❌ Missing')

    if (!hasServiceRoleKey) {
      return res.status(200).json({
        status: 'error',
        message: 'Service Role Key not configured',
        details: {
          serviceRoleKey: false,
          anonKey: hasAnonKey,
          url: hasUrl
        },
        solution: 'Add SUPABASE_SERVICE_ROLE_KEY to your environment variables'
      })
    }

    // Teste Service Role Key
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

    // Teste Admin-Berechtigungen
    try {
      const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1
      })

      if (error) {
        console.error('❌ Service Role Key test failed:', error)
        return res.status(200).json({
          status: 'error',
          message: 'Service Role Key is invalid or has insufficient permissions',
          error: error.message,
          details: {
            serviceRoleKey: true,
            anonKey: hasAnonKey,
            url: hasUrl,
            adminTest: false
          }
        })
      }

      console.log('✅ Service Role Key test successful')
      console.log('👥 Users found:', users?.users?.length || 0)

      return res.status(200).json({
        status: 'success',
        message: 'Service Role Key is properly configured',
        details: {
          serviceRoleKey: true,
          anonKey: hasAnonKey,
          url: hasUrl,
          adminTest: true,
          userCount: users?.users?.length || 0
        }
      })

    } catch (error) {
      console.error('❌ Service Role Key test error:', error)
      return res.status(200).json({
        status: 'error',
        message: 'Service Role Key test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          serviceRoleKey: true,
          anonKey: hasAnonKey,
          url: hasUrl,
          adminTest: false
        }
      })
    }

  } catch (error) {
    console.error('❌ Service Role Key check error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Service Role Key check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
