import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { WORLD_CONFIG, WORLD_TYPES } from '../constants/worlds'

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [selectedWorld, setSelectedWorld] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      alert('Please write something!')
      return
    }

    setSubmitting(true)

    try {
      const { data: post, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            content: content.trim(),
            world: selectedWorld,
            likes: [],
            comments: []
          }
        ])
        .select()
        .single()

      if (error) throw error

      // Update user's posts array
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('posts')
        .eq('id', user.id)
        .single()

      if (userError) throw userError

      const updatedPosts = [...(userData.posts || []), post.id]

      const { error: updateError } = await supabase
        .from('users')
        .update({ posts: updatedPosts })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Reset form
      setContent('')
      setSelectedWorld(null)
      
      // Notify parent
      if (onPostCreated) onPostCreated()
      
      onClose()
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const worlds = [
    { name: null, label: 'General', icon: '🌐' },
    { ...WORLD_CONFIG[WORLD_TYPES.HAVEN], label: WORLD_CONFIG[WORLD_TYPES.HAVEN].name },
    { ...WORLD_CONFIG[WORLD_TYPES.TOOLS], label: WORLD_CONFIG[WORLD_TYPES.TOOLS].name },
    { ...WORLD_CONFIG[WORLD_TYPES.OASIS], label: WORLD_CONFIG[WORLD_TYPES.OASIS].name },
    { ...WORLD_CONFIG[WORLD_TYPES.NEXUS], label: WORLD_CONFIG[WORLD_TYPES.NEXUS].name },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6">Create Post</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's on your mind?
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, tips, or questions..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={submitting}
            />
            <p className="text-sm text-gray-500 mt-1">
              {content.length} characters
            </p>
          </div>

          {/* World Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post to (optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {worlds.map((world) => (
                <button
                  key={world.label}
                  type="button"
                  onClick={() => setSelectedWorld(world.name)}
                  className={`p-3 rounded-lg border-2 transition-all active:scale-95 ${
                    selectedWorld === world.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{world.icon}</div>
                  <div className="text-xs font-medium text-gray-700">
                    {world.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 active:scale-95 transition-all"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePostModal
