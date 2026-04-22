import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { contentService } from '@services/contentService'
import { getWorldBySlug } from '@constants/worlds'
import { 
  ArrowLeft, 
  Bookmark, 
  BookmarkCheck, 
  Loader2, 
  Calendar, 
  Users, 
  Package, 
  Share2 
} from 'lucide-react'
import { clsx } from 'clsx'

const GuideDetails = () => {
  const { worldName, guideId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const world = getWorldBySlug(worldName)

  const [guide, setGuide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  // Derived state: Check if user is in the bookmarked_by array
  const isBookmarked = user && guide?.bookmarked_by?.includes(user.id)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      // We can use a simple supabase query here or add getGuideById to contentService
      const { data, error } = await contentService.getWorldContent(world.name)
      const currentGuide = data.guides.find(g => g.id === guideId)
      
      if (currentGuide) setGuide(currentGuide)
      setLoading(false)
    }
    fetchData()
  }, [guideId, world.name])

  const handleBookmark = async () => {
    if (!user) return alert('Please sign in to bookmark guides!')
    
    setBookmarkLoading(true)
    const result = await contentService.toggleBookmark(
      guide.id, 
      user.id, 
      guide.bookmarked_by || []
    )

    if (result.success) {
      // Optimistically update the local state array
      const updatedArray = isBookmarked
        ? guide.bookmarked_by.filter(id => id !== user.id)
        : [...(guide.bookmarked_by || []), user.id]
      
      setGuide({ ...guide, bookmarked_by: updatedArray })
    }
    setBookmarkLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-slate-400" size={40} />
    </div>
  )

  if (!guide || !world) return <div className="p-20 text-center font-bold">Guide not found.</div>

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: world.colors.base }}>
      {/* Header / Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-black/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-900 transition-all"
          >
            <ArrowLeft size={20} /> Back to {world.name}
          </button>

          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={clsx(
              "flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold transition-all active:scale-95 border-2",
              isBookmarked 
                ? "bg-slate-900 border-slate-900 text-white" 
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            )}
            style={isBookmarked ? { backgroundColor: world.colors.accent, borderColor: world.colors.accent } : {}}
          >
            {bookmarkLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isBookmarked ? (
              <BookmarkCheck size={18} />
            ) : (
              <Bookmark size={18} />
            )}
            <span>{isBookmarked ? 'Saved' : 'Save Guide'}</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-16">
        {/* Category & Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span 
            className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
            style={{ backgroundColor: `${world.colors.accent}20`, color: world.colors.text }}
          >
            {guide.category || 'General'}
          </span>
          <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-tighter">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(guide.created_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><Users size={14} /> {guide.bookmarked_by?.length || 0} Readers</span>
          </div>
        </div>

        <h1 className={`text-5xl md:text-7xl font-black mb-12 tracking-tighter ${world.fontFamily}`} style={{ color: world.colors.text }}>
          {guide.title}
        </h1>

        {/* Main Content Card */}
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl shadow-black/5 border border-white/50 mb-12">
          <div className="prose prose-slate prose-lg max-w-none">
            <p className="text-xl text-slate-500 leading-relaxed font-medium mb-10 border-l-4 pl-6 border-slate-200 italic">
              {guide.description || "A comprehensive deep-dive into the strategies and mechanics of this world."}
            </p>
            <div className="text-slate-800 leading-loose whitespace-pre-line font-medium">
              {guide.content}
            </div>
          </div>

          {/* Related Products CTA */}
          {guide.attached_products?.length > 0 && (
            <div className="mt-16 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-500">
                  <Package size={32} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">Unlock Related Tools</h4>
                  <p className="text-sm text-slate-500 font-medium">This guide uses {guide.attached_products.length} specific assets.</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/worlds/${worldName}`)}
                className="px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95"
              >
                Browse Assets
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col items-center gap-6 py-12 border-t border-black/5 text-center">
          <h3 className="text-2xl font-black text-slate-900">Knowledge is better shared.</h3>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-8 py-4 bg-white rounded-2xl font-bold shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-95">
              <Share2 size={18} /> Share Guide
            </button>
            <button 
              onClick={handleBookmark}
              className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
              style={{ backgroundColor: world.colors.accent }}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              {isBookmarked ? 'Saved to Library' : 'Save for Later'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GuideDetails
