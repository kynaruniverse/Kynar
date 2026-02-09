import { useParams, useNavigate } from 'react-router-dom'
import { getWorldBySlug } from '../constants/worlds'

const WorldPage = () => {
  const { worldName } = useParams()
  const navigate = useNavigate()
  const world = getWorldBySlug(worldName)

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
          {world.categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95"
              style={{ 
                backgroundColor: world.colors.accent + '20',
                color: world.colors.text,
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Content Area */}
      <main className="p-4 md:p-8">
        <section className="mb-8">
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: world.colors.text }}
          >
            Products
          </h2>
          
          {/* Placeholder for ProductCards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="base-card bg-white/80 backdrop-blur"
              >
                <div className="h-40 bg-gray-200 rounded mb-3 flex items-center justify-center">
                  <span className="text-gray-400">Product Image {i}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Sample Product {i}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  This is a placeholder for product description. Real data will be loaded from Supabase.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold" style={{ color: world.colors.accent }}>
                    $29.99
                  </span>
                  <button
                    className="base-button"
                    style={{ 
                      backgroundColor: world.colors.accent,
                      color: '#FFFFFF'
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 
            className="text-2xl font-semibold mb-4"
            style={{ color: world.colors.text }}
          >
            Guides
          </h2>
          
          {/* Placeholder for GuideCards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="base-card bg-white/80 backdrop-blur"
              >
                <h3 className="text-lg font-semibold mb-2">Sample Guide {i}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  This is a placeholder for guide content. Real data will be loaded from Supabase.
                </p>
                <button
                  className="base-button"
                  style={{ 
                    backgroundColor: 'transparent',
                    border: `2px solid ${world.colors.accent}`,
                    color: world.colors.accent
                  }}
                >
                  Read Guide
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default WorldPage
