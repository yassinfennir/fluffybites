import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const CURRENCY = 'eur'
export const MIN_AMOUNT = 1.00
export const MAX_AMOUNT = 5000.00

export function formatAmountForStripe(
  amount: number,
  currency: string = CURRENCY
): number {
  // Stripe expects amounts in the smallest currency unit (cents for EUR)
  return Math.round(amount * 100)
}

export function formatAmountForDisplay(
  amount: number,
  currency: string = CURRENCY
): string {
  const numberFormat = new Intl.NumberFormat('en-FI', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  return numberFormat.format(amount / 100)
}
