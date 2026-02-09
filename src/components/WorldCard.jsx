import { useNavigate } from 'react-router-dom'

const WorldCard = ({ world }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/worlds/${world.slug}`)
  }

  return (
    <div
      onClick={handleClick}
      className="base-card cursor-pointer hover:shadow-md active:scale-95 transition-all duration-150"
      style={{ backgroundColor: world.colors.base }}
    >
      {/* World Icon */}
      <div className="text-6xl mb-4 text-center">
        {world.icon}
      </div>

      {/* World Name */}
      <h2 
        className={`text-xl font-bold text-center mb-2 ${world.fontFamily}`}
        style={{ color: world.colors.text }}
      >
        {world.name}
      </h2>

      {/* World Vibe */}
      <p 
        className="text-sm text-center mb-3 italic"
        style={{ color: world.colors.text, opacity: 0.7 }}
      >
        {world.vibe}
      </p>

      {/* World Description */}
      <p 
        className="text-sm text-center leading-relaxed"
        style={{ color: world.colors.text, opacity: 0.8 }}
      >
        {world.description}
      </p>

      {/* Explore Button */}
      <button
        className="w-full mt-4 base-button font-medium"
        style={{ 
          backgroundColor: world.colors.accent, 
          color: '#FFFFFF' 
        }}
      >
        Explore {world.name}
      </button>
    </div>
  )
}

export default WorldCard
