'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  description: string
  category: string
  subcategory: string
  price: number
  image: string
  fallbackImage?: string
  featured?: boolean
  available?: boolean
  tags?: string[]
  allergens?: string[]
}

interface ProductsData {
  metadata: {
    version: string
    lastUpdate: string
    cafeName: string
    description: string
  }
  categories: {
    [key: string]: {
      name: string
      icon: string
      description: string
      subcategories: {
        [key: string]: {
          name: string
          badge: string
          description: string
        }
      }
    }
  }
  products: Product[]
}

export default function MenuPage() {
  const [productsData, setProductsData] = useState<ProductsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('food')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProductsData(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = productsData?.products.filter(product => {
    const matchesCategory = product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const isAvailable = product.available !== false
    return matchesCategory && matchesSearch && isAvailable
  }) || []

  const featuredProducts = filteredProducts.filter(p => p.featured).sort((a, b) => a.name.localeCompare(b.name))
  const regularProducts = filteredProducts.filter(p => !p.featured).sort((a, b) => a.name.localeCompare(b.name))
  const sortedProducts = [...featuredProducts, ...regularProducts]

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fluffy-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-400">Loading delicious menu...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Our Menu
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Culinary Art in Every Detail
          </p>
          <div className="w-20 h-1 bg-fluffy-red mx-auto"></div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 px-4 bg-gray-900 sticky top-0 z-40 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="mb-6">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md mx-auto block px-6 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-fluffy-red transition-colors"
            />
          </div>

          {/* Category Buttons */}
          <div className="flex justify-center gap-4 flex-wrap">
            {productsData && Object.entries(productsData.categories).map(([key, category]) => (
              <Button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`
                  px-6 py-3 rounded-full font-semibold transition-all duration-300
                  ${activeCategory === key
                    ? 'bg-fluffy-red text-white shadow-lg shadow-fluffy-red/50 scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }
                `}
              >
                {category.icon} {category.name.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-400">
                No products found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className="group bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 hover:border-fluffy-red transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-fluffy-red/20 cursor-pointer"
      style={{
        animation: `fade-in-up 0.6s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Image Container */}
      <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <img
          src={imageError ? product.fallbackImage : product.image}
          alt={product.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />

        {/* Featured Badge */}
        {product.featured && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <span>★</span> Featured
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {product.tags.slice(0, 2).map(tag => (
              <span key={tag} className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block bg-fluffy-red/20 text-fluffy-red px-3 py-1 rounded-lg text-xs font-bold uppercase border border-fluffy-red/30">
            {product.subcategory}
          </span>
        </div>

        <h3 className="text-2xl font-bold mb-2 group-hover:text-fluffy-red transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-gray-800">
          <span className="text-3xl font-bold text-white">
            €{product.price.toFixed(2)}
          </span>

          {product.allergens && product.allergens.length > 0 && (
            <span className="text-xs text-gray-500 hover:text-gray-300 cursor-help" title={`Allergens: ${product.allergens.join(', ')}`}>
              ⚠️ Allergens
            </span>
          )}
        </div>

        <Button className="w-full mt-4 bg-fluffy-red hover:bg-red-600 rounded-full font-semibold">
          Order Now
        </Button>
      </div>
    </div>
  )
}
