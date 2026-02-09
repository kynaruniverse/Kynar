import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const GuideCard = ({ guide, world }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  useEffect(() => {
    // Check if guide is bookmarked by current user
    if (user && guide.bookmarked_by) {
      setIsBookmarked(guide.bookmarked_by.includes(user.id))
    } else {
      setIsBookmarked(false)
    }
  }, [guide, user])

  const handleReadGuide = () => {
    navigate(`/worlds/${world.slug}/guides/${guide.id}`)
  }

  const handleBookmark = async (e) => {
    e.stopPropagation()
    
    if (!user) {
      alert('Please sign in to bookmark guides!')
      return
    }

    setBookmarkLoading(true)

    try {
      let updatedBookmarks = [...(guide.bookmarked_by || [])]

      if (isBookmarked) {
        updatedBookmarks = updatedBookmarks.filter(id => id !== user.id)
      } else {
        if (!updatedBookmarks.includes(user.id)) {
          updatedBookmarks.push(user.id)
        }
      }

      const { error } = await supabase
        .from('guides')
        .update({ bookmarked_by: updatedBookmarks })
        .eq('id', guide.id)

      if (error) throw error

      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setBookmarkLoading(false)
    }
  }

  return (
    <div className="base-card bg-white/80 backdrop-blur hover:shadow-md active:scale-95 transition-all duration-150">
      {/* Guide Header with Bookmark */}
      <div className="flex justify-between items-start mb-3">
        <h3 
          className={`text-lg font-semibold flex-1 line-clamp-2 ${world.fontFamily}`}
          style={{ color: world.colors.text }}
        >
          {guide.title}
        </h3>
        
        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          disabled={bookmarkLoading}
          className="ml-2 p-2 rounded-lg transition-all active:scale-90"
          style={{ 
            color: isBookmarked ? world.colors.accent : '#9CA3AF',
            backgroundColor: isBookmarked ? world.colors.accent + '10' : 'transparent'
          }}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {bookmarkLoading ? '⏳' : isBookmarked ? '🔖' : '📑'}
        </button>
      </div>

      {/* Guide Content Preview */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-4">
        {guide.content ? guide.content.substring(0, 200) + '...' : 'No preview available.'}
      </p>

      {/* Category Tag */}
      {guide.category && (
        <div className="mb-4">
          <span 
            className="inline-block px-3 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: world.colors.accent + '20',
              color: world.colors.text 
            }}
          >
            {guide.category}
          </span>
        </div>
      )}

      {/* Attached Products Preview */}
      {guide.attached_products && guide.attached_products.length > 0 && (
        <div className="mb-4 text-xs text-gray-500 flex items-center gap-1">
          <span>🎁</span>
          <span>{guide.attached_products.length} related product{guide.attached_products.length > 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Bookmark Count */}
      {guide.bookmarked_by && guide.bookmarked_by.length > 0 && (
        <div className="mb-4 text-xs text-gray-500 flex items-center gap-1">
          <span>🔖</span>
          <span>{guide.bookmarked_by.length} bookmark{guide.bookmarked_by.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Read Button */}
      <button
        onClick={handleReadGuide}
        className="w-full base-button"
        style={{ 
          backgroundColor: 'transparent',
          border: `2px solid ${world.colors.accent}`,
          color: world.colors.accent
        }}
      >
        Read Guide
      </button>
    </div>
  )
}

export default GuideCard
