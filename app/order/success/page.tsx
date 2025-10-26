'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails(sessionId)
    }
  }, [sessionId])

  const fetchOrderDetails = async (id: string) => {
    try {
      // In production, fetch order details from API
      // const response = await fetch(`/api/orders/${id}`)
      // const data = await response.json()
      // setOrderDetails(data)

      // For now, just set loading to false
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching order details:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fluffy-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-400">Processing your order...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-900 rounded-3xl p-8 md:p-12 border border-gray-800 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Order Confirmed!
        </h1>

        <p className="text-xl text-gray-400 mb-8">
          Thank you for your order! We'll start preparing it right away.
        </p>

        {/* Order Number */}
        {sessionId && (
          <div className="bg-gray-800 rounded-2xl p-6 mb-8">
            <p className="text-sm text-gray-400 mb-2">Order Number</p>
            <p className="text-lg font-mono text-fluffy-red">
              #{sessionId.slice(-8).toUpperCase()}
            </p>
          </div>
        )}

        {/* What's Next */}
        <div className="text-left bg-gray-800 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">What's Next?</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-fluffy-red flex-shrink-0">✓</span>
              <span>You'll receive a confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-fluffy-red flex-shrink-0">✓</span>
              <span>We'll notify you when your order is ready</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-fluffy-red flex-shrink-0">✓</span>
              <span>Estimated preparation time: 15-30 minutes</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/menu">
            <Button size="lg" className="bg-fluffy-red hover:bg-red-600 rounded-full px-8">
              Order More
            </Button>
          </Link>

          <Link href="/">
            <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400">
          <p>Need help with your order?</p>
          <p className="mt-2">
            Call us at <a href="tel:+358453549022" className="text-fluffy-red hover:underline">+358 45 3549022</a>
          </p>
        </div>
      </div>
    </main>
  )
}
