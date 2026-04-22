import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWorldBySlug } from '@constants/worlds'
import { contentService } from '@services/contentService'
import ProductCard from '@components/ProductCard'
import GuideCard from '@components/GuideCard'
import { ArrowLeft, Loader2 } from 'lucide-react'

const WorldPage = () => {
  const { worldName } = useParams()
  const navigate = useNavigate()
  const world = useMemo(() => getWorldBySlug(worldName), [worldName])

  const [data, setData] = useState({ products: [], guides: [] })
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    if (!world) return
    
    const loadContent = async () => {
      setLoading(true)
      const { products, guides } = await contentService.getWorldContent(world.name)
      setData({ products, guides })
      setLoading(false)
    }

    loadContent()
  }, [world])

  // Simplify Conditionals: Memoized filtered list
  const filteredProducts = useMemo(() => {
    return selectedCategory === 'All' 
      ? data.products 
      : data.products.filter(p => p.category === selectedCategory)
  }, [selectedCategory, data.products])

  if (!world) return <NotFoundView onBack={() => navigate('/')} />

  return (
    <div className={`min-h-screen transition-colors duration-500`} style={{ backgroundColor: world.colors.base }}>
      {/* Header Section */}
      <header className="p-6 md:p-10 border-b border-black/5">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/40 transition-all mb-8"
          style={{ color: world.colors.text }}
        >
          <ArrowLeft size={18} /> Back to Hub
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <span className="text-6xl md:text-7xl drop-shadow-sm">{world.icon}</span>
            <div>
              <h1 className={`text-4xl md:text-6xl font-black tracking-tight ${world.fontFamily}`} style={{ color: world.colors.text }}>
                {world.name}
              </h1>
              <p className="text-lg opacity-80 max-w-xl" style={{ color: world.colors.text }}>
                {world.description}
              </p>
            </div>
          </div>

          {/* Dynamic Filters */}
          <div className="flex gap-2 flex-wrap">
            {['All', ...world.categories].map((cat) => (
              <FilterButton 
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                colors={world.colors}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        {loading ? (
          <LoadingState world={world} />
        ) : (
          <div className="space-y-16">
            <ContentGrid title="Premium Products" items={filteredProducts} renderItem={(p) => <ProductCard key={p.id} product={p} world={world} />} />
            <ContentGrid title="Knowledge Guides" items={data.guides} renderItem={(g) => <GuideCard key={g.id} guide={g} world={world} />} />
          </div>
        )}
      </main>
    </div>
  )
}

// Sub-components for better composition
const FilterButton = ({ label, active, onClick, colors }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${active ? 'shadow-lg scale-105' : 'hover:bg-white/10'}`}
    style={{ 
      backgroundColor: active ? colors.accent : 'transparent',
      color: active ? '#fff' : colors.text,
      border: `1px solid ${active ? colors.accent : colors.text + '30'}`
    }}
  >
    {label}
  </button>
)

const ContentGrid = ({ title, items, renderItem }) => (
  <section>
    <h2 className="text-2xl font-bold mb-8 opacity-90">{title}</h2>
    {items.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(renderItem)}
      </div>
    ) : (
      <div className="py-20 text-center bg-black/5 rounded-3xl border-2 border-dashed border-black/10">
        <p className="text-gray-500 font-medium">No items found in this category.</p>
      </div>
    )}
  </section>
)

const LoadingState = ({ world }) => (
  <div className="flex flex-col items-center justify-center py-24">
    <Loader2 className="animate-spin mb-4" size={40} style={{ color: world.colors.accent }} />
    <p className="font-medium animate-pulse">Entering {world.name}...</p>
  </div>
)

const NotFoundView = ({ onBack }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-black mb-4">404</h1>
      <p className="mb-8 text-gray-600">This world has drifted out of orbit.</p>
      <button onClick={onBack} className="px-8 py-3 bg-black text-white rounded-full font-bold">Return Home</button>
    </div>
  </div>
)

export default WorldPage
