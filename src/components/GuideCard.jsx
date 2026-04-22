import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { contentService } from '@services/contentService'
import { Bookmark, BookmarkCheck, Loader2, FileText, Gift } from 'lucide-react'

const GuideCard = ({ guide, world }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  // Derived State: Check if user ID is in the array
  const isBookmarked = user && guide.bookmarked_by?.includes(user.id)

  const handleBookmark = async (e) => {
    e.stopPropagation()
    if (!user) return alert('Sign in to bookmark this guide.')
    
    setLoading(true)
    await contentService.toggleBookmark(guide.id, user.id, guide.bookmarked_by || [])
    // Note: In a real app, we'd use a global state update or re-fetch here
    setLoading(false)
  }

  return (
    <div className="group bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/20 transition-all hover:bg-white/90 shadow-sm hover:shadow-md">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="p-3 rounded-2xl bg-white shadow-sm">
          <FileText size={24} style={{ color: world.colors.accent }} />
        </div>
        
        <button
          onClick={handleBookmark}
          disabled={loading}
          className="p-2.5 rounded-xl bg-white shadow-sm transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin text-gray-400" />
          ) : isBookmarked ? (
            <BookmarkCheck size={20} className="fill-current" style={{ color: world.colors.accent }} />
          ) : (
            <Bookmark size={20} className="text-gray-300 hover:text-gray-500" />
          )}
        </button>
      </div>

      <h3 className={`text-xl font-bold mb-3 ${world.fontFamily}`} style={{ color: world.colors.text }}>
        {guide.title}
      </h3>

      <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed">
        {guide.content}
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        {guide.attached_products?.length > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md uppercase">
            <Gift size={12} /> {guide.attached_products.length} Items
          </div>
        )}
        <div className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md uppercase">
          {guide.bookmarked_by?.length || 0} Saves
        </div>
      </div>

      <button
        onClick={() => navigate(`/worlds/${world.slug}/guides/${guide.id}`)}
        className="w-full py-3 rounded-2xl font-bold text-sm transition-all border-2 hover:bg-white"
        style={{ borderColor: world.colors.accent, color: world.colors.text }}
      >
        Open Guide
      </button>
    </div>
  )
}

export default GuideCard
