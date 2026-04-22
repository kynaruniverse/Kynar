import { useAuth } from '@contexts/AuthContext'
import { WORLD_CONFIG } from '@constants/worlds'
import WorldCard from '@components/WorldCard'
import { Sparkles, Users, Library, Shield } from 'lucide-react'

const HubPage = () => {
  const { user, profile } = useAuth()

  const worlds = Object.values(WORLD_CONFIG)

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
              Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">4 Worlds.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
              A curated ecosystem of digital assets, knowledge guides, and community interaction. Choose your path and start building.
            </p>
            
            {user && (
              <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm w-fit">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold">
                  {profile?.username?.[0] || user.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Welcome back,</p>
                  <p className="text-lg font-black text-slate-900">{profile?.username || 'Explorer'}</p>
                </div>
              </div>
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
            <WorldCard key={world.slug} world={world} />
          ))}
        </div>
      </main>

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-200 pt-20">
          <FeatureItem 
            icon={Users} 
            title="Unified Community" 
            desc="One social feed to rule them all. Share insights across every world."
          />
          <FeatureItem 
            icon={Library} 
            title="Personal Vault" 
            desc="Every purchase and bookmark is synced to your cross-world library."
          />
          <FeatureItem 
            icon={Shield} 
            title="Secure Access" 
            desc="Powered by Supabase and LemonSqueezy for industry-grade safety."
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
