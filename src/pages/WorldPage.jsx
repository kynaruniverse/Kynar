import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getWorldBySlug } from '../constants/worlds'
import ProductCard from '../components/ProductCard'
import GuideCard from '../components/GuideCard'

const WorldPage = () => {
  const { worldName } = useParams()
  const navigate = useNavigate()
  const world = getWorldBySlug(worldName)

  const [products, setProducts] = useState([])
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    if (world) {
      fetchWorldData()
    }
  }, [world])

  const fetchWorldData = async () => {
    setLoading(true)
    try {
      // Fetch products for this world
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('world', world.name)
        .order('created_at', { ascending: false })

      if (productsError) throw productsError

      // Fetch guides for this world
      const { data: guidesData, error: guidesError } = await supabase
        .from('guides')
        .select('*')
        .eq('world', world.name)
        .order('created_at', { ascending: false })

      if (guidesError) throw guidesError

      setProducts(productsData || [])
      setGuides(guidesData || [])
    } catch (error) {
      console.error('Error fetching world data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = (guideId, isBookmarked) => {
    // Bookmarking is now handled directly in GuideCard component
    console.log('Bookmark toggled:', guideId, isBookmarked)
  }

  // Filter products by category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  if (!world) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">World Not Found</h1>
          <button 
            onClick={() => navigate('/')}
            className="base-button bg-gray-900 text-white"
          >
            Return to Hub
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${world.themeClass}`} style={{ backgroundColor: world.colors.base }}>
      {/* Header/Navigation */}
      <header className="p-4 md:p-8 border-b" style={{ borderColor: world.colors.accent + '20' }}>
        <button
          onClick={() => navigate('/')}
          className="base-button mb-4 bg-white/50 hover:bg-white/80"
          style={{ color: world.colors.text }}
        >
          ← Back to Hub
        </button>
        
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{world.icon}</span>
          <div>
            <h1 
              className={`text-3xl md:text-4xl font-bold ${world.fontFamily}`}
              style={{ color: world.colors.text }}
            >
              {world.name}
            </h1>
            <p className="text-sm opacity-70" style={{ color: world.colors.text }}>
              {world.description}
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap mt-4">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
              selectedCategory === 'All' ? 'font-bold' : ''
            }`}
            style={{ 
              backgroundColor: selectedCategory === 'All' 
                ? world.colors.accent 
                : world.colors.accent + '20',
              color: selectedCategory === 'All' ? '#FFFFFF' : world.colors.text,
            }}
          >
            All
          </button>
          {world.categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95 ${
                selectedCategory === category ? 'font-bold' : ''
              }`}
              style={{ 
                backgroundColor: selectedCategory === category 
                  ? world.colors.accent 
                  : world.colors.accent + '20',
                color: selectedCategory === category ? '#FFFFFF' : world.colors.text,
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Content Area */}
      <main className="p-4 md:p-8">
        {loading ? (
          <div className="text-center py-12">
            <div 
              className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: world.colors.accent, borderTopColor: 'transparent' }}
            ></div>
            <p className="mt-4 text-gray-600">Loading {world.name}...</p>
          </div>
        ) : (
          <>
            {/* Products Section */}
            <section className="mb-12">
              <h2 
                className="text-2xl font-semibold mb-6"
                style={{ color: world.colors.text }}
              >
                Products {selectedCategory !== 'All' && `- ${selectedCategory}`}
              </h2>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      world={world}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/50 rounded-lg">
                  <p className="text-gray-500">
                    {selectedCategory === 'All' 
                      ? 'No products available yet.' 
                      : `No products in ${selectedCategory} category.`}
                  </p>
                </div>
              )}
            </section>

            {/* Guides Section */}
            <section>
              <h2 
                className="text-2xl font-semibold mb-6"
                style={{ color: world.colors.text }}
              >
                Guides & Resources
              </h2>
              
              {guides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guides.map((guide) => (
                    <GuideCard 
                      key={guide.id} 
                      guide={guide} 
                      world={world}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/50 rounded-lg">
                  <p className="text-gray-500">No guides available yet.</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default WorldPage
