import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-90"></div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in-up bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Fluffy Bites
          </h1>

          <p className="text-xl md:text-3xl text-gray-300 mb-8 animate-fade-in-up animation-delay-200">
            Premium Coffee & Artisan Delights
          </p>

          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
            Experience the finest specialty coffee and handcrafted sandwiches in Espoo.
            Your new favorite cozy café awaits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <Link href="/menu">
              <Button size="lg" className="bg-fluffy-red hover:bg-red-600 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105">
                View Menu
              </Button>
            </Link>

            <Link href="/order">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg rounded-full transition-all duration-300">
                Order Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose Fluffy Bites?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="☕"
              title="Specialty Coffee"
              description="Premium artisan coffee roasted to perfection"
            />
            <FeatureCard
              icon="🥪"
              title="Fresh Sandwiches"
              description="Handcrafted daily with the finest ingredients"
            />
            <FeatureCard
              icon="🍰"
              title="Artisan Cakes"
              description="Homemade cakes and pastries baked fresh"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-fluffy-red">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Visit Us Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Merituulentie 36, 02200 Espoo, Finland
          </p>
          <Link href="/locations">
            <Button size="lg" className="bg-black hover:bg-gray-900 text-white px-8 py-6 text-lg rounded-full">
              Get Directions
            </Button>
          </Link>
        </div>
      </section>

      {/* Temporary note */}
      <section className="py-12 px-4 bg-yellow-500 text-black">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-semibold text-lg">
            🚀 <strong>Next.js Platform Active!</strong> This is the new modern platform.
            The classic site is still available at <Link href="/old-site" className="underline">index.html</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-black border border-gray-800 rounded-3xl p-8 hover:border-fluffy-red transition-all duration-300 hover:scale-105">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
