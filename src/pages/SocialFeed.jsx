import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'
import { WORLD_CONFIG } from '../constants/worlds'

const SocialFeed = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedWorld, setSelectedWorld] = useState('all')

  useEffect(() => {
    fetchPosts()
    
    // Set up realtime subscription
    const subscription = supabase
      .channel('posts-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          console.log('Post change:', payload)
          fetchPosts() // Refresh posts on any change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [selectedWorld])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey (email)
        `)
        .order('created_at', { ascending: false })

      // Filter by world if not 'all'
      if (selectedWorld !== 'all') {
        if (selectedWorld === 'general') {
          query = query.is('world', null)
        } else {
          query = query.eq('world', selectedWorld)
        }
      }

      const { data, error } = await query

      if (error) throw error

      // Add user email to posts
      const postsWithEmail = data.map(post => ({
        ...post,
        user_email: post.users?.email
      }))

      setPosts(postsWithEmail)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const worldFilters = [
    { value: 'all', label: 'All Posts', icon: '🌍' },
    { value: 'general', label: 'General', icon: '🌐' },
    ...Object.values(WORLD_CONFIG).map(world => ({
      value: world.name,
      label: world.name,
      icon: world.icon
    }))
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Social Feed</h1>
              <p className="text-gray-600">
                Connect with the community across all worlds
              </p>
            </div>
            
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 active:scale-95 transition-all"
              >
                ✍️ Create Post
              </button>
            )}
          </div>

          {/* World Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {worldFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedWorld(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all active:scale-95 whitespace-nowrap ${
                  selectedWorld === filter.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter.icon} {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post}
                onUpdate={fetchPosts}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
            <p className="text-gray-600 mb-6">
              {selectedWorld === 'all' 
                ? 'Be the first to share something with the community!' 
                : `No posts in ${selectedWorld} yet. Be the first!`}
            </p>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 active:scale-95 transition-all"
              >
                Create First Post
              </button>
            )}
            {!user && (
              <p className="text-sm text-gray-500">
                Sign in to create posts
              </p>
            )}
          </div>
        )}

        {/* Not Signed In Message */}
        {!user && posts.length === 0 && !loading && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
            <p className="text-blue-800 font-medium">
              Sign in to join the conversation and create posts!
            </p>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={fetchPosts}
      />
    </div>
  )
}

export default SocialFeed
