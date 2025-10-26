import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Disable body parsing, need raw body for webhook verification
export const config = {
  api: {
    bodyParser: false,
  },
}

async function buffer(readable: ReadableStream) {
  const chunks = []
  const reader = readable.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  return Buffer.concat(chunks)
}

export async function POST(request: Request) {
  const body = await buffer(request.body!)
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object
      await handleCheckoutSessionCompleted(session)
      break

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log('💰 Payment succeeded:', paymentIntent.id)
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      console.log('❌ Payment failed:', failedPayment.id)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutSessionCompleted(session: any) {
  console.log('✅ Checkout session completed:', session.id)

  // Create order record
  const order = {
    id: session.id,
    customerEmail: session.customer_details?.email,
    customerName: session.customer_details?.name,
    amount: session.amount_total / 100, // Convert from cents
    currency: session.currency,
    status: 'paid',
    items: JSON.parse(session.metadata?.cartItems || '[]'),
    shippingAddress: session.shipping_details?.address,
    createdAt: new Date().toISOString(),
    paymentIntent: session.payment_intent,
  }

  // Save order to file (in production, use database)
  try {
    const ordersDir = path.join(process.cwd(), 'data', 'orders')

    // Create directory if it doesn't exist
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir, { recursive: true })
    }

    const orderFile = path.join(ordersDir, `${order.id}.json`)
    fs.writeFileSync(orderFile, JSON.stringify(order, null, 2))

    console.log('📝 Order saved:', orderFile)

    // TODO: Send confirmation email to customer
    // TODO: Notify staff about new order
    // TODO: Generate invoice PDF
  } catch (error) {
    console.error('Error saving order:', error)
  }
}
