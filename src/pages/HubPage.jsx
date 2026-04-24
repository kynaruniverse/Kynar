import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@contexts/AuthContext'
import { WORLD_CONFIG } from '@constants/worlds'
import WorldCard from '@components/WorldCard'
import { Sparkles, Users, Library, Compass, ArrowRight } from 'lucide-react'
import { getAlignment } from '@services/alignmentService'
import useDocumentMeta from '@lib/useDocumentMeta'

const HubPage = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [alignment, setAlignment] = useState(null)

  useDocumentMeta({
    title: '4 Worlds · Which world are you?',
    description:
      'A 90-second alignment quiz reveals which of the four worlds your taste belongs to. Claim your Identity Card and share it.',
  })

  const worlds = Object.values(WORLD_CONFIG)
  const primary = alignment?.primary_world ? WORLD_CONFIG[alignment.primary_world] : null

  useEffect(() => {
    if (!user) return setAlignment(null)
    let cancelled = false
    getAlignment(user.id).then((a) => {
      if (!cancelled) setAlignment(a)
    })
    return () => {
      cancelled = true
    }
  }, [user])

  const showQuizCTA = !user || !alignment

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles size={14} /> The Multiverse is Open
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6">
              Which world are{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                you?
              </span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
              Four living biomes. One identity. Take the 90-second alignment quiz
              and discover the world your taste actually belongs to.
            </p>

            {showQuizCTA ? (
              <motion.button
                onClick={() => navigate('/quiz')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-3 px-7 py-5 rounded-full bg-slate-900 text-white text-base font-black shadow-2xl shadow-slate-200 hover:shadow-indigo-200 transition-shadow"
              >
                <Compass size={18} />
                Find my world
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </motion.button>
            ) : (
              <motion.button
                onClick={() => navigate('/me')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="group flex items-center gap-4 p-2 pr-6 bg-white rounded-full border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${primary?.colors.primary}33, ${primary?.colors.secondary}33)`,
                  }}
                >
                  {primary?.icon}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    @{profile?.username || 'you'} • {primary?.name}
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    View my identity
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-slate-400 transition-transform group-hover:translate-x-1"
                />
              </motion.button>
            )}
          </div>
        </div>

        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none" />
      </section>

      {/* Worlds Grid */}
      <main className="max-w-7xl mx-auto px-6 -mt-16 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {worlds.map((world) => (
            <WorldCard
              key={world.slug}
              world={world}
              isPrimary={alignment?.primary_world === world.name}
            />
          ))}
        </div>
      </main>

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-200 pt-20">
          <FeatureItem
            icon={Compass}
            title="Your World, Discovered"
            desc="A 7-question quiz reveals your alignment across all four worlds."
          />
          <FeatureItem
            icon={Users}
            title="One Identity, Four Tribes"
            desc="Your card evolves with your taste. Share it. Defend it."
          />
          <FeatureItem
            icon={Library}
            title="Personal Vault"
            desc="Every save and bookmark is synced to your cross-world library."
          />
        </div>
      </section>
    </div>
  )
}

const FeatureItem = ({ icon: Icon, title, desc }) => (
  <div className="space-y-4">
    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-900">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </div>
)

export default HubPage
