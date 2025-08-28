import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Teste die Verbindung zur products Tabelle
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(5)

    if (error) {
      return res.status(500).json({ 
        error: 'Database connection failed', 
        details: error.message 
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      productsCount: products?.length || 0,
      sampleProducts: products
    })

  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
