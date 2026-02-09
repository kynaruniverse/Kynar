import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product, world }) => {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/worlds/${world.slug}/products/${product.id}`)
  }

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div className="base-card bg-white/80 backdrop-blur hover:shadow-lg active:scale-95 transition-all duration-150">
      {/* Product Image Placeholder */}
      <div 
        className="h-48 rounded-lg mb-4 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: world.colors.accent + '20' }}
      >
        <div className="text-6xl opacity-50">
          {world.icon}
        </div>
      </div>

      {/* Product Title */}
      <h3 
        className={`text-lg font-semibold mb-2 line-clamp-2 ${world.fontFamily}`}
        style={{ color: world.colors.text }}
      >
        {product.title}
      </h3>

      {/* Product Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
        {product.description}
      </p>

      {/* Category Tag */}
      {product.category && (
        <div className="mb-3">
          <span 
            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: world.colors.accent + '20',
              color: world.colors.text 
            }}
          >
            {product.category}
          </span>
        </div>
      )}

      {/* Attached Guides Preview */}
      {product.attached_guides && product.attached_guides.length > 0 && (
        <div className="mb-3 text-xs text-gray-500 flex items-center gap-1">
          <span>📚</span>
          <span>{product.attached_guides.length} guide{product.attached_guides.length > 1 ? 's' : ''} included</span>
        </div>
      )}

      {/* Price and Button */}
      <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        <span 
          className="text-2xl font-bold"
          style={{ color: world.colors.accent }}
        >
          {formatPrice(product.price)}
        </span>
        
        <button
          onClick={handleViewDetails}
          className="base-button px-5"
          style={{ 
            backgroundColor: world.colors.accent,
            color: '#FFFFFF'
          }}
        >
          View Details
        </button>
      </div>
    </div>
  )
}

export default ProductCard
