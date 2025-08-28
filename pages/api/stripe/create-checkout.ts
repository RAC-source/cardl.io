import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { 
  apiVersion: '2025-08-27.basil' 
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { productId, quantity = 1, customerEmail } = req.body

    if (!productId || !customerEmail) {
      return res.status(400).json({ 
        error: 'productId und customerEmail sind erforderlich' 
      })
    }

    // Produkt aus der Datenbank holen (später)
    // Für jetzt: Hardcoded Produkte
    const products = {
      'birthday-card': { name: 'Geburtstagskarte', price: 299 },
      'wedding-card': { name: 'Hochzeitskarte', price: 399 },
      'poster-a3': { name: 'Poster A3', price: 1499 },
      'sticker-set': { name: 'Sticker Set', price: 799 }
    }

    const product = products[productId as keyof typeof products]
    if (!product) {
      return res.status(400).json({ error: 'Produkt nicht gefunden' })
    }

    // Stripe Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.name,
              description: `cardl.io - ${product.name}`,
            },
            unit_amount: product.price, // in Cents
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      customer_email: customerEmail,
      metadata: {
        productId,
        productName: product.name,
        quantity: quantity.toString(),
      },
    })

    res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error) {
    console.error('Stripe Checkout Fehler:', error)
    res.status(500).json({ 
      error: 'Checkout-Session konnte nicht erstellt werden',
      details: error instanceof Error ? error.message : 'Unbekannter Fehler'
    })
  }
}
