import { useNavigate } from 'react-router-dom'
import { BookOpen, ArrowRight } from 'lucide-react'

const ProductCard = ({ product, world }) => {
  const navigate = useNavigate()

  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price)

  return (
    <div className="group flex flex-col h-full bg-white/90 backdrop-blur-sm rounded-3xl p-5 border border-black/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Visual Placeholder */}
      <div 
        className="aspect-video rounded-2xl mb-5 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-[1.02]"
        style={{ backgroundColor: `${world.colors.accent}15` }}
      >
        <span className="text-7xl group-hover:rotate-12 transition-transform duration-500">
          {world.icon}
        </span>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className={`text-xl font-bold leading-tight ${world.fontFamily}`} style={{ color: world.colors.text }}>
            {product.title}
          </h3>
          <span className="text-lg font-black" style={{ color: world.colors.accent }}>
            {priceString}
          </span>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        {product.category && (
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-4"
            style={{ backgroundColor: `${world.colors.accent}20`, color: world.colors.text }}>
            {product.category}
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        {product.attached_guides?.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
            <BookOpen size={14} />
            {product.attached_guides.length} Guides
          </div>
        )}
        
        <button
          onClick={() => navigate(`/worlds/${world.slug}/products/${product.id}`)}
          className="flex items-center gap-2 py-2 px-4 rounded-full font-bold text-sm transition-all hover:gap-3"
          style={{ backgroundColor: world.colors.accent, color: '#fff' }}
        >
          View Details <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default ProductCard
