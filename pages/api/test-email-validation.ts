import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🔍 Testing email validation and user creation...')

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

    // Teste verschiedene E-Mail-Formate
    const emailTests = [
      `test-${Date.now()}@cardl.io`,
      `test-${Date.now()}@gmail.com`,
      `test-${Date.now()}@outlook.com`,
      `test-${Date.now()}@yahoo.com`,
      `test-${Date.now()}@test.com`,
      `test-${Date.now()}@example.com`
    ]

    const results = {
      emailValidation: {} as any,
      userCreation: {
        adminCreateUser: {
          success: false,
          error: null as string | null,
          userId: null as string | null
        },
        normalSignUp: {
          success: false,
          error: null as string | null,
          userId: null as string | null
        }
      }
    }

    // Teste E-Mail-Validierung für verschiedene Domains
    for (const email of emailTests) {
      console.log(`🧪 Testing email validation for: ${email}`)
      
      try {
        // Teste mit normaler signUp
        const { data, error } = await supabaseAdmin.auth.signUp({
          email,
          password: 'testpassword123'
        })

        results.emailValidation[email] = {
          valid: !error,
          error: error?.message || null,
          userId: data?.user?.id || null
        }

        console.log(`✅ ${email}: ${!error ? 'VALID' : 'INVALID'} - ${error?.message || 'Success'}`)

      } catch (error) {
        results.emailValidation[email] = {
          valid: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: null
        }
        console.log(`❌ ${email}: INVALID - ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    // Teste Benutzer-Erstellung mit der ersten gültigen E-Mail
    const validEmail = Object.entries(results.emailValidation).find(([email, result]: [string, any]) => result.valid)?.[0]

    if (validEmail) {
      console.log(`🧪 Testing user creation with valid email: ${validEmail}`)

      // Teste admin.createUser
      try {
        const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
          email: validEmail,
          password: 'testpassword123',
          email_confirm: true
        })

        if (adminError) {
          results.userCreation.adminCreateUser.error = adminError.message
        } else {
          results.userCreation.adminCreateUser.success = true
          results.userCreation.adminCreateUser.userId = adminData.user?.id || null
        }
      } catch (error) {
        results.userCreation.adminCreateUser.error = error instanceof Error ? error.message : 'Unknown error'
      }

      // Teste normale signUp
      try {
        const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.signUp({
          email: validEmail,
          password: 'testpassword123'
        })

        if (signUpError) {
          results.userCreation.normalSignUp.error = signUpError.message
        } else {
          results.userCreation.normalSignUp.success = true
          results.userCreation.normalSignUp.userId = signUpData.user?.id || null
        }
      } catch (error) {
        results.userCreation.normalSignUp.error = error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Bestimme Status
    const hasValidEmail = Object.values(results.emailValidation).some((result: any) => result.valid)
    const hasWorkingAuth = results.userCreation.adminCreateUser.success || results.userCreation.normalSignUp.success

    return res.status(200).json({
      status: hasValidEmail && hasWorkingAuth ? 'success' : hasValidEmail ? 'partial_success' : 'error',
      message: hasValidEmail && hasWorkingAuth ? 'Email validation and user creation working' : 
               hasValidEmail ? 'Email validation working, but user creation issues' : 
               'Email validation failing',
      results,
      recommendations: hasValidEmail ? [
        'Email validation working - check user creation methods',
        'Review working email domains for production use'
      ] : [
        'All email domains failing validation',
        'Check Supabase Dashboard → Authentication → Settings',
        'Check email allowlist/blocklist settings',
        'Contact Supabase support'
      ]
    })

  } catch (error) {
    console.error('❌ Email validation test error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Email validation test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
