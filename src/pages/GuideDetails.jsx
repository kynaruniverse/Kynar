import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getWorldBySlug } from '../constants/worlds'
import { useAuth } from '../contexts/AuthContext'

const GuideDetails = () => {
  const { worldName, guideId } = useParams()
  const navigate = useNavigate()
  const world = getWorldBySlug(worldName)
  const { user } = useAuth()

  const [guide, setGuide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  useEffect(() => {
    fetchGuide()
  }, [guideId, user])

  const fetchGuide = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('id', guideId)
        .single()

      if (error) throw error
      setGuide(data)

      // Check if current user has bookmarked this guide
      if (user && data.bookmarked_by) {
        setIsBookmarked(data.bookmarked_by.includes(user.id))
      } else {
        setIsBookmarked(false)
      }
    } catch (error) {
      console.error('Error fetching guide:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = async () => {
    if (!user) {
      alert('Please sign in to bookmark guides!')
      return
    }

    setBookmarkLoading(true)

    try {
      let updatedBookmarks = [...(guide.bookmarked_by || [])]

      if (isBookmarked) {
        // Remove bookmark
        updatedBookmarks = updatedBookmarks.filter(id => id !== user.id)
      } else {
        // Add bookmark
        if (!updatedBookmarks.includes(user.id)) {
          updatedBookmarks.push(user.id)
        }
      }

      const { error } = await supabase
        .from('guides')
        .update({ bookmarked_by: updatedBookmarks })
        .eq('id', guideId)

      if (error) throw error

      setIsBookmarked(!isBookmarked)
      setGuide({ ...guide, bookmarked_by: updatedBookmarks })
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      alert('Failed to update bookmark. Please try again.')
    } finally {
      setBookmarkLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div 
          className="inline-block w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: world?.colors.accent, borderTopColor: 'transparent' }}
        ></div>
      </div>
    )
  }

  if (!guide || !world) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Guide Not Found</h1>
          <button 
            onClick={() => navigate(`/worlds/${worldName}`)}
            className="base-button bg-gray-900 text-white"
          >
            ← Back to {worldName}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${world.themeClass}`} style={{ backgroundColor: world.colors.base }}>
      {/* Header */}
      <header className="p-4 md:p-8 border-b" style={{ borderColor: world.colors.accent + '20' }}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(`/worlds/${worldName}`)}
            className="base-button bg-white/50 hover:bg-white/80"
            style={{ color: world.colors.text }}
          >
            ← Back to {world.name}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className="base-button px-6 flex items-center gap-2"
            style={{ 
              backgroundColor: isBookmarked ? world.colors.accent : 'transparent',
              border: `2px solid ${world.colors.accent}`,
              color: isBookmarked ? '#FFFFFF' : world.colors.accent
            }}
          >
            <span className="text-xl">
              {bookmarkLoading ? '⏳' : isBookmarked ? '🔖' : '📑'}
            </span>
            <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
        </div>
      </header>

      {/* Guide Content */}
      <main className="p-4 md:p-8">
        <article className="max-w-4xl mx-auto">
          {/* Category Badge */}
          {guide.category && (
            <div className="mb-6">
              <span 
                className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: world.colors.accent + '20',
                  color: world.colors.text 
                }}
              >
                {guide.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 
            className={`text-4xl md:text-5xl font-bold mb-8 ${world.fontFamily}`}
            style={{ color: world.colors.text }}
          >
            {guide.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>{new Date(guide.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            {guide.bookmarked_by && guide.bookmarked_by.length > 0 && (
              <div className="flex items-center gap-2">
                <span>🔖</span>
                <span>{guide.bookmarked_by.length} bookmark{guide.bookmarked_by.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 md:p-10">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                {guide.content}
              </div>
            </div>

            {/* Attached Products Info */}
            {guide.attached_products && guide.attached_products.length > 0 && (
              <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span>🎁</span>
                  <span>Related Products</span>
                </h3>
                <p className="text-sm text-gray-600">
                  This guide references {guide.attached_products.length} product{guide.attached_products.length > 1 ? 's' : ''} available in {world.name}.
                </p>
                <button
                  onClick={() => navigate(`/worlds/${worldName}`)}
                  className="mt-4 base-button"
                  style={{ 
                    backgroundColor: world.colors.accent,
                    color: '#FFFFFF'
                  }}
                >
                  Browse Products
                </button>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              className="base-button px-8"
              style={{ 
                backgroundColor: isBookmarked ? world.colors.accent : 'transparent',
                border: `2px solid ${world.colors.accent}`,
                color: isBookmarked ? '#FFFFFF' : world.colors.accent
              }}
            >
              {bookmarkLoading ? 'Updating...' : isBookmarked ? '🔖 Bookmarked' : '📑 Bookmark This Guide'}
            </button>
          </div>

          {/* Share Section */}
          <div className="mt-12 p-6 bg-white/50 backdrop-blur rounded-xl text-center">
            <h3 className="font-semibold mb-2">Found this guide helpful?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Bookmark it to save for later or share it with others!
            </p>
            <div className="flex justify-center gap-3">
              <button 
                className="base-button px-6 bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => alert('Share functionality coming soon!')}
              >
                Share
              </button>
              <button
                onClick={() => navigate(`/worlds/${worldName}`)}
                className="base-button px-6"
                style={{ 
                  backgroundColor: world.colors.accent,
                  color: '#FFFFFF'
                }}
              >
                Explore More Guides
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}

export default GuideDetails
