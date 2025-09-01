import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase client not available' })
    }

    console.log('🔍 Checking database status...')

    // 1. Prüfe ob Tabelle existiert
    const { data: tableCheck, error: tableError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1)

    if (tableError) {
      console.error('❌ Table check failed:', tableError)
      return res.status(200).json({ 
        status: 'error',
        message: 'user_profiles table does not exist or is not accessible',
        error: tableError.message,
        code: tableError.code
      })
    }

    console.log('✅ Table exists, checking RLS...')

    // 2. Prüfe RLS-Policies
    let policies = null
    let policyError = null
    try {
      const result = await supabase.rpc('get_policies', { table_name: 'user_profiles' })
      policies = result.data
      policyError = result.error
    } catch (error) {
      policyError = { message: 'get_policies function not available' }
    }

    // 3. Prüfe Trigger
    let triggers = null
    let triggerError = null
    try {
      const result = await supabase.rpc('get_triggers', { table_name: 'user_profiles' })
      triggers = result.data
      triggerError = result.error
    } catch (error) {
      triggerError = { message: 'get_triggers function not available' }
    }

    // 4. Versuche einen Test-Eintrag zu erstellen
    const testUser = {
      user_id: 'test-user-id-' + Date.now(),
      email: 'test@example.com',
      full_name: 'Test User',
      provider: 'test',
      beta_access: true,
      beta_access_granted_at: new Date().toISOString()
    }

    const { data: insertTest, error: insertError } = await supabase
      .from('user_profiles')
      .insert(testUser)
      .select()

    if (insertError) {
      console.error('❌ Insert test failed:', insertError)
      return res.status(200).json({
        status: 'error',
        message: 'Cannot insert into user_profiles table',
        error: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint
      })
    }

    console.log('✅ Insert test successful:', insertTest)

    // 5. Lösche Test-Eintrag
    const { error: deleteError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', testUser.user_id)

    if (deleteError) {
      console.error('❌ Delete test failed:', deleteError)
    }

    // 6. Zähle Einträge
    const { count, error: countError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    return res.status(200).json({
      status: 'success',
      message: 'Database is working correctly',
      tableExists: true,
      rlsEnabled: true,
      insertTest: insertTest ? 'passed' : 'failed',
      deleteTest: deleteError ? 'failed' : 'passed',
      totalRecords: count || 0,
      policies: policies || 'not available',
      triggers: triggers || 'not available'
    })

  } catch (error) {
    console.error('❌ Database check error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Database check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
