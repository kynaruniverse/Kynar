import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getWorldBySlug } from '../constants/worlds'

const ProductDetails = () => {
  const { worldName, productId } = useParams()
  const navigate = useNavigate()
  const world = getWorldBySlug(worldName)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isPurchased, setIsPurchased] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error) throw error
      setProduct(data)

      // TODO Phase 4: Check if user has purchased this product
      // For now, randomly simulate some purchases for demo
      setIsPurchased(Math.random() > 0.7)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = () => {
    // TODO Phase 4: Implement Lemon Squeezy checkout
    alert('Purchase functionality will be implemented in Phase 4 with Lemon Squeezy!')
  }

  const handleDownload = () => {
    // TODO Phase 4: Generate signed URL for download
    alert('Download functionality will be implemented in Phase 4!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div 
          className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: world?.colors.accent, borderTopColor: 'transparent' }}
        ></div>
      </div>
    )
  }

  if (!product || !world) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button 
            onClick={() => navigate(`/worlds/${worldName}`)}
            className="base-button bg-gray-900 text-white"
          >
            ← Back to {worldName}
          </button>
        </div>
      </div>
    )
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div className={`min-h-screen ${world.themeClass}`} style={{ backgroundColor: world.colors.base }}>
      {/* Header */}
      <header className="p-4 md:p-8 border-b" style={{ borderColor: world.colors.accent + '20' }}>
        <button
          onClick={() => navigate(`/worlds/${worldName}`)}
          className="base-button bg-white/50 hover:bg-white/80"
          style={{ color: world.colors.text }}
        >
          ← Back to {world.name}
        </button>
      </header>

      {/* Product Details */}
      <main className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div 
              className="aspect-square rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: world.colors.accent + '20' }}
            >
              <div className="text-9xl opacity-50">
                {world.icon}
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 md:p-8 space-y-6">
              {/* Category Badge */}
              {product.category && (
                <div>
                  <span 
                    className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: world.colors.accent + '20',
                      color: world.colors.text 
                    }}
                  >
                    {product.category}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 
                className={`text-3xl md:text-4xl font-bold ${world.fontFamily}`}
                style={{ color: world.colors.text }}
              >
                {product.title}
              </h1>

              {/* Price */}
              <div 
                className="text-4xl font-bold"
                style={{ color: world.colors.accent }}
              >
                {formatPrice(product.price)}
              </div>

              {/* Description */}
              <div className="prose prose-lg">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Attached Guides Info */}
              {product.attached_guides && product.attached_guides.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-700">
                    <span>📚</span>
                    <span className="font-medium">
                      Includes {product.attached_guides.length} bonus guide{product.attached_guides.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Purchase/Download Button */}
              <div className="pt-6 border-t">
                {isPurchased ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <span>✓</span>
                      <span>You own this product</span>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="w-full base-button text-lg py-4"
                      style={{ 
                        backgroundColor: world.colors.accent,
                        color: '#FFFFFF'
                      }}
                    >
                      Download Now
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handlePurchase}
                    className="w-full base-button text-lg py-4"
                    style={{ 
                      backgroundColor: world.colors.accent,
                      color: '#FFFFFF'
                    }}
                  >
                    Buy Now - {formatPrice(product.price)}
                  </button>
                )}
              </div>

              {/* Additional Info */}
              <div className="text-sm text-gray-500 space-y-2">
                <p>✓ Instant digital delivery</p>
                <p>✓ Lifetime access</p>
                <p>✓ 30-day money-back guarantee</p>
              </div>
            </div>
          </div>

          {/* What's Included Section */}
          <div className="mt-12 bg-white/80 backdrop-blur rounded-2xl p-6 md:p-8">
            <h2 
              className="text-2xl font-bold mb-6"
              style={{ color: world.colors.text }}
            >
              What's Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="font-semibold mb-2">Digital Product</h3>
                <p className="text-sm text-gray-600">High-quality digital files ready to use</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="font-semibold mb-2">Free Updates</h3>
                <p className="text-sm text-gray-600">Get all future updates at no extra cost</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">💬</div>
                <h3 className="font-semibold mb-2">Support</h3>
                <p className="text-sm text-gray-600">Email support for any questions</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductDetails
