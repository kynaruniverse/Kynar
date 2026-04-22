import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { userService } from '@services/userService'
import { WORLD_CONFIG } from '@constants/worlds'
import ProductCard from '@components/ProductCard'
import GuideCard from '@components/GuideCard'
import { Package, Bookmark, Wallet, ArrowRight, Loader2 } from 'lucide-react'

const UserLibrary = () => {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [data, setData] = useState({ products: [], guides: [] })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')

  useEffect(() => {
    if (!user) { navigate('/'); return; }
    
    const loadLibrary = async () => {
      setLoading(true)
      const res = await userService.getUserLibraryData(user.id, profile?.saved_products)
      setData(res)
      setLoading(false)
    }
    loadLibrary()
  }, [user, profile])

  const stats = useMemo(() => ({
    count: data.products.length,
    bookmarks: data.guides.length,
    totalValue: data.products.reduce((sum, p) => sum + (p.price || 0), 0)
  }), [data])

  if (loading) return <LoadingScreen />

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Collection</h1>
          <p className="text-slate-500 font-medium mt-1">Access your acquired knowledge and tools.</p>
        </header>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <StatCard icon={Package} label="Owned Assets" value={stats.count} color="indigo" />
          <StatCard icon={Bookmark} label="Saved Guides" value={stats.bookmarks} color="rose" />
          <StatCard icon={Wallet} label="Library Value" value={`$${stats.totalValue.toFixed(2)}`} color="emerald" />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 mb-8 border-b border-slate-200">
          {['products', 'guides'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400'
              }`}
            >
              {tab} ({tab === 'products' ? data.products.length : data.guides.length})
            </button>
          ))}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'products' ? (
            data.products.map(p => <ProductCard key={p.id} product={p} world={Object.values(WORLD_CONFIG).find(w => w.name === p.world)} />)
          ) : (
            data.guides.map(g => <GuideCard key={g.id} guide={g} world={Object.values(WORLD_CONFIG).find(w => w.name === g.world)} />)
          )}
        </div>

        {data[activeTab].length === 0 && <EmptyState type={activeTab} navigate={navigate} />}
      </div>
    </div>
  )
}

// Sub-components
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
)

const EmptyState = ({ type, navigate }) => (
  <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 mt-6">
    <div className="text-5xl mb-4">{type === 'products' ? '📦' : '📑'}</div>
    <h3 className="text-xl font-bold text-slate-900">Your {type} library is empty</h3>
    <p className="text-slate-500 mb-8">Start exploring the 4 Worlds to fill it up!</p>
    <button onClick={() => navigate('/')} className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold flex items-center gap-2 mx-auto hover:gap-4 transition-all">
      Explore Worlds <ArrowRight size={18} />
    </button>
  </div>
)

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <Loader2 className="animate-spin text-slate-900 mb-4" size={40} />
    <p className="font-bold tracking-widest text-slate-400 uppercase text-xs">Opening Vault</p>
  </div>
)

export default UserLibrary
