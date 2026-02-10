import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { WORLD_CONFIG } from '../constants/worlds'

const PostCard = ({ post, onUpdate }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLiked, setIsLiked] = useState(
    user && post.likes ? post.likes.includes(user.id) : false
  )
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Get world config if post has a world
  const world = post.world ? Object.values(WORLD_CONFIG).find(w => w.name === post.world) : null

  const handleLike = async () => {
    if (!user) {
      alert('Please sign in to like posts!')
      return
    }

    try {
      let updatedLikes = [...(post.likes || [])]

      if (isLiked) {
        updatedLikes = updatedLikes.filter(id => id !== user.id)
      } else {
        if (!updatedLikes.includes(user.id)) {
          updatedLikes.push(user.id)
        }
      }

      const { error } = await supabase
        .from('posts')
        .update({ likes: updatedLikes })
        .eq('id', post.id)

      if (error) throw error

      setIsLiked(!isLiked)
      setLikeCount(updatedLikes.length)

      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please sign in to comment!')
      return
    }

    if (!comment.trim()) return

    setSubmitting(true)

    try {
      // Create comment
      const { data: newComment, error: commentError } = await supabase
        .from('comments')
        .insert([
          {
            post_id: post.id,
            user_id: user.id,
            content: comment.trim()
          }
        ])
        .select()
        .single()

      if (commentError) throw commentError

      // Update post's comments array
      const updatedComments = [...(post.comments || []), newComment.id]
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({ comments: updatedComments })
        .eq('id', post.id)

      if (updateError) throw updateError

      setComment('')
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
            {post.user_email?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {post.user_email?.split('@')[0] || 'Anonymous'}
            </p>
            <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>

        {/* World Badge */}
        {world && (
          <button
            onClick={() => navigate(`/worlds/${world.slug}`)}
            className="px-3 py-1 rounded-full text-xs font-medium active:scale-95 transition-all"
            style={{
              backgroundColor: world.colors.accent + '20',
              color: world.colors.text
            }}
          >
            {world.icon} {world.name}
          </button>
        )}
      </div>

      {/* Post Content */}
      <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Post Media (if any) */}
      {post.media && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img 
            src={post.media} 
            alt="Post media" 
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-sm font-medium transition-colors active:scale-95"
          style={{ 
            color: isLiked ? '#EF4444' : '#6B7280' 
          }}
        >
          <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
          <span>{likeCount}</span>
        </button>

        {/* Comment Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 active:scale-95 transition-all"
        >
          <span className="text-lg">💬</span>
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          {/* Comment Form */}
          {user && (
            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-2">
            {post.comments && post.comments.length > 0 ? (
              <p className="text-sm text-gray-500">
                {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard
