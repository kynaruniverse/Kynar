import { useNavigate } from 'react-router-dom'
import { ArrowRight, Compass } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'
import { clsx } from 'clsx'

/**
 * WorldCard
 * Hero tile for one of the four worlds. Until per-world content surfaces are
 * built, the card routes the user toward the alignment quiz (or their saved
 * identity) instead of a placeholder /worlds/:slug page.
 */
const WorldCard = ({ world, isPrimary = false }) => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const cta = profile?.primary_world ? 'View my identity' : 'Find my world'
  const handleClick = () =>
    navigate(profile?.primary_world ? '/me' : '/quiz')

  return (
    <button
      onClick={handleClick}
      className={clsx(
        'group relative overflow-hidden rounded-[2rem] p-8 text-left cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full',
        isPrimary && 'ring-2 ring-offset-4 ring-offset-[#F8FAFC]'
      )}
      style={{
        backgroundColor: world.colors.base,
        ...(isPrimary ? { '--tw-ring-color': world.colors.primary } : {}),
      }}
    >
      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 text-9xl opacity-10 transition-transform group-hover:scale-125 group-hover:-rotate-12">
        {world.icon}
      </div>

      <div className="relative z-10">
        {isPrimary && (
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4"
            style={{
              backgroundColor: `${world.colors.primary}33`,
              color: world.colors.text,
            }}
          >
            <Compass size={10} /> Your world
          </div>
        )}

        <span className="inline-block text-5xl mb-6 transform transition-transform group-hover:scale-110">
          {world.icon}
        </span>

        <h2
          className={`text-2xl font-black mb-2 ${world.fontFamily}`}
          style={{ color: world.colors.text }}
        >
          {world.name}
        </h2>

        <p
          className="text-sm font-bold uppercase tracking-widest mb-4 opacity-60"
          style={{ color: world.colors.text }}
        >
          {world.vibe}
        </p>

        <p
          className="text-base leading-relaxed mb-8 opacity-80 max-w-[90%]"
          style={{ color: world.colors.text }}
        >
          {world.description}
        </p>

        <div
          className="flex items-center gap-2 font-bold transition-all group-hover:gap-4"
          style={{ color: world.colors.text }}
        >
          {user ? cta : 'Find my world'} <ArrowRight size={20} />
        </div>
      </div>
    </button>
  )
}

export default WorldCard
