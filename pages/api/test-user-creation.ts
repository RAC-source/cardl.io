import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔍 Testing user creation with different methods...')

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

    const testEmail = `test-${Date.now()}@example.com`
    const results = {
      method1: {
        name: 'createUser with email only',
        success: false,
        error: null as string | null,
        userId: null as string | null
      },
      method2: {
        name: 'createUser with email and password',
        success: false,
        error: null as string | null,
        userId: null as string | null
      },
      method3: {
        name: 'createUser with email, password, and metadata',
        success: false,
        error: null as string | null,
        userId: null as string | null
      },
      method4: {
        name: 'createUser with minimal data',
        success: false,
        error: null as string | null,
        userId: null as string | null
      }
    }

    // Methode 1: Nur Email
    try {
      console.log('🧪 Testing Method 1: Email only')
      const { data: user1, error: error1 } = await supabaseAdmin.auth.admin.createUser({
        email: `${testEmail}-1@example.com`,
        email_confirm: true
      })

      if (error1) {
        console.error('❌ Method 1 failed:', error1)
        results.method1.error = error1.message
      } else {
        console.log('✅ Method 1 successful:', user1.user?.id)
        results.method1.success = true
        results.method1.userId = user1.user?.id || null
      }
    } catch (error) {
      console.error('❌ Method 1 exception:', error)
      results.method1.error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Methode 2: Email + Password
    try {
      console.log('🧪 Testing Method 2: Email + Password')
      const { data: user2, error: error2 } = await supabaseAdmin.auth.admin.createUser({
        email: `${testEmail}-2@example.com`,
        password: 'testpassword123',
        email_confirm: true
      })

      if (error2) {
        console.error('❌ Method 2 failed:', error2)
        results.method2.error = error2.message
      } else {
        console.log('✅ Method 2 successful:', user2.user?.id)
        results.method2.success = true
        results.method2.userId = user2.user?.id || null
      }
    } catch (error) {
      console.error('❌ Method 2 exception:', error)
      results.method2.error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Methode 3: Email + Password + Metadata
    try {
      console.log('🧪 Testing Method 3: Email + Password + Metadata')
      const { data: user3, error: error3 } = await supabaseAdmin.auth.admin.createUser({
        email: `${testEmail}-3@example.com`,
        password: 'testpassword123',
        email_confirm: true,
        user_metadata: {
          full_name: 'Test User',
          provider: 'email'
        }
      })

      if (error3) {
        console.error('❌ Method 3 failed:', error3)
        results.method3.error = error3.message
      } else {
        console.log('✅ Method 3 successful:', user3.user?.id)
        results.method3.success = true
        results.method3.userId = user3.user?.id || null
      }
    } catch (error) {
      console.error('❌ Method 3 exception:', error)
      results.method3.error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Methode 4: Minimal data
    try {
      console.log('🧪 Testing Method 4: Minimal data')
      const { data: user4, error: error4 } = await supabaseAdmin.auth.admin.createUser({
        email: `${testEmail}-4@example.com`
      })

      if (error4) {
        console.error('❌ Method 4 failed:', error4)
        results.method4.error = error4.message
      } else {
        console.log('✅ Method 4 successful:', user4.user?.id)
        results.method4.success = true
        results.method4.userId = user4.user?.id || null
      }
    } catch (error) {
      console.error('❌ Method 4 exception:', error)
      results.method4.error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Teste auch normale Auth (ohne admin)
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const signUpResults = {
      signUp: {
        name: 'Normal signUp (non-admin)',
        success: false,
        error: null as string | null,
        userId: null as string | null
      }
    }

    try {
      console.log('🧪 Testing Normal signUp')
      const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
        email: `${testEmail}-signup@example.com`,
        password: 'testpassword123'
      })

      if (signUpError) {
        console.error('❌ Normal signUp failed:', signUpError)
        signUpResults.signUp.error = signUpError.message
      } else {
        console.log('✅ Normal signUp successful:', signUpData.user?.id)
        signUpResults.signUp.success = true
        signUpResults.signUp.userId = signUpData.user?.id || null
      }
    } catch (error) {
      console.error('❌ Normal signUp exception:', error)
      signUpResults.signUp.error = error instanceof Error ? error.message : 'Unknown error'
    }

    // Bestimme Status
    const anySuccess = Object.values(results).some(r => r.success) || signUpResults.signUp.success

    return res.status(200).json({
      status: anySuccess ? 'partial_success' : 'error',
      message: anySuccess ? 'Some user creation methods work' : 'All user creation methods failed',
      results: { ...results, ...signUpResults },
      recommendations: anySuccess ? [
        'Some methods work - check which parameters are causing issues',
        'Review the working method and adapt registration flow'
      ] : [
        'All user creation methods failed - this is a Supabase configuration issue',
        'Check Supabase Dashboard → Authentication → Settings',
        'Check Supabase Dashboard → Settings → Database',
        'Consider contacting Supabase support'
      ]
    })

  } catch (error) {
    console.error('❌ User creation test error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'User creation test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
