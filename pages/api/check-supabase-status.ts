import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔍 Checking Supabase database status...')

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ error: 'Service Role Key not configured' })
    }

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

          const results = {
        database: {
          connection: false,
          authUsersTable: false,
          userProfilesTable: false,
          userCount: 0,
          error: null as string | null
        },
        auth: {
          settings: false,
          providers: {
            google: false,
            apple: false,
            email: false
          },
          error: null as string | null
        }
      }

    // Teste Datenbank-Verbindung
    try {
      const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1
      })

      if (userError) {
        console.error('❌ Database connection error:', userError)
        results.database.error = userError.message
      } else {
        results.database.connection = true
        results.database.authUsersTable = true
        results.database.userCount = users?.users?.length || 0
        console.log('✅ Database connection successful')
      }
    } catch (error) {
      console.error('❌ Database connection exception:', error)
      results.database.error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Teste user_profiles Tabelle
    try {
      const { data: profiles, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('count')
        .limit(1)

      if (profileError) {
        console.error('❌ user_profiles table error:', profileError)
        results.database.userProfilesTable = false
      } else {
        results.database.userProfilesTable = true
        console.log('✅ user_profiles table accessible')
      }
    } catch (error) {
      console.error('❌ user_profiles table exception:', error)
      results.database.userProfilesTable = false
    }

    // Teste Auth-Provider
    try {
      // Teste Google OAuth
      const googleResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent('https://cardl.io/auth/callback')}`, {
        method: 'GET',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
        }
      })
      results.auth.providers.google = googleResponse.ok

      // Teste Apple OAuth
      const appleResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=apple&redirect_to=${encodeURIComponent('https://cardl.io/auth/callback')}`, {
        method: 'GET',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
        }
      })
      results.auth.providers.apple = appleResponse.ok

      // Teste Email Auth
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=email&redirect_to=${encodeURIComponent('https://cardl.io/auth/callback')}`, {
        method: 'GET',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`
        }
      })
      results.auth.providers.email = emailResponse.ok

      results.auth.settings = true
      console.log('✅ Auth providers test completed')
    } catch (error) {
      console.error('❌ Auth providers test error:', error)
      results.auth.error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Bestimme Status
    const isHealthy = results.database.connection && results.database.authUsersTable && results.database.userProfilesTable

    return res.status(200).json({
      status: isHealthy ? 'healthy' : 'error',
      message: isHealthy ? 'Supabase database is healthy' : 'Supabase database has issues',
      results,
      recommendations: isHealthy ? [] : [
        'Check Supabase Dashboard → Settings → Database',
        'Check Supabase Dashboard → Authentication → Settings',
        'Check Supabase Dashboard → Logs → Database',
        'Consider restarting Supabase project'
      ]
    })

  } catch (error) {
    console.error('❌ Supabase status check error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Supabase status check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
