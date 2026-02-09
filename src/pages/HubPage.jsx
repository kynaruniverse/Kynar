import { WORLD_CONFIG, WORLD_TYPES } from '../constants/worlds'
import WorldCard from '../components/WorldCard'

const HubPage = () => {
  const worlds = [
    WORLD_CONFIG[WORLD_TYPES.HAVEN],
    WORLD_CONFIG[WORLD_TYPES.TOOLS],
    WORLD_CONFIG[WORLD_TYPES.OASIS],
    WORLD_CONFIG[WORLD_TYPES.NEXUS],
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          4 Worlds Ecosystem
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore four unique worlds, each offering curated products, guides, and experiences tailored to your passions.
        </p>
      </header>

      {/* World Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {worlds.map((world) => (
          <WorldCard key={world.name} world={world} />
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 text-sm text-gray-500">
        <p>Built with React, Tailwind CSS, and Supabase</p>
      </footer>
    </div>
  )
}

export default HubPage
