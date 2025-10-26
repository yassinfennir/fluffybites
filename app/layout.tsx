import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fluffy Bites - Premium Coffee & Artisan Delights',
  description: 'Discover Fluffy Bites in Espoo! Specialty coffee, fresh artisan sandwiches, and delicious cakes. Your new favorite cozy café at Merituulentie 36.',
  keywords: ['cafe Espoo', 'kahvila Espoo', 'specialty coffee', 'best cafe Helsinki', 'coffee shop Espoo', 'artisan sandwiches'],
  authors: [{ name: 'Fluffy Bites' }],
  creator: 'Fluffy Bites',
  publisher: 'Fluffy Bites',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://fluffybites.net',
    title: 'Fluffy Bites: Best Specialty Coffee & Artisan Sandwiches in Espoo',
    description: 'Discover Fluffy Bites at Merituulentie 36, Espoo! Handmade sandwiches, specialty coffee, and freshly baked cakes.',
    siteName: 'Fluffy Bites',
    images: [
      {
        url: 'https://fluffybites.net/Fotos/Pasteles/chocolate-dreamland-1.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@fluffybitesfi',
    creator: '@fluffybitesfi',
    title: 'Fluffy Bites: Best Specialty Coffee & Artisan Sandwiches in Espoo',
    description: 'Discover Fluffy Bites at Merituulentie 36, Espoo!',
    images: ['https://fluffybites.net/Fotos/Pasteles/chocolate-dreamland-1.png'],
  },
  icons: {
    icon: '/Logo/1.png',
    apple: '/Logo/1.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
