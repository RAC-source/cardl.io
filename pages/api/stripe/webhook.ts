import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

export const config = { api: { bodyParser: false } }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-08-27.basil' })

function buffer(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = []
    req.on('data', (c: Uint8Array) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed')
  const sig = req.headers['stripe-signature'] as string
  const wh = process.env.STRIPE_WEBHOOK_SECRET
  if (!wh) return res.status(200).json({ ok: true, note: 'No webhook secret set (stub)' })

  const buf = await buffer(req)
  let evt: Stripe.Event
  try {
    evt = stripe.webhooks.constructEvent(buf, sig, wh)
  } catch (err: any) {
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` })
  }

  switch (evt.type) {
    case 'payment_intent.succeeded':
      // TODO: Order auf paid setzen
      break
    default:
      break
  }
  res.json({ received: true })
}
