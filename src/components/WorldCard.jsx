import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const WorldCard = ({ world }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/worlds/${world.slug}`)}
      className="group relative overflow-hidden rounded-[2rem] p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      style={{ backgroundColor: world.colors.base }}
    >
      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 text-9xl opacity-10 transition-transform group-hover:scale-125 group-hover:-rotate-12">
        {world.icon}
      </div>

      <div className="relative z-10">
        <span className="inline-block text-5xl mb-6 transform transition-transform group-hover:scale-110">
          {world.icon}
        </span>
        
        <h2 className={`text-2xl font-black mb-2 ${world.fontFamily}`} style={{ color: world.colors.text }}>
          {world.name}
        </h2>

        <p className="text-sm font-bold uppercase tracking-widest mb-4 opacity-60" style={{ color: world.colors.text }}>
          {world.vibe}
        </p>

        <p className="text-base leading-relaxed mb-8 opacity-80 max-w-[90%]" style={{ color: world.colors.text }}>
          {world.description}
        </p>

        <div 
          className="flex items-center gap-2 font-bold transition-all group-hover:gap-4"
          style={{ color: world.colors.accent }}
        >
          Explore World <ArrowRight size={20} />
        </div>
      </div>
    </div>
  )
}

export default WorldCard
