import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getWorldBySlug } from '@constants/worlds'
import { useAuth } from '@contexts/AuthContext'
import { userService } from '@services/userService'
import { contentService } from '@services/contentService'
import { CheckCircle, Download, ShieldCheck, Zap, Globe, ArrowLeft } from 'lucide-react'

const ProductDetails = () => {
  const { worldName, productId } = useParams()
  const navigate = useNavigate()
  const { user, refreshProfile } = useAuth()
  const world = getWorldBySlug(worldName)

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isPurchased, setIsPurchased] = useState(false)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data } = await contentService.getProductById(productId)
      setProduct(data)
      
      if (user) {
        const owns = await userService.checkOwnership(user.id, productId)
        setIsPurchased(owns)
      }
      setLoading(false)
    }
    init()
  }, [productId, user])

  const handlePurchase = async () => {
    if (!user) return alert('Please sign in first.')
    setPurchasing(true)
    
    // Using the userService we built earlier
    const res = await userService.fulfillPurchase(user.id, productId)
    
    if (res.success) {
      await refreshProfile() // Update global auth state
      setIsPurchased(true)
    }
    setPurchasing(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: world.colors.base }}>
      <header className="p-6 max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold opacity-60 hover:opacity-100 transition-opacity">
          <ArrowLeft size={20} /> Back to {world.name}
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        {/* Visual Hero */}
        <div className="lg:col-span-7">
          <div className="aspect-square rounded-[3rem] bg-white/40 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-2xl overflow-hidden group">
            <span className="text-[12rem] group-hover:scale-110 transition-transform duration-700">{world.icon}</span>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-black/5 text-[10px] font-black uppercase tracking-widest">{product.category}</span>
              <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                <ShieldCheck size={12} /> Verified Asset
              </span>
            </div>

            <h1 className={`text-4xl font-black mb-4 ${world.fontFamily}`} style={{ color: world.colors.text }}>
              {product.title}
            </h1>

            <p className="text-slate-600 leading-relaxed mb-8 font-medium">
              {product.description}
            </p>

            <div className="flex items-end justify-between mb-8">
              <div className="text-4xl font-black text-slate-900">${product.price}</div>
              <div className="text-right text-[10px] font-bold text-slate-400 uppercase">One-time payment</div>
            </div>

            {isPurchased ? (
              <button className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-emerald-100">
                <Download size={20} /> Download Content
              </button>
            ) : (
              <button 
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl transition-all hover:bg-slate-800 disabled:opacity-50"
              >
                {purchasing ? <Loader2 className="animate-spin" /> : <><Zap size={20} /> Unlock Access</>}
              </button>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4">
            <FeatureBox icon={Globe} title="World Sync" desc="Ready for use" />
            <FeatureBox icon={CheckCircle} title="Lifetime" desc="Permanent access" />
          </div>
        </div>
      </main>
    </div>
  )
}

const FeatureBox = ({ icon: Icon, title, desc }) => (
  <div className="bg-white/40 p-4 rounded-2xl border border-white/60">
    <Icon size={18} className="mb-2 opacity-50" />
    <p className="text-sm font-bold text-slate-900">{title}</p>
    <p className="text-[10px] font-medium text-slate-500 uppercase">{desc}</p>
  </div>
)

export default ProductDetails
